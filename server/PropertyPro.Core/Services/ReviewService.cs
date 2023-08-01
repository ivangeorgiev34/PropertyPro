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
		private readonly ITenantService tenantService;

		public ReviewService(IRepository _repo,
			ITenantService _tenantService)
		{
			this.repo = _repo;
			this.tenantService = _tenantService;
		}

		public async Task<ReviewDto> CreateReviewAsync(CreateReviewDto createReviewDto, string userId, string propertyId)
		{
			var tenantDto = await tenantService.GetTenantByUserId(Guid.Parse(userId));

			var review = new Review()
			{
				Id = Guid.NewGuid(),
				Description = createReviewDto.Description,
				Stars = createReviewDto.Stars,
				IsActive = true,
				TenantId = tenantDto!.Id,
				PropertyId = Guid.Parse(propertyId)
			};

			await repo.AddAsync(review);
			await repo.SaveChangesAsync();


			var reviewDto = new ReviewDto()
			{
				Id = review.Id,
				Stars = review.Stars,
				Description = review.Description,
				Tenant = tenantDto!
			};

			return reviewDto;
		}

		public async Task DeleteReviewByIdAsync(string reviewId)
		{
			var review = await GetReviewByIdAsync(reviewId) ?? throw new NullReferenceException("Review doesn't exist");

			review.IsActive = false;
			await repo.SaveChangesAsync();
		}

		public async Task<ReviewDto> EditReviewAsync(EditReviewDto editReviewDto, string reviewId, string propertyId)
		{
			var review = await GetReviewInPropertyById(reviewId, propertyId);

			if (review == null)
			{
				throw new NullReferenceException("Review cannot be found");
			}

			review.Stars = editReviewDto.Stars;
			review.Description = editReviewDto.Description;

			await repo.SaveChangesAsync();

			var reviewDto = new ReviewDto()
			{
				Id = review.Id,
				Description = review.Description,
				Stars = review.Stars,
				Tenant = new TenantDto()
				{
					Id = review.Tenant.UserId,
					FirstName = review.Tenant.User.FirstName,
					MiddleName = review.Tenant.User.MiddleName,
					LastName = review.Tenant.User.LastName,
					Age = review.Tenant.User.Age,
					Gender = review.Tenant.User.Gender,
					ProfilePicture = review.Tenant.User.ProfilePicture != null
						? Convert.ToBase64String(review.Tenant.User.ProfilePicture)
						: null
				}
			};

			return reviewDto;
		}

		public async Task<List<ReviewDto>> GetPropertyReviews(string propertyId)
		{
			var reviews = await repo.All<Review>()
				.Include(r => r.Property)
				.ThenInclude(p => p.Landlord)
				.Include(r => r.Tenant)
				.Where(r => r.PropertyId == Guid.Parse(propertyId)
				&& r.Property.IsActive == true
				&& r.IsActive == true)
				.Select(r => new ReviewDto()
				{
					Id = r.Id,
					Stars = r.Stars,
					Description = r.Description,
					Tenant = new TenantDto()
					{
						Id = r.Tenant.UserId,
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

		public async Task<Review?> GetReviewByIdAsync(string reviewId)
		{
			var review = await repo.All<Review>()
				.FirstOrDefaultAsync(r => r.IsActive == true && r.Id == Guid.Parse(reviewId));

			return review;
		}

		public async Task<ReviewDto?> GetReviewDtoByIdAsync(string reviewId)
		{
			var reviewDto = await repo.All<Review>()
				.Include(r => r.Tenant)
				.ThenInclude(t => t.User)
				.Where(r => r.IsActive == true && r.Id == Guid.Parse(reviewId))
				.Select(r => new ReviewDto()
				{
					Id = r.Id,
					Stars = r.Stars,
					Description = r.Description,
					Tenant = new TenantDto()
					{
						Id = r.Tenant.UserId,
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
				.FirstOrDefaultAsync();

			return reviewDto;
		}

		public async Task<Review?> GetReviewInPropertyById(string reviewId, string propertyId)
		{
			var review = await repo.All<Review>()
				.Include(r => r.Tenant)
				.ThenInclude(t => t.User)
				.FirstOrDefaultAsync(r => r.IsActive == true && r.PropertyId == Guid.Parse(propertyId) && r.Id == Guid.Parse(reviewId));

			return review;
		}

		public async Task<bool> ReviewExistsAsync(string reviewId)
		{
			var reviewExists = await repo.All<Review>()
				.AnyAsync(r => r.IsActive == true && r.Id == Guid.Parse(reviewId));

			return reviewExists;
		}

		public async Task<bool> ReviewExistsInPropertyAsync(string reviewId, string propertyId)
		{
			var reviewExists = await repo.All<Review>()
				.AnyAsync(r => r.IsActive == true && r.Id == Guid.Parse(reviewId) && r.PropertyId == Guid.Parse(propertyId));

			return reviewExists;
		}


	}
}
