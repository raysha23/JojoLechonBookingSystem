using api.data;
using api.Interfaces;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext _context;

        public ProductRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<ProductType>> GetProductTypesAsync()
        {
            return await _context.ProductTypes
                .AsNoTracking()
                .Where(pt => pt.IsActive)
                .OrderBy(pt => pt.TypeName)
                .ToListAsync();
        }

        public async Task<List<Product>> GetProductsAsync(int? productTypeId = null, string? productTypeName = null)
        {
            var query = _context.Products
                .AsNoTracking()
                .Where(p => p.IsActive);

            if (productTypeId.HasValue)
                query = query.Where(p => p.ProductTypeId == productTypeId.Value);

            return await query
                .OrderBy(p => p.ProductName)
                .Select(p => new Product
                {
                    Id = p.Id,
                    ProductName = p.ProductName,
                    Amount = p.Amount,
                    PromoAmount = p.PromoAmount,
                    ProductTypeId = p.ProductTypeId,
                    NoOfIncludedDishes = p.NoOfIncludedDishes,
                    IsActive = p.IsActive,
                    // ✅ ADD THESE:
                    DefaultDishes = p.DefaultDishes.Select(pd => new ProductDefaultDish
                    {
                        Id = pd.Id,
                        ProductId = pd.ProductId,
                        DishId = pd.DishId,
                        Dish = new Dish { Id = pd.Dish.Id, DishName = pd.Dish.DishName }
                    }).ToList(),
                    Freebies = p.Freebies.Select(f => new ProductFreebie
                    {
                        Id = f.Id,
                        ProductId = f.ProductId,
                        FreebieName = f.FreebieName
                    }).ToList()
                })
                .ToListAsync();
        }


        public async Task<Product?> GetByIdAsync(int productId)
        {
            return await _context.Products
                .AsNoTracking()
                .Include(p => p.ProductType)
                .Include(p => p.Freebies)
                .Include(p => p.DefaultDishes)
                    .ThenInclude(pd => pd.Dish)
                .FirstOrDefaultAsync(p => p.Id == productId && p.IsActive);
        }

        // ── NEW ──────────────────────────────────────

        public async Task<List<Dish>> GetDishesAsync()
        {
            return await _context.Dishes
                .AsNoTracking()
                .Where(d => d.IsActive)
                .OrderBy(d => d.DishName)
                .ToListAsync();
        }

        public async Task<List<DeliveryCharge>> GetDeliveryChargesAsync()
        {
            return await _context.DeliveryCharges
                .AsNoTracking()
                .OrderBy(dc => dc.ZoneName)
                .ToListAsync();
        }
    }
}