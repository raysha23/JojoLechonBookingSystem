using System;
using System.Collections.Generic;

namespace api.Models
{
    public class ProductType
    {
        public int Id { get; set; }
        public string TypeName { get; set; } = string.Empty; // lechon_package, belly_package, etc.
        public bool HasIncludedDishes { get; set; } = false;
        public bool HasExtraDishes { get; set; } = false;
        public bool HasFreebies { get; set; } = false;
        public string? Description { get; set; }

        // Navigation
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}