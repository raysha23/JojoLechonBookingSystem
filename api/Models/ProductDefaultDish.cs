using System;

namespace api.Models
{
    public class ProductDefaultDish
    {
        public int Id { get; set; }

        // Foreign Keys
        public int ProductId { get; set; }
        public int DishId { get; set; }

        // Navigation
        public Product Product { get; set; } = null!;
        public Dish Dish { get; set; } = null!;
    }
}