using System;
using System.Collections.Generic;
using System.Linq;
using api.Models;

namespace api.data
{
    public static class SeedData
    {
        // ─────────────────────────────────────────────
        // ROLES
        // ─────────────────────────────────────────────
        public static List<Role> GetRoles()
        {
            return new List<Role>
            {
                new Role { RoleName = "admin", Description = "Administrator" },
                new Role { RoleName = "encoder", Description = "Encoder" }
            };
        }

        // ─────────────────────────────────────────────
        // USERS
        // ─────────────────────────────────────────────
        public static List<User> GetUsers(List<Role> roles)
        {
            return new List<User>
            {
                new User
                {
                    FullName = "Admin User",
                    Username = "admin",
                    PasswordHash = "admin123",
                    RoleId = roles.First(r => r.RoleName == "admin").Id
                },
                new User
                {
                    FullName = "Encoder User",
                    Username = "encoder",
                    PasswordHash = "encoder123",
                    RoleId = roles.First(r => r.RoleName == "encoder").Id
                }
            };
        }

        // ─────────────────────────────────────────────
        // PRODUCT TYPES
        // ─────────────────────────────────────────────
        public static List<ProductType> GetProductTypes()
        {
            return new List<ProductType>
            {
                new ProductType
                {
                    TypeName = "lechon_package",
                    Description = "Lechon package",
                    HasIncludedDishes = true,
                    HasExtraDishes = true,
                    HasFreebies = true
                },
                new ProductType
                {
                    TypeName = "belly_package",
                    Description = "Belly package",
                    HasIncludedDishes = true,
                    HasExtraDishes = true,
                    HasFreebies = true
                },
                new ProductType
                {
                    TypeName = "lechon_only",
                    Description = "Lechon only",
                    HasIncludedDishes = false,
                    HasExtraDishes = true,
                    HasFreebies = true
                },
                new ProductType
                {
                    TypeName = "belly_only",
                    Description = "Belly only",
                    HasIncludedDishes = false,
                    HasExtraDishes = false,
                    HasFreebies = true
                },
                new ProductType
                {
                    TypeName = "dish_only",
                    Description = "Dish only orders",
                    HasIncludedDishes = false,
                    HasExtraDishes = false,
                    HasFreebies = false
                }
            };
        }

        // ─────────────────────────────────────────────
        // DISHES
        // ─────────────────────────────────────────────
        public static List<Dish> GetDishes()
        {
            var dishes = new List<(string Name, decimal Amount)>
            {
                ("Buttered Chicken",        700),
                ("Cordon Blue",             700),
                ("Buttered Shrimp",         700),
                ("Porksteak",               700),
                ("Humba",                   700),
                ("Bam-e",                   700),
                ("Calamares",               700),
                ("Fish Fillet",             700),
                ("Sweet and Sour Fish",     700),
                ("Sweet and Sour Chicken",  700),
                ("Sweet and Sour Pork",     700),
                ("Pork Caldereta",          700),
                ("Chicken Afritada",        700),
                ("Menudo",                  700),
                ("Lumpia",                  700),
                ("Sinugbang Isda",          700),
                ("Chop Suey",               700),
                ("Buffalo Chicken",         700),
                ("Pork Afritada",           700),
                ("Tempura Shrimp",          700),
                ("Escabeche",               700),
                ("Kinilaw",                 700),
                ("Porkchop",                700),
                ("Pancit Guisado",          700),
                // Added to match package defaults
                ("Crispy Chicken",          700),
                ("Tempura",                 700),
                ("Carbonara",               700),
            };

            return dishes.Select(d => new Dish
            {
                DishName = d.Name,
                Amount = d.Amount,
                IsActive = true
            }).ToList();
        }

