using MockQueryable.Moq;
using Moq;
using NUnit.Framework;
using PropertyPro.Core.Contracts;
using PropertyPro.Core.Services;
using PropertyPro.Infrastructure.Common;
using PropertyPro.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PropertyPro.UnitTests
{
	[TestFixture]
	public class TenantServiceUnitTests
	{
		private Mock<IRepository> repoMock;
		private Tenant tenant;
		private ITenantService tenantService;

		[SetUp]
		public void SetUp()
		{
			repoMock = new Mock<IRepository>();

			tenant = new Tenant()
			{
				Id = new Guid(),
				UserId = new Guid("da84abd3-9c09-4236-8d73-999074d26270"),
				User = new User()
				{
					Id = new Guid("da84abd3-9c09-4236-8d73-999074d26270"),
					FirstName = "first name",
					MiddleName = "middle name",
					LastName = "last name",
					Age = 18,
					Gender = "male",
					ProfilePicture = null
				}
			};
		}

		[Test]
		public void Test_Method_CreateTenantAsync_ShouldCreateTenant()
		{
			var tenants = new List<Tenant>();

			repoMock.Setup(r=>r.AddAsync(It.IsAny<Tenant>()))
				.Callback<Tenant>(t=> tenants.Add(t));

			tenantService = new TenantService(repoMock.Object);

			tenantService.CreateTenantAsync(tenant.UserId);

			var actualResult = tenants.FirstOrDefault()?.UserId;

			Assert.That(actualResult, Is.EqualTo(tenant.UserId));
		}

		[Test]
		public async Task Test_Method_GetTenantByUserId_ShouldGetTenant()
		{
			var tenants = new List<Tenant>()
			{
				tenant
			}
			.AsQueryable()
			.BuildMock();

			repoMock.Setup(r => r.All<Tenant>())
				.Returns(tenants);

			tenantService = new TenantService(repoMock.Object);

			var actualResult = (await tenantService.GetTenantByUserId(tenant.UserId))?.Id;

			Assert.That(actualResult, Is.EqualTo(tenant.Id));
		}

		[Test]
		public async Task Test_Method_GetTenantByUserId_ShouldReturnNullIfReviewDoesNotExist()
		{
			var tenants = new List<Tenant>()
			{
				tenant
			}
			.AsQueryable()
			.BuildMock();

			repoMock.Setup(r => r.All<Tenant>())
				.Returns(tenants);

			tenantService = new TenantService(repoMock.Object);

			var actualResult = await tenantService.GetTenantByUserId(new Guid());

			Assert.That(actualResult, Is.Null);
		}
	}
}
