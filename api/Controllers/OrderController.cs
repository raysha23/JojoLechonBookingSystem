using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.data;
using api.DTOs.Order;
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
        public async Task<ActionResult<IEnumerable<OrderDTO>>> GetOrders([FromQuery] string? date = null)
        {
            IQueryable<Order> query = _context.Orders
                .Include(o => o.Customer)
                    .ThenInclude(c => c.Contacts)
                .Include(o => o.Product);

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
        public async Task<ActionResult<OrderDTO>> CreateOrder([FromBody] CreateOrderDTO createOrderDto)
        {
            if (string.IsNullOrWhiteSpace(createOrderDto.CustomerName))
            {
                return BadRequest("Customer name is required.");
            }

            if (createOrderDto.DeliveryDate == default)
            {
                return BadRequest("Delivery date is required.");
            }

            // Treat 0 or negative product ids as "no selected package"
            if (createOrderDto.ProductId.HasValue && createOrderDto.ProductId.Value <= 0)
            {
                createOrderDto.ProductId = null;
            }

            if (createOrderDto.ProductId.HasValue)
            {
                var productExists = await _context.Products
                    .AnyAsync(p => p.Id == createOrderDto.ProductId.Value);

                if (!productExists)
                {
                    return BadRequest($"Product with ID {createOrderDto.ProductId.Value} does not exist.");
                }
            }

            var customer = new Customer
            {
                Name = createOrderDto.CustomerName,
                FacebookProfile = createOrderDto.FacebookProfile,
                Contacts = createOrderDto.Contacts
                    .Where(c => !string.IsNullOrWhiteSpace(c))
                    .Select(c => new CustomerContact
                    {
                        ContactNumber = c.Trim()
                    })
                    .ToList()
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            var order = createOrderDto.ToOrderFromCreateDTO(customer.Id);
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            var createdOrder = await _context.Orders
                .Include(o => o.Customer)
                    .ThenInclude(c => c.Contacts)
                .Include(o => o.Product)
                .FirstOrDefaultAsync(o => o.Id == order.Id);

            if (createdOrder == null)
            {
                return StatusCode(500, "Order was created but could not be loaded.");
            }

            return Created($"/api/order/{createdOrder.Id}", createdOrder.ToOrderDTO());
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<OrderDTO>> UpdateOrder(int id, [FromBody] UpdateOrderDTO updateOrderDto)
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
        public async Task<ActionResult<OrderDTO>> RestoreOrder(int id)
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