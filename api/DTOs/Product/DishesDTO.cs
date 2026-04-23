using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.Product
{
    public class DishesDTO
    {
        public List<int> Required { get; set; } = new();
        public List<int> Extra { get; set; } = new();
    }
}