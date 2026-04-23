using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.data
{
    public static class SeedData
    {
        public static List<Role> GetRoles()
        {
            return new List<Role>
            {
                new Role { RoleName = "admin", Description = "Administrator" },
                new Role { RoleName = "encoder", Description = "Encoder" }
            };
        }
        public static List<User> GetUsers(List<Role> roles)
        {
            return new List<User>
            {
                new User { FullName = "Admin User", Username = "admin", PasswordHash = "admin123", RoleId = roles.First(r => r.RoleName == "admin").Id },
                new User { FullName = "Encoder User", Username = "encoder", PasswordHash = "encoder123", RoleId = roles.First(r => r.RoleName == "encoder").Id }
            };
        }
        public static List<Dish> GetDishes()
        {
            return new List<Dish>
            {
                new Dish { DishName = "Shanghai", Amount = 700 },
                new Dish { DishName = "Pancit", Amount = 700 },
                new Dish { DishName = "Chopsuey", Amount = 700 },
                new Dish { DishName = "Fried Rice", Amount = 500 },
                new Dish { DishName = "Steamed Rice", Amount = 500 }
            };
        }
        public static List<ProductType> GetProductTypes()
        {
            return new List<ProductType>
            {
                new ProductType
                {
                    TypeName = "lechon_package",
                    Description = "Lechon package products with dishes and freebies",
                    HasIncludedDishes = true,
                    HasExtraDishes = true,
                    HasFreebies = true
                },
                new ProductType
                {
                    TypeName = "belly_package",
                    Description = "Belly package products with dishes and freebies",
                    HasIncludedDishes = true,
                    HasExtraDishes = true,
                    HasFreebies = true
                },
                new ProductType
                {
                    TypeName = "lechon_only",
                    Description = "Lechon only products",
                    HasIncludedDishes = false,
                    HasExtraDishes = true,
                    HasFreebies = true
                }
            };
        }

        public static List<Product> GetProducts(List<ProductType> productTypes)
        {
            var lechonPackageType = productTypes.First(pt => pt.TypeName == "lechon_package");
            var bellyPackageType = productTypes.First(pt => pt.TypeName == "belly_package");
            var lechonOnlyType = productTypes.First(pt => pt.TypeName == "lechon_only");

            return new List<Product>
            {
                new Product
                {
                    ProductName = "Lechon Package A",
                    Amount = 8500,
                    PromoAmount = 8000,
                    NoOfIncludedDishes = 2,
                    ProductTypeId = lechonPackageType.Id
                },
                new Product
                {
                    ProductName = "Lechon Package B",
                    Amount = 10500,
                    PromoAmount = 9800,
                    NoOfIncludedDishes = 3,
                    ProductTypeId = lechonPackageType.Id
                },
                new Product
                {
                    ProductName = "Belly Package A",
                    Amount = 6500,
                    PromoAmount = 6000,
                    NoOfIncludedDishes = 2,
                    ProductTypeId = bellyPackageType.Id
                },
                new Product
                {
                    ProductName = "Lechon Only (Small)",
                    Amount = 5000,
                    PromoAmount = 0,
                    NoOfIncludedDishes = 0,
                    ProductTypeId = lechonOnlyType.Id
                }
            };
        }
        public static List<ProductFreebie> GetProductFreebies(List<Product> products)
        {
            var lechonA = products.First(p => p.ProductName == "Lechon Package A");
            var lechonB = products.First(p => p.ProductName == "Lechon Package B");

            return new List<ProductFreebie>
            {
                new ProductFreebie { ProductId = lechonA.Id, FreebieName = "1.5L Coke" },
                new ProductFreebie { ProductId = lechonA.Id, FreebieName = "Plastic Utensils" },

                new ProductFreebie { ProductId = lechonB.Id, FreebieName = "2x 1.5L Coke" },
                new ProductFreebie { ProductId = lechonB.Id, FreebieName = "Party Hats" }
            };
        }
        public static List<ProductDefaultDish> GetProductDefaultDishes(List<Product> products, List<Dish> dishes)
        {
            var lechonA = products.First(p => p.ProductName == "Lechon Package A");
            var lechonB = products.First(p => p.ProductName == "Lechon Package B");
            var bellyA = products.First(p => p.ProductName == "Belly Package A");

            var shanghai = dishes.First(d => d.DishName == "Shanghai");
            var pancit = dishes.First(d => d.DishName == "Pancit");
            var chopsuey = dishes.First(d => d.DishName == "Chopsuey");
            var friedRice = dishes.First(d => d.DishName == "Fried Rice");

            return new List<ProductDefaultDish>
            {
                new ProductDefaultDish { ProductId = lechonA.Id, DishId = shanghai.Id },
                new ProductDefaultDish { ProductId = lechonA.Id, DishId = pancit.Id },

                new ProductDefaultDish { ProductId = lechonB.Id, DishId = shanghai.Id },
                new ProductDefaultDish { ProductId = lechonB.Id, DishId = chopsuey.Id },

                new ProductDefaultDish { ProductId = bellyA.Id, DishId = pancit.Id },
                new ProductDefaultDish { ProductId = bellyA.Id, DishId = friedRice.Id }
            };
        }
        public static List<Customer> GetCustomers()
        {
            return new List<Customer>
            {
                new Customer
                {
                    Name = "Maria Santos",
                    FacebookProfile = "https://facebook.com/maria.santos",
                    Contacts = new List<CustomerContact>
                    {
                        new CustomerContact { ContactNumber = "09171234567" }
                    }
                },
                new Customer
                {
                    Name = "Juan Dela Cruz",
                    FacebookProfile = "https://facebook.com/juan.delacruz",
                    Contacts = new List<CustomerContact>
                    {
                        new CustomerContact { ContactNumber = "09181234567" }
                    }
                },
                new Customer
                {
                    Name = "Ana Reyes",
                    FacebookProfile = "https://facebook.com/ana.reyes",
                    Contacts = new List<CustomerContact>
                    {
                        new CustomerContact { ContactNumber = "09191234567" }
                    }
                }
            };
        }
        public static List<Order> GetOrders(List<Customer> customers, List<Product> products)
        {
            return new List<Order>
            {
                new Order
                {
                    OrderNumber = "ORD-001",
                    OrderType = "delivery",
                    Address = "123 Mango St., Cebu City",
                    Zone = "Zone 1",
                    DeliveryDate = DateTime.Today, // Today's date
                    DeliveryTime = "10:00 AM",
                    PaymentMethod = "gcash",
                    TotalAmount = 14450,
                    SubmittedByType = "customer",
                    Status = "active",
                    IsPrinted = false,
                    CreatedAt = DateTime.UtcNow,
                    CustomerId = customers.First().Id,
                    ProductId = products.First().Id
                },
                new Order
                {
                    OrderNumber = "ORD-002",
                    OrderType = "pickup",
                    DeliveryDate = DateTime.Today, // Today's date
                    DeliveryTime = "2:00 PM",
                    PaymentMethod = "cod",
                    TotalAmount = 15950,
                    SubmittedByType = "customer",
                    Status = "active",
                    IsPrinted = true,
                    CreatedAt = DateTime.UtcNow.AddHours(-2),
                    CustomerId = customers.Skip(1).First().Id,
                    ProductId = products.Skip(1).First().Id
                },
                new Order
                {
                    OrderNumber = "ORD-003",
                    OrderType = "delivery",
                    Address = "456 Pineapple Ave., Cebu City",
                    Zone = "Zone 2",
                    DeliveryDate = DateTime.Today.AddDays(1), // Tomorrow's date
                    DeliveryTime = "11:30 AM",
                    PaymentMethod = "gcash",
                    TotalAmount = 13950,
                    SubmittedByType = "customer",
                    Status = "active",
                    IsPrinted = false,
                    CreatedAt = DateTime.UtcNow.AddHours(-1),
                    CustomerId = customers.Skip(2).First().Id,
                    ProductId = products.First().Id
                }
            };
        }
    }
}