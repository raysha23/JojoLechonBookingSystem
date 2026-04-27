using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Product;

namespace api.DTOs.Order
{
    public class OrderItemDTO
    {
        public class OrderItemRequestDTO
        {
            public int ProductId { get; set; }
            public int Quantity {get; set;}

            public decimal UpgradeAmount { get; set; } = 0;
            public DishesDTO Dishes { get; set; } = new();
        }

        public class OrderItemResponseDTO
        {
            public int Id { get; set; }
            public int ProductId { get; set; }
            public string ProductName { get; set; } = string.Empty;
            public string ProductTypeName { get; set; } = string.Empty;
            public decimal ProductAmount { get; set; }
            public decimal? PromoAmount { get; set; }
            public decimal UpgradeAmount { get; set; }
            public List<string> RequiredDishes { get; set; } = new();
            public List<string> ExtraDishes { get; set; } = new();
            public List<string> Freebies { get; set; } = new();
        }
    }
}