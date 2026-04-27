using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Product;
using static api.DTOs.Order.OrderItemDTO;

namespace api.DTOs.Order
{
    // What the server sends back to the client when an order is created or retrieved
    public class OrderResponseDTO
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public bool IsPrinted { get; set; }
        public DateTime? PrintedAt { get; set; }

        public string? CustomerName { get; set; }
        public List<string>? Contacts { get; set; }
        public string? FacebookProfile { get; set; }

        public string? OrderType { get; set; }
        public string? Address { get; set; }
        public string? Zone { get; set; }
        public DateTime DeliveryDate { get; set; }
        public string? DeliveryTime { get; set; }
        public string? PaymentMethod { get; set; }
        public decimal TotalAmount { get; set; }

        public List<OrderItemResponseDTO> Items { get; set; } = new();


    }
}