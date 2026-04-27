using System;

namespace api.Models
{
    public class CustomerContact
    {
        public int Id { get; set; }
        public string ContactNumber { get; set; } = string.Empty;

        public int CustomerId { get; set; }
        public Customer Customer { get; set; } = null!;
    }
}