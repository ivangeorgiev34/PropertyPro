using PropertyPro.Infrastructure.Dtos.Review;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PropertyPro.Core.Contracts
{
    public interface IReviewService
    {
        Task<List<ReviewDto>> GetPropertyReviews(string userId,string propertyId);

        Task<ReviewDto> CreateReviewAsync(CreateReviewDto createReviewDto,string userId, string propertyId);
    }
}
