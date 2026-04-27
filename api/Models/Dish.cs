using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace api.Models
{
    public class Dish
    {
        public int Id { get; set; }
        public string DishName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public bool IsActive { get; set; } = true;

        public ICollection<ProductDefaultDish> ProductDefaultDishes { get; set; } = new List<ProductDefaultDish>();
        public ICollection<OrderItemDish> OrderItemDishes { get; set; } = new List<OrderItemDish>();
    }
}