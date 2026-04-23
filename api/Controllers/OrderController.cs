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
        public async Task<ActionResult<IEnumerable<OrderDTO>>> GetOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.Customer)
                    .ThenInclude(c => c.Contacts)
                .Include(o => o.Product)
                .ToListAsync();

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

    }


}