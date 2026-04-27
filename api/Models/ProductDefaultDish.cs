using System;
using System.Text.Json.Serialization;

namespace api.Models
{
    public class ProductDefaultDish
    {
        public int Id { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public int DishId { get; set; }
        public Dish Dish { get; set; } = null!;
    }
}