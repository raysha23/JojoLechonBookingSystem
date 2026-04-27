using Microsoft.EntityFrameworkCore;
using api.Models;

namespace api.data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Order>().Property(o => o.TotalAmount).HasPrecision(18, 2);
            modelBuilder.Entity<Product>().Property(p => p.Amount).HasPrecision(18, 2);
            modelBuilder.Entity<Product>().Property(p => p.PromoAmount).HasPrecision(18, 2);
            modelBuilder.Entity<Dish>().Property(d => d.Amount).HasPrecision(18, 2);
            modelBuilder.Entity<OrderItem>().Property(i => i.UpgradeAmount).HasPrecision(18, 2);

            modelBuilder.Entity<Order>().HasIndex(o => o.DeliveryDate);
            modelBuilder.Entity<Order>().HasIndex(o => o.Status);
            modelBuilder.Entity<Product>().HasIndex(p => p.ProductTypeId);
            modelBuilder.Entity<ProductType>().HasIndex(pt => pt.TypeName);
            modelBuilder.Entity<Dish>().HasIndex(d => d.IsActive);
            modelBuilder.Entity<User>().HasIndex(u => u.Username).IsUnique();

            // OrderItem → Order
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // OrderItemDish → OrderItem
            modelBuilder.Entity<OrderItemDish>()
                .HasOne(oid => oid.OrderItem)
                .WithMany(oi => oi.OrderItemDishes)
                .HasForeignKey(oid => oid.OrderItemId)
                .OnDelete(DeleteBehavior.Cascade);

            // OrderItemDish → Dish
            modelBuilder.Entity<OrderItemDish>()
                .HasOne(oid => oid.Dish)
                .WithMany()
                .HasForeignKey(oid => oid.DishId)
                .OnDelete(DeleteBehavior.Restrict);
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
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<OrderItemDish> OrderItemDishes { get; set; }
        public DbSet<DeliveryCharge> DeliveryCharges { get; set; }
    }
}