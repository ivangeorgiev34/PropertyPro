using PropertyPro.Infrastructure.Dtos.Review;
using PropertyPro.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PropertyPro.Core.Contracts
{
	public interface IReviewService
	{
		Task<List<ReviewDto>> GetPropertyReviews(string propertyId);

		Task<ReviewDto> CreateReviewAsync(CreateReviewDto createReviewDto, string userId, string propertyId);

		Task<bool> ReviewExistsInPropertyAsync(string reviewId, string propertyId);

		Task<Review?> GetReviewInPropertyById(string reviewId, string propertyId);

		Task<bool> ReviewExistsAsync(string reviewId);

		Task<ReviewDto> EditReviewAsync(EditReviewDto editReviewDto, string reviewId, string userId);

		Task DeleteReviewByIdAsync(string reviewId);

		Task<Review?> GetReviewByIdAsync(string reviewId);

		Task<ReviewDto?> GetReviewDtoByIdAsync(string reviewId);
	}
}
