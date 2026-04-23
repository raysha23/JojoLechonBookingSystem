using System;

namespace api.Models
{
    public class OrderDish
    {
        public int Id { get; set; }
        public string DishType { get; set; } = string.Empty; // included or extra

        // Foreign Keys
        public int OrderId { get; set; }
        public int DishId { get; set; }

        // Navigation
        public Order Order { get; set; } = null!;
        public Dish Dish { get; set; } = null!;
        public bool IsExtra { get; set; } = false; // true if extra dish, false if included dish
    }
}