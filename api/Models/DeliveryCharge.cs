namespace api.Models
{
    public class DeliveryCharge
    {
        public int Id { get; set; }
        public string ZoneName { get; set; } = string.Empty;
        public string CityName { get; set; } = string.Empty;

        public string AreaType { get; set; } = "proper"; // proper | mountain | far
        public decimal BaseFee { get; set; }
        public decimal Surcharge { get; set; } = 0;

        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}