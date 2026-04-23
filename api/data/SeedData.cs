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
                new Role { RoleName = "admin",   Description = "Administrator" },
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
                    FullName     = "Admin User",
                    Username     = "admin",
                    PasswordHash = "admin123",
                    RoleId       = roles.First(r => r.RoleName == "admin").Id
                },
                new User
                {
                    FullName     = "Encoder User",
                    Username     = "encoder",
                    PasswordHash = "encoder123",
                    RoleId       = roles.First(r => r.RoleName == "encoder").Id
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
                    TypeName          = "lechon_package",
                    Description       = "Lechon package with dishes and freebies",
                    HasIncludedDishes = true,
                    HasExtraDishes    = true,
                    HasFreebies       = true
                },
                new ProductType
                {
                    TypeName          = "belly_package",
                    Description       = "Belly package with dishes and freebies",
                    HasIncludedDishes = true,
                    HasExtraDishes    = true,
                    HasFreebies       = true
                },
                new ProductType
                {
                    TypeName          = "lechon_only",
                    Description       = "Lechon only — no included dishes",
                    HasIncludedDishes = false,
                    HasExtraDishes    = true,
                    HasFreebies       = true
                },
                new ProductType
                {
                    TypeName          = "belly_only",
                    Description       = "Belly only — no packages",
                    HasIncludedDishes = false,
                    HasExtraDishes    = false,
                    HasFreebies       = true
                }
            };
        }

        // ─────────────────────────────────────────────
        // DISHES
        // ─────────────────────────────────────────────
        public static List<Dish> GetDishes()
        {
            var dishNames = new List<string>
            {
                "Buttered Chicken", "Cordon Blue", "Buttered Shrimp", "Porksteak",
                "Humba", "Bam-e", "Calamares", "Fish Fillet",
                "Sweet and Sour Fish", "Sweet and Sour Chicken", "Sweet and Sour Pork",
                "Pork Caldereta", "Chicken Afritada", "Menudo", "Lumpia",
                "Sinugbang Isda", "Chop Suey", "Buffalo Chicken", "Pork Afritada",
                "Tempura Shrimp", "Escabeche", "Kinilaw", "Porkchop", "Pancit Guisado"
            };

            return dishNames.Select(name => new Dish
            {
                DishName = name,
                Amount = 700,
                IsActive = true
            }).ToList();
        }

        // ─────────────────────────────────────────────
        // PRODUCTS
        // ─────────────────────────────────────────────
        public static List<Product> GetProducts(List<ProductType> productTypes)
        {
            var lechonPackage = productTypes.First(pt => pt.TypeName == "lechon_package");
            var bellyPackage = productTypes.First(pt => pt.TypeName == "belly_package");
            var lechonOnly = productTypes.First(pt => pt.TypeName == "lechon_only");
            var bellyOnly = productTypes.First(pt => pt.TypeName == "belly_only");

            var products = new List<Product>();

            // ── BELLY ONLY ──────────────────────────────
            var bellyAmounts = new[] { 3000, 3400, 3700, 4000, 4300, 4700, 5000, 5300, 5500 };
            foreach (var amount in bellyAmounts)
            {
                products.Add(new Product
                {
                    ProductName = "Belly",
                    Amount = amount,
                    PromoAmount = -500,
                    NoOfIncludedDishes = 0,
                    ProductTypeId = bellyOnly.Id,
                    IsActive = true
                });
            }

            // ── BELLY PACKAGES ──────────────────────────
            products.Add(new Product { ProductName = "Belly - 1 (4kg)", Amount = 4790, PromoAmount = -500, NoOfIncludedDishes = 3, ProductTypeId = bellyPackage.Id, IsActive = true });
            products.Add(new Product { ProductName = "Belly - 2 (4kg)", Amount = 5400, PromoAmount = -500, NoOfIncludedDishes = 4, ProductTypeId = bellyPackage.Id, IsActive = true });
            products.Add(new Product { ProductName = "Belly - 4 (4kg)", Amount = 6590, PromoAmount = -500, NoOfIncludedDishes = 6, ProductTypeId = bellyPackage.Id, IsActive = true });
            products.Add(new Product { ProductName = "Big Belly A (6kg - 7kg)", Amount = 6300, PromoAmount = -500, NoOfIncludedDishes = 4, ProductTypeId = bellyPackage.Id, IsActive = true });
            products.Add(new Product { ProductName = "Big Belly B (6kg - 7kg)", Amount = 6900, PromoAmount = -500, NoOfIncludedDishes = 5, ProductTypeId = bellyPackage.Id, IsActive = true });
            products.Add(new Product { ProductName = "Big Belly C (6kg - 7kg)", Amount = 7490, PromoAmount = -500, NoOfIncludedDishes = 6, ProductTypeId = bellyPackage.Id, IsActive = true });

            // ── LECHON ONLY ─────────────────────────────
            products.Add(new Product { ProductName = "Cochinillo", Amount = 7000, PromoAmount = 0, NoOfIncludedDishes = 0, ProductTypeId = lechonOnly.Id, IsActive = true });
            products.Add(new Product { ProductName = "Solo Lechon", Amount = 7000, PromoAmount = -500, NoOfIncludedDishes = 0, ProductTypeId = lechonOnly.Id, IsActive = true });
            products.Add(new Product { ProductName = "Solo Lechon", Amount = 7500, PromoAmount = -500, NoOfIncludedDishes = 0, ProductTypeId = lechonOnly.Id, IsActive = true });
            products.Add(new Product { ProductName = "Solo Lechon", Amount = 8000, PromoAmount = -500, NoOfIncludedDishes = 0, ProductTypeId = lechonOnly.Id, IsActive = true });
            products.Add(new Product { ProductName = "Solo Lechon", Amount = 9000, PromoAmount = -500, NoOfIncludedDishes = 0, ProductTypeId = lechonOnly.Id, IsActive = true });
            products.Add(new Product { ProductName = "Solo Lechon", Amount = 9500, PromoAmount = -500, NoOfIncludedDishes = 0, ProductTypeId = lechonOnly.Id, IsActive = true });
            products.Add(new Product { ProductName = "Solo Lechon", Amount = 10000, PromoAmount = -500, NoOfIncludedDishes = 0, ProductTypeId = lechonOnly.Id, IsActive = true });
            products.Add(new Product { ProductName = "Solo Lechon", Amount = 11000, PromoAmount = -500, NoOfIncludedDishes = 0, ProductTypeId = lechonOnly.Id, IsActive = true });
            products.Add(new Product { ProductName = "Solo Lechon", Amount = 12000, PromoAmount = -500, NoOfIncludedDishes = 0, ProductTypeId = lechonOnly.Id, IsActive = true });
            products.Add(new Product { ProductName = "Solo Lechon", Amount = 14000, PromoAmount = -500, NoOfIncludedDishes = 0, ProductTypeId = lechonOnly.Id, IsActive = true });
            products.Add(new Product { ProductName = "Solo Lechon", Amount = 15000, PromoAmount = -500, NoOfIncludedDishes = 0, ProductTypeId = lechonOnly.Id, IsActive = true });
            products.Add(new Product { ProductName = "Solo Lechon", Amount = 16000, PromoAmount = -500, NoOfIncludedDishes = 0, ProductTypeId = lechonOnly.Id, IsActive = true });
            products.Add(new Product { ProductName = "Solo Lechon", Amount = 20000, PromoAmount = -500, NoOfIncludedDishes = 0, ProductTypeId = lechonOnly.Id, IsActive = true });
            products.Add(new Product { ProductName = "Solo Lechon", Amount = 25000, PromoAmount = -500, NoOfIncludedDishes = 0, ProductTypeId = lechonOnly.Id, IsActive = true });

            // ── LECHON PACKAGES ─────────────────────────
            // Pasko (18kg - 20kg)
            products.Add(new Product { ProductName = "Pasko 1 (18kg - 20kg)", Amount = 14950, PromoAmount = -1000, NoOfIncludedDishes = 3, ProductTypeId = lechonPackage.Id, IsActive = true });
            products.Add(new Product { ProductName = "Pasko 2 (18kg - 20kg)", Amount = 15600, PromoAmount = -1000, NoOfIncludedDishes = 4, ProductTypeId = lechonPackage.Id, IsActive = true });
            products.Add(new Product { ProductName = "Pasko 3 (18kg - 20kg)", Amount = 15600, PromoAmount = -1000, NoOfIncludedDishes = 6, ProductTypeId = lechonPackage.Id, IsActive = true });
            products.Add(new Product { ProductName = "Pasko 4 (18kg - 20kg)", Amount = 18200, PromoAmount = -1000, NoOfIncludedDishes = 8, ProductTypeId = lechonPackage.Id, IsActive = true });
            // Jumbo (22kg - 25kg)
            products.Add(new Product { ProductName = "Jumbo Set A (22kg - 25kg)", Amount = 16950, PromoAmount = -1000, NoOfIncludedDishes = 3, ProductTypeId = lechonPackage.Id, IsActive = true });
            products.Add(new Product { ProductName = "Jumbo Set B (22kg - 25kg)", Amount = 17600, PromoAmount = -1000, NoOfIncludedDishes = 4, ProductTypeId = lechonPackage.Id, IsActive = true });
            products.Add(new Product { ProductName = "Jumbo Set C (22kg - 25kg)", Amount = 18900, PromoAmount = -1000, NoOfIncludedDishes = 6, ProductTypeId = lechonPackage.Id, IsActive = true });
            products.Add(new Product { ProductName = "Jumbo Set D (22kg - 25kg)", Amount = 20200, PromoAmount = -1000, NoOfIncludedDishes = 8, ProductTypeId = lechonPackage.Id, IsActive = true });
            // Medium (8kg - 10kg)
            products.Add(new Product { ProductName = "Medium 1 (8kg - 10kg)", Amount = 10950, PromoAmount = -500, NoOfIncludedDishes = 3, ProductTypeId = lechonPackage.Id, IsActive = true });
            products.Add(new Product { ProductName = "Medium 2 (8kg - 10kg)", Amount = 11600, PromoAmount = -500, NoOfIncludedDishes = 4, ProductTypeId = lechonPackage.Id, IsActive = true });
            products.Add(new Product { ProductName = "Medium 3 (8kg - 10kg)", Amount = 12900, PromoAmount = -500, NoOfIncludedDishes = 6, ProductTypeId = lechonPackage.Id, IsActive = true });
            products.Add(new Product { ProductName = "Medium 4 (8kg - 10kg)", Amount = 14200, PromoAmount = -500, NoOfIncludedDishes = 8, ProductTypeId = lechonPackage.Id, IsActive = true });
            // Regular (11kg - 13kg)
            products.Add(new Product { ProductName = "Regular 1 (11kg - 13kg)", Amount = 11950, PromoAmount = -500, NoOfIncludedDishes = 3, ProductTypeId = lechonPackage.Id, IsActive = true });
            products.Add(new Product { ProductName = "Regular 2 (11kg - 13kg)", Amount = 12600, PromoAmount = -500, NoOfIncludedDishes = 4, ProductTypeId = lechonPackage.Id, IsActive = true });
            products.Add(new Product { ProductName = "Regular 3 (11kg - 13kg)", Amount = 13900, PromoAmount = -500, NoOfIncludedDishes = 6, ProductTypeId = lechonPackage.Id, IsActive = true });
            products.Add(new Product { ProductName = "Regular 4 (11kg - 13kg)", Amount = 15200, PromoAmount = -500, NoOfIncludedDishes = 8, ProductTypeId = lechonPackage.Id, IsActive = true });
            // Small (7kg - 8kg)
            products.Add(new Product { ProductName = "Small 1 (7kg - 8kg)", Amount = 9450, PromoAmount = -500, NoOfIncludedDishes = 3, ProductTypeId = lechonPackage.Id, IsActive = true });
            products.Add(new Product { ProductName = "Small 2 (7kg - 8kg)", Amount = 10100, PromoAmount = -500, NoOfIncludedDishes = 4, ProductTypeId = lechonPackage.Id, IsActive = true });
            products.Add(new Product { ProductName = "Small 3 (7kg - 8kg)", Amount = 11400, PromoAmount = -500, NoOfIncludedDishes = 6, ProductTypeId = lechonPackage.Id, IsActive = true });
            products.Add(new Product { ProductName = "Small 4 (7kg - 8kg)", Amount = 12700, PromoAmount = -500, NoOfIncludedDishes = 8, ProductTypeId = lechonPackage.Id, IsActive = true });
            // Special packages
            products.Add(new Product { ProductName = "Buy Jumbo Get Lechon Belly", Amount = 16000, PromoAmount = -500, NoOfIncludedDishes = 0, ProductTypeId = lechonPackage.Id, IsActive = true });
            products.Add(new Product { ProductName = "Twin Package 1 (8kg - 10kg) 2pcs", Amount = 18800, PromoAmount = -500, NoOfIncludedDishes = 8, ProductTypeId = lechonPackage.Id, IsActive = true });
            products.Add(new Product { ProductName = "Twin Package 2 (11kg - 13kg) 2pcs", Amount = 22800, PromoAmount = -500, NoOfIncludedDishes = 8, ProductTypeId = lechonPackage.Id, IsActive = true });

            return products;
        }

        // ─────────────────────────────────────────────
        // FREEBIES
        // ─────────────────────────────────────────────
        public static List<ProductFreebie> GetProductFreebies(List<Product> products)
        {
            var freebies = new List<ProductFreebie>();

            void AddFreebies(string productName, decimal amount, List<string> items)
            {
                var product = products.FirstOrDefault(p => p.ProductName == productName && p.Amount == amount);
                if (product == null) return;
                foreach (var item in items)
                    freebies.Add(new ProductFreebie { ProductId = product.Id, FreebieName = item });
            }

            // Belly only
            var bellyAmounts = new[] { 3000, 3400, 3700, 4000, 4300, 4700, 5000, 5300, 5500 };
            foreach (var amt in bellyAmounts)
                AddFreebies("Belly", amt, new List<string> { "Coke" });

            // Belly packages
            AddFreebies("Belly - 1 (4kg)", 4790, new List<string> { "Ribs", "Coke" });
            AddFreebies("Belly - 2 (4kg)", 5400, new List<string> { "Ribs", "Coke" });
            AddFreebies("Belly - 4 (4kg)", 6590, new List<string> { "Ribs", "Coke" });
            AddFreebies("Big Belly A (6kg - 7kg)", 6300, new List<string> { "Ribs", "Coke" });
            AddFreebies("Big Belly B (6kg - 7kg)", 6900, new List<string> { "Ribs", "Coke" });
            AddFreebies("Big Belly C (6kg - 7kg)", 7490, new List<string> { "Ribs", "Coke" });

            // Lechon only
            AddFreebies("Solo Lechon", 7000, new List<string> { "Dinuguan", "Ginabot" });
            var lechonWithManok = new[] { 7500, 8000, 9000, 9500, 10000, 11000, 12000, 14000, 15000, 16000, 20000, 25000 };
            foreach (var amt in lechonWithManok)
                AddFreebies("Solo Lechon", amt, new List<string> { "Lechon Manok", "Coke Sakto 12pc", "Dinuguan", "Ginabot" });

            // Lechon packages — Pasko & Jumbo (with Lechon Manok)
            var withManokPackages = new (string Name, decimal Amount)[]
            {
                ("Pasko 1 (18kg - 20kg)", 14950), ("Pasko 2 (18kg - 20kg)", 15600),
                ("Pasko 3 (18kg - 20kg)", 15600), ("Pasko 4 (18kg - 20kg)", 18200),
                ("Jumbo Set A (22kg - 25kg)", 16950), ("Jumbo Set B (22kg - 25kg)", 17600),
                ("Jumbo Set C (22kg - 25kg)", 18900), ("Jumbo Set D (22kg - 25kg)", 20200),
                ("Medium 1 (8kg - 10kg)", 10950), ("Medium 2 (8kg - 10kg)", 11600),
                ("Medium 3 (8kg - 10kg)", 12900), ("Medium 4 (8kg - 10kg)", 14200),
                ("Regular 1 (11kg - 13kg)", 11950), ("Regular 2 (11kg - 13kg)", 12600),
                ("Regular 3 (11kg - 13kg)", 13900), ("Regular 4 (11kg - 13kg)", 15200),
            };
            foreach (var (name, amt) in withManokPackages)
                AddFreebies(name, amt, new List<string> { "Lechon Manok", "Coke Sakto 12pc", "Dinuguan", "Ginabot" });

            // Small packages (no Lechon Manok)
            AddFreebies("Small 1 (7kg - 8kg)", 9450, new List<string> { "Dinuguan", "Ginabot" });
            AddFreebies("Small 2 (7kg - 8kg)", 10100, new List<string> { "Dinuguan", "Ginabot" });
            AddFreebies("Small 3 (7kg - 8kg)", 11400, new List<string> { "Dinuguan", "Ginabot" });
            AddFreebies("Small 4 (7kg - 8kg)", 12700, new List<string> { "Dinuguan", "Ginabot" });

            // Special packages
            AddFreebies("Buy Jumbo Get Lechon Belly", 16000, new List<string> { "Lechon Belly", "Coke 1.5L", "Dinuguan", "Ginabot" });
            AddFreebies("Twin Package 1 (8kg - 10kg) 2pcs", 18800, new List<string> { "Coke 1.5L", "Dinuguan", "Ginabot" });
            AddFreebies("Twin Package 2 (11kg - 13kg) 2pcs", 22800, new List<string> { "Coke 1.5L", "Dinuguan", "Ginabot" });

            return freebies;
        }

        // ─────────────────────────────────────────────
        // DEFAULT DISHES  (Pasko 2 has Lechon Belly Medium Cut + Garlic Rice)
        // ─────────────────────────────────────────────
        public static List<ProductDefaultDish> GetProductDefaultDishes(List<Product> products, List<Dish> dishes)
        {
            // Only Pasko 2 has fixed default dishes in the source data.
            // All other packages let customers pick from the dish list.
            var defaults = new List<ProductDefaultDish>();

            var pasko2 = products.FirstOrDefault(p => p.ProductName == "Pasko 2 (18kg - 20kg)");
            var bellyMC = dishes.FirstOrDefault(d => d.DishName == "Lechon Belly Medium Cut");
            var garlicR = dishes.FirstOrDefault(d => d.DishName == "Garlic Rice");

            // NOTE: "Lechon Belly Medium Cut" and "Garlic Rice" are not in the dishes
            // list above — they appear to be included dishes, not orderable side dishes.
            // If you add them to GetDishes() later, uncomment the lines below:
            // if (pasko2 != null && bellyMC != null)
            //     defaults.Add(new ProductDefaultDish { ProductId = pasko2.Id, DishId = bellyMC.Id });
            // if (pasko2 != null && garlicR != null)
            //     defaults.Add(new ProductDefaultDish { ProductId = pasko2.Id, DishId = garlicR.Id });

            return defaults;
        }

        // ─────────────────────────────────────────────
        // CUSTOMERS  (kept as sample data)
        // ─────────────────────────────────────────────
        public static List<Customer> GetCustomers()
        {
            return new List<Customer>
            {
                new Customer
                {
                    Name            = "Maria Santos",
                    FacebookProfile = "https://facebook.com/maria.santos",
                    Contacts        = new List<CustomerContact> { new CustomerContact { ContactNumber = "09171234567" } }
                },
                new Customer
                {
                    Name            = "Juan Dela Cruz",
                    FacebookProfile = "https://facebook.com/juan.delacruz",
                    Contacts        = new List<CustomerContact> { new CustomerContact { ContactNumber = "09181234567" } }
                },
                new Customer
                {
                    Name            = "Ana Reyes",
                    FacebookProfile = "https://facebook.com/ana.reyes",
                    Contacts        = new List<CustomerContact> { new CustomerContact { ContactNumber = "09191234567" } }
                }
            };
        }
        // ─────────────────────────────────────────────
        // DELIVERY CHARGES
        // ─────────────────────────────────────────────
        public static List<DeliveryCharge> GetDeliveryCharges()
        {
            return new List<DeliveryCharge>
            {
                new DeliveryCharge { ZoneName = "Inayawan",         MinAmount = 90 },
                new DeliveryCharge { ZoneName = "Near Talisay",     MinAmount = 100,  MaxAmount = 150 },
                new DeliveryCharge { ZoneName = "Minglanilla",      MinAmount = 250,  MaxAmount = 400 },
                new DeliveryCharge { ZoneName = "Naga Proper",      MinAmount = 250,  MaxAmount = 400 },
                new DeliveryCharge { ZoneName = "Carcar",           MinAmount = 450,  MaxAmount = 500 },
                new DeliveryCharge { ZoneName = "San Fernando",     MinAmount = 450,  MaxAmount = 500 },
                new DeliveryCharge { ZoneName = "Naga Mountains",   MinAmount = 450,  MaxAmount = 500 },
                new DeliveryCharge { ZoneName = "Pardo",            MinAmount = 200 },
                new DeliveryCharge { ZoneName = "Basak",            MinAmount = 200 },
                new DeliveryCharge { ZoneName = "Quiot",            MinAmount = 200 },
                new DeliveryCharge { ZoneName = "Mambaling",        MinAmount = 200 },
                new DeliveryCharge { ZoneName = "Pasil",            MinAmount = 250 },
                new DeliveryCharge { ZoneName = "Tisa",             MinAmount = 250 },
                new DeliveryCharge { ZoneName = "Banawa",           MinAmount = 250 },
                new DeliveryCharge { ZoneName = "Sambag",           MinAmount = 250 },
                new DeliveryCharge { ZoneName = "V. Rama",          MinAmount = 250 },
                new DeliveryCharge { ZoneName = "Fuente",           MinAmount = 250 },
                new DeliveryCharge { ZoneName = "Lahug",            MinAmount = 300 },
                new DeliveryCharge { ZoneName = "Mabolo",           MinAmount = 300 },
                new DeliveryCharge { ZoneName = "Talamban",         MinAmount = 300 },
                new DeliveryCharge { ZoneName = "Pit-os",           MinAmount = 300 },
                new DeliveryCharge { ZoneName = "Ayala",            MinAmount = 300 },
                new DeliveryCharge { ZoneName = "Temple of Leah",   MinAmount = 400,  MaxAmount = 500 },
                new DeliveryCharge { ZoneName = "Busay",            MinAmount = 400,  MaxAmount = 500 },
                new DeliveryCharge { ZoneName = "Mandaue",          MinAmount = 350,  MaxAmount = 400 },
                new DeliveryCharge { ZoneName = "Consolacion",      MinAmount = 350,  MaxAmount = 400 },
                new DeliveryCharge { ZoneName = "Lapu-Lapu",        MinAmount = 400,  MaxAmount = 450 },
                new DeliveryCharge { ZoneName = "Cordova",          MinAmount = 400,  MaxAmount = 450 },
                new DeliveryCharge { ZoneName = "Liloan",           MinAmount = 500 },
                new DeliveryCharge { ZoneName = "Compostela",       MinAmount = 500 },
                new DeliveryCharge { ZoneName = "Danao",            MinAmount = 600,  MaxAmount = 700 },
            };
        }
        // ─────────────────────────────────────────────
        // ORDERS  (kept as sample data)
        // ─────────────────────────────────────────────
        public static List<Order> GetOrders(
            List<Customer> customers,
            List<Product> products,
            List<DeliveryCharge> deliveryCharges,
            List<Dish> dishes, List<ProductDefaultDish> productDefaultDishes)
        {
            var inayawan = deliveryCharges.First(dc => dc.ZoneName == "Inayawan");
            var lahug = deliveryCharges.First(dc => dc.ZoneName == "Lahug");

            var firstProduct = products.First();
            var secondProduct = products.Skip(1).First();

            return new List<Order>
            {
                new Order
                {
                    OrderNumber     = "ORD-001",
                    OrderType       = "delivery",
                    Address         = "123 Mango St., Cebu City",
                    Zone            = inayawan.ZoneName,
                    DeliveryChargeId = inayawan.Id,
                    DeliveryDate    = DateTime.Today,
                    DeliveryTime    = "10:00 AM",
                    PaymentMethod   = "gcash",
                    TotalAmount     = 14450,
                    SubmittedByType = "customer",
                    Status          = "active",
                    IsPrinted       = false,
                    CreatedAt       = DateTime.UtcNow,
                    CustomerId      = customers.First().Id,
                    ProductId       = firstProduct.Id,

                    // 🔥 FIX: INCLUDED DISHES
                    OrderDishes = new List<OrderDish>
                    {
                        new OrderDish
                        {
                            DishId = dishes.First().Id,
                            DishType = "included"
                        },
                        new OrderDish
                        {
                            DishId = dishes.Skip(1).First().Id,
                            DishType = "extra"
                        }
                    }
                },

                new Order
                {
                    OrderNumber     = "ORD-002",
                    OrderType       = "pickup",
                    DeliveryDate    = DateTime.Today,
                    DeliveryTime    = "2:00 PM",
                    PaymentMethod   = "cod",
                    TotalAmount     = 15950,
                    SubmittedByType = "customer",
                    Status          = "active",
                    IsPrinted       = true,
                    CreatedAt       = DateTime.UtcNow.AddHours(-2),
                    CustomerId      = customers.Skip(1).First().Id,
                    ProductId       = secondProduct.Id,

                    OrderDishes = new List<OrderDish>
                    {
                        new OrderDish
                        {
                            DishId = dishes.Skip(2).First().Id,
                            DishType = "included"
                        }
                    }
                },

                new Order
                {
                    OrderNumber     = "ORD-003",
                    OrderType       = "delivery",
                    Address         = "456 Pineapple Ave., Cebu City",
                    Zone            = lahug.ZoneName,
                    DeliveryChargeId = lahug.Id,
                    DeliveryDate    = DateTime.Today.AddDays(1),
                    DeliveryTime    = "11:30 AM",
                    PaymentMethod   = "gcash",
                    TotalAmount     = 13950,
                    SubmittedByType = "customer",
                    Status          = "active",
                    IsPrinted       = false,
                    CreatedAt       = DateTime.UtcNow.AddHours(-1),
                    CustomerId      = customers.Skip(2).First().Id,
                    ProductId       = firstProduct.Id,

                    OrderDishes = new List<OrderDish>
                    {
                        new OrderDish
                        {
                            DishId = dishes.Skip(3).First().Id,
                            DishType = "extra"
                        }
                    }
                }
            };
        }
    }
}