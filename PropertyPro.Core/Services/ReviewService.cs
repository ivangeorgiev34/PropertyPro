using Microsoft.EntityFrameworkCore;
using PropertyPro.Core.Contracts;
using PropertyPro.Infrastructure.Common;
using PropertyPro.Infrastructure.Dtos.Review;
using PropertyPro.Infrastructure.Dtos.Tenant;
using PropertyPro.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PropertyPro.Core.Services
{
    public class ReviewService : IReviewService
    {
        private readonly IRepository repo;

        public ReviewService(IRepository _repo)
        {
            this.repo = _repo;
        }
        public async Task<List<ReviewDto>> GetPropertyReviews(string userId, string propertyId)
        {
            var reviews = await repo.All<Review>()
                .Include(r => r.Property)
                .ThenInclude(p => p.Landlord)
                .Include(r => r.Tenant)
                .Where(r => r.PropertyId == Guid.Parse(propertyId) && r.Property.Landlord.UserId == Guid.Parse(userId))
                .Select(r => new ReviewDto()
                {
                    Id = r.Id,
                    Stars = r.Stars,
                    Description = r.Description,
                    Tenant = new TenantDto()
                    {
                        FirstName = r.Tenant.User.FirstName,
                        MiddleName = r.Tenant.User.MiddleName,
                        LastName = r.Tenant.User.LastName,
                        Age = r.Tenant.User.Age,
                        Gender = r.Tenant.User.Gender,
                        ProfilePicture = r.Tenant.User.ProfilePicture != null
                        ? Convert.ToBase64String(r.Tenant.User.ProfilePicture)
                        : null
                    }
                })
                .ToListAsync();

            return reviews;

        }
    }
}
