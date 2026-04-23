using api.data;
using api.Interfaces;
using api.Repository;
using Microsoft.EntityFrameworkCore;




var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<IProductRepository, ProductRepository>();

// ✅ Swagger services (MISSING BEFORE)
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    // Use migrations so schema updates (like ProductTypes) are applied
    // to existing databases. EnsureCreated does not evolve an existing DB.
    context.Database.Migrate();

    // ROLES
    if (!context.Roles.Any())
    {
        var roles = SeedData.GetRoles();
        context.Roles.AddRange(roles);
        context.SaveChanges();
    }

    // USERS
    if (!context.Users.Any())
    {
        var roles = context.Roles.ToList();
        var users = SeedData.GetUsers(roles);
        context.Users.AddRange(users);
        context.SaveChanges();
    }

    // DISHES
    if (!context.Dishes.Any())
    {
        var dishes = SeedData.GetDishes();
        context.Dishes.AddRange(dishes);
        context.SaveChanges();
    }

    // PRODUCT TYPES
    if (!context.ProductTypes.Any())
    {
        var productTypes = SeedData.GetProductTypes();
        context.ProductTypes.AddRange(productTypes);
        context.SaveChanges();
    }

    // PRODUCTS
    if (!context.Products.Any())
    {
        var productTypes = context.ProductTypes.ToList();
        var products = SeedData.GetProducts(productTypes);
        context.Products.AddRange(products);
        context.SaveChanges();
    }

    // FREEBIES
    if (!context.ProductFreebies.Any())
    {
        var products = context.Products.ToList();
        var freebies = SeedData.GetProductFreebies(products); // improve later if needed
        context.ProductFreebies.AddRange(freebies);
        context.SaveChanges();
    }

    // DEFAULT DISHES
    if (!context.ProductDefaultDishes.Any())
    {
        var products = context.Products.ToList();
        var dishes = context.Dishes.ToList();
        var defaults = SeedData.GetProductDefaultDishes(products, dishes);
        context.ProductDefaultDishes.AddRange(defaults);
        context.SaveChanges();
    }

    // CUSTOMERS
    if (!context.Customers.Any())
    {
        var customers = SeedData.GetCustomers();
        context.Customers.AddRange(customers);
        context.SaveChanges();
    }
    // DELIVERY CHARGES
    if (!context.DeliveryCharges.Any())
    {
        var charges = SeedData.GetDeliveryCharges();
        context.DeliveryCharges.AddRange(charges);
        context.SaveChanges();
    }

    // ORDERS
    if (!context.Orders.Any())
    {
        var customers = context.Customers.ToList();
        var products = context.Products.ToList();
        var deliveryCharges = context.DeliveryCharges.ToList();
        var dishes = context.Dishes.ToList();
        var productDefaultDishes = context.ProductDefaultDishes.ToList();
        var orders = SeedData.GetOrders(customers, products, deliveryCharges, dishes, productDefaultDishes);
        context.Orders.AddRange(orders);
        context.SaveChanges();
    }
}
app.UseCors("AllowReactApp");

// ✅ Enable Swagger (MISSING BEFORE)
app.UseSwagger();
app.UseSwaggerUI();

// Middleware
// Avoid forcing HTTP->HTTPS in local development because the frontend
// proxy currently targets HTTP and may fail with cert/redirect issues.
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// Test endpoint
app.MapGet("/", () => "API is running...");
app.MapControllers();
app.Run();