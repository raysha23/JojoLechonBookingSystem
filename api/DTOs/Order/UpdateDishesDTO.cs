using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.Order
{
    public class UpdateDishesDTO
    {
        public List<int> Required { get; set; } = new();
        public List<int> Extra { get; set; } = new();
    }
}