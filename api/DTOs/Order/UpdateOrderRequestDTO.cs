using System;
using System.Collections.Generic;
using api.DTOs.Product;

namespace api.DTOs.Order
{
    public class UpdateOrderRequestDTO
    {
        public string? OrderType { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public string? DeliveryTime { get; set; }
        public string? Address { get; set; }
        public string? Zone { get; set; }
        public string? PaymentMethod { get; set; }
        public decimal TotalAmount { get; set; }
        public bool? IsPrinted { get; set; }

        // ← NEW
        public int? ProductId { get; set; }
        public DishesDTO? Dishes { get; set; }

    }
}