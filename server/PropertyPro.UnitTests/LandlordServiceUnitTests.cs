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
	public class LandlordServiceUnitTests
	{
		private Mock<IRepository> repoMock;
		private ILandlordService landlordService;
		private Landlord landlord;

		[SetUp]
		public void SetUp()
		{
			repoMock = new Mock<IRepository>();

			landlord = new Landlord()
			{
				Id = new Guid("82139e21-7823-485e-8758-0182932d77e6"),
				UserId = new Guid("7e30dfe6-2ef1-42c5-a87a-c8efdb0045e7"),
				User = new User()
				{
					Id = new Guid("7e30dfe6-2ef1-42c5-a87a-c8efdb0045e7")
				}
			};
		}

		[Test]
		public void Test_Method_CreateLandlordAsync_ShouldCreateLandlord()
		{
			var userId = new Guid("e9e7ff64-fc25-4775-92da-0cc6891ecec3");

			var landlords = new List<Landlord>();

			repoMock.Setup(r => r.AddAsync(It.IsAny<Landlord>()))
				.Callback<Landlord>(l => landlords.Add(l));

			landlordService = new LandlordService(repoMock.Object);

			landlordService.CreateLandlordAsync(userId);

			var actualResult = landlords.FirstOrDefault()?.UserId;

			Assert.That(actualResult, Is.EqualTo(userId));
		}

		[Test]
		public async Task Test_Method_GetLandlordByUserIdAsync_ShouldGetLandlord()
		{
			var landlords = new List<Landlord>()
			{
				landlord
			}
			.AsQueryable()
			.BuildMock();

			repoMock.Setup(r => r.All<Landlord>())
				.Returns(landlords);

			landlordService = new LandlordService(repoMock.Object);

			var actualResult = (await landlordService
				.GetLandlordByUserIdAsync(landlord.UserId.ToString()))?
				.Id;

			Assert.That(actualResult, Is.EqualTo(landlord.Id));
		}

		[Test]
		public async Task Test_Method_GetLandlordByUserIdAsync_ShouldReturnNullWhenCannotFindLandlord()
		{
			var landlords = new List<Landlord>()
			{
				landlord
			}
			.AsQueryable()
			.BuildMock();

			repoMock.Setup(r => r.All<Landlord>())
				.Returns(landlords);

			landlordService = new LandlordService(repoMock.Object);

			var actualResult = (await landlordService
				.GetLandlordByUserIdAsync("f204b530-96b6-417b-98ea-45c658320007"))?
				.Id;

			Assert.That(actualResult, Is.Null);
		}
	}
}
