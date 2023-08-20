using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;
using Microsoft.EntityFrameworkCore;
using Moq;
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
		private Mock<IRepository> repoMock;
		private IAccountService accountService;

		[SetUp]
		public void Setup()
		{
			repoMock = new Mock<IRepository>();
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

			var editProfileDto = new EditProfileDto()
			{
				FirstName = "test",
				MiddleName = "test",
				LastName = "test",
				Gender = "male",
				Age = 22,
				ProfilePicture = null
			};

			repoMock.Setup(r => r.SaveChangesAsync())
				.Returns(Task.FromResult(1));

			var accountService = new AccountService(repoMock.Object);

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

			 repoMock.Setup(r => r.SaveChangesAsync())
				.Returns(Task.FromResult(1));

			accountService = new AccountService(repoMock.Object);

			await accountService!.EditProfileAsync(user, editProfileDto);

			Assert.That(user.ProfilePicture != null);
		}
	}
}