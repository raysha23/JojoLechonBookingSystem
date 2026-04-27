using System;
using System.Text.Json.Serialization;

namespace api.Models
{
    public class ProductFreebie
    {
        public int Id { get; set; }
        public string FreebieName { get; set; } = string.Empty;

        public int ProductId { get; set; }

        [JsonIgnore]
        public Product Product { get; set; } = null!;
    }
}