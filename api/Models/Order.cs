using System;
using System.Collections.Generic;

namespace api.Models
{
    public class Order
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; } = string.Empty; // e.g. ORD-001
        public string OrderType { get; set; } = string.Empty;   // delivery or pickup
        public string? Address { get; set; }
        public string? Zone { get; set; }
        public DateTime DeliveryDate { get; set; }
        public string? DeliveryTime { get; set; }
        public string PaymentMethod { get; set; } = string.Empty; // gcash or cod
        public decimal TotalAmount { get; set; }
        public string SubmittedByType { get; set; } = string.Empty; // customer or encoder
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? DeletedAt { get; set; }
        public string Status { get; set; } = "active"; // "active" or "deleted"
        public bool IsPrinted { get; set; } = false;        // false = not yet printed
        public DateTime? PrintedAt { get; set; }             // when it was printed

        // Foreign Keys
        public int CustomerId { get; set; }
        public int? ProductId { get; set; }
        public int? SubmittedByUserId { get; set; }
        public int? DeliveryChargeId { get; set; }

        // Navigation
        public DeliveryCharge? DeliveryCharge { get; set; }
        public Customer Customer { get; set; } = null!;
        public Product? Product { get; set; }
        public User? SubmittedByUser { get; set; }
        public ICollection<OrderDish> OrderDishes { get; set; } = new List<OrderDish>();
    }
}