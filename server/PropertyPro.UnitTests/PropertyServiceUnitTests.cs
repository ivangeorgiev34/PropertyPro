using Microsoft.EntityFrameworkCore;
using MockQueryable.Moq;
using Moq;
using NUnit.Framework;
using PropertyPro.Core.Contracts;
using PropertyPro.Core.Services;
using PropertyPro.Infrastructure.Common;
using PropertyPro.Infrastructure.Dtos.Property;
using PropertyPro.Infrastructure.Dtos.Query;
using PropertyPro.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PropertyPro.UnitTests
{
	public class PropertyServiceUnitTests
	{
		private Mock<IRepository> repoMock;
		private Mock<ILandlordService> landlordServiceMock;
		private Mock<IPropertyService> propertyServiceMock;
		private IPropertyService propertyService;
		private Property property;

		[SetUp]
		public void SetUp()
		{
			repoMock = new Mock<IRepository>();
			landlordServiceMock = new Mock<ILandlordService>();
			propertyServiceMock = new Mock<IPropertyService>();
			property = new Property()
			{
				Id = new Guid("4aa222e6-f9ec-4c80-ba25-271aca08783d"),
				Title = "thrthrtr",
				Type = "apartment",
				Town = "mykonos",
				BathroomsCount = 5,
				BedroomsCount = 5,
				BedsCount = 5,
				Country = "greece",
				Description = "errehghree",
				MaxGuestsCount = 6,
				GuestPricePerNight = 4.53m,
				FirstImage = new byte[2],
				SecondImage = null,
				ThirdImage = null,
				IsActive = true,
				Landlord = new Landlord()
				{
					Id = new Guid("e259d01d-c1d2-4bfb-835f-73e6e108c623"),
					UserId = new Guid("b6c79a54-a26e-4446-9121-6eb0fdb7c97c"),
					User = new User()
					{
						Id = new Guid("b6c79a54-a26e-4446-9121-6eb0fdb7c97c"),
						Email = "regrge@abv.bg",
						Age = 19,
						FirstName = "nekoi",
						MiddleName = "nekoi",
						LastName = "nekoi",
						Gender = "male",
						PhoneNumber = "0878404032",
						UserName = "Nekoi",
						ProfilePicture = null
					}
				}
			};
		}

		[Test]
		public void Test_Method_CreatePropertyAsync_ShouldThrowExceptionWhenLandlordIsNotFound()
		{
			landlordServiceMock.Setup(l => l.GetLandlordByUserIdAsync(It.IsAny<string>()).Result)
				.Returns((Landlord)null!);

			propertyService = new PropertyService(repoMock.Object, landlordServiceMock.Object);

			Assert.ThrowsAsync<InvalidOperationException>(async () =>
			{
				await propertyService.CreatePropertyAsync("", new CreatePropertyDto(), new byte[1], new byte[2], new byte[3]);
			});
		}

		[Test]
		public async Task Test_Method_CreatePropertyAsync_ShouldAddProperty()
		{
			var properties = new List<Property>();

			var createPropertyDto = new CreatePropertyDto()
			{
				Title = "title",
				Description = "description",
				BathroomsCount = 1,
				BedroomsCount = 1,
				BedsCount = 1,
				Country = "country",
				Type = "type",
				Town = "town",
				MaxGuestsCount = 1,
				GuestPricePerNight = 4.21m
			};

			landlordServiceMock.Setup(l => l.GetLandlordByUserIdAsync(It.IsAny<string>()).Result)
				.Returns(property.Landlord);

			repoMock.Setup(r => r.AddAsync(It.IsAny<Property>()))
				.Callback<Property>(p => properties.Add(p));

			propertyService = new PropertyService(repoMock.Object, landlordServiceMock.Object);

			await propertyService.CreatePropertyAsync("", createPropertyDto, new byte[1], new byte[2], new byte[3]);

			var actualResultFirstImage = properties
				.FirstOrDefault()?.FirstImage.Length;

			var actualResultTitle = properties
				.FirstOrDefault()?.Title;

			Assert.That(actualResultFirstImage, Is.EqualTo(1));
			Assert.That(actualResultTitle,
				Is.EqualTo(createPropertyDto.Title));
		}

		[Test]
		public async Task Test_Method_DeletePropertyAsync_ShouldDeleteProperty()
		{
			var properties = new List<Property>()
			{
				property
			}
			.AsQueryable()
			.BuildMock();

			var propertyId = property.Id.ToString();

			repoMock.Setup(r => r.All<Property>())
				.Returns(properties);

			propertyService = new PropertyService(repoMock.Object, landlordServiceMock.Object);

			await propertyService.DeletePropertyAsync(propertyId);

			var actualResult = properties
				.FirstOrDefault()?.IsActive;

			Assert.That(actualResult, Is.False);
		}

		[Test]
		public void Test_Method_DeletePropertyAsync_ShouldThrowExceptionWhenPropertyCannotBeFound()
		{
			var properties = new List<Property>()
			{
				property
			}
			.AsQueryable()
			.BuildMock();

			repoMock.Setup(r => r.All<Property>())
				.Returns(properties);

			propertyService = new PropertyService(repoMock.Object, landlordServiceMock.Object);

			Assert.ThrowsAsync<NullReferenceException>(async () =>
			{
				await propertyService
				.DeletePropertyAsync("e808256b-ffcf-4247-86c6-d48987bb5edd");
			});
		}

		[Test]
		public async Task Test_Method_EditPropertyAsync_ShouldEditProperty()
		{
			var properties = new List<Property>()
			{
				property
			}
			.AsQueryable()
			.BuildMock();

			var editPropertyDto = new EditPropertyDto()
			{
				Title = "edited",
				Description = "regrere",
				BathroomsCount = 1,
				BedroomsCount = 1,
				MaxGuestsCount = 1,
				BedsCount = 1,
				Country = "eer",
				GuestPricePerNight = 3.42m,
				Town = "erre",
				Type = "ee"
			};

			repoMock.Setup(r => r.All<Property>())
				.Returns(properties);

			propertyService = new PropertyService(repoMock.Object, landlordServiceMock.Object);

			await propertyService.EditPropertyAsync(
				editPropertyDto,
				property.Id.ToString(),
				new byte[2],
				new byte[2],
				new byte[3]);

			var actualResultFirstImage = (await properties
				.FirstOrDefaultAsync())?.FirstImage.Length;

			var actualResultTitle = (await properties
				.FirstOrDefaultAsync())?.Title;

			Assert.That(actualResultFirstImage, Is.EqualTo(2));
			Assert.That(actualResultTitle, Is.EqualTo("edited"));
		}

		[Test]
		public void Test_Method_EditPropertyAsync_ShouldThrowExceptionWhenPropertyIsNotFound()
		{
			var properties = new List<Property>()
			{
				property
			}
			.AsQueryable()
			.BuildMock();

			var editPropertyDto = new EditPropertyDto();

			repoMock.Setup(r => r.All<Property>())
				.Returns(properties);

			propertyService = new PropertyService(repoMock.Object, landlordServiceMock.Object);

			Assert.ThrowsAsync<InvalidOperationException>(async () =>
			{
				await propertyService.EditPropertyAsync(
					editPropertyDto,
					"e2da3f5c-229b-4ac7-9a9d-54306eee40fa",
					new byte[2],
					new byte[2],
					new byte[3]);
			});
		}

		[Test]
		public async Task Test_Method_GetAllPropertiesAsync_ShouldGetAllProperties()
		{
			var properties = new List<Property>()
			{
				property
			}
			.AsQueryable()
			.BuildMock();

			repoMock.Setup(r => r.AllReadonly<Property>())
				.Returns(properties);

			propertyService = new PropertyService(repoMock.Object, landlordServiceMock.Object);

			var actualResult = (await propertyService.GetAllPropertiesAsync())
				.FirstOrDefault()?.Title;

			Assert.That(actualResult, Is.EqualTo(property.Title));
		}

		[Test]
		public async Task Test_Method_GetLandlordsPropertiesBySearchTermAsync_ShouldGetLandlordsPropertiesByTitle()
		{
			var properties = new List<Property>()
			{
				property
			}
			.AsQueryable()
			.BuildMock();

			var searchParams = new GetLandlordsPropertiesSearchParameters()
			{
				Title = "th"
			};

			repoMock.Setup(r => r.AllReadonly<Property>())
				.Returns(properties);

			propertyService = new PropertyService(repoMock.Object, landlordServiceMock.Object);

			var actualResult = (await propertyService
				.GetLandlordsPropertiesBySearchTermAsync(searchParams, property.Landlord.UserId.ToString()))
				.FirstOrDefault()?.Title;

			Assert.That(actualResult, Is.EqualTo(property.Title));
		}

		[Test]
		public async Task Test_Method_GetLandlordsPropertiesBySearchTermAsync_ShouldGetLandlordsPropertiesByTown()
		{
			var properties = new List<Property>()
			{
				property
			}
			.AsQueryable()
			.BuildMock();

			var searchParams = new GetLandlordsPropertiesSearchParameters()
			{
				Town = "MyK"
			};

			repoMock.Setup(r => r.AllReadonly<Property>())
				.Returns(properties);

			propertyService = new PropertyService(repoMock.Object, landlordServiceMock.Object);

			var actualResult = (await propertyService
				.GetLandlordsPropertiesBySearchTermAsync(searchParams, property.Landlord.UserId.ToString()))
				.FirstOrDefault()?.Town;

			Assert.That(actualResult, Is.EqualTo(property.Town));
		}

		[Test]
		public async Task Test_Method_GetLandlordsPropertiesBySearchTermAsync_ShouldGetLandlordsPropertiesByCountry()
		{
			var properties = new List<Property>()
			{
				property
			}
			.AsQueryable()
			.BuildMock();

			var searchParams = new GetLandlordsPropertiesSearchParameters()
			{
				Country = "GrEe"
			};

			repoMock.Setup(r => r.AllReadonly<Property>())
				.Returns(properties);

			propertyService = new PropertyService(repoMock.Object, landlordServiceMock.Object);

			var actualResult = (await propertyService
				.GetLandlordsPropertiesBySearchTermAsync(searchParams, property.Landlord.UserId.ToString()))
				.FirstOrDefault()?.Country;

			Assert.That(actualResult, Is.EqualTo(property.Country));
		}

		[Test]
		public async Task Test_Method_GetLandlordsPropertiesAsync_ShouldGetLandlordsProperties()
		{
			var landlord = new Landlord()
			{
				Id = new Guid("e259d01d-c1d2-4bfb-835f-73e6e108c623"),
				UserId = new Guid("b6c79a54-a26e-4446-9121-6eb0fdb7c97c"),
				User = new User()
				{
					Id = new Guid("b6c79a54-a26e-4446-9121-6eb0fdb7c97c"),
					Email = "regrge@abv.bg",
					Age = 19,
					FirstName = "nekoi",
					MiddleName = "nekoi",
					LastName = "nekoi",
					Gender = "male",
					PhoneNumber = "0878404032",
					UserName = "Nekoi",
					ProfilePicture = null
				},
				Properties = new List<Property>()
				{
					property
				}
			};

			var properties = new List<Property>()
			{
				property
			}
			.AsQueryable()
			.BuildMock();

			var landlords = new List<Landlord>()
			{
				landlord
			}
			.AsQueryable()
			.BuildMock();

			repoMock.Setup(r => r.All<Landlord>())
				.Returns(landlords);

			landlordServiceMock
				.Setup(l => l.GetLandlordByUserIdAsync(property.Landlord.UserId.ToString()).Result)
				.Returns(landlord);


			propertyService = new PropertyService(repoMock.Object, landlordServiceMock.Object);

			var actualResult = (await propertyService
				.GetLandlordsPropertiesAsync(property.Landlord.UserId.ToString()))?
				.FirstOrDefault()?.Title;

			Assert.That(actualResult, Is.EqualTo(property.Title));
		}

		[Test]
		public async Task Test_Method_GetPropertyByIdAsync_ShouldReturnNullWhenPropertyIdIsNull()
		{
			propertyService = new PropertyService(repoMock.Object, landlordServiceMock.Object);

			var actualResult = (await propertyService.GetPropertyByIdAsync(null));

			Assert.That(actualResult, Is.Null);
		}

		[Test]
		public async Task Test_Method_GetPropertyDtoByIdAsync_ShouldGetPropertyDtoById()
		{
			var properties = new List<Property>()
			{
				property
			}
			.AsQueryable()
			.BuildMock();

			repoMock.Setup(r => r.All<Property>())
				.Returns(properties);

			propertyService = new PropertyService(repoMock.Object, landlordServiceMock.Object);

			var actualResult = (await propertyService.GetPropertyDtoByIdAsync(property.Id.ToString()))?.Title;

			Assert.That(actualResult, Is.EqualTo(property.Title));
		}

		[Test]
		public async Task Test_Method_LandlordOwnsPropertyById_ShouldReturnFalseIfPropertyIdOrUserIdIsNull()
		{
			propertyService = new PropertyService(repoMock.Object, landlordServiceMock.Object);

			var actualResult = await propertyService.LandlordOwnsPropertyById(null, null);

			Assert.That(actualResult, Is.False);
		}

		[Test]
		public async Task Test_Method_LandlordOwnsPropertyById_ShouldReturnFalseIfPropertyDoesNotExist()
		{
			var properties = new List<Property>()
			{
				property
			}
			.AsQueryable()
			.BuildMock();

			repoMock.Setup(r => r.AllReadonly<Property>())
				.Returns(properties);

			propertyService = new PropertyService(repoMock.Object, landlordServiceMock.Object);

			var actualResult = await propertyService.LandlordOwnsPropertyById("b41a51a1-79c3-49fd-b7a2-572cee721e60", "");

			Assert.That(actualResult, Is.False);
		}

		[Test]
		public async Task Test_Method_LandlordOwnsPropertyById_ShouldReturnTrue()
		{
			var properties = new List<Property>()
			{
				property
			}
			.AsQueryable()
			.BuildMock();

			repoMock.Setup(r => r.AllReadonly<Property>())
				.Returns(properties);

			propertyService = new PropertyService(repoMock.Object, landlordServiceMock.Object);

			var actualResult = await propertyService.LandlordOwnsPropertyById(property.Id.ToString(), property.Landlord.UserId.ToString());

			Assert.That(actualResult, Is.True);
		}

		[Test]
		public async Task Test_Method_PropertyExistsAsync_ShouldReturnFalseIfPropertyIdIsNull()
		{
			propertyService = new PropertyService(repoMock.Object, landlordServiceMock.Object);

			var actualResult = await propertyService.PropertyExistsAsync(null);

			Assert.That(actualResult, Is.False);
		}

		[Test]
		public async Task Test_Method_GetAllPropertiesBySearchTermAsync_ShouldGetAllPropertiesByTitle()
		{
			var properties = new List<Property>()
			{
				property
			}
			.AsQueryable()
			.BuildMock();

			var searchParams = new GetAllPropertiesSearchParams()
			{
				Title = "tH"
			};

			repoMock.Setup(r => r.AllReadonly<Property>())
				.Returns(properties);

			propertyService = new PropertyService(repoMock.Object, landlordServiceMock.Object);

			var actualResult = (await propertyService.GetAllPropertiesBySearchTermAsync(searchParams)).FirstOrDefault()?.Title;

			Assert.That(actualResult, Is.EqualTo(property.Title));
		}

		[Test]
		public async Task Test_Method_GetAllPropertiesBySearchTermAsync_ShouldGetAllPropertiesByTown()
		{
			var properties = new List<Property>()
			{
				property
			}
			.AsQueryable()
			.BuildMock();

			var searchParams = new GetAllPropertiesSearchParams()
			{
				Town = "MyKO"
			};

			repoMock.Setup(r => r.AllReadonly<Property>())
				.Returns(properties);

			propertyService = new PropertyService(repoMock.Object, landlordServiceMock.Object);

			var actualResult = (await propertyService.GetAllPropertiesBySearchTermAsync(searchParams)).FirstOrDefault()?.Town;

			Assert.That(actualResult, Is.EqualTo(property.Town));
		}

		[Test]
		public async Task Test_Method_GetAllPropertiesBySearchTermAsync_ShouldGetAllPropertiesByCountry()
		{
			var properties = new List<Property>()
			{
				property
			}
			.AsQueryable()
			.BuildMock();

			var searchParams = new GetAllPropertiesSearchParams()
			{
				Country = "GrEEc"
			};

			repoMock.Setup(r => r.AllReadonly<Property>())
				.Returns(properties);

			propertyService = new PropertyService(repoMock.Object, landlordServiceMock.Object);

			var actualResult = (await propertyService.GetAllPropertiesBySearchTermAsync(searchParams)).FirstOrDefault()?.Country;

			Assert.That(actualResult, Is.EqualTo(property.Country));
		}

		[Test]
		public async Task Test_Method_GetAllPropertiesBySearchTermAsync_ShouldGetAllPropertiesWhenSearcgParamsAreNull()
		{
			var properties = new List<Property>()
			{
				property
			}
			.AsQueryable()
			.BuildMock();

			var searchParams = new GetAllPropertiesSearchParams();

			repoMock.Setup(r => r.AllReadonly<Property>())
				.Returns(properties);

			propertyService = new PropertyService(repoMock.Object, landlordServiceMock.Object);

			var actualResult = (await propertyService.GetAllPropertiesBySearchTermAsync(searchParams)).FirstOrDefault()?.Country;

			Assert.That(actualResult, Is.EqualTo(property.Country));
		}
	}
}
