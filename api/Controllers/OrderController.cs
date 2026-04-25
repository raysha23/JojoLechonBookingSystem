using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.data;
using api.DTOs.Order;
using api.DTOs.Product;
using api.Mappers;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace api.Controllers
{
    [Route("api/order")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderResponseDTO>>> GetOrders([FromQuery] string? date = null)
        {
            IQueryable<Order> query = _context.Orders
                .Include(o => o.Customer)
                    .ThenInclude(c => c.Contacts)
                .Include(o => o.Product)
            .ThenInclude(p => p!.ProductType)        // ← product type name
                .Include(o => o.Product)
            .ThenInclude(p => p!.Freebies)           // ← freebies
            .Include(o => o.OrderDishes)                // ← dishes on the order
                    .ThenInclude(od => od.Dish)
            .Include(o => o.DeliveryCharge);            // ← delivery charge + zone

            // Filter by delivery date if provided
            if (!string.IsNullOrEmpty(date))
            {
                if (DateTime.TryParse(date, out var filterDate))
                {
                    var startOfDay = filterDate.Date;
                    var endOfDay = startOfDay.AddDays(1);
                    query = query.Where(o => o.DeliveryDate >= startOfDay && o.DeliveryDate < endOfDay);
                }
            }

            var orders = await query.ToListAsync();
            var orderDTOs = orders.Select(OrderMappers.ToOrderDTO).ToList();
            return Ok(orderDTOs);
        }

        [HttpPost]
        public async Task<ActionResult<OrderResponseDTO>> CreateOrder([FromBody] CreateOrderRequestDTO createOrderDto)
        {
            if (string.IsNullOrWhiteSpace(createOrderDto.CustomerName))
                return BadRequest("Customer name is required.");

            if (createOrderDto.DeliveryDate == default)
                return BadRequest("Delivery date is required.");

            createOrderDto.Dishes ??= new DishesDTO
            {
                Required = new List<int>(),
                Extra = new List<int>()
            };

            if (createOrderDto.ProductId.HasValue && createOrderDto.ProductId <= 0)
                createOrderDto.ProductId = null;

            if (createOrderDto.ProductId.HasValue)
            {
                var productExists = await _context.Products
                    .AsNoTracking()
                    .AnyAsync(p => p.Id == createOrderDto.ProductId.Value);

                if (!productExists)
                    return BadRequest($"Product with ID {createOrderDto.ProductId.Value} does not exist.");
            }

            var allRequestedDishIds = (createOrderDto.Dishes.Required ?? new List<int>())
                .Concat(createOrderDto.Dishes.Extra ?? new List<int>())
                .Where(id => id > 0)
                .Distinct()
                .ToList();

            var invalidDishIds = await GetInvalidDishIdsAsync(allRequestedDishIds);
            if (invalidDishIds.Any())
                return BadRequest($"Dish with ID {invalidDishIds.First()} does not exist.");

            var defaultDishIds = new List<int>();
            if (createOrderDto.ProductId.HasValue)
            {
                defaultDishIds = await _context.ProductDefaultDishes
                    .AsNoTracking()
                    .Where(pd => pd.ProductId == createOrderDto.ProductId.Value)
                    .Select(pd => pd.DishId)
                    .ToListAsync();
            }

            // ✅ transaction declared OUTSIDE try so catch can access it
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var customer = new Customer
                {
                    Name = createOrderDto.CustomerName,
                    FacebookProfile = createOrderDto.FacebookProfile,
                    Contacts = createOrderDto.Contacts?
                        .Where(c => !string.IsNullOrWhiteSpace(c))
                        .Select(c => new CustomerContact { ContactNumber = c.Trim() })
                        .ToList() ?? new List<CustomerContact>()
                };

                var order = createOrderDto.ToOrderFromCreateDTO(customer.Id);
                order.Customer = customer;

                var includedIds = (createOrderDto.Dishes.Required ?? new List<int>())
                    .Union(defaultDishIds)
                    .ToList();

                var orderDishes = includedIds.Select(dishId => new OrderDish
                {
                    Order = order,
                    DishId = dishId,
                    DishType = "included",
                    IsExtra = false
                }).ToList();

                orderDishes.AddRange(
                    (createOrderDto.Dishes.Extra ?? new List<int>())
                    .Select(dishId => new OrderDish
                    {
                        Order = order,
                        DishId = dishId,
                        DishType = "extra",
                        IsExtra = true
                    })
                );

                _context.Orders.Add(order);
                _context.OrderDishes.AddRange(orderDishes);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                var createdOrder = await _context.Orders
                    .AsNoTracking()
                    .Include(o => o.Customer).ThenInclude(c => c.Contacts)
                    .Include(o => o.Product)
                        .ThenInclude(p => p!.Freebies)
                    .Include(o => o.OrderDishes).ThenInclude(od => od.Dish)
                    .FirstOrDefaultAsync(o => o.Id == order.Id);

                if (createdOrder == null)
                    return StatusCode(500, "Order was created but could not be loaded.");

                return Created($"/api/order/{createdOrder.Id}", createdOrder.ToOrderDTO());
            }
            catch (Exception ex)  // ✅ single catch, can access transaction
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new
                {
                    error = ex.Message,
                    inner = ex.InnerException?.Message,
                    trace = ex.StackTrace
                });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<OrderResponseDTO>> UpdateOrder(int id, [FromBody] UpdateOrderRequestDTO updateOrderDto)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return NotFound($"Order with ID {id} not found.");

            // ── BASIC FIELDS ──────────────────────────────────────────────
            if (!string.IsNullOrEmpty(updateOrderDto.OrderType))
                order.OrderType = updateOrderDto.OrderType;

            if (updateOrderDto.DeliveryDate != default)
                order.DeliveryDate = updateOrderDto.DeliveryDate;

            if (!string.IsNullOrEmpty(updateOrderDto.DeliveryTime))
                order.DeliveryTime = updateOrderDto.DeliveryTime;

            if (!string.IsNullOrEmpty(updateOrderDto.Address))
                order.Address = updateOrderDto.Address;

            if (!string.IsNullOrEmpty(updateOrderDto.Zone))
                order.Zone = updateOrderDto.Zone;

            if (!string.IsNullOrEmpty(updateOrderDto.PaymentMethod))
                order.PaymentMethod = updateOrderDto.PaymentMethod;

            if (updateOrderDto.TotalAmount > 0)
                order.TotalAmount = updateOrderDto.TotalAmount;

            if (updateOrderDto.IsPrinted.HasValue)
            {
                order.IsPrinted = updateOrderDto.IsPrinted.Value;
                order.PrintedAt = updateOrderDto.IsPrinted.Value ? DateTime.UtcNow : null;
            }

            // ── PRODUCT ───────────────────────────────────────────────────
            if (updateOrderDto.ProductId.HasValue)
            {
                var productExists = await _context.Products
                    .AnyAsync(p => p.Id == updateOrderDto.ProductId.Value);

                if (!productExists)
                    return BadRequest($"Product with ID {updateOrderDto.ProductId.Value} does not exist.");

                order.ProductId = updateOrderDto.ProductId.Value;
            }

            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            // ── DISHES ────────────────────────────────────────────────────
            if (updateOrderDto.Dishes != null)
            {
                var allRequested = updateOrderDto.Dishes.Required
                    .Concat(updateOrderDto.Dishes.Extra)
                    .Where(id => id > 0)
                    .Distinct()
                    .ToList();

                var invalidDishIds = await GetInvalidDishIdsAsync(allRequested);
                if (invalidDishIds.Any())
                    return BadRequest($"Dish with ID {invalidDishIds.First()} does not exist.");

                var defaultDishIds = new List<int>();
                if (order.ProductId.HasValue)
                {
                    defaultDishIds = await _context.ProductDefaultDishes
                        .AsNoTracking()
                        .Where(pd => pd.ProductId == order.ProductId.Value)
                        .Select(pd => pd.DishId)
                        .ToListAsync();
                }

                var existingDishes = await _context.OrderDishes
                    .Where(od => od.OrderId == id)
                    .ToListAsync();
                _context.OrderDishes.RemoveRange(existingDishes);

                var includedIds = updateOrderDto.Dishes.Required.Union(defaultDishIds).ToList();
                var newDishes = includedIds.Select(dishId => new OrderDish
                {
                    OrderId = id,
                    DishId = dishId,
                    DishType = "included",
                    IsExtra = false
                }).ToList();

                newDishes.AddRange(updateOrderDto.Dishes.Extra.Select(dishId => new OrderDish
                {
                    OrderId = id,
                    DishId = dishId,
                    DishType = "extra",
                    IsExtra = true
                }));

                _context.OrderDishes.AddRange(newDishes);
            }

            await _context.SaveChangesAsync();

            // ── RELOAD & RETURN ───────────────────────────────────────────
            var updatedOrder = await _context.Orders
                .AsNoTracking()
                .Include(o => o.Customer)
                    .ThenInclude(c => c.Contacts)
                .Include(o => o.Product)
                    .ThenInclude(p => p!.Freebies)
                .Include(o => o.OrderDishes)
                    .ThenInclude(od => od.Dish)
                .FirstOrDefaultAsync(o => o.Id == id);

            return Ok(updatedOrder?.ToOrderDTO());
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound($"Order with ID {id} not found.");
            }

            // Soft delete - mark with DeletedAt timestamp
            order.DeletedAt = DateTime.UtcNow;
            // order.IsDeleted = true;

            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("{id}/restore")]
        public async Task<ActionResult<OrderResponseDTO>> RestoreOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound($"Order with ID {id} not found.");
            }

            // Restore - clear DeletedAt and set status back to active
            order.DeletedAt = null;
            // order.IsDeleted = false;

            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            var restoredOrder = await _context.Orders
                .Include(o => o.Customer)
                    .ThenInclude(c => c.Contacts)
                .Include(o => o.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            return Ok(restoredOrder?.ToOrderDTO());
        }

        [HttpPost("mark-printed")]
        public async Task<IActionResult> MarkOrdersAsPrinted([FromBody] List<int> orderIds)
        {
            if (orderIds == null || orderIds.Count == 0)
                return BadRequest("No order IDs provided.");

            var orders = await _context.Orders
                .Where(o => orderIds.Contains(o.Id) && !o.IsPrinted)
                .ToListAsync();

            foreach (var order in orders)
            {
                order.IsPrinted = true;
                order.PrintedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return Ok(new { marked = orders.Count });
        }

        private async Task<List<int>> GetInvalidDishIdsAsync(IEnumerable<int> dishIds)
        {
            var distinctIds = dishIds.Where(id => id > 0).Distinct().ToList();
            if (!distinctIds.Any())
                return new List<int>();

            var validIds = await _context.Dishes
                .AsNoTracking()
                .Where(d => distinctIds.Contains(d.Id))
                .Select(d => d.Id)
                .ToListAsync();

            return distinctIds.Except(validIds).ToList();
        }
    }


}