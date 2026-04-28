using System;
using Microsoft.AspNetCore.SignalR;
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
using api.Hubs;
namespace api.Controllers
{
    [Route("api/order")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IHubContext<OrderHub> _hub;
        private readonly ApplicationDbContext _context;
        public OrderController(ApplicationDbContext context, IHubContext<OrderHub> hub)
        {
            _hub = hub;
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderResponseDTO>>> GetOrders([FromQuery] string? date = null)
        {
            IQueryable<Order> query = _context.Orders
                .Include(o => o.Customer).ThenInclude(c => c.Contacts)
                .Include(o => o.DeliveryCharge)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product).ThenInclude(p => p.ProductType)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product).ThenInclude(p => p.Freebies)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.OrderItemDishes).ThenInclude(d => d.Dish);

            if (!string.IsNullOrEmpty(date) && DateTime.TryParse(date, out var filterDate))
            {
                // Specific date selected — show only that day
                var start = filterDate.Date;
                var end = start.AddDays(1);
                query = query.Where(o => o.DeliveryDate >= start && o.DeliveryDate < end);
            }
            else
            {
                // No date — show today and future (pending bookings)
                var today = DateTime.UtcNow.Date;
                query = query.Where(o => o.DeliveryDate >= today && o.DeletedAt == null);
            }

            var orders = await query
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
            
            return Ok(orders.Select(OrderMappers.ToOrderDTO).ToList());
        }


        [HttpPost]
        public async Task<ActionResult<OrderResponseDTO>> CreateOrder([FromBody] CreateOrderRequestDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.CustomerName))
                return BadRequest("Customer name is required.");

            if (dto.DeliveryDate == default)
                return BadRequest("Delivery date is required.");

            if (dto.Items == null || dto.Items.Count == 0)
                return BadRequest("At least one order item is required.");

            var productIds = dto.Items.Select(i => i.ProductId).Distinct().ToList();

            var validProductIds = await _context.Products.AsNoTracking()
                .Where(p => productIds.Contains(p.Id))
                .Select(p => p.Id)
                .ToListAsync();

            var invalidProduct = productIds.FirstOrDefault(id => !validProductIds.Contains(id));
            if (invalidProduct != 0)
                return BadRequest($"Product with ID {invalidProduct} does not exist.");

            var allDishIds = dto.Items
                .SelectMany(i => (i.Dishes?.Required ?? new List<int>())
                .Concat(i.Dishes?.Extra ?? new List<int>()))
                .Where(id => id > 0)
                .Distinct()
                .ToList();

            var invalidDishIds = await GetInvalidDishIdsAsync(allDishIds);
            if (invalidDishIds.Any())
                return BadRequest($"Dish with ID {invalidDishIds.First()} does not exist.");

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var customer = new Customer
                {
                    Name = dto.CustomerName,
                    FacebookProfile = dto.FacebookProfile,
                    Contacts = (dto.Contacts ?? new())
                        .Where(c => !string.IsNullOrWhiteSpace(c))
                        .Select(c => new CustomerContact { ContactNumber = c.Trim() })
                        .ToList()
                };

                var order = dto.ToOrderFromCreateDTO(customer.Id);
                order.Customer = customer;

                foreach (var itemDto in dto.Items)
                {
                    var defaultDishIds = await _context.ProductDefaultDishes.AsNoTracking()
                        .Where(pd => pd.ProductId == itemDto.ProductId)
                        .Select(pd => pd.DishId)
                        .ToListAsync();

                    var includedIds = (itemDto.Dishes?.Required ?? new List<int>())
                        .Union(defaultDishIds)
                        .ToList();

                    var itemDishIds = includedIds
                        .Concat(itemDto.Dishes?.Extra ?? new List<int>())
                        .Distinct()
                        .ToList();

                    var dishes = await _context.Dishes.AsNoTracking()
                        .Where(d => itemDishIds.Contains(d.Id))
                        .ToDictionaryAsync(d => d.Id);

                    var orderItem = new OrderItem
                    {
                        ProductId = itemDto.ProductId,
                        Quantity = itemDto.Quantity,
                        UpgradeAmount = itemDto.UpgradeAmount,

                        OrderItemDishes = includedIds.Select(dishId =>
                        {
                            var dish = dishes[dishId];
                            return new OrderItemDish
                            {
                                DishId = dishId,
                                DishName = dish.DishName,
                                Price = dish.Amount,
                                IsExtra = false
                            };
                        })
                        .Concat((itemDto.Dishes?.Extra ?? new List<int>()).Select(dishId =>
                        {
                            var dish = dishes[dishId];
                            return new OrderItemDish
                            {
                                DishId = dishId,
                                DishName = dish.DishName,
                                Price = dish.Amount,
                                IsExtra = true
                            };
                        }))
                        .ToList()
                    };

                    order.OrderItems.Add(orderItem);
                }

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                var createdOrder = await _context.Orders.AsNoTracking()
                    .Include(o => o.Customer).ThenInclude(c => c.Contacts)
                    .Include(o => o.OrderItems).ThenInclude(oi => oi.Product).ThenInclude(p => p.ProductType)
                    .Include(o => o.OrderItems).ThenInclude(oi => oi.Product).ThenInclude(p => p.Freebies)
                    .Include(o => o.OrderItems).ThenInclude(oi => oi.OrderItemDishes).ThenInclude(d => d.Dish)
                    .FirstOrDefaultAsync(o => o.Id == order.Id);

                await _hub.Clients.All.SendAsync("NewOrder", createdOrder!.ToOrderDTO());

                return Created($"/api/order/{order.Id}", createdOrder!.ToOrderDTO());
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult<OrderResponseDTO>> UpdateOrder(int id, [FromBody] UpdateOrderRequestDTO dto)
        {
            try
            {
                var order = await _context.Orders
                    .Include(o => o.OrderItems)
                        .ThenInclude(oi => oi.OrderItemDishes)
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (order == null)
                    return NotFound($"Order with ID {id} not found.");

                if (!string.IsNullOrEmpty(dto.OrderType)) order.OrderType = dto.OrderType;
                if (dto.DeliveryDate.HasValue) order.DeliveryDate = dto.DeliveryDate.Value;
                if (!string.IsNullOrEmpty(dto.DeliveryTime)) order.DeliveryTime = dto.DeliveryTime;
                if (!string.IsNullOrEmpty(dto.PaymentMethod)) order.PaymentMethod = dto.PaymentMethod;
                if (dto.TotalAmount >= 0) order.TotalAmount = dto.TotalAmount;
                if (dto.Address != null) order.Address = dto.Address;
                if (dto.Zone != null) order.Zone = dto.Zone;

                if (dto.IsPrinted.HasValue)
                {
                    order.IsPrinted = dto.IsPrinted.Value;
                    order.PrintedAt = dto.IsPrinted.Value ? DateTime.UtcNow : null;
                }

                if (dto.Items != null && dto.Items.Count > 0)
                {
                    // Validate products
                    var productIds = dto.Items.Select(i => i.ProductId).Distinct().ToList();

                    var validProductIds = await _context.Products.AsNoTracking()
                        .Where(p => productIds.Contains(p.Id))
                        .Select(p => p.Id)
                        .ToListAsync();

                    var invalidProduct = productIds.FirstOrDefault(pid => !validProductIds.Contains(pid));
                    if (invalidProduct != 0)
                        return BadRequest($"Product with ID {invalidProduct} does not exist.");

                    // ✅ FIXED: Renamed to updateDishIds to avoid scope conflict with allDishIds above
                    var updateDishIds = dto.Items
                        .SelectMany(i => (i.Dishes?.Required ?? new List<int>())
                            .Concat(i.Dishes?.Extra ?? new List<int>()))
                        .Where(id => id > 0)
                        .Distinct()
                        .ToList();

                    var invalidDishIds = await GetInvalidDishIdsAsync(updateDishIds);
                    if (invalidDishIds.Any())
                        return BadRequest($"Dish with ID {invalidDishIds.First()} does not exist.");

                    _context.OrderItems.RemoveRange(order.OrderItems);

                    foreach (var itemDto in dto.Items)
                    {
                        var defaultDishIds = await _context.ProductDefaultDishes.AsNoTracking()
                            .Where(pd => pd.ProductId == itemDto.ProductId)
                            .Select(pd => pd.DishId)
                            .ToListAsync();

                        var includedIds = (itemDto.Dishes?.Required ?? new List<int>())
                            .Union(defaultDishIds)
                            .ToList();

                        var itemDishIds = includedIds
                            .Concat(itemDto.Dishes?.Extra ?? new List<int>())
                            .Distinct()
                            .ToList();

                        var dishes = await _context.Dishes.AsNoTracking()
                            .Where(d => itemDishIds.Contains(d.Id))
                            .ToDictionaryAsync(d => d.Id);

                        var orderItem = new OrderItem
                        {
                            OrderId = id,
                            ProductId = itemDto.ProductId,
                            Quantity = itemDto.Quantity,
                            UpgradeAmount = itemDto.UpgradeAmount,

                            OrderItemDishes = includedIds.Select(dishId =>
                            {
                                if (!dishes.TryGetValue(dishId, out var dish))
                                    throw new Exception($"Dish {dishId} missing");

                                return new OrderItemDish
                                {
                                    DishId = dishId,
                                    DishName = dish.DishName,
                                    Price = dish.Amount,
                                    IsExtra = false
                                };
                            })
                            .Concat((itemDto.Dishes?.Extra ?? new List<int>()).Select(dishId =>
                            {
                                if (!dishes.TryGetValue(dishId, out var dish))
                                    throw new Exception($"Dish {dishId} missing");

                                return new OrderItemDish
                                {
                                    DishId = dishId,
                                    DishName = dish.DishName,
                                    Price = dish.Amount,
                                    IsExtra = true
                                };
                            }))
                            .ToList()
                        };

                        order.OrderItems.Add(orderItem);
                    }
                }

                await _context.SaveChangesAsync();

                var updatedOrder = await _context.Orders.AsNoTracking()
                    .Include(o => o.Customer).ThenInclude(c => c.Contacts)
                    .Include(o => o.OrderItems).ThenInclude(oi => oi.Product).ThenInclude(p => p.ProductType)
                    .Include(o => o.OrderItems).ThenInclude(oi => oi.Product).ThenInclude(p => p.Freebies)
                    .Include(o => o.OrderItems).ThenInclude(oi => oi.OrderItemDishes).ThenInclude(d => d.Dish)
                    .FirstOrDefaultAsync(o => o.Id == id);

                return Ok(updatedOrder?.ToOrderDTO());
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPatch("{id}/print-status")]
        public async Task<IActionResult> TogglePrintStatus(int id, [FromBody] TogglePrintStatusDTO dto)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return NotFound($"Order with ID {id} not found.");

            order.IsPrinted = dto.IsPrinted;
            order.PrintedAt = dto.IsPrinted ? DateTime.UtcNow : null;

            await _context.SaveChangesAsync();
            return Ok(new { id, isPrinted = order.IsPrinted, printedAt = order.PrintedAt });
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

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return NotFound($"Order with ID {id} not found.");

            order.DeletedAt = DateTime.UtcNow;

            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("{id}/restore")]
        public async Task<ActionResult<OrderResponseDTO>> RestoreOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return NotFound($"Order with ID {id} not found.");

            order.DeletedAt = null;

            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            var restoredOrder = await _context.Orders
                .Include(o => o.Customer)
                    .ThenInclude(c => c.Contacts)
                .Include(o => o.OrderItems)
                    .ThenInclude(io => io.Product).ThenInclude(p => p.ProductType)
                .Include(o => o.OrderItems).ThenInclude(oi => oi.Product).ThenInclude(p => p.Freebies)
                .Include(o => o.OrderItems).ThenInclude(oi => oi.OrderItemDishes).ThenInclude(d => d.Dish)
                .FirstOrDefaultAsync(o => o.Id == id);

            return Ok(restoredOrder?.ToOrderDTO());
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

        [HttpGet("my-bookings")]
        public async Task<ActionResult<IEnumerable<OrderResponseDTO>>> GetMyBookings(
                [FromQuery] int encoderId,
                [FromQuery] string? date = null)
        {
            IQueryable<Order> query = _context.Orders
                .Include(o => o.Customer).ThenInclude(c => c.Contacts)
                .Include(o => o.DeliveryCharge)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product).ThenInclude(p => p.ProductType)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product).ThenInclude(p => p.Freebies)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.OrderItemDishes).ThenInclude(d => d.Dish)
                .Where(o => o.SubmittedByUserId == encoderId && o.DeletedAt == null);

            var filterDate = date != null && DateTime.TryParse(date, out var parsed)
                ? parsed.Date
                : DateTime.UtcNow.Date;

            query = query.Where(o =>
                o.CreatedAt.Date >= filterDate &&
                o.CreatedAt.Date < filterDate.AddDays(1));

            var orders = await query
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return Ok(orders.Select(OrderMappers.ToOrderDTO).ToList());
        }
    }
}