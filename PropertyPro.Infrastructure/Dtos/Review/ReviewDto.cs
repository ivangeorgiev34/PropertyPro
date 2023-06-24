using PropertyPro.Infrastructure.Dtos.Tenant;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PropertyPro.Infrastructure.Dtos.Review
{
    public class ReviewDto
    {
        public Guid Id { get; set; }

        public double Stars { get; set; }

        public string? Description { get; set; }

        public TenantDto Tenant { get; set; } = null!;
    }
}
