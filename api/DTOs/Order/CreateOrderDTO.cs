using System;
using System.Collections.Generic;

namespace api.DTOs.Order
{
    //What the client sends to the server when creating a new order
    public class CreateOrderDTO
    {
        public string CustomerName { get; set; } = string.Empty;
        public List<string> Contacts { get; set; } = new();
        public string? FacebookProfile { get; set; }

        public string OrderType { get; set; } = string.Empty;   // delivery or pickup
        public string? Address { get; set; }
        public string? Zone { get; set; }
        public DateTime DeliveryDate { get; set; }
        public string? DeliveryTime { get; set; }
        public string PaymentMethod { get; set; } = string.Empty; // gcash or cod
        public decimal TotalAmount { get; set; }

        public int? ProductId { get; set; }
    }
}