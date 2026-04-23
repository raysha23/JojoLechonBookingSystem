using System;
using System.Text.Json.Serialization;

namespace api.Models
{
    public class ProductFreebie
    {
        public int Id { get; set; }
        public string FreebieName { get; set; } = string.Empty;

        // Foreign Key
        public int ProductId { get; set; }

        // Navigation
        [JsonIgnore]
        public Product Product { get; set; } = null!;
    }
}