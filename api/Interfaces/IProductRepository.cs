using api.Models;

namespace api.Interfaces
{
    public interface IProductRepository
    {
        Task<List<ProductType>> GetProductTypesAsync();
        Task<List<Product>> GetProductsAsync(int? productTypeId = null, string? productTypeName = null);
        Task<Product?> GetByIdAsync(int productId);

        // ── NEW ──────────────────────────────────────
        Task<List<Dish>> GetDishesAsync();
        Task<List<DeliveryCharge>> GetDeliveryChargesAsync();
    }
}