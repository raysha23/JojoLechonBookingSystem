using System;
using System.Collections.Generic;

namespace api.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastLoginAt { get; set; }

        public int RoleId { get; set; }
        public Role Role { get; set; } = null!;

        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}