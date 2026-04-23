using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.data;
using api.Interfaces;
using api.Models;

namespace api.Repository
{
    public class OrderRepository : IOrderRepository
    {
        private readonly ApplicationDbContext _context;
        public OrderRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public Task<List<Order>> GetOrdersAsync()
        {
            // throw new NotImplementedException();
            return Task.FromResult(_context.Orders.ToList());
        }

        public Task<List<Order>> GetOrdersByDateAsync(DateTime deliveryDate)
        {
            var startOfDay = deliveryDate.Date;
            var endOfDay = startOfDay.AddDays(1);
            
            var orders = _context.Orders
                .Where(o => o.DeliveryDate >= startOfDay && o.DeliveryDate < endOfDay)
                .ToList();
            
            return Task.FromResult(orders);
        }

        public Task<Order?> GetByIdAsync(int orderId)
        {
            // throw new NotImplementedException();
            var order = _context.Orders.FirstOrDefault(o => o.Id == orderId);
            return Task.FromResult(order);
        }
    }
}