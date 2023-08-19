using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using PropertyPro.Core.Contracts;
using PropertyPro.Core.Services;
using PropertyPro.Infrastructure.Common;
using PropertyPro.Infrastructure.Data;
using PropertyPro.Infrastructure.Dtos.Account;
using PropertyPro.Infrastructure.Models;

namespace PropertyPro.UnitTests
{
	[TestFixture]
	public class Tests
	{
		private IRepository? repo;
		private PropertyProDbContext dbContext;
		private IAccountService? accountService;

		[SetUp]
		public void Setup()
		{
			var contextOptions = new DbContextOptionsBuilder<PropertyProDbContext>()
				.UseInMemoryDatabase("PropertyProDb")
				.Options;

			dbContext = new PropertyProDbContext(contextOptions);

			dbContext.Database.EnsureDeleted();
			dbContext.Database.EnsureCreated();

			repo = new Repository(dbContext);

			accountService = new AccountService(repo);

		}

		[Test]
		public async Task Test_MethodEditProfileAsyncShouldNotEditProfilePictureWhenItIsNull()
		{
			var user = new User()
			{
				Id = new Guid("3476f883-78c2-4e80-8ac4-fd2d61bb7ae9"),
				FirstName = "test",
				MiddleName = "test",
				LastName = "test",
				Gender = "male",
				Age = 23,
				ProfilePicture = null,
				Email = "test@abv.bg",
				UserName = "test123"
			};

			dbContext.Add(user);

			var editProfileDto = new EditProfileDto()
			{
				FirstName = "test",
				MiddleName = "test",
				LastName = "test",
				Gender = "male",
				Age = 22,
				ProfilePicture = null
			};

			await accountService!.EditProfileAsync(user, editProfileDto);

			Assert.That(user.ProfilePicture == null);
			Assert.That(user.Age == 22);
		}

		[Test]
		public async Task Test_MethodEditProfileAsyncShouldEditProperly()
		{
			var user = new User()
			{
				Id = new Guid("3476f883-78c2-4e80-8ac4-fd2d61bb7ae9"),
				FirstName = "test",
				MiddleName = "test",
				LastName = "test",
				Gender = "male",
				Age = 23,
				ProfilePicture = null,
				Email = "test@abv.bg",
				UserName = "test123"
			};

			dbContext.Add(user);

			var stream = new MemoryStream();

			var editProfileDto = new EditProfileDto()
			{
				FirstName = "test",
				MiddleName = "test",
				LastName = "test",
				Gender = "male",
				Age = 23,
				ProfilePicture = new FormFile(stream, 0, stream.Length, "test", "test")
			};

			await accountService!.EditProfileAsync(user, editProfileDto);

			Assert.That(user.ProfilePicture != null);
		}

		[TearDown]
		public void TearDown()
		{
			dbContext.Dispose();
		}
	}
}