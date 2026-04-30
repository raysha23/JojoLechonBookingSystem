using api.data;
using api.Hubs;
using api.Interfaces;
using api.Repository;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// IMPORTANT: Render requires explicit port binding
builder.WebHost.UseUrls("http://0.0.0.0:8080");


// ===================== DATABASE =====================
builder.Services.AddDbContextPool<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

builder.Services.AddScoped<IProductRepository, ProductRepository>();


// ===================== CONTROLLERS + SIGNALR =====================
builder.Services.AddControllers();
builder.Services.AddSignalR();


// ===================== OUTPUT CACHE =====================
builder.Services.AddOutputCache(options =>
{
    options.AddPolicy("static-data", policy =>
        policy.Expire(TimeSpan.FromMinutes(10)));
});


// ===================== SWAGGER =====================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// ===================== CORS =====================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "https://your-frontend.onrender.com" // update after deployment
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});


var app = builder.Build();


// ===================== DATABASE SEEDING =====================
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    // Safe migration (avoids crash on Render)
    try
    {
        context.Database.Migrate();
    }
    catch (Exception ex)
    {
        Console.WriteLine("Migration error: " + ex.Message);
    }

    // ===================== SEED DATA =====================

    if (!context.Roles.Any())
    {
        context.Roles.AddRange(SeedData.GetRoles());
        context.SaveChanges();
    }

    if (!context.Users.Any())
    {
        var roles = context.Roles.ToList();
        context.Users.AddRange(SeedData.GetUsers(roles));
        context.SaveChanges();
    }

    if (!context.Dishes.Any())
    {
        context.Dishes.AddRange(SeedData.GetDishes());
        context.SaveChanges();
    }

    if (!context.ProductTypes.Any())
    {
        context.ProductTypes.AddRange(SeedData.GetProductTypes());
        context.SaveChanges();
    }

    if (!context.Products.Any())
    {
        var productTypes = context.ProductTypes.ToList();
        context.Products.AddRange(SeedData.GetProducts(productTypes));
        context.SaveChanges();
    }

    if (!context.ProductFreebies.Any())
    {
        var products = context.Products.ToList();
        context.ProductFreebies.AddRange(SeedData.GetProductFreebies(products));
        context.SaveChanges();
    }

    if (!context.ProductDefaultDishes.Any())
    {
        var products = context.Products.ToList();
        var dishes = context.Dishes.ToList();

        context.ProductDefaultDishes.AddRange(
            SeedData.GetProductDefaultDishes(products, dishes)
        );

        context.SaveChanges();
    }

    if (!context.DeliveryCharges.Any())
    {
        context.DeliveryCharges.AddRange(SeedData.GetDeliveryCharges());
        context.SaveChanges();
    }
}


// ===================== PIPELINE =====================
app.UseSwagger();
app.UseSwaggerUI();

app.UseRouting();

app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.UseOutputCache();

app.MapControllers();
app.MapHub<OrderHub>("/hubs/order");


// Optional static hosting (only useful if serving frontend from API)
app.UseDefaultFiles();
app.UseStaticFiles();

app.Run();