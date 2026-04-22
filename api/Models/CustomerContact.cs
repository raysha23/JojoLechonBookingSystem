using System;

namespace api.Models
{
    public class CustomerContact
    {
        public int Id { get; set; }
        public string ContactNumber { get; set; } = string.Empty;

        // Foreign Key
        public int CustomerId { get; set; }

        // Navigation
        public Customer Customer { get; set; } = null!;
    }
}