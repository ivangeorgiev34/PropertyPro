using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PropertyPro.Infrastructure.Dtos.Landlord
{
    public class LandlordDto
    {
        public Guid Id { get; set; }

        public string FirstName { get; set; } = null!;

        public string MiddleName { get; set; } = null!;

        public string LastName { get; set; } = null!;

        public string? Gender { get; set; }

        public int Age { get; set; }

        public string? Email { get; set; }

        public string? Username { get; set; }

        public string? PhoneNumber { get; set; }
    }
}
