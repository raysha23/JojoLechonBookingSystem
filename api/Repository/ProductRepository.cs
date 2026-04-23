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
                .Where(pt => pt.IsActive)
                .OrderBy(pt => pt.TypeName)
                .ToListAsync();
        }

        public async Task<List<Product>> GetProductsAsync(int? productTypeId = null, string? productTypeName = null)
        {
            var query = _context.Products
                .Include(p => p.ProductType)
                .Include(p => p.Freebies)
                .Include(p => p.DefaultDishes)
                    .ThenInclude(pd => pd.Dish)
                .Where(p => p.IsActive)
                .AsQueryable();

            if (productTypeId.HasValue)
            {
                query = query.Where(p => p.ProductTypeId == productTypeId.Value);
            }
            else if (!string.IsNullOrWhiteSpace(productTypeName))
            {
                var normalizedTypeName = productTypeName.Trim().ToLower();
                query = query.Where(p => p.ProductType.TypeName.ToLower() == normalizedTypeName);
            }

            return await query
                .OrderBy(p => p.ProductName)
                .ToListAsync();
        }

        public async Task<Product?> GetByIdAsync(int productId)
        {
            return await _context.Products
                .Include(p => p.ProductType)
                .Include(p => p.Freebies)
                .Include(p => p.DefaultDishes)
                    .ThenInclude(pd => pd.Dish)
                .FirstOrDefaultAsync(p => p.Id == productId && p.IsActive);
        }
    }
}
