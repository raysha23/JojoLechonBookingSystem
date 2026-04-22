using System;
using System.Collections.Generic;

namespace api.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public decimal PromoAmount { get; set; } = 0; // discount e.g. -500, -1000
        public int NoOfIncludedDishes { get; set; } = 0;
        public bool IsActive { get; set; } = true;

        // Foreign Key
        public int ProductTypeId { get; set; }

        // Navigation
        public ProductType ProductType { get; set; } = null!;
        public ICollection<ProductFreebie> Freebies { get; set; } = new List<ProductFreebie>();
        public ICollection<ProductDefaultDish> DefaultDishes { get; set; } = new List<ProductDefaultDish>();
        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}