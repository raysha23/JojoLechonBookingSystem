using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace api.Models
{
    public class ProductType
    {
        public int Id { get; set; }
        public string TypeName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool HasIncludedDishes { get; set; } 
        public bool HasExtraDishes { get; set; }
        public bool HasFreebies { get; set; }
        public bool IsActive { get; set; } = true;

        // Navigation
        [JsonIgnore]
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
