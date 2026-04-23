using api.DTOs.Order;
using api.Models;

namespace api.Mappers
{
    public static class OrderMappers
    {
        // Order → OrderDTO (for GET responses)
        public static OrderDTO ToOrderDTO(this Order order)
        {
            return new OrderDTO
            {
                CustomerName = order.Customer.Name,
                Contacts = order.Customer.Contacts
                    .Select(c => c.ContactNumber).ToList(),
                FacebookProfile = order.Customer.FacebookProfile,
                OrderType = order.OrderType,
                Address = order.Address,
                Zone = order.Zone,
                DeliveryDate = order.DeliveryDate, // ✅ fixed
                DeliveryTime = order.DeliveryTime,
                PaymentMethod = order.PaymentMethod,
                TotalAmount = order.TotalAmount,
                ProductId = order.ProductId
            };
        }

        // CreateOrderDTO → Order (for POST saving)
        public static Order ToOrderFromCreateDTO(this CreateOrderDTO dto, int customerId)
        {
            return new Order
            {
                OrderNumber = $"ORD-{DateTime.UtcNow.Ticks}",
                OrderType = dto.OrderType,
                Address = dto.Address,
                Zone = dto.Zone,
                DeliveryDate = dto.DeliveryDate,
                DeliveryTime = dto.DeliveryTime,
                PaymentMethod = dto.PaymentMethod,
                TotalAmount = dto.TotalAmount,
                SubmittedByType = "customer",
                Status = "active",
                IsPrinted = false,
                CreatedAt = DateTime.UtcNow,
                CustomerId = customerId, // ✅ passed in from controller
                ProductId = dto.ProductId.HasValue && dto.ProductId.Value > 0
                    ? dto.ProductId
                    : null
            };
        }
    }
}