using api.data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ✅ Register DbContext (DATABASE)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ✅ Add basic API services
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

// Middleware
app.UseHttpsRedirection();

// ✅ Example test endpoint (optional, you can remove later)
app.MapGet("/", () => "API is running...");

// Start app
app.Run();