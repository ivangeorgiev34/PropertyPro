using Microsoft.EntityFrameworkCore;
using MockQueryable.Moq;
using Moq;
using NUnit.Framework;
using PropertyPro.Core.Contracts;
using PropertyPro.Core.Services;
using PropertyPro.Infrastructure.Common;
using PropertyPro.Infrastructure.Dtos.Review;
using PropertyPro.Infrastructure.Dtos.Tenant;
using PropertyPro.Infrastructure.Models;

namespace PropertyPro.UnitTests
{
    [TestFixture]
    public class ReviewServiceUnitTests
    {
        private Mock<IRepository> repoMock;
        private Mock<ITenantService> tenantServiceMock;
        private ReviewService reviewService;
        private Review review;

        [SetUp]
        public void SetUp()
        {
            repoMock = new Mock<IRepository>();
            tenantServiceMock = new Mock<ITenantService>();

            review = new Review()
            {
                Id = new Guid("510e22c3-6bcb-40e3-ba40-9396d7559305"),
                Description = "description",
                Stars = 4,
                IsActive = true,
                PropertyId = new Guid("1c06a717-f53c-45e5-987d-b535e974b53b"),
                Property = new Property()
                {
                    Id = new Guid("1c06a717-f53c-45e5-987d-b535e974b53b"),
                    IsActive = true
                },
                Tenant = new Tenant()
                {
                    Id = new Guid("1a48e022-7951-49a4-a96d-318f910a82d8"),
                    UserId = new Guid("7f2e088e-83af-4efb-af53-8835fcc3986b"),
                    User = new User()
                    {
                        Id = new Guid("7f2e088e-83af-4efb-af53-8835fcc3986b"),
                        FirstName = "first name",
                        MiddleName = "middle name",
                        LastName = "last name",
                        Age = 18,
                        Gender = "male",
                        ProfilePicture = null
                    }
                }
            };
        }

        [Test]
        public async Task Test_Method_CreateReviewAsync_ShouldCreateReview()
        {
            var tenant = new TenantDto()
            {
                Id = new Guid("4f5a97d2-1b98-4e6f-b6d3-a0bcddce1d40")
            };

            var reviews = new List<Review>();

            var createReviewDto = new CreateReviewDto()
            {
                Description = "description",
                Stars = 2
            };

            tenantServiceMock.Setup(t => t.GetTenantByUserId(It.IsAny<Guid>()).Result)
                .Returns(tenant);

            repoMock.Setup(r => r.AddAsync(It.IsAny<Review>()))
                .Callback<Review>(b => reviews.Add(b));

            reviewService = new ReviewService(repoMock.Object, tenantServiceMock.Object);

            var actualResult = (await reviewService.CreateReviewAsync(createReviewDto, "4f5a97d2-1b98-4e6f-b6d3-a0bcddce1d40", "0cd7a7f1-a105-4c88-ba8e-d2ba0e85c73e")).Id;

            Assert.That(actualResult, Is.EqualTo(reviews.FirstOrDefault()?.Id));
        }

        [Test]
        public void Test_Method_DeleteReviewByIdAsync_ShouldThrowExceptionWhenReviewIsNotFound()
        {
            var reviews = new List<Review>()
            {
                review
            }
            .AsQueryable()
            .BuildMock();

            repoMock.Setup(r => r.All<Review>())
                .Returns(reviews);

            reviewService = new ReviewService(repoMock.Object, tenantServiceMock.Object);

            Assert.ThrowsAsync<NullReferenceException>(async () =>
            {
                await reviewService.DeleteReviewByIdAsync("7dee4845-63a3-40db-b2c5-0d3bc103f607");
            });
        }

        [Test]
        public async Task Test_Method_DeleteReviewByIdAsync_ShouldDeleteReview()
        {
            var reviews = new List<Review>()
            {
                review
            }
            .AsQueryable()
            .BuildMock();

            repoMock.Setup(r => r.All<Review>())
                .Returns(reviews);

            reviewService = new ReviewService(repoMock.Object, tenantServiceMock.Object);

            await reviewService.DeleteReviewByIdAsync(review.Id.ToString());

            var actualResult = (await reviews.FirstOrDefaultAsync())?.IsActive;

            Assert.That(actualResult, Is.False);
        }

        [Test]
        public void Test_Method_EditReviewAsync_ShouldThrowExceptionWhenReviewIsNotFound()
        {
            var reviews = new List<Review>()
            {
                review
            }
            .AsQueryable()
            .BuildMock();

            repoMock.Setup(r => r.All<Review>())
                .Returns(reviews);

            reviewService = new ReviewService(repoMock.Object, tenantServiceMock.Object);

            Assert.ThrowsAsync<NullReferenceException>(async () =>
            {
                await reviewService.EditReviewAsync(new EditReviewDto(), "7dee4845-63a3-40db-b2c5-0d3bc103f607", "7dee4845-63a3-40db-b2c5-0d3bc103f601");
            });
        }

        [Test]
        public async Task Test_Method_EditReviewAsync_ShouldEditReview()
        {
            var reviews = new List<Review>()
            {
                review
            }
            .AsQueryable()
            .BuildMock();

            var editReviewDto = new EditReviewDto()
            {
                Description = "edited",
                Stars = 1
            };

            repoMock.Setup(r => r.All<Review>())
                .Returns(reviews);

            reviewService = new ReviewService(repoMock.Object, tenantServiceMock.Object);

            var actualResult = (await reviewService
                .EditReviewAsync(editReviewDto, review.Id.ToString(), "7f2e088e-83af-4efb-af53-8835fcc3986b")).Description;

            Assert.That(actualResult, Is.EqualTo(editReviewDto.Description));
        }

        [Test]
        public async Task Test_Method_GetPropertyReviews_ShouldGetPropertiesReviews()
        {
            var reviews = new List<Review>()
            {
                review
            }
            .AsQueryable()
            .BuildMock();

            repoMock.Setup(r => r.All<Review>())
                .Returns(reviews);

            reviewService = new ReviewService(repoMock.Object, tenantServiceMock.Object);

            var actualResult = (await reviewService.GetPropertyReviews(review.PropertyId.ToString()))?
                .FirstOrDefault()?.Id;

            Assert.That(actualResult, Is.EqualTo(review.Id));
        }

        [Test]
        public async Task Test_Method_GetReviewDtoByIdAsync_ShouldGetReviewDto()
        {
            var reviews = new List<Review>()
            {
                review
            }
            .AsQueryable()
            .BuildMock();

            repoMock.Setup(r => r.All<Review>())
                .Returns(reviews);

            reviewService = new ReviewService(repoMock.Object, tenantServiceMock.Object);

            var actualResult = (await reviewService.GetReviewDtoByIdAsync(review.Id.ToString()))?.Id;

            Assert.That(actualResult, Is.EqualTo(review.Id));
        }

        [Test]
        public async Task Test_Method_GetReviewInPropertyById_ShouldGetReviewInProperty()
        {
            var reviews = new List<Review>()
            {
                review
            }
            .AsQueryable()
            .BuildMock();

            repoMock.Setup(r => r.All<Review>())
                .Returns(reviews);

            reviewService = new ReviewService(repoMock.Object, tenantServiceMock.Object);

            var actualResult = (await reviewService.GetReviewInPropertyById(review.Id.ToString(), review.PropertyId.ToString()))?.Id;

            Assert.That(actualResult, Is.EqualTo(review.Id));
        }

        [Test]
        public async Task Test_Method_ReviewExistsAsync_ShouldReturnTrueIfReviewExists()
        {
            var reviews = new List<Review>()
            {
                review
            }
            .AsQueryable()
            .BuildMock();

            repoMock.Setup(r => r.All<Review>())
                .Returns(reviews);

            reviewService = new ReviewService(repoMock.Object, tenantServiceMock.Object);

            var actualResult = (await reviewService.ReviewExistsAsync(review.Id.ToString()));

            Assert.That(actualResult, Is.True);
        }

        [Test]
        public async Task Test_Method_ReviewExistsAsync_ShouldReturnFalseIfReviewExists()
        {
            var reviews = new List<Review>()
            {
                review
            }
            .AsQueryable()
            .BuildMock();

            repoMock.Setup(r => r.All<Review>())
                .Returns(reviews);

            reviewService = new ReviewService(repoMock.Object, tenantServiceMock.Object);

            var actualResult = (await reviewService.ReviewExistsAsync(new Guid().ToString()));

            Assert.That(actualResult, Is.False);
        }

        [Test]
        public async Task Test_Method_ReviewExistsInPropertyAsync_ShouldReturnTrueIfReviewExists()
        {
            var reviews = new List<Review>()
            {
                review
            }
            .AsQueryable()
            .BuildMock();

            repoMock.Setup(r => r.All<Review>())
                .Returns(reviews);

            reviewService = new ReviewService(repoMock.Object, tenantServiceMock.Object);

            var actualResult = (await reviewService.ReviewExistsInPropertyAsync(review.Id.ToString(), review.PropertyId.ToString()));

            Assert.That(actualResult, Is.True);
        }

        [Test]
        public async Task Test_Method_ReviewExistsInPropertyAsync_ShouldReturnFalseIfReviewExists()
        {
            var reviews = new List<Review>()
            {
                review
            }
            .AsQueryable()
            .BuildMock();

            repoMock.Setup(r => r.All<Review>())
                .Returns(reviews);

            reviewService = new ReviewService(repoMock.Object, tenantServiceMock.Object);

            var actualResult = (await reviewService.ReviewExistsInPropertyAsync(new Guid().ToString(), new Guid().ToString()));

            Assert.That(actualResult, Is.False);
        }
    }
}
