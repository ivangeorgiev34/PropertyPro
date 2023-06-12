using PropertyPro.Infrastructure.Constants;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PropertyPro.Infrastructure.Models
{
    public class Review
    {
        [Key]
        public Guid Id { get; set; }

        [Required(ErrorMessage = InfrastructureConstants.Review.REVIEW_STARS_REQUIRED_ERROR_MESSAGE)]
        [Range(InfrastructureConstants.Review.REVIEW_STARS_MIN_VALUE_ERROR_MESSAGE, InfrastructureConstants.Review.REVIEW_STARS_MAX_VALUE_ERROR_MESSAGE)]
        public double Stars { get; set; }

        public string? Description { get; set; }

        [Required(ErrorMessage = InfrastructureConstants.Review.REVIEW_PROPERTY_REQUIRED_ERROR_MESSAGE)]
        [ForeignKey(nameof(Property))]
        public Guid PropertyId { get; set; }
        public Property Property { get; set; } = null!;

        [Required(ErrorMessage = InfrastructureConstants.Review.REVIEW_TENANT_REQUIRED_ERROR_MESSAGE)]
        [ForeignKey(nameof(Tenant))]
        public Guid TenantId { get; set; }
        public Tenant Tenant { get; set; } = null!;
    }
}
