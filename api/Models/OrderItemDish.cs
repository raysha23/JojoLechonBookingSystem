using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class OrderItemDish
    {
        public int Id { get; set; }

        public int OrderItemId { get; set; }
        public OrderItem OrderItem { get; set; } = null!;

        public int DishId { get; set; }
        public Dish Dish { get; set; } = null!;

        // SNAPSHOT (very important)
        public string DishName { get; set; } = string.Empty;
        public decimal Price { get; set; }

        public bool IsExtra { get; set; } = false;
    }
}