using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace api.Models
{
    public class Dish
    {
        public int Id { get; set; }
        public string DishName { get; set; } = string.Empty;
        public decimal Amount { get; set; } = 700;
        public bool IsActive { get; set; } = true;

        // Navigation
        [JsonIgnore]
        public ICollection<ProductDefaultDish> ProductDefaultDishes { get; set; } = new List<ProductDefaultDish>();
        [JsonIgnore]
        public ICollection<OrderDish> OrderDishes { get; set; } = new List<OrderDish>();
    }
}