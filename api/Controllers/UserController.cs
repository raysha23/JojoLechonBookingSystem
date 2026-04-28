using api.data;
using api.DTOs.User;
using api.Helpers;
using api.Models;
using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }   

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest("Username and password are required.");

            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Username == dto.Username);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized("Invalid username or password.");

            user.LastLoginAt = PhTime.Now;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = user.Id,
                fullName = user.FullName,
                username = user.Username,
                role = user.Role.RoleName
            });
        }
    }
}