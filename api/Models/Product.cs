using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace api.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string ProductName { get; set; } = string.Empty;

        public decimal Amount { get; set; }
        public decimal PromoAmount { get; set; } = 0;

        public int NoOfIncludedDishes { get; set; }
        public bool IsActive { get; set; } = true;

        public int ProductTypeId { get; set; }
        public ProductType ProductType { get; set; } = null!;

        public ICollection<ProductDefaultDish> DefaultDishes { get; set; } = new List<ProductDefaultDish>();

        public ICollection<ProductFreebie> Freebies { get; set; } = new List<ProductFreebie>();
    }
}