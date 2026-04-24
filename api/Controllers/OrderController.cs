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
            // -------------------------
            // 1. VALIDATION
            // -------------------------
            if (string.IsNullOrWhiteSpace(createOrderDto.CustomerName))
                return BadRequest("Customer name is required.");

            if (createOrderDto.DeliveryDate == default)
                return BadRequest("Delivery date is required.");

            if (createOrderDto.Dishes == null)
                createOrderDto.Dishes = new DishesDTO
                {
                    Required = new List<int>(),
                    Extra = new List<int>()
                };

            // Treat invalid product ID as null
            if (createOrderDto.ProductId.HasValue && createOrderDto.ProductId <= 0)
                createOrderDto.ProductId = null;

            if (createOrderDto.ProductId.HasValue)
            {
                var productExists = await _context.Products
                    .AnyAsync(p => p.Id == createOrderDto.ProductId.Value);

                if (!productExists)
                    return BadRequest($"Product with ID {createOrderDto.ProductId.Value} does not exist.");
            }

            // -------------------------
            // 2. VALIDATE DISHES (🔥 IMPORTANT FIX)
            // -------------------------
            var allDishIds = await _context.Dishes
                .Select(d => d.Id)
                .ToListAsync();

            var allRequestedDishIds =
                (createOrderDto.Dishes.Required ?? new List<int>())
                .Concat(createOrderDto.Dishes.Extra ?? new List<int>())
                .ToList();

            foreach (var dishId in allRequestedDishIds)
            {
                if (!allDishIds.Contains(dishId))
                {
                    return BadRequest($"Dish with ID {dishId} does not exist.");
                }
            }
            // -------------------------
            // 2.5 GET PRODUCT DEFAULT DISHES
            // -------------------------
            List<int> defaultDishIds = new();

            if (createOrderDto.ProductId.HasValue)
            {
                defaultDishIds = await _context.ProductDefaultDishes
                    .Where(pd => pd.ProductId == createOrderDto.ProductId.Value)
                    .Select(pd => pd.DishId)
                    .ToListAsync();
            }
            // -------------------------
            // 3. CREATE CUSTOMER
            // -------------------------
            var customer = new Customer
            {
                Name = createOrderDto.CustomerName,
                FacebookProfile = createOrderDto.FacebookProfile,
                Contacts = createOrderDto.Contacts?
                    .Where(c => !string.IsNullOrWhiteSpace(c))
                    .Select(c => new CustomerContact
                    {
                        ContactNumber = c.Trim()
                    })
                    .ToList() ?? new List<CustomerContact>()
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            // -------------------------
            // 4. CREATE ORDER
            // -------------------------
            var order = createOrderDto.ToOrderFromCreateDTO(customer.Id);

            _context.Orders.Add(order);
            await _context.SaveChangesAsync(); // generates order.Id

            // -------------------------
            // 5. CREATE ORDER DISHES
            // -------------------------
            var orderDishes = new List<OrderDish>();

            // Combine default dishes with required dishes (no duplicates)
            var includedDishIds = (createOrderDto.Dishes.Required ?? new List<int>()).Union(defaultDishIds).ToList();

            if (includedDishIds.Any())
            {
                orderDishes.AddRange(
                    includedDishIds.Select(dishId => new OrderDish
                    {
                        OrderId = order.Id,
                        DishId = dishId,
                        DishType = "included",
                        IsExtra = false
                    })
                );
            }

            if (createOrderDto.Dishes.Extra != null)
            {
                orderDishes.AddRange(
                    createOrderDto.Dishes.Extra.Select(dishId => new OrderDish
                    {
                        OrderId = order.Id,
                        DishId = dishId,
                        DishType = "extra",
                        IsExtra = true
                    })
                );
            }

            _context.OrderDishes.AddRange(orderDishes);
            await _context.SaveChangesAsync();

            // -------------------------
            // 6. RELOAD ORDER (with relations)
            // -------------------------
            var createdOrder = await _context.Orders
                .Include(o => o.Customer)
                    .ThenInclude(c => c.Contacts)
                .Include(o => o.Product)
                .Include(o => o.OrderDishes)
                    .ThenInclude(od => od.Dish)
                .FirstOrDefaultAsync(o => o.Id == order.Id);

            if (createdOrder == null)
                return StatusCode(500, "Order was created but could not be loaded.");

            return Created($"/api/order/{createdOrder.Id}", createdOrder.ToOrderDTO());
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<OrderResponseDTO>> UpdateOrder(int id, [FromBody] UpdateOrderRequestDTO updateOrderDto)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound($"Order with ID {id} not found.");
            }

            // Update basic fields
            if (!string.IsNullOrEmpty(updateOrderDto.OrderType))
                order.OrderType = updateOrderDto.OrderType;

            if (updateOrderDto.DeliveryDate != default)
                order.DeliveryDate = updateOrderDto.DeliveryDate;

            if (!string.IsNullOrEmpty(updateOrderDto.DeliveryTime))
                order.DeliveryTime = updateOrderDto.DeliveryTime;

            if (!string.IsNullOrEmpty(updateOrderDto.PaymentMethod))
                order.PaymentMethod = updateOrderDto.PaymentMethod;

            if (updateOrderDto.TotalAmount > 0)
                order.TotalAmount = updateOrderDto.TotalAmount;

            if (updateOrderDto.IsPrinted.HasValue)
                order.IsPrinted = updateOrderDto.IsPrinted.Value;

            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            var updatedOrder = await _context.Orders
                .Include(o => o.Customer)
                    .ThenInclude(c => c.Contacts)
                .Include(o => o.Product)
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
            order.Status = "deleted";

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
            order.Status = "active";

            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            var restoredOrder = await _context.Orders
                .Include(o => o.Customer)
                    .ThenInclude(c => c.Contacts)
                .Include(o => o.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            return Ok(restoredOrder?.ToOrderDTO());
        }

    }


}