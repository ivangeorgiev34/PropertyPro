﻿using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PropertyPro.Constants;
using PropertyPro.Core.Contracts;
using PropertyPro.Infrastructure.Constants;
using PropertyPro.Infrastructure.Dtos.Property;
using PropertyPro.Infrastructure.Dtos.Query;
using PropertyPro.Infrastructure.Models;
using PropertyPro.Utilities;
using System.Security.Claims;

namespace PropertyPro.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class PropertyController : BaseController
	{
		private readonly IPropertyService propertyService;
		private readonly IReviewService reviewService;
		private readonly IBookingService bookingService;
		private readonly UserManager<User> userManager;
		public PropertyController(IPropertyService _propertyService,
			IReviewService _reviewService,
			IBookingService _bookingService,
			UserManager<User> _userManager)
		{
			this.propertyService = _propertyService;
			this.reviewService = _reviewService;
			this.bookingService = _bookingService;
			this.userManager = _userManager;
		}

		[HttpGet]
		[Route("properties/all/search")]
		[Authorize(Roles = "Landlord,Tenant", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		public async Task<IActionResult> GetAllPropertiesBySearch([FromQuery] GetAllPropertiesSearchParams searchParameters)
		{

			var properties = await propertyService.GetAllPropertiesBySearchTermAsync(searchParameters);

			if (properties.Skip((searchParameters.Page - 1) * 6).Take(6).ToList().Count == 0)
			{
				return StatusCode(StatusCodes.Status404NotFound, new Response()
				{
					Status = ApplicationConstants.Response.RESPONSE_STATUS_ERROR,
					Message = "No properties were found"
				});
			}

			return StatusCode(StatusCodes.Status200OK, new Response()
			{
				Status = ApplicationConstants.Response.RESPONSE_STATUS_SUCCESS,
				Message = "Properties retrieved successfully",
				Content = new
				{
					Properties = properties.Skip((searchParameters.Page - 1) * 6).Take(6).ToList(),
					TotalPropertiesCount = properties.Count
				}
			});
		}

		[HttpGet]
		[Route("properties/search")]
		[Authorize(Roles = "Landlord", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		public async Task<IActionResult> SearchAllLandlordsProperties([FromQuery] GetLandlordsPropertiesSearchParameters searchParameters)
		{
			var userId = GetUserId(HttpContext);

			var properties = await propertyService.GetLandlordsPropertiesBySearchTermAsync(searchParameters, userId!);

			var paginatedProperties = properties.Skip((searchParameters.Page - 1) * 6).Take(6).ToList();

			if (paginatedProperties.Count == 0)
			{
				return StatusCode(StatusCodes.Status404NotFound, new Response()
				{
					Status = ApplicationConstants.Response.RESPONSE_STATUS_ERROR,
					Message = "No properties were found"
				});
			}

			return StatusCode(StatusCodes.Status200OK, new Response()
			{
				Status = ApplicationConstants.Response.RESPONSE_STATUS_SUCCESS,
				Message = "Properties retrieved successfully",
				Content = new
				{
					Properties = paginatedProperties,
					TotalPropertiesCount = properties.Count
				}
			});
		}

		[HttpGet]
		[Route("properties")]
		[Authorize(Roles = "Landlord,Tenant", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		public async Task<IActionResult> GetAll([FromQuery] int page = 1)
		{
			var properties = await propertyService.GetAllPropertiesAsync();

			if (properties.Skip((page - 1) * 6).Take(6).ToList().Count == 0)
			{
				return StatusCode(StatusCodes.Status404NotFound, new Response()
				{
					Status = ApplicationConstants.Response.RESPONSE_STATUS_ERROR,
					Message = "No properties were found"
				});
			}

			return StatusCode(StatusCodes.Status200OK, new Response()
			{
				Status = ApplicationConstants.Response.RESPONSE_STATUS_SUCCESS,
				Message = "Properties retrieved successfully",
				Content = new
				{
					Properties = properties.Skip((page - 1) * 6).Take(6).ToList(),
					TotalPropertiesCount = properties.Count
				}
			});
		}

		[HttpPost]
		[Route("create")]
		[Authorize(Roles = "Landlord", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		public async Task<IActionResult> Create([FromForm] CreatePropertyDto createPropertyDto)
		{
			var firstImageBytes = await ConvertImageToByteArrayAsync(createPropertyDto.FirstImage);
			var secondImageBytes = await ConvertImageToByteArrayAsync(createPropertyDto.SecondImage);
			var thirdImageBytes = await ConvertImageToByteArrayAsync(createPropertyDto.ThirdImage);

			var userId = GetUserId(HttpContext);

			if (userId == null)
			{
				return NotFound(new
				{
					Status = "Error",
					Message = "Cannot find user identifier"
				});

			}

			try
			{

				await propertyService.CreatePropertyAsync(userId, createPropertyDto, firstImageBytes!, secondImageBytes, thirdImageBytes);

				return Ok(new
				{
					Status = "Success",
					Message = "Property added to landlord successfully!"
				});

			}
			catch (InvalidOperationException ioe)
			{
				return NotFound(new
				{
					Status = "Error",
					Message = ioe.Message
				});
			}
		}

		[HttpGet]
		[Route("{propertyId}")]
		[Authorize(Roles = "Landlord,Tenant", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		public async Task<IActionResult> GetLandlordsProperty(string propertyId)
		{

			if (propertyId == null || Guid.TryParse(propertyId, out Guid propertyIdResult) == false)
			{
				return NotFound(new Response()
				{
					Status = ApplicationConstants.Response.RESPONSE_STATUS_ERROR,
					Message = "Property with such id doesn't exist"
				});
			}

			var property = await propertyService.GetPropertyDtoByIdAsync(propertyId);

			if (property == null)
			{
				return NotFound(new Response()
				{
					Status = ApplicationConstants.Response.RESPONSE_STATUS_ERROR,
					Message = "Property with such id doesn't exist"
				});
			}

			return Ok(new
			{
				Property = property
			});
		}

		[HttpGet]
		[Route("{propertyId}/reviews")]
		[Authorize(Roles = "Landlord,Tenant", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		public async Task<IActionResult> GetLandlordsPropertyReviews(string propertyId)
		{
			if (propertyId == null || Guid.TryParse(propertyId, out Guid propertyIdResult) == false)
			{
				return BadRequest(new Response()
				{
					Status = ApplicationConstants.Response.RESPONSE_STATUS_ERROR,
					Message = "Property with such id doesn't exist"
				});
			}

			var reviews = await reviewService.GetPropertyReviews(propertyId);

			return Ok(new Response()
			{
				Status = ApplicationConstants.Response.RESPONSE_STATUS_SUCCESS,
				Message = "Reviews retrieved successfully",
				Content = new
				{
					Reviews = reviews
				}
			});
		}

		[HttpGet]
		[Route("properties/{userId}/{propertyId}/bookings")]
		[Authorize(Roles = "Landlord,Tenant", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		public async Task<IActionResult> GetLandlordsPropertyBookings(string userId, string propertyId)
		{
			if (await userManager.FindByIdAsync(userId) == null || IsIdValidGuidAndNotNull(userId) == false)
			{
				return BadRequest(new Response()
				{
					Status = ApplicationConstants.Response.RESPONSE_STATUS_ERROR,
					Message = "User with such id doesn't exist"
				});
			}

			if (IsIdValidGuidAndNotNull(propertyId) == false)
			{
				return BadRequest(new Response()
				{
					Status = ApplicationConstants.Response.RESPONSE_STATUS_ERROR,
					Message = "Property with such id doesn't exist"
				});
			}

			var bookings = await bookingService.GetPropertyBookings(userId, propertyId);

			return StatusCode(StatusCodes.Status200OK, new Response()
			{
				Status = ApplicationConstants.Response.RESPONSE_STATUS_SUCCESS,
				Message = "Bookings retrieved successfully",
				Content = new
				{
					Bookings = bookings
				}
			});
		}

		[HttpGet]
		[Route("properties/{userId?}")]
		[Authorize(Roles = "Landlord", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		public async Task<IActionResult> GetLandlordsProperties(string? userId, int page = 1)
		{

			if (userId == null || Guid.TryParse(userId, out Guid userIdResult) == false)
			{
				return NotFound(new
				{
					Status = "Error",
					Message = "User with such id doesn't exist"
				});
			}

			try
			{
				var landlordProperties = await propertyService.GetLandlordsPropertiesAsync(userId);

				var paginatedLandlordProperties = landlordProperties?.Skip((page - 1) * 6).Take(6).ToList();

				if (paginatedLandlordProperties?.Count == 0)
				{
					return StatusCode(StatusCodes.Status404NotFound,new Response()
					{
						Status = ApplicationConstants.Response.RESPONSE_STATUS_ERROR,
						Message = "No properties were found"
					});
				}

				return StatusCode(StatusCodes.Status200OK, new Response()
				{
					Status = ApplicationConstants.Response.RESPONSE_STATUS_SUCCESS,
					Message = "Properties retrieved",
					Content = new
					{
						Properties = paginatedLandlordProperties,
						TotalPropertiesCount = landlordProperties?.Count
					}
				});

			}
			catch (InvalidOperationException ioe)
			{

				return NotFound(new
				{
					Status = "Error",
					Message = ioe.Message
				});
			}

		}

		[HttpPut]
		[Route("edit/{propertyId}")]
		[Authorize(Roles = "Landlord", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		public async Task<IActionResult> EditProperty([FromForm] EditPropertyDto editPropertyDto, string? propertyId)
		{

			if (propertyId == null || Guid.TryParse(propertyId, out Guid propertyIdResult) == false)
			{
				return StatusCode(StatusCodes.Status400BadRequest, new
				{
					Status = "Error",
					Message = "Property doesn't exist!"
				});
			}

			if (await propertyService.PropertyExistsAsync(propertyId) == false)
			{
				return NotFound(new
				{
					Status = "Error",
					Message = "Property doesn't exist!"
				});
			}

			var userId = GetUserId(HttpContext);

			if (await propertyService.LandlordOwnsPropertyById(propertyId, userId) == false)
			{
				return NotFound(new
				{
					Status = "Error",
					Message = "You are not the landlord of this property!"
				});
			}

			var firstImageBytes = await ConvertImageToByteArrayAsync(editPropertyDto.FirstImage);
			var secondImageBytes = await ConvertImageToByteArrayAsync(editPropertyDto.SecondImage);
			var thirdImageBytes = await ConvertImageToByteArrayAsync(editPropertyDto.ThirdImage);

			try
			{
				await propertyService.EditPropertyAsync(editPropertyDto, propertyId!, firstImageBytes!, secondImageBytes, thirdImageBytes);

				var responseProperty = new PropertyDto()
				{
					Id = Guid.Parse(propertyId!),
					Title = editPropertyDto.Title,
					Description = editPropertyDto.Description,
					BathroomsCount = editPropertyDto.BathroomsCount,
					BedroomsCount = editPropertyDto.BedroomsCount,
					BedsCount = editPropertyDto.BedsCount,
					Country = editPropertyDto.Country,
					MaxGuestsCount = editPropertyDto.MaxGuestsCount,
					Type = editPropertyDto.Type,
					Town = editPropertyDto.Town,
					FirstImage = Convert.ToBase64String(firstImageBytes!),
					SecondImage = secondImageBytes == null ? null : Convert.ToBase64String(secondImageBytes),
					ThirdImage = thirdImageBytes == null ? null : Convert.ToBase64String(thirdImageBytes)
				};

				return Ok(new Response
				{
					Status = ApplicationConstants.Response.RESPONSE_STATUS_SUCCESS,
					Message = "Property edited successfully!",
					Content = responseProperty
				});
			}
			catch (InvalidOperationException ioe)
			{
				return NotFound(new Response
				{
					Status = ApplicationConstants.Response.RESPONSE_STATUS_ERROR,
					Message = ioe.Message
				});
			}
		}

		[HttpDelete]
		[Route("delete/{propertyId}")]
		[Authorize(Roles = "Landlord", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		public async Task<IActionResult> DeleteProperty(string propertyId)
		{
			if (await propertyService.PropertyExistsAsync(propertyId) == false || propertyId == null || Guid.TryParse(propertyId, out Guid propertyIdResult) == false)
			{
				return NotFound(new
				{
					Status = "Error",
					Message = "Property doesn't exist!"
				});
			}

			var userId = GetUserId(HttpContext);

			if (await propertyService.LandlordOwnsPropertyById(propertyId, userId) == false)
			{
				return NotFound(new
				{
					Status = "Error",
					Message = "You are not the landlord of this property!"
				});
			}

			try
			{
				await propertyService.DeletePropertyAsync(propertyId);

				return StatusCode(StatusCodes.Status204NoContent);
			}
			catch (NullReferenceException e)
			{
				return BadRequest(new Response()
				{
					Status = ApplicationConstants.Response.RESPONSE_STATUS_ERROR,
					Message = e.Message
				});
			}

		}

		private async Task<byte[]?> ConvertImageToByteArrayAsync(IFormFile? image)
		{
			byte[]? byteArray = null;

			if (image != null)
			{
				using (var ms = new MemoryStream())
				{
					await image.CopyToAsync(ms);
					byteArray = ms.ToArray();
				}
			}

			return byteArray;
		}
	}
}
