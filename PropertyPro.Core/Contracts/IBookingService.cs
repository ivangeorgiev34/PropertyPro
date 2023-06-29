using PropertyPro.Infrastructure.Dtos.Booking;
using PropertyPro.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PropertyPro.Core.Contracts
{
    public interface IBookingService
    {
        Task<BookingDto> CreateBookingAsync(CreateBookingDto createBookingDto, string userId, string propertyId, DateTime startDate, DateTime endDate);

        Task<bool> CanBookingBeBooked(DateTime startDate, DateTime endDate);

        Task<BookingDto> EditBookingAsync(EditBookingDto editBookingDto, string bookingId, string userId, DateTime startDate, DateTime endDate);

        Task<bool> BookingExistsByIdAsync(string bookingId);

        Task<BookingDto?> GetBookingByIdAsync(string bookingId, string userId);

        Task DeleteBookingAsync(string bookingId, string userId);

        Task<List<BookingDto>?> GetAllUsersBookings(string userId);
    }
}
