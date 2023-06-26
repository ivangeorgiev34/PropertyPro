using PropertyPro.Infrastructure.Constants;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PropertyPro.Infrastructure.Dtos.Booking
{
    public class CreateBookingDto
    {

        [Required(ErrorMessage = InfrastructureConstants.Booking.BOOKING_START_DATE_REQUIRED_ERROR_MESSAGE)]
        public string StartDate { get; set; } = null!;

        [Required(ErrorMessage = InfrastructureConstants.Booking.BOOKING_END_DATE_REQUIRED_ERROR_MESSAGE)]
        public string EndDate { get; set; } = null!;

        [Required(ErrorMessage = InfrastructureConstants.Booking.BOOKING_GUESTS_REQUIRED_ERROR_MESSAGE)]
        public int Guests { get; set; }
    }
}
