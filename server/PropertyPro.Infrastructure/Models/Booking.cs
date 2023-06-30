using PropertyPro.Infrastructure.Constants;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PropertyPro.Infrastructure.Models
{
    public class Booking
    {
        [Key]
        public Guid Id { get; set; }

        [Required(ErrorMessage =InfrastructureConstants.Booking.BOOKING_START_DATE_REQUIRED_ERROR_MESSAGE)]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage =InfrastructureConstants.Booking.BOOKING_END_DATE_REQUIRED_ERROR_MESSAGE)]
        public DateTime EndDate { get; set; }

        [Required(ErrorMessage =InfrastructureConstants.Booking.BOOKING_GUESTS_REQUIRED_ERROR_MESSAGE)]
        public int Guests { get; set; }

        public bool IsActive { get; set; }

        [Required(ErrorMessage =InfrastructureConstants.Booking.BOOKING_TENANT_REQUIRED_ERROR_MESSAGE)]
        [ForeignKey(nameof(Tenant))]
        public Guid TenantId { get; set; }
        public Tenant Tenant { get; set; } = null!;

        [Required(ErrorMessage =InfrastructureConstants.Booking.BOOKING_PROPERTY_REQUIRED_ERROR_MESSAGE)]
        [ForeignKey(nameof(Property))]
        public Guid PropertyId { get; set; }
        public Property Property { get; set; } = null!;

    }
}
