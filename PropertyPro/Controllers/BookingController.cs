using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using PropertyPro.Constants;
using PropertyPro.Core.Contracts;
using PropertyPro.Infrastructure.Dtos.Booking;
using PropertyPro.Utilities;
using System.Globalization;
using System.Net;

namespace PropertyPro.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : BaseController
    {
        private readonly IPropertyService propertyService;
        private readonly IBookingService bookingService;
        public BookingController(IPropertyService _propertyService,
            IBookingService _bookingService)
        {
            this.propertyService = _propertyService;
            this.bookingService = _bookingService;
        }

        [HttpPost]
        [Route("create/{propertyId}")]
        [Authorize(Roles = "Tenant", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> CreateBooking(CreateBookingDto createBookingDto, string propertyId)
        {
            if (IsIdValidGuidAndNotNull(propertyId) == false || await propertyService.PropertyExistsAsync(propertyId) == false)
            {
                return BadRequest(new Response()
                {
                    Status = ApplicationConstants.Response.RESPONSE_STATUS_ERROR,
                    Message = "Property doesn't exist"
                });
            }

            var convertFirstDateResult = DateTime.TryParseExact(DateTime.Parse(createBookingDto.StartDate).ToString("dd/MM/yyyy"), "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime startDate);
            var convertSecondDateResult = DateTime.TryParseExact(DateTime.Parse(createBookingDto.EndDate).ToString("dd/MM/yyyy"), "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime endDate);

            if (convertFirstDateResult == false
                && convertSecondDateResult == false)
            {
                return BadRequest(new Response()
                {
                    Status = ApplicationConstants.Response.RESPONSE_STATUS_ERROR,
                    Message = "Invalid dates"
                });
            }

            if (DateTime.Compare(startDate, endDate) >= 0)
            {
                return BadRequest(new Response()
                {
                    Status = ApplicationConstants.Response.RESPONSE_STATUS_ERROR,
                    Message = "Start date cannot be later than end date"
                });
            }

            try
            {
                //if CanBookingBeBooked is true, then booking cannot be booked, otherwise booking can be booked
                if (await bookingService.CanBookingBeBooked(startDate, endDate) == true)
                {
                    return BadRequest(new Response()
                    {
                        Status = ApplicationConstants.Response.RESPONSE_STATUS_ERROR,
                        Message = "The dates you chose are busy"
                    });
                }
            }
            catch (InvalidOperationException e)
            {
                return BadRequest(new Response()
                {
                    Status = ApplicationConstants.Response.RESPONSE_STATUS_ERROR,
                    Message = e.Message
                });
            }

            var userId = GetUserId(HttpContext);

            var bookingDto = await bookingService.CreateBookingAsync(createBookingDto, userId!, propertyId, startDate, endDate);
            
            return Ok(new Response()
            {
                Status = ApplicationConstants.Response.RESPONSE_STATUS_SUCCESS,
                Message = "Booking created successfully",
                Content = new
                {
                    Booking = bookingDto
                }
            });
        }

        [HttpPut]
        [Route("edit/{bookingId}")]
        [Authorize(Roles = "Tenant",AuthenticationSchemes =JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> EditBooking(EditBookingDto editBookingDto,string bookingId)
        {
            if (IsIdValidGuidAndNotNull(bookingId) == false)
            {
                return BadRequest(new Response()
                {
                    Status = ApplicationConstants.Response.RESPONSE_STATUS_ERROR,
                    Message = "Property doesn't exist"
                });
            }

            var convertFirstDateResult = DateTime.TryParseExact(DateTime.Parse(editBookingDto.StartDate).ToString("dd/MM/yyyy"), "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime startDate);
            var convertSecondDateResult = DateTime.TryParseExact(DateTime.Parse(editBookingDto.EndDate).ToString("dd/MM/yyyy"), "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime endDate);

            if (convertFirstDateResult == false
                && convertSecondDateResult == false)
            {
                return BadRequest(new Response()
                {
                    Status = ApplicationConstants.Response.RESPONSE_STATUS_ERROR,
                    Message = "Invalid dates"
                });
            }

            if (DateTime.Compare(startDate, endDate) >= 0)
            {
                return BadRequest(new Response()
                {
                    Status = ApplicationConstants.Response.RESPONSE_STATUS_ERROR,
                    Message = "Start date cannot be later than end date"
                });
            }

            try
            {
                //if CanBookingBeBooked is true, then booking cannot be booked, otherwise booking can be booked
                if (await bookingService.CanBookingBeBooked(startDate, endDate) == true)
                {
                    return BadRequest(new Response()
                    {
                        Status = ApplicationConstants.Response.RESPONSE_STATUS_ERROR,
                        Message = "The dates you chose are busy"
                    });
                }
            }
            catch (InvalidOperationException e)
            {
                return BadRequest(new Response()
                {
                    Status = ApplicationConstants.Response.RESPONSE_STATUS_ERROR,
                    Message = e.Message
                });
            }

            var userId = GetUserId(HttpContext);

            if (userId == null)
            {
                return StatusCode(500, new Response()
                {
                    Status = ApplicationConstants.Response.RESPONSE_STATUS_ERROR,
                    Message = "User is not logged in"
                });
            }

            var bookingDto = await bookingService.EditBookingAsync(editBookingDto, bookingId, userId, startDate,endDate);

            return StatusCode(200, new Response()
            {
                Status = ApplicationConstants.Response.RESPONSE_STATUS_SUCCESS,
                Message = "Booking edited successfully",
                Content = new
                {
                    Booking = bookingDto
                }
            });
        }

        [HttpDelete]
        [Route("delete/{bookingId}")]
        [Authorize(Roles ="Tenant",AuthenticationSchemes =JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> DeleteBooking(string bookingId)
        {
            if (IsIdValidGuidAndNotNull(bookingId) == false
                || await bookingService.BookingExistsByIdAsync(bookingId) == false)
            {
                return StatusCode(StatusCodes.Status400BadRequest, new Response()
                {
                    Status = ApplicationConstants.Response.RESPONSE_STATUS_ERROR,
                    Message = "Booking doesn't exist"
                });
            }

            var userId = GetUserId(HttpContext);

            if (userId == null)
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new Response()
                {
                    Status = ApplicationConstants.Response.RESPONSE_STATUS_ERROR,
                    Message = "User is not logged in"
                });
            }

            try
            {
                await bookingService.DeleteBookingAsync(bookingId, userId);

                return StatusCode(StatusCodes.Status204NoContent);
            }
            catch (InvalidOperationException ioe)
            {
                return StatusCode(StatusCodes.Status404NotFound, new Response()
                {
                    Status = ApplicationConstants.Response.RESPONSE_STATUS_ERROR,
                    Message = ioe.Message
                });
            }

        }
    }
}
