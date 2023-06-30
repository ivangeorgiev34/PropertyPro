using PropertyPro.Infrastructure.Constants;
using PropertyPro.Infrastructure.Dtos.Property;
using PropertyPro.Infrastructure.Dtos.Tenant;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PropertyPro.Infrastructure.Dtos.Booking
{
    public class BookingDto
    {
        public Guid Id { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public int Guests { get; set; }

        public TenantDto Tenant { get; set; } = null!;

        public PropertyDto Property { get; set; } = null!;
    }
}
