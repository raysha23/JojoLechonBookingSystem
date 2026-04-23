using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Interfaces
{
    public interface IOrderRepository
    {
        Task<List<Order>> GetOrdersAsync();
        Task<List<Order>> GetOrdersByDateAsync(DateTime deliveryDate);
        Task<Order?> GetByIdAsync(int orderId);
    }
}