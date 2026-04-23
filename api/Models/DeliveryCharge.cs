namespace api.Models
{
    public class DeliveryCharge
    {
        public int Id { get; set; }
        public string ZoneName { get; set; } = string.Empty;
        public decimal MinAmount { get; set; }
        public decimal? MaxAmount { get; set; } // nullable — some zones have fixed price
    }
}