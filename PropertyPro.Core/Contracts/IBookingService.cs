using PropertyPro.Infrastructure.Dtos.Booking;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PropertyPro.Core.Contracts
{
    public interface IBookingService
    {
        Task<BookingDto> CreateBookingAsync(CreateBookingDto createBookingDto,string userId,string propertyId, DateTime startDate, DateTime endDate);

        Task<bool> CanBookingBeBooked(DateTime startDate, DateTime endDate);
    }
}
