using api.Models;

public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? FacebookProfile { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<CustomerContact> Contacts { get; set; } = new List<CustomerContact>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}