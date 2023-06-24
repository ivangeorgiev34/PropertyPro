using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata;
using PropertyPro.Constants;
using PropertyPro.Core.Contracts;
using PropertyPro.Infrastructure.Dtos.Review;
using PropertyPro.Utilities;

namespace PropertyPro.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : BaseController
    {
        private readonly IPropertyService propertyService;
        private readonly IReviewService reviewService;
        public ReviewController(IPropertyService _propertyService,
            IReviewService _reviewService)
        {
            this.propertyService = _propertyService;
            this.reviewService = _reviewService;
        }

        [HttpPost]
        [Route("create/{propertyId}")]
        [Authorize(Roles = "Tenant", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> CreateReview(CreateReviewDto createReviewDto, string propertyId)
        {
            if (IsIdValidGuidAndNotNull(propertyId) == false
                || await propertyService.PropertyExistsAsync(propertyId) == false)
            {
                return BadRequest(new Response()
                {
                    Status = ApplicationConstants.Response.RESPONSE_STATUS_ERROR,
                    Message = "Property doesn't exist"
                });
            }

            var userId = GetUserId(HttpContext);

            var review = await reviewService.CreateReviewAsync(createReviewDto, userId!,propertyId);

            return Ok(new Response()
            {
                Status = ApplicationConstants.Response.RESPONSE_STATUS_ERROR,
                Message = "Review created successfully",
                Content = new
                {
                    Review = review
                }
            });

        }
    }
}
