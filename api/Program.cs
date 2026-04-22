using api.data;
using Microsoft.EntityFrameworkCore;




var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

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

    context.Database.EnsureCreated();

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

    // PRODUCTS
    if (!context.Products.Any())
    {
        var products = SeedData.GetProducts();
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
}
app.UseCors("AllowReactApp");

// ✅ Enable Swagger (MISSING BEFORE)
app.UseSwagger();
app.UseSwaggerUI();

// Middleware
app.UseHttpsRedirection();

// Test endpoint
app.MapGet("/", () => "API is running...");
app.MapControllers();
app.Run();