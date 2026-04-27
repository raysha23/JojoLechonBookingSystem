using System;
using System.Collections.Generic;

namespace api.Models
{
    public class Order
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public string OrderType { get; set; } = string.Empty;

        public string? Address { get; set; }
        public string? Zone { get; set; }

        public DateTime DeliveryDate { get; set; }
        public string? DeliveryTime { get; set; }

        public string PaymentMethod { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }

        public string Status { get; set; } = "active";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? DeletedAt { get; set; }

        public bool IsPrinted { get; set; } = false;
        public DateTime? PrintedAt { get; set; }

        public int CustomerId { get; set; }
        public Customer Customer { get; set; } = null!;

        public int? SubmittedByUserId { get; set; }
        public User? SubmittedByUser { get; set; }

        public int? DeliveryChargeId { get; set; }
        public DeliveryCharge? DeliveryCharge { get; set; }

        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}