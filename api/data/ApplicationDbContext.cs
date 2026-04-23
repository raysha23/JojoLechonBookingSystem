using Microsoft.EntityFrameworkCore;
using api.Models;

namespace api.data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // ✅ Fix decimal precision for Order
            modelBuilder.Entity<Order>()
                .Property(o => o.TotalAmount)
                .HasPrecision(18, 2);

            // You should also fix others (based on your warnings)
            modelBuilder.Entity<Product>()
                .Property(p => p.Amount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Product>()
                .Property(p => p.PromoAmount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Dish>()
                .Property(d => d.Amount)
                .HasPrecision(18, 2);
        }

        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<CustomerContact> CustomerContacts { get; set; }
        public DbSet<ProductType> ProductTypes { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductFreebie> ProductFreebies { get; set; }
        public DbSet<Dish> Dishes { get; set; }
        public DbSet<ProductDefaultDish> ProductDefaultDishes { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDish> OrderDishes { get; set; }
        public DbSet<DeliveryCharge> DeliveryCharges { get; set; }
    }
}