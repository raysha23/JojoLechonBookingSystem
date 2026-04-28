using api.DTOs.Order;
using api.Helpers;
using api.Models;
using static api.DTOs.Order.OrderItemDTO;

namespace api.Mappers
{
    public static class OrderMappers
    {
        public static OrderResponseDTO ToOrderDTO(this Order order)
        {
            return new OrderResponseDTO
            {
                Id = order.Id,
                OrderNumber = order.OrderNumber,
                CreatedAt = order.CreatedAt,
                DeletedAt = order.DeletedAt,
                IsPrinted = order.IsPrinted,
                PrintedAt = order.PrintedAt,
                CustomerName = order.Customer.Name,
                Contacts = order.Customer.Contacts.Select(c => c.ContactNumber).ToList(),
                FacebookProfile = order.Customer.FacebookProfile,
                OrderType = order.OrderType,
                Address = order.Address,
                Zone = order.Zone,
                DeliveryDate = order.DeliveryDate,
                DeliveryTime = order.DeliveryTime,
                PaymentMethod = order.PaymentMethod,
                TotalAmount = order.TotalAmount,
                Items = order.OrderItems.Select(item => new OrderItemResponseDTO
                {
                    Id = item.Id,
                    ProductId = item.ProductId,
                    ProductName = item.Product.ProductName,
                    ProductTypeName = item.Product.ProductType.TypeName,
                    ProductAmount = item.Product.Amount,
                    PromoAmount = item.Product.PromoAmount,
                    UpgradeAmount = item.UpgradeAmount,
                    // ✅ FIXED: IsExtra == false means Required, IsExtra == true means Extra
                    RequiredDishes = item.OrderItemDishes
                        .Where(d => d.IsExtra == false)
                        .Select(d => d.Dish.DishName).ToList(),
                    ExtraDishes = item.OrderItemDishes
                        .Where(d => d.IsExtra == true)
                        .Select(d => d.Dish.DishName).ToList(),
                    Freebies = item.Product.Freebies.Select(f => f.FreebieName).ToList()
                }).ToList()
            };
        }

        public static Order ToOrderFromCreateDTO(this CreateOrderRequestDTO dto, int customerId)
        {
            return new Order
            {
                OrderNumber = $"ORD-{PhTime.Now.Ticks}",
                OrderType = dto.OrderType,
                Address = dto.Address,
                Zone = dto.Zone,
                DeliveryDate = dto.DeliveryDate,
                DeliveryTime = dto.DeliveryTime,
                PaymentMethod = dto.PaymentMethod,
                TotalAmount = dto.TotalAmount,
                // ✅ FIXED: Removed SubmittedByType (doesn't exist on Order model)
                SubmittedByUserId = dto.SubmittedByUserId,
                Status = "active",
                IsPrinted = false,
                CreatedAt = PhTime.Now,
                CustomerId = customerId,
            };
        }
    }
}