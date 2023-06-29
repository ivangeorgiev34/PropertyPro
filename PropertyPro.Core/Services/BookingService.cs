using Microsoft.EntityFrameworkCore;
using PropertyPro.Core.Contracts;
using PropertyPro.Infrastructure.Common;
using PropertyPro.Infrastructure.Dtos.Booking;
using PropertyPro.Infrastructure.Dtos.Landlord;
using PropertyPro.Infrastructure.Dtos.Property;
using PropertyPro.Infrastructure.Dtos.Tenant;
using PropertyPro.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PropertyPro.Core.Services
{
    public class BookingService : IBookingService
    {
        private readonly IRepository repo;
        private readonly ITenantService tenantService;
        public BookingService(IRepository _repo,
            ITenantService _tenantService)
        {
            this.repo = _repo;
            this.tenantService = _tenantService;
        }

        public async Task<bool> BookingExistsByIdAsync(string bookingId)
        {
           var bookingExists = await repo.AllReadonly<Booking>()
                .AnyAsync(b=>b.IsActive == true && b.Id == Guid.Parse(bookingId));

            return bookingExists;
        }

        public async Task<bool> CanBookingBeBooked(DateTime startDate, DateTime endDate)
        {
            if (DateTime.Compare(startDate, DateTime.Now) < 0)
            {
                throw new InvalidOperationException("Start date is invalid");
            }

            if (startDate.Year != endDate.Year)
            {
                if ((endDate.DayOfYear + ((endDate.Year - startDate.Year) * 365)) - (startDate.DayOfYear + ((endDate.Year - startDate.Year - 1) * 365)) >= 30)
                {
                    throw new InvalidOperationException("Cannot reserve for more than one month");
                }
            }

            if (startDate.DayOfYear - endDate.DayOfYear >= 30)
            {
                throw new InvalidOperationException("Cannot reserve for more than one month");
            }

            var canBookingBeBooked = await repo.All<Booking>()
                .AnyAsync(b => b.IsActive == true
                && ((b.StartDate.DayOfYear <= startDate.DayOfYear && b.EndDate.DayOfYear >= startDate.DayOfYear)
                || (b.EndDate.DayOfYear >= endDate.DayOfYear && b.StartDate.DayOfYear <= endDate.DayOfYear)));

            return canBookingBeBooked;
        }

        public async Task<BookingDto> CreateBookingAsync(CreateBookingDto createBookingDto, string userId, string propertyId, DateTime startDate, DateTime endDate)
        {
            var tenantDto = await tenantService.GetTenantByUserId(Guid.Parse(userId));

            var booking = new Booking()
            {
                Id = Guid.NewGuid(),
                StartDate = startDate.Date,
                EndDate = endDate.Date,
                Guests = createBookingDto.Guests,
                IsActive = true,
                PropertyId = Guid.Parse(propertyId),
                TenantId = tenantDto!.Id
            };

            await repo.AddAsync(booking);
            await repo.SaveChangesAsync();

            var bookingDto = await repo.All<Booking>()
                .Include(b => b.Property)
                .ThenInclude(p => p.Landlord)
                .ThenInclude(l => l.User)
                .Include(b => b.Tenant)
                .ThenInclude(t => t.User)
                .Where(b => b.IsActive == true && b.Id == booking.Id)
                .Select(b => new BookingDto()
                {
                    Id = b.Id,
                    StartDate = b.StartDate,
                    EndDate = b.EndDate,
                    Guests = b.Guests,
                    Tenant = new TenantDto()
                    {
                        Id = b.Tenant.UserId,
                        FirstName = b.Tenant.User.FirstName,
                        MiddleName = b.Tenant.User.MiddleName,
                        LastName = b.Tenant.User.LastName,
                        Age = b.Tenant.User.Age,
                        Gender = b.Tenant.User.Gender,
                        ProfilePicture = b.Tenant.User.ProfilePicture != null
                        ? Convert.ToBase64String(b.Tenant.User.ProfilePicture)
                        : null
                    },
                    Property = new PropertyDto()
                    {
                        Id = b.PropertyId,
                        Title = b.Property.Title,
                        Type = b.Property.Type,
                        BathroomsCount = b.Property.BathroomsCount,
                        BedroomsCount = b.Property.BedroomsCount,
                        BedsCount = b.Property.BedsCount,
                        Country = b.Property.Country,
                        Description = b.Property.Description,
                        MaxGuestsCount = b.Property.MaxGuestsCount,
                        Town = b.Property.Town,
                        FirstImage = Convert.ToBase64String(b.Property.FirstImage),
                        SecondImage = b.Property.SecondImage == null ? null : Convert.ToBase64String(b.Property.SecondImage),
                        ThirdImage = b.Property.ThirdImage == null ? null : Convert.ToBase64String(b.Property.ThirdImage),
                        Landlord = new LandlordDto()
                        {
                            Id = b.Property.Landlord.User.Id,
                            Email = b.Property.Landlord.User.Email,
                            Age = b.Property.Landlord.User.Age,
                            FirstName = b.Property.Landlord.User.FirstName,
                            MiddleName = b.Property.Landlord.User.MiddleName,
                            LastName = b.Property.Landlord.User.LastName,
                            Gender = b.Property.Landlord.User.Gender,
                            PhoneNumber = b.Property.Landlord.User.PhoneNumber,
                            Username = b.Property.Landlord.User.UserName
                        }
                    }
                })
                .FirstOrDefaultAsync();

            return bookingDto!;
        }

        public async Task<BookingDto> EditBookingAsync(EditBookingDto editBookingDto, string bookingId, string userId, DateTime startDate, DateTime endDate)
        {

            if (DateTime.Compare(startDate, DateTime.Now) < 0)
            {
                throw new InvalidOperationException("Start date is invalid");
            }

            if (startDate.Year != endDate.Year)
            {
                if ((endDate.DayOfYear + ((endDate.Year - startDate.Year) * 365)) - (startDate.DayOfYear + ((endDate.Year - startDate.Year - 1) * 365)) >= 30)
                {
                    throw new InvalidOperationException("Cannot reserve for more than one month");
                }
            }

            if (startDate.DayOfYear - endDate.DayOfYear >= 30)
            {
                throw new InvalidOperationException("Cannot reserve for more than one month");
            }

            var booking = await repo.All<Booking>()
                .Include(b => b.Property)
                .ThenInclude(p => p.Landlord)
                .ThenInclude(l => l.User)
                .Include(b => b.Tenant)
                .ThenInclude(t => t.User)
                .FirstOrDefaultAsync(b => b.IsActive == true && b.Id == Guid.Parse(bookingId) && b.Tenant.UserId == Guid.Parse(userId));

            if (booking == null)
            {
                throw new InvalidOperationException("Booking doesn't exist");
            }

            booking.Guests = editBookingDto.Guests;
            booking.StartDate = startDate;
            booking.EndDate = endDate;

            await repo.SaveChangesAsync();

            var bookingDto = new BookingDto()
            {
                Id = booking.Id,
                StartDate = booking.StartDate,
                EndDate = booking.EndDate,
                Guests = booking.Guests,
                Tenant = new TenantDto()
                {
                    Id = booking.Tenant.UserId,
                    FirstName = booking.Tenant.User.FirstName,
                    MiddleName = booking.Tenant.User.MiddleName,
                    LastName = booking.Tenant.User.LastName,
                    Age = booking.Tenant.User.Age,
                    Gender = booking.Tenant.User.Gender,
                    ProfilePicture = booking.Tenant.User.ProfilePicture != null
                        ? Convert.ToBase64String(booking.Tenant.User.ProfilePicture)
                        : null
                },
                Property = new PropertyDto()
                {
                    Id = booking.PropertyId,
                    Title = booking.Property.Title,
                    Type = booking.Property.Type,
                    BathroomsCount = booking.Property.BathroomsCount,
                    BedroomsCount = booking.Property.BedroomsCount,
                    BedsCount = booking.Property.BedsCount,
                    Country = booking.Property.Country,
                    Description = booking.Property.Description,
                    MaxGuestsCount = booking.Property.MaxGuestsCount,
                    Town = booking.Property.Town,
                    FirstImage = Convert.ToBase64String(booking.Property.FirstImage),
                    SecondImage = booking.Property.SecondImage == null ? null : Convert.ToBase64String(booking.Property.SecondImage),
                    ThirdImage = booking.Property.ThirdImage == null ? null : Convert.ToBase64String(booking.Property.ThirdImage),
                    Landlord = new LandlordDto()
                    {
                        Id = booking.Property.Landlord.User.Id,
                        Email = booking.Property.Landlord.User.Email,
                        Age = booking.Property.Landlord.User.Age,
                        FirstName = booking.Property.Landlord.User.FirstName,
                        MiddleName = booking.Property.Landlord.User.MiddleName,
                        LastName = booking.Property.Landlord.User.LastName,
                        Gender = booking.Property.Landlord.User.Gender,
                        PhoneNumber = booking.Property.Landlord.User.PhoneNumber,
                        Username = booking.Property.Landlord.User.UserName
                    }
                }
            };

            return bookingDto;
        }
    }
}