        // ─────────────────────────────────────────────
        // PRODUCTS
        // ─────────────────────────────────────────────
        public static List<Product> GetProducts(List<ProductType> types)
        {
            var lechonPackage = types.First(t => t.TypeName == "lechon_package");
            var bellyPackage = types.First(t => t.TypeName == "belly_package");
            var lechonOnly = types.First(t => t.TypeName == "lechon_only");
            var bellyOnly = types.First(t => t.TypeName == "belly_only");
            var dishOnly = types.First(t => t.TypeName == "dish_only");

            return new List<Product>
            {
                // ── LECHON PACKAGE ────────────────────────────────────────
                new Product { ProductName = "Fiesta 1 (16kg - 18kg)",          Amount = 14950, PromoAmount = -1000, NoOfIncludedDishes = 3, ProductTypeId = lechonPackage.Id },
                new Product { ProductName = "Fiesta 2 (16kg - 18kg)",          Amount = 15600, PromoAmount = -1000, NoOfIncludedDishes = 4, ProductTypeId = lechonPackage.Id },
                new Product { ProductName = "Fiesta 3 (16kg - 18kg)",          Amount = 16900, PromoAmount = -1000, NoOfIncludedDishes = 6, ProductTypeId = lechonPackage.Id },
                new Product { ProductName = "Fiesta 4 (16kg - 18kg)",          Amount = 18200, PromoAmount = -1000, NoOfIncludedDishes = 8, ProductTypeId = lechonPackage.Id },

                new Product { ProductName = "Jumbo Set A (22kg - 25kg)",       Amount = 16950, PromoAmount = -1000, NoOfIncludedDishes = 3, ProductTypeId = lechonPackage.Id },
                new Product { ProductName = "Jumbo Set B (22kg - 25kg)",       Amount = 17600, PromoAmount = -1000, NoOfIncludedDishes = 4, ProductTypeId = lechonPackage.Id },
                new Product { ProductName = "Jumbo Set C (22kg - 25kg)",       Amount = 18900, PromoAmount = -1000, NoOfIncludedDishes = 6, ProductTypeId = lechonPackage.Id },
                new Product { ProductName = "Jumbo Set D (22kg - 25kg)",       Amount = 20200, PromoAmount = -1000, NoOfIncludedDishes = 8, ProductTypeId = lechonPackage.Id },

                new Product { ProductName = "Medium 1 (8kg - 10kg)",           Amount = 10950, PromoAmount = -500,  NoOfIncludedDishes = 3, ProductTypeId = lechonPackage.Id },
                new Product { ProductName = "Medium 2 (8kg - 10kg)",           Amount = 11600, PromoAmount = -500,  NoOfIncludedDishes = 4, ProductTypeId = lechonPackage.Id },
                new Product { ProductName = "Medium 3 (8kg - 10kg)",           Amount = 12900, PromoAmount = -500,  NoOfIncludedDishes = 6, ProductTypeId = lechonPackage.Id },
                new Product { ProductName = "Medium 4 (8kg - 10kg)",           Amount = 14200, PromoAmount = -500,  NoOfIncludedDishes = 8, ProductTypeId = lechonPackage.Id },

                new Product { ProductName = "Regular 1 (11kg - 13kg)",         Amount = 11950, PromoAmount = -500,  NoOfIncludedDishes = 3, ProductTypeId = lechonPackage.Id },
                new Product { ProductName = "Regular 2 (11kg - 13kg)",         Amount = 12600, PromoAmount = -500,  NoOfIncludedDishes = 4, ProductTypeId = lechonPackage.Id },
                new Product { ProductName = "Regular 3 (11kg - 13kg)",         Amount = 13900, PromoAmount = -500,  NoOfIncludedDishes = 6, ProductTypeId = lechonPackage.Id },
                new Product { ProductName = "Regular 4 (11kg - 13kg)",         Amount = 15200, PromoAmount = -500,  NoOfIncludedDishes = 8, ProductTypeId = lechonPackage.Id },

                new Product { ProductName = "Small 1 (7kg - 8kg)",             Amount = 9450,  PromoAmount = -500,  NoOfIncludedDishes = 3, ProductTypeId = lechonPackage.Id },
                new Product { ProductName = "Small 2 (7kg - 8kg)",             Amount = 10100, PromoAmount = -500,  NoOfIncludedDishes = 4, ProductTypeId = lechonPackage.Id },
                new Product { ProductName = "Small 3 (7kg - 8kg)",             Amount = 11400, PromoAmount = -500,  NoOfIncludedDishes = 6, ProductTypeId = lechonPackage.Id },
                new Product { ProductName = "Small 4 (7kg - 8kg)",             Amount = 12700, PromoAmount = -500,  NoOfIncludedDishes = 8, ProductTypeId = lechonPackage.Id },

                new Product { ProductName = "Buy Jumbo Get Lechon Belly",      Amount = 16000, PromoAmount = -500,  NoOfIncludedDishes = 0, ProductTypeId = lechonPackage.Id },
                new Product { ProductName = "Twin Package 1 (8kg - 10kg) 2pcs",Amount = 18800, PromoAmount = -500, NoOfIncludedDishes = 8, ProductTypeId = lechonPackage.Id },
                new Product { ProductName = "Twin Package 2 (11kg - 13kg) 2pcs",Amount = 22800,PromoAmount = -500, NoOfIncludedDishes = 8, ProductTypeId = lechonPackage.Id },

                // ── BELLY PACKAGE ─────────────────────────────────────────
                new Product { ProductName = "Belly - 1 (4kg)",                 Amount = 4790,  PromoAmount = -500,  NoOfIncludedDishes = 3, ProductTypeId = bellyPackage.Id },
                new Product { ProductName = "Belly - 2 (4kg)",                 Amount = 5400,  PromoAmount = -500,  NoOfIncludedDishes = 4, ProductTypeId = bellyPackage.Id },
                new Product { ProductName = "Belly - 4 (4kg)",                 Amount = 6590,  PromoAmount = -500,  NoOfIncludedDishes = 6, ProductTypeId = bellyPackage.Id },
                new Product { ProductName = "Big Belly A (6kg - 7kg)",         Amount = 6300,  PromoAmount = -500,  NoOfIncludedDishes = 4, ProductTypeId = bellyPackage.Id },
                new Product { ProductName = "Big Belly B (6kg - 7kg)",         Amount = 6900,  PromoAmount = -500,  NoOfIncludedDishes = 5, ProductTypeId = bellyPackage.Id },
                new Product { ProductName = "Big Belly C (6kg - 7kg)",         Amount = 7490,  PromoAmount = -500,  NoOfIncludedDishes = 6, ProductTypeId = bellyPackage.Id },

                // ── LECHON ONLY ───────────────────────────────────────────
                new Product { ProductName = "Cochinillo",                       Amount = 7000,  PromoAmount = 0,     ProductTypeId = lechonOnly.Id },
                new Product { ProductName = "Solo Lechon 7000",                 Amount = 7000,  PromoAmount = -500,  ProductTypeId = lechonOnly.Id },
                new Product { ProductName = "Solo Lechon 7500",                 Amount = 7500,  PromoAmount = -500,  ProductTypeId = lechonOnly.Id },
                new Product { ProductName = "Solo Lechon 8000",                 Amount = 8000,  PromoAmount = -500,  ProductTypeId = lechonOnly.Id },
                new Product { ProductName = "Solo Lechon 9000",                 Amount = 9000,  PromoAmount = -500,  ProductTypeId = lechonOnly.Id },
                new Product { ProductName = "Solo Lechon 9500",                 Amount = 9500,  PromoAmount = -500,  ProductTypeId = lechonOnly.Id },
                new Product { ProductName = "Solo Lechon 10000",                Amount = 10000, PromoAmount = -500,  ProductTypeId = lechonOnly.Id },
                new Product { ProductName = "Solo Lechon 11000",                Amount = 11000, PromoAmount = -500,  ProductTypeId = lechonOnly.Id },
                new Product { ProductName = "Solo Lechon 12000",                Amount = 12000, PromoAmount = -500,  ProductTypeId = lechonOnly.Id },
                new Product { ProductName = "Solo Lechon 14000",                Amount = 14000, PromoAmount = -500,  ProductTypeId = lechonOnly.Id },
                new Product { ProductName = "Solo Lechon 15000",                Amount = 15000, PromoAmount = -500,  ProductTypeId = lechonOnly.Id },
                new Product { ProductName = "Solo Lechon 16000",                Amount = 16000, PromoAmount = -500,  ProductTypeId = lechonOnly.Id },
                new Product { ProductName = "Solo Lechon 20000",                Amount = 20000, PromoAmount = -500,  ProductTypeId = lechonOnly.Id },
                new Product { ProductName = "Solo Lechon 25000",                Amount = 25000, PromoAmount = -500,  ProductTypeId = lechonOnly.Id },

                // ── BELLY ONLY ────────────────────────────────────────────
                new Product { ProductName = "Belly 3000",                       Amount = 3000,  PromoAmount = -500,  ProductTypeId = bellyOnly.Id },
                new Product { ProductName = "Belly 3400",                       Amount = 3400,  PromoAmount = -500,  ProductTypeId = bellyOnly.Id },
                new Product { ProductName = "Belly 3700",                       Amount = 3700,  PromoAmount = -500,  ProductTypeId = bellyOnly.Id },
                new Product { ProductName = "Belly 4000",                       Amount = 4000,  PromoAmount = -500,  ProductTypeId = bellyOnly.Id },
                new Product { ProductName = "Belly 4300",                       Amount = 4300,  PromoAmount = -500,  ProductTypeId = bellyOnly.Id },
                new Product { ProductName = "Belly 4700",                       Amount = 4700,  PromoAmount = -500,  ProductTypeId = bellyOnly.Id },
                new Product { ProductName = "Belly 5000",                       Amount = 5000,  PromoAmount = -500,  ProductTypeId = bellyOnly.Id },
                new Product { ProductName = "Belly 5300",                       Amount = 5300,  PromoAmount = -500,  ProductTypeId = bellyOnly.Id },
                new Product { ProductName = "Belly 5500",                       Amount = 5500,  PromoAmount = -500,  ProductTypeId = bellyOnly.Id },

                // ── DISH ONLY ─────────────────────────────────────────────
                new Product { ProductName = "Dish Order (Small Tray)",          Amount = 700,   ProductTypeId = dishOnly.Id },
                new Product { ProductName = "Dish Order (Large Tray)",          Amount = 1200,  ProductTypeId = dishOnly.Id },
            };
        }

        // ─────────────────────────────────────────────
        // FREEBIES
        // ─────────────────────────────────────────────
        public static List<ProductFreebie> GetProductFreebies(List<Product> products)
        {
            var freebies = new List<ProductFreebie>();

            // Helper: adds freebies to a product by name
            void AddFreebies(string productName, List<string> freebieNames)
            {
                var product = products.FirstOrDefault(p => p.ProductName == productName);
                if (product == null) return;
                foreach (var name in freebieNames)
                {
                    freebies.Add(new ProductFreebie
                    {
                        ProductId = product.Id,
                        FreebieName = name
                    });
                }
            }

            var lechonPackageFreebies = new List<string> { "Lechon Manok", "Coke Sakto 12pc", "Dinuguan", "Ginabot" };
            var lechonPackageFreebiesSmall = new List<string> { "Dinuguan", "Ginabot" };
            var bellyPackageFreebies = new List<string> { "Ribs", "Coke" };
            var lechonOnlyFreebies = new List<string> { "Lechon Manok", "Coke Sakto 12pc", "Dinuguan", "Ginabot" };
            var bellyOnlyFreebies = new List<string> { "Coke" };

            // ── LECHON PACKAGE ────────────────────────────────────────
            foreach (var name in new[]
            {
                "Fiesta 1 (16kg - 18kg)", "Fiesta 2 (16kg - 18kg)", "Fiesta 3 (16kg - 18kg)", "Fiesta 4 (16kg - 18kg)",
                "Jumbo Set A (22kg - 25kg)", "Jumbo Set B (22kg - 25kg)", "Jumbo Set C (22kg - 25kg)", "Jumbo Set D (22kg - 25kg)",
                "Medium 1 (8kg - 10kg)", "Medium 2 (8kg - 10kg)", "Medium 3 (8kg - 10kg)", "Medium 4 (8kg - 10kg)",
                "Regular 1 (11kg - 13kg)", "Regular 2 (11kg - 13kg)", "Regular 3 (11kg - 13kg)", "Regular 4 (11kg - 13kg)",
                "Twin Package 1 (8kg - 10kg) 2pcs", "Twin Package 2 (11kg - 13kg) 2pcs"
            })
                AddFreebies(name, lechonPackageFreebies);

            foreach (var name in new[]
            {
                "Small 1 (7kg - 8kg)", "Small 2 (7kg - 8kg)", "Small 3 (7kg - 8kg)", "Small 4 (7kg - 8kg)"
            })
                AddFreebies(name, lechonPackageFreebiesSmall);

            AddFreebies("Buy Jumbo Get Lechon Belly", new List<string> { "Lechon Belly", "Coke 1.5L", "Dinuguan", "Ginabot" });

            // ── BELLY PACKAGE ─────────────────────────────────────────
            foreach (var name in new[]
            {
                "Belly - 1 (4kg)", "Belly - 2 (4kg)", "Belly - 4 (4kg)",
                "Big Belly A (6kg - 7kg)", "Big Belly B (6kg - 7kg)", "Big Belly C (6kg - 7kg)"
            })
                AddFreebies(name, bellyPackageFreebies);

            // ── LECHON ONLY ───────────────────────────────────────────
            // Cochinillo has no freebies
            foreach (var name in new[]
            {
                "Solo Lechon 7000", "Solo Lechon 7500", "Solo Lechon 8000", "Solo Lechon 9000",
                "Solo Lechon 9500", "Solo Lechon 10000", "Solo Lechon 11000", "Solo Lechon 12000",
                "Solo Lechon 14000", "Solo Lechon 15000", "Solo Lechon 16000", "Solo Lechon 20000",
                "Solo Lechon 25000"
            })
                AddFreebies(name, lechonOnlyFreebies);

            // ── BELLY ONLY ────────────────────────────────────────────
            foreach (var name in new[]
            {
                "Belly 3000", "Belly 3400", "Belly 3700", "Belly 4000", "Belly 4300",
                "Belly 4700", "Belly 5000", "Belly 5300", "Belly 5500"
            })
                AddFreebies(name, bellyOnlyFreebies);

            return freebies;
        }

        // ─────────────────────────────────────────────
        // DEFAULT DISHES
        // ─────────────────────────────────────────────
        public static List<ProductDefaultDish> GetProductDefaultDishes(
            List<Product> products,
            List<Dish> dishes)
        {
            var defaults = new List<ProductDefaultDish>();

            Dish? GetDish(string name) =>
                dishes.FirstOrDefault(d =>
                    d.DishName.Equals(name, StringComparison.OrdinalIgnoreCase));

            Product? GetProduct(string name) =>
                products.FirstOrDefault(p => p.ProductName == name);

            void AddDefaults(string productName, List<string> dishNames)
            {
                var product = GetProduct(productName);
                if (product == null) return;
                foreach (var dishName in dishNames)
                {
                    var dish = GetDish(dishName);
                    if (dish == null) continue;
                    defaults.Add(new ProductDefaultDish
                    {
                        ProductId = product.Id,
                        DishId = dish.Id
                    });
                }
            }

            // ── LECHON PACKAGE ────────────────────────────────────────
            AddDefaults("Fiesta 1 (16kg - 18kg)", new() { "Tempura", "Cordon Blue", "Escabeche" });
            AddDefaults("Fiesta 2 (16kg - 18kg)", new() { "Cordon Blue", "Escabeche", "Buttered Shrimp", "Sweet and Sour Fish" });
            AddDefaults("Fiesta 3 (16kg - 18kg)", new() { "Cordon Blue", "Chop Suey", "Buttered Shrimp", "Escabeche", "Sweet and Sour Fish", "Crispy Chicken" });
            AddDefaults("Fiesta 4 (16kg - 18kg)", new() { "Cordon Blue", "Chop Suey", "Buttered Shrimp", "Escabeche", "Tempura", "Bam-e", "Sweet and Sour Fish", "Crispy Chicken" });

            AddDefaults("Jumbo Set A (22kg - 25kg)", new() { "Tempura", "Cordon Blue", "Escabeche" });
            AddDefaults("Jumbo Set B (22kg - 25kg)", new() { "Cordon Blue", "Escabeche", "Buttered Shrimp", "Sweet and Sour Fish" });
            AddDefaults("Jumbo Set C (22kg - 25kg)", new() { "Cordon Blue", "Chop Suey", "Buttered Shrimp", "Escabeche", "Sweet and Sour Fish", "Crispy Chicken" });
            AddDefaults("Jumbo Set D (22kg - 25kg)", new() { "Cordon Blue", "Chop Suey", "Buttered Shrimp", "Escabeche", "Tempura", "Bam-e", "Sweet and Sour Fish", "Crispy Chicken" });

            AddDefaults("Medium 1 (8kg - 10kg)", new() { "Cordon Blue", "Tempura", "Escabeche" });
            AddDefaults("Medium 2 (8kg - 10kg)", new() { "Cordon Blue", "Escabeche", "Buttered Shrimp", "Sweet and Sour Fish" });
            AddDefaults("Medium 3 (8kg - 10kg)", new() { "Cordon Blue", "Chop Suey", "Buttered Shrimp", "Escabeche", "Sweet and Sour Fish", "Crispy Chicken" });
            AddDefaults("Medium 4 (8kg - 10kg)", new() { "Cordon Blue", "Chop Suey", "Buttered Shrimp", "Escabeche", "Tempura", "Bam-e", "Sweet and Sour Fish", "Crispy Chicken" });

            AddDefaults("Regular 1 (11kg - 13kg)", new() { "Tempura", "Escabeche", "Cordon Blue" });
            AddDefaults("Regular 2 (11kg - 13kg)", new() { "Buttered Shrimp", "Sweet and Sour Fish", "Escabeche", "Cordon Blue" });
            AddDefaults("Regular 3 (11kg - 13kg)", new() { "Crispy Chicken", "Escabeche", "Cordon Blue", "Chop Suey", "Buttered Shrimp", "Sweet and Sour Fish" });
            AddDefaults("Regular 4 (11kg - 13kg)", new() { "Cordon Blue", "Chop Suey", "Buttered Shrimp", "Escabeche", "Tempura", "Bam-e", "Sweet and Sour Fish", "Crispy Chicken" });

            AddDefaults("Small 1 (7kg - 8kg)", new() { "Cordon Blue", "Tempura", "Escabeche" });
            AddDefaults("Small 2 (7kg - 8kg)", new() { "Cordon Blue", "Sweet and Sour Fish", "Escabeche", "Buttered Shrimp" });
            AddDefaults("Small 3 (7kg - 8kg)", new() { "Cordon Blue", "Chop Suey", "Buttered Shrimp", "Escabeche", "Sweet and Sour Fish", "Crispy Chicken" });
            AddDefaults("Small 4 (7kg - 8kg)", new() { "Cordon Blue", "Chop Suey", "Buttered Shrimp", "Escabeche", "Tempura", "Bam-e", "Sweet and Sour Fish", "Crispy Chicken" });

            // ── BELLY PACKAGE ─────────────────────────────────────────
            AddDefaults("Belly - 1 (4kg)", new() { "Cordon Blue", "Humba", "Calamares" });
            AddDefaults("Belly - 2 (4kg)", new() { "Crispy Chicken", "Sweet and Sour Chicken", "Lumpia", "Carbonara" });
            AddDefaults("Belly - 4 (4kg)", new() { "Bam-e", "Buttered Shrimp", "Menudo", "Calamares", "Lumpia", "Chop Suey" });
            AddDefaults("Big Belly A (6kg - 7kg)", new() { "Lumpia", "Humba", "Calamares", "Buttered Shrimp" });
            AddDefaults("Big Belly B (6kg - 7kg)", new() { "Cordon Blue", "Escabeche", "Buffalo Chicken", "Buttered Shrimp", "Crispy Chicken" });
            AddDefaults("Big Belly C (6kg - 7kg)", new() { "Bam-e", "Buttered Shrimp", "Menudo", "Calamares", "Lumpia", "Chop Suey" });

            return defaults;
        }

        // ─────────────────────────────────────────────
        // DELIVERY CHARGES
        // ─────────────────────────────────────────────
        public static List<DeliveryCharge> GetDeliveryCharges()
        {
            return new List<DeliveryCharge>
            {
                // ======================
                // TALISAY
                // ======================
                new DeliveryCharge { ZoneName = "Talisay-Proper",   CityName = "Talisay City", AreaType = "proper",   BaseFee = 150 },
                new DeliveryCharge { ZoneName = "Talisay-Mountain", CityName = "Talisay City", AreaType = "mountain", BaseFee = 150, Surcharge = 100 },

                // ======================
                // MINGLANILLA
                // ======================
                new DeliveryCharge { ZoneName = "Minglanilla-Proper",   CityName = "Minglanilla", AreaType = "proper",   BaseFee = 250 },
                new DeliveryCharge { ZoneName = "Minglanilla-Mountain", CityName = "Minglanilla", AreaType = "mountain", BaseFee = 250, Surcharge = 100 },

                // ======================
                // NAGA
                // ======================
                new DeliveryCharge { ZoneName = "Naga-Proper",   CityName = "Naga City", AreaType = "proper",   BaseFee = 400 },
                new DeliveryCharge { ZoneName = "Naga-Mountain", CityName = "Naga City", AreaType = "mountain", BaseFee = 400, Surcharge = 100 },

                // ======================
                // CARCAR
                // ======================
                new DeliveryCharge { ZoneName = "Carcar-Proper",   CityName = "Carcar City", AreaType = "proper",   BaseFee = 600 },
                new DeliveryCharge { ZoneName = "Carcar-Mountain", CityName = "Carcar City", AreaType = "mountain", BaseFee = 600, Surcharge = 100 },

                // ======================
                // CEBU CITY AREAS
                // ======================
                new DeliveryCharge { ZoneName = "Cebu-Proper",   CityName = "Cebu City", AreaType = "proper",   BaseFee = 250 },
                new DeliveryCharge { ZoneName = "Cebu-Mountain", CityName = "Cebu City", AreaType = "mountain", BaseFee = 250, Surcharge = 250 },

                // Barangay-level flat areas (no mountain split)
                new DeliveryCharge { ZoneName = "Mandaue-Proper",    CityName = "Mandaue City",  AreaType = "proper", BaseFee = 350 },
                new DeliveryCharge { ZoneName = "Consolacion-Proper", CityName = "Consolacion",   AreaType = "proper", BaseFee = 400 },
                new DeliveryCharge { ZoneName = "Consolacion-Mountain", CityName = "Consolacion",   AreaType = "mountain", BaseFee = 400, Surcharge = 100 },

                new DeliveryCharge { ZoneName = "LapuLapu-Proper",   CityName = "Lapu-Lapu City",AreaType = "proper", BaseFee = 400 },
                new DeliveryCharge { ZoneName = "Cordova-Proper",    CityName = "Cordova",       AreaType = "proper", BaseFee = 450 },

                // Far provinces
                new DeliveryCharge { ZoneName = "Liloan-Proper",     CityName = "Liloan",       AreaType = "proper", BaseFee = 500 },
                new DeliveryCharge { ZoneName = "Liloan-Mountain",   CityName = "Liloan",       AreaType = "mountain", BaseFee = 500, Surcharge = 100 },

                new DeliveryCharge { ZoneName = "Compostela-Proper", CityName = "Compostela",   AreaType = "proper", BaseFee = 600 },
                new DeliveryCharge { ZoneName = "Compostela-Mountain", CityName = "Compostela",   AreaType = "mountain", BaseFee = 600, Surcharge = 100 },

                new DeliveryCharge { ZoneName = "Danao-Proper",      CityName = "Danao City",   AreaType = "proper", BaseFee = 700 },
                new DeliveryCharge { ZoneName = "Danao-Mountain",    CityName = "Danao City",   AreaType = "mountain", BaseFee = 700, Surcharge = 100 },
                // ======================
                // MOALBOAL
                // ======================
                new DeliveryCharge { ZoneName = "Moalboal-Proper", CityName = "Moalboal", AreaType = "proper", BaseFee = 1200 },
                new DeliveryCharge { ZoneName = "Moalboal-Mountain", CityName = "Moalboal", AreaType = "mountain", BaseFee = 1200, Surcharge = 100 },
                // ======================
                // SIBONGA (you wrote "sibunga" - corrected)
                // ======================
                new DeliveryCharge { ZoneName = "Sibonga-Proper", CityName = "Sibonga", AreaType = "proper", BaseFee = 900 },
                new DeliveryCharge { ZoneName = "Sibonga-Mountain", CityName = "Sibonga", AreaType = "mountain", BaseFee = 900, Surcharge = 100 },

                // ======================
                // SAN FERNANDO
                // ======================
                new DeliveryCharge { ZoneName = "San Fernando-Proper", CityName = "San Fernando", AreaType = "proper", BaseFee = 500 },
                new DeliveryCharge { ZoneName = "San Fernando-Mountain", CityName = "San Fernando", AreaType = "mountain", BaseFee = 500, Surcharge = 100 },

                // ======================
                // ARGAO
                // ======================
                new DeliveryCharge { ZoneName = "Argao-Proper", CityName = "Argao", AreaType = "proper", BaseFee = 1200 },
                new DeliveryCharge { ZoneName = "Argao-Mountain", CityName = "Argao", AreaType = "mountain", BaseFee = 1200, Surcharge = 100 },

            };
        }
    }
}