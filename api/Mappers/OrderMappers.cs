using api.DTOs.Order;
using api.DTOs.Product;
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
                Id = order.Id,
                OrderNumber = order.OrderNumber,
                CreatedAt = order.CreatedAt,
                DeletedAt = order.DeletedAt,
                IsPrinted = order.IsPrinted,
                PrintedAt = order.PrintedAt,

                CustomerName = order.Customer.Name,
                Contacts = order.Customer.Contacts
                    .Select(c => c.ContactNumber).ToList(),

                FacebookProfile = order.Customer.FacebookProfile,
                OrderType = order.OrderType,
                Address = order.Address,
                Zone = order.Zone,
                DeliveryDate = order.DeliveryDate,
                DeliveryTime = order.DeliveryTime,
                PaymentMethod = order.PaymentMethod,
                TotalAmount = order.TotalAmount,

                ProductId = order.ProductId,
                ProductName = order.Product?.ProductName,

                // ✅ THIS FIXES YOUR UI - Return dish NAMES not IDs
                Dishes = new OrderDTO.DishesResponse
                {
                    Required = order.OrderDishes?
                    .Where(od => od.DishType == "included")
                    .Select(od => od.Dish.DishName)
                    .ToList() ?? new List<string>(),

                    Extra = order.OrderDishes?
                    .Where(od => od.DishType == "extra")
                    .Select(od => od.Dish.DishName)
                    .ToList() ?? new List<string>()
                },
                Freebies = new FreebiesDTO
                {
                    Freebies = order.Product?.Freebies.Select(f => f.FreebieName).ToList()
                }
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