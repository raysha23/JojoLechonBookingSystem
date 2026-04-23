using api.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductRepository _productRepository;

        public ProductController(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts(
            [FromQuery] int? productTypeId = null,
            [FromQuery] string? productTypeName = null)
        {
            var products = await _productRepository.GetProductsAsync(productTypeId, productTypeName);
            return Ok(products);
        }

        [HttpGet("types")]
        public async Task<IActionResult> GetProductTypes()
        {
            var productTypes = await _productRepository.GetProductTypesAsync();
            return Ok(productTypes);
        }

        // ── NEW ──────────────────────────────────────

        [HttpGet("dishes")]
        public async Task<IActionResult> GetDishes()
        {
            var dishes = await _productRepository.GetDishesAsync();
            return Ok(dishes);
        }

        [HttpGet("delivery-charges")]
        public async Task<IActionResult> GetDeliveryCharges()
        {
            var charges = await _productRepository.GetDeliveryChargesAsync();
            return Ok(charges);
        }
    }
}