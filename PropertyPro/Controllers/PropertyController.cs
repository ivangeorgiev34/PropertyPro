using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PropertyPro.Constants;
using PropertyPro.Core.Contracts;
using PropertyPro.Infrastructure.Dtos.Property;
using PropertyPro.Utilities;
using System.Security.Claims;

namespace PropertyPro.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles ="Landlord,Tenant",AuthenticationSchemes =JwtBearerDefaults.AuthenticationScheme)]
    public class PropertyController : BaseController
    {
        private readonly IPropertyService propertyService;
        public PropertyController(IPropertyService _propertyService)
        {
            this.propertyService = _propertyService;
        }

        [HttpGet]
        [Route("properties")]
        [Authorize(Roles = "Landlord,Tenant", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetAll()
        {
            var properties = await propertyService.GetAllPropertiesAsync();

            return Ok(new
            {
                Properties = properties
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
        [Route("properties/{userId?}")]
        [Authorize(Roles = "Landlord", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetLandlordsProperties(string? userId)
        {
            if (userId == null)
            {
                return NotFound(new
                {
                    Status = "Error",
                    Message = "User with such id doesn't exist"
                });
            }

            var landlordProperties = await propertyService.GetLandlordsPropertiesAsync(userId);

            return Ok(new
            {
                Properties = landlordProperties
            });

        }

        [HttpPut]
        [Route("edit/{propertyId?}")]
        [Authorize(Roles = "Landlord", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> EditProperty([FromForm]EditPropertyDto editPropertyDto, string? propertyId)
        {
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
                await propertyService.EditPropertyAsync(editPropertyDto, propertyId!, firstImageBytes!,secondImageBytes,thirdImageBytes);

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
