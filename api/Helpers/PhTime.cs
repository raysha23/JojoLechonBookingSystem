using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Helpers
{
    public static class PhTime
    {
        private static readonly TimeZoneInfo _ph =
            TimeZoneInfo.FindSystemTimeZoneById("Asia/Manila");

        public static DateTime Now =>
            TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, _ph);
    }
}