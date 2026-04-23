using System;

namespace api.DTOs.Order
{
    //What the client sends to the server when updating an order
    public class UpdateOrderDTO
    {
        public string? OrderType { get; set; }   // delivery or pickup
        public DateTime DeliveryDate { get; set; }
        public string? DeliveryTime { get; set; }
        public string? PaymentMethod { get; set; } // gcash or cod
        public decimal TotalAmount { get; set; }
        public bool? IsPrinted { get; set; }
    }
}
