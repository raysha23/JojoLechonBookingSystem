using api.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;

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

        [HttpGet("landing")]
        [OutputCache(PolicyName = "static-data")]
        public async Task<IActionResult> GetBootstrapData()
        {
            // products dishes,
            var (types, charges) = (
                await _productRepository.GetProductTypesAsync(),
                // await _productRepository.GetProductsAsync(),
                // await _productRepository.GetDishesAsync(),
                await _productRepository.GetDeliveryChargesAsync()
            );
            // products, dishes,
            return Ok(new { types, charges });
        }

        [HttpGet]
        [OutputCache(PolicyName = "static-data")]
        [HttpGet]
        public async Task<IActionResult> GetProducts([FromQuery] int? productTypeId = null, [FromQuery] string? productTypeName = null)
        {
            try
            {
                Console.WriteLine($"🔍 GetProducts: productTypeId={productTypeId}");

                var products = await _productRepository.GetProductsAsync(productTypeId, productTypeName);
                Console.WriteLine($"✅ Found {products.Count} products");

                return Ok(products);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"💥 ERROR: {ex.Message}");
                Console.WriteLine($"💥 Stack: {ex.StackTrace}");
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpGet("types")]
        [OutputCache(PolicyName = "static-data")]
        public async Task<IActionResult> GetProductTypes()
        {
            var productTypes = await _productRepository.GetProductTypesAsync();
            return Ok(productTypes);
        }

        [HttpGet("dishes")]
        [OutputCache(PolicyName = "static-data")]
        public async Task<IActionResult> GetDishes()
        {
            var dishes = await _productRepository.GetDishesAsync();
            return Ok(dishes);
        }

        [HttpGet("delivery-charges")]
        [OutputCache(PolicyName = "static-data")]
        public async Task<IActionResult> GetDeliveryCharges()
        {
            var charges = await _productRepository.GetDeliveryChargesAsync();
            return Ok(charges);
        }
    }
}