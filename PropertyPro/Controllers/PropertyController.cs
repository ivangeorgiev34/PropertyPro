using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PropertyPro.Core.Contracts;
using PropertyPro.Infrastructure.Dtos.Property;
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
                    Status="Error",
                    Message="Cannot find user identifier"
                });
                
            }

            try
            {

                await propertyService.CreatePropertyAsync(userId, createPropertyDto, firstImageBytes!, secondImageBytes, thirdImageBytes);

                return Ok(new
                {
                    Status="Success",
                    Message="Property added to landlord successfully!"
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
