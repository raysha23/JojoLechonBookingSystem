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
        public static List<Product> GetProducts()
        {
            return new List<Product>
            {
                new Product
                {
                    ProductName = "Lechon Package A",
                    Amount = 8500,
                    PromoAmount = 8000,
                    NoOfIncludedDishes = 2
                },
                new Product
                {
                    ProductName = "Lechon Package B",
                    Amount = 10500,
                    PromoAmount = 9800,
                    NoOfIncludedDishes = 3
                },
                new Product
                {
                    ProductName = "Belly Package A",
                    Amount = 6500,
                    PromoAmount = 6000,
                    NoOfIncludedDishes = 2
                },
                new Product
                {
                    ProductName = "Lechon Only (Small)",
                    Amount = 5000,
                    PromoAmount = 0,
                    NoOfIncludedDishes = 0
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
    }
}