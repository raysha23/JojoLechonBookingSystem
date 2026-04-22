using api.Models;

namespace api.data
{

    public static class SeedData
    {
        public static void SeedDatabase(ApplicationDbContext context)
        {
            if (!context.Roles.Any())
            {
                var roles = GetRoles();
                context.Roles.AddRange(roles);
                context.SaveChanges();

                var users = GetUsers(roles);
                context.Users.AddRange(users);
                context.SaveChanges();
            }
        }
        
        // ✅ ROLES
        public static List<Role> GetRoles()
        {
            return new List<Role>
            {
                new Role
                {
                    RoleName = "admin",
                    Description = "Administrator with full access"
                },
                new Role
                {
                    RoleName = "encoder",
                    Description = "Staff who encodes and manages orders"
                }
            };
        }
        public static List<User> GetUsers(List<Role> roles)
        {
            var adminRole = roles.First(r => r.RoleName == "admin");
            var encoderRole = roles.First(r => r.RoleName == "encoder");

            return new List<User>
            {

                new User
                {
                    FullName = "System Administrator",
                    Username = "admin",
                    PasswordHash = "admin123", // ⚠️ replace with hash later
                    RoleId = adminRole.Id
                },
                       new User
                {
                    FullName = "Encoder One",
                    Username = "encoder1",
                    PasswordHash = "encoder123",
                    RoleId = encoderRole.Id
                },
                new User
                {
                    FullName = "Encoder Two",
                    Username = "encoder2",
                    PasswordHash = "encoder123",
                    RoleId = encoderRole.Id
                }
            };
        }
        public static List<Order> GetOrders(List<Customer> customers, List<Product> products, List<User> users)
        {
            var today = DateTime.UtcNow.Date;

            return new List<Order>
            {
                new Order
                {
                    OrderNumber = "ORD-001",
                    OrderType = "delivery",
                    Address = "Cebu City",
                    Zone = "Zone 1",
                    DeliveryDate = today,
                    DeliveryTime = "10:00 AM",
                    PaymentMethod = "gcash",
                    TotalAmount = 1200,
                    SubmittedByType = "encoder",
                    CustomerId = customers[0].Id,
                    ProductId = products[0].Id,
                    SubmittedByUserId = users[1].Id
                },

                new Order
                {
                    OrderNumber = "ORD-002",
                    OrderType = "pickup",
                    Address = null,
                    Zone = null,
                    DeliveryDate = today,
                    DeliveryTime = "11:00 AM",
                    PaymentMethod = "cod",
                    TotalAmount = 850,
                    SubmittedByType = "customer",
                    CustomerId = customers[1].Id,
                    ProductId = products[1].Id,
                    SubmittedByUserId = null
                },

                new Order
                {
                    OrderNumber = "ORD-003",
                    OrderType = "delivery",
                    Address = "Talisay City",
                    Zone = "Zone 2",
                    DeliveryDate = today,
                    DeliveryTime = "12:00 PM",
                    PaymentMethod = "gcash",
                    TotalAmount = 1500,
                    SubmittedByType = "encoder",
                    CustomerId = customers[2].Id,
                    ProductId = products[2].Id,
                    SubmittedByUserId = users[2].Id
                },

                new Order
                {
                    OrderNumber = "ORD-004",
                    OrderType = "delivery",
                    Address = "Mandaue City",
                    Zone = "Zone 3",
                    DeliveryDate = today,
                    DeliveryTime = "01:00 PM",
                    PaymentMethod = "cod",
                    TotalAmount = 2000,
                    SubmittedByType = "encoder",
                    CustomerId = customers[0].Id,
                    ProductId = products[0].Id,
                    SubmittedByUserId = users[1].Id
                },

                new Order
                {
                    OrderNumber = "ORD-005",
                    OrderType = "pickup",
                    Address = null,
                    Zone = null,
                    DeliveryDate = today,
                    DeliveryTime = "02:00 PM",
                    PaymentMethod = "gcash",
                    TotalAmount = 950,
                    SubmittedByType = "customer",
                    CustomerId = customers[1].Id,
                    ProductId = products[1].Id,
                    SubmittedByUserId = null
                },

                new Order
                {
                    OrderNumber = "ORD-006",
                    OrderType = "delivery",
                    Address = "Lapulapu City",
                    Zone = "Zone 1",
                    DeliveryDate = today,
                    DeliveryTime = "03:00 PM",
                    PaymentMethod = "gcash",
                    TotalAmount = 1800,
                    SubmittedByType = "encoder",
                    CustomerId = customers[2].Id,
                    ProductId = products[2].Id,
                    SubmittedByUserId = users[2].Id
                },

                new Order
                {
                    OrderNumber = "ORD-007",
                    OrderType = "delivery",
                    Address = "Cebu City",
                    Zone = "Zone 4",
                    DeliveryDate = today,
                    DeliveryTime = "04:00 PM",
                    PaymentMethod = "cod",
                    TotalAmount = 1300,
                    SubmittedByType = "encoder",
                    CustomerId = customers[0].Id,
                    ProductId = products[0].Id,
                    SubmittedByUserId = users[1].Id
                },

                new Order
                {
                    OrderNumber = "ORD-008",
                    OrderType = "pickup",
                    Address = null,
                    Zone = null,
                    DeliveryDate = today,
                    DeliveryTime = "05:00 PM",
                    PaymentMethod = "gcash",
                    TotalAmount = 700,
                    SubmittedByType = "customer",
                    CustomerId = customers[1].Id,
                    ProductId = products[1].Id,
                    SubmittedByUserId = null
                },

                new Order
                {
                    OrderNumber = "ORD-009",
                    OrderType = "delivery",
                    Address = "Talisay City",
                    Zone = "Zone 2",
                    DeliveryDate = today,
                    DeliveryTime = "06:00 PM",
                    PaymentMethod = "cod",
                    TotalAmount = 1600,
                    SubmittedByType = "encoder",
                    CustomerId = customers[2].Id,
                    ProductId = products[2].Id,
                    SubmittedByUserId = users[2].Id
                },

                new Order
                {
                    OrderNumber = "ORD-010",
                    OrderType = "delivery",
                    Address = "Mandaue City",
                    Zone = "Zone 3",
                    DeliveryDate = today,
                    DeliveryTime = "07:00 PM",
                    PaymentMethod = "gcash",
                    TotalAmount = 2200,
                    SubmittedByType = "encoder",
                    CustomerId = customers[0].Id,
                    ProductId = products[0].Id,
                    SubmittedByUserId = users[1].Id
                }
            };
        }
    }
}