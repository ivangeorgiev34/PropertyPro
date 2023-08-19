using Microsoft.EntityFrameworkCore;
using MockQueryable.Moq;
using Moq;
using NUnit.Framework;
using PropertyPro.Core.Contracts;
using PropertyPro.Core.Services;
using PropertyPro.Infrastructure.Common;
using PropertyPro.Infrastructure.Data;
using PropertyPro.Infrastructure.Dtos.Booking;
using PropertyPro.Infrastructure.Dtos.Query;
using PropertyPro.Infrastructure.Dtos.Tenant;
using PropertyPro.Infrastructure.Models;

namespace PropertyPro.UnitTests
{
	[TestFixture]
	public class BookingServiceUnitTests
	{
		private Mock<PropertyProDbContext>? dbContextMock;
		private Mock<IRepository>? repoMock;
		private Mock<ITenantService> tenantServiceMock;
		private IBookingService bookingService;
		private Booking booking;

		[SetUp]
		public void SetUp()
		{
			dbContextMock = new Mock<PropertyProDbContext>();
			repoMock = new Mock<IRepository>();
			tenantServiceMock = new Mock<ITenantService>();

			var bookingId = new Guid("e259d01d-c1d2-4bfb-835f-73e6e108c623");
			var userId = new Guid("66e6d1bb-525b-4b00-a2fa-ffed7eabc3be");
			booking = new Booking()
			{
				Id = new Guid("e259d01d-c1d2-4bfb-835f-73e6e108c623"),
				StartDate = new DateTime(2023, 10, 10),
				EndDate = new DateTime(2023, 10, 12),
				Guests = 2,
				IsActive = true,
				Property = new Property()
				{
					Id = new Guid("4aa222e6-f9ec-4c80-ba25-271aca08783d"),
					Title = "thrthrtr",
					Type = "apartment",
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
					Landlord = new Landlord()
					{
						Id = new Guid("e259d01d-c1d2-4bfb-835f-73e6e108c623"),
						User = new User()
						{
							Id = new Guid(),
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
				},
				Tenant = new Tenant()
				{
					Id = new Guid("f6213a62-efe5-43d5-b9df-16fddb6d9a8b"),
					UserId = new Guid("66e6d1bb-525b-4b00-a2fa-ffed7eabc3be"),
					User = new User()
					{
						Id = new Guid("287c478c-74b3-4e78-9aa3-e5fb1ab648e9"),
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
		public async Task Test_Method_BookingExistsByIdAsync_ShouldReturnTrueWhenBookingExists()
		{
			var bookings = new List<Booking>()
			{
				new Booking()
				{
					Id = new Guid("4aa222e6-f9ec-4c80-ba25-271aca08783d"),
					IsActive=true
				},
				new Booking()
				{
					Id = new Guid("8bd947ff-230d-4b11-91e7-2f9685c020f7"),
					IsActive=true
				},
				new Booking()
				{
					Id = new Guid("c7da5f4a-e3c1-4eaf-a365-eea4c3afad05"),
					IsActive=false
				},
			}
			.AsQueryable()
			.BuildMock();

			repoMock?.Setup(r => r.AllReadonly<Booking>())
				.Returns(bookings);

			bookingService = new BookingService(repoMock!.Object, tenantServiceMock.Object);

			var searchedBookingId = "4aa222e6-f9ec-4c80-ba25-271aca08783d";
			var bookingExists = await bookingService.BookingExistsByIdAsync(searchedBookingId);

			Assert.That(bookingExists, Is.True);
		}

		[Test]
		public async Task Test_Method_BookingExistsByIdAsync_ShouldReturnFalseWhenBookingDoesNotExist()
		{
			var bookings = new List<Booking>()
			{
				new Booking()
				{
					Id = new Guid("4aa222e6-f9ec-4c80-ba25-271aca08783d"),
					IsActive=false
				},
				new Booking()
				{
					Id = new Guid("8bd947ff-230d-4b11-91e7-2f9685c020f7"),
					IsActive=true
				},
				new Booking()
				{
					Id = new Guid("c7da5f4a-e3c1-4eaf-a365-eea4c3afad05"),
					IsActive=false
				},
			}
			.AsQueryable()
			.BuildMock();

			repoMock?.Setup(r => r.AllReadonly<Booking>())
				.Returns(bookings);

			bookingService = new BookingService(repoMock!.Object, tenantServiceMock.Object);

			var searchedBookingId = "4aa222e6-f9ec-4c80-ba25-271aca08783d";
			var bookingExists = await bookingService.BookingExistsByIdAsync(searchedBookingId);

			Assert.That(bookingExists, Is.False);
		}

		[Test]
		public void Test_Method_CanBookingBeBooked_ShouldThrowExceptionWhenStartDateIsSmallerThanDateNow()
		{
			bookingService = new BookingService(repoMock!.Object, tenantServiceMock.Object);

			var searchedPropertyId = "4aa222e6-f9ec-4c80-ba25-271aca08783d";

			Assert.ThrowsAsync<InvalidOperationException>(async () => await bookingService.CanBookingBeBooked(new DateTime(2022, 12, 12), new DateTime(2022, 12, 13), searchedPropertyId));
		}

		[Test]
		public void Test_Method_CanBookingBeBooked_ShouldThrowExceptionWhenBookingIsForMoreThanOneMonth()
		{
			bookingService = new BookingService(repoMock!.Object, tenantServiceMock.Object);

			var searchedPropertyId = "4aa222e6-f9ec-4c80-ba25-271aca08783d";

			Assert.ThrowsAsync<InvalidOperationException>(async () => await bookingService.CanBookingBeBooked(new DateTime(2023, 10, 10), new DateTime(2024, 1, 1), searchedPropertyId));
		}

		[Test]
		public void Test_Method_CanBookingBeBooked_ShouldThrowExceptionWhenBookingIsForMoreThanOneMonthAndYearsAreSame()
		{
			bookingService = new BookingService(repoMock!.Object, tenantServiceMock.Object);

			var searchedPropertyId = "4aa222e6-f9ec-4c80-ba25-271aca08783d";

			Assert.ThrowsAsync<InvalidOperationException>(async () => await bookingService.CanBookingBeBooked(new DateTime(2023, 10, 10), new DateTime(2023, 12, 10), searchedPropertyId));
		}

		[Test]
		public async Task Test_Method_CanBookingBeBooked_ShouldReturnTrueWhenCannotBookBooking()
		{
			var bookings = new List<Booking>()
			{
				new Booking()
				{
					StartDate = new DateTime(2023,10,10),
					EndDate = new DateTime(2023,10,12),
					IsActive = true,
					PropertyId = new Guid("4aa222e6-f9ec-4c80-ba25-271aca08783d")
				}
			}
			.AsQueryable()
			.BuildMock();

			repoMock?.Setup(r => r.All<Booking>())
				.Returns(bookings);

			bookingService = new BookingService(repoMock!.Object, tenantServiceMock.Object);

			var searchedPropertyId = "4aa222e6-f9ec-4c80-ba25-271aca08783d";

			var actualResult = await bookingService.CanBookingBeBooked(new DateTime(2023, 10, 12), new DateTime(2023, 10, 14), searchedPropertyId);

			Assert.That(actualResult, Is.True);
		}

		[Test]
		public async Task Test_Method_CanBookingBeBooked_ShouldReturnFalseWhenCanBookBooking()
		{
			var bookings = new List<Booking>()
			{
				new Booking()
				{
					StartDate = new DateTime(2023,10,10),
					EndDate = new DateTime(2023,10,12),
					IsActive = true,
					PropertyId = new Guid("4aa222e6-f9ec-4c80-ba25-271aca08783d")
				}
			}
			.AsQueryable()
			.BuildMock();

			repoMock?.Setup(r => r.All<Booking>())
				.Returns(bookings);

			bookingService = new BookingService(repoMock!.Object, tenantServiceMock.Object);

			var searchedPropertyId = "4aa222e6-f9ec-4c80-ba25-271aca08783d";

			var actualResult = await bookingService.CanBookingBeBooked(new DateTime(2023, 10, 13), new DateTime(2023, 10, 14), searchedPropertyId);

			Assert.That(actualResult, Is.False);
		}

		[Test]
		public async Task Test_Method_CreateBookingAsync_ShouldReturnFalseWhenCanBookBooking()
		{
			var tenantDto = new TenantDto()
			{
				Id = new Guid("c6c92a02-0bf0-42de-8700-d709d32d7b5a"),
				FirstName = "ivan",
				MiddleName = "ivanov",
				LastName = "ivanov",
				Age = 27,
				Gender = "Male",
				ProfilePicture = null
			};

			var bookings = new List<Booking>();

			var createBookingDto = new CreateBookingDto()
			{
				StartDate = "",
				EndDate = "",
				Guests = 5
			};

			var landlord = new Landlord()
			{
				Id = new Guid("e259d01d-c1d2-4bfb-835f-73e6e108c623"),
				User = new User()
				{
					Id = new Guid(),
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
			};

			var property = new Property()
			{
				Id = new Guid("4aa222e6-f9ec-4c80-ba25-271aca08783d"),
				Title = "thrthrtr",
				Type = "apartment",
				BathroomsCount = 5,
				BedroomsCount = 5,
				BedsCount = 5,
				Country = "greece",
				Description = "errehghree",
				MaxGuestsCount = 6,
				GuestPricePerNight = 4.53m,
				FirstImage = new byte[2],
				SecondImage = null,
				ThirdImage = null
			};

			var tenant = new Tenant()
			{
				Id = new Guid("f6213a62-efe5-43d5-b9df-16fddb6d9a8b"),
				UserId = new Guid("287c478c-74b3-4e78-9aa3-e5fb1ab648e9"),
				User = new User()
				{
					Id = new Guid("287c478c-74b3-4e78-9aa3-e5fb1ab648e9"),
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
			};

			repoMock?.Setup(repo => repo.AddAsync(It.IsAny<Booking>()))
				.Callback<Booking>(booking =>
				{
					booking.Property = property;
					booking.Tenant = tenant;
					booking.Property.Landlord = landlord;

					bookings.Add(booking);
				});

			repoMock?.Setup(repo => repo.All<Booking>())
				.Returns(bookings.AsQueryable().BuildMock());

			repoMock?.Setup(repo => repo.SaveChangesAsync()).ReturnsAsync(1);

			tenantServiceMock.Setup(t => t.GetTenantByUserId(
				It.IsAny<Guid>()).Result)
					.Returns(tenantDto);

			bookingService = new BookingService(repoMock!.Object, tenantServiceMock.Object);

			var actualResult = (await bookingService.CreateBookingAsync(createBookingDto, "e259d01d-c1d2-4bfb-835f-73e6e108c623", "4aa222e6-f9ec-4c80-ba25-271aca08783d", new DateTime(2023, 10, 10), new DateTime(2023, 10, 12))).Guests;

			Assert.That(actualResult, Is.EqualTo(5));
		}

		[Test]
		public void Test_Method_DeleteBookingAsync_ShouldThrowExceptionWhenBookingIsNotFound()
		{
			var bookingId = new Guid("e259d01d-c1d2-4bfb-835f-73e6e108c623");
			var userId = new Guid("66e6d1bb-525b-4b00-a2fa-ffed7eabc3be");

			var bookings = new List<Booking>()
			{
				new Booking()
				{
					Id = bookingId,
					IsActive=false,
					Tenant = new Tenant()
					{
					UserId = userId
					}
				}
			}
			.AsQueryable()
			.BuildMock();

			repoMock?.Setup(r => r.All<Booking>())
				.Returns(bookings);

			bookingService = new BookingService(repoMock!.Object, tenantServiceMock.Object);

			Assert.ThrowsAsync<InvalidOperationException>(async () =>
			{
				await bookingService.DeleteBookingAsync(bookingId.ToString(), userId.ToString());
			});
		}

		[Test]
		public async Task Test_Method_DeleteBookingAsync_ShouldSetBookingToBeInactive()
		{
			var bookingId = new Guid("e259d01d-c1d2-4bfb-835f-73e6e108c623");
			var userId = new Guid("66e6d1bb-525b-4b00-a2fa-ffed7eabc3be");

			var bookings = new List<Booking>()
			{
				new Booking()
				{
					Id = bookingId,
					IsActive=true,
					Tenant = new Tenant()
					{
					UserId = userId
					}
				}
			}
			.AsQueryable()
			.BuildMock();

			repoMock?.Setup(r => r.All<Booking>())
				.Returns(bookings);

			bookingService = new BookingService(repoMock!.Object, tenantServiceMock.Object);

			await bookingService
				.DeleteBookingAsync(bookingId.ToString(), userId.ToString());

			var actualResult = (await bookings
				.FirstOrDefaultAsync(b => b.Id == bookingId))?.IsActive;

			Assert.That(actualResult, Is.False);
		}

		[Test]
		public void Test_Method_EditBookingAsync_ShouldThrowExceptionIfStartDateIsEarlierThanNow()
		{
			bookingService = new BookingService(repoMock!.Object, tenantServiceMock.Object);

			Assert.ThrowsAsync<InvalidOperationException>(async () =>
			{
				await bookingService.EditBookingAsync(new EditBookingDto(), "", "", new DateTime(2022, 10, 10), new DateTime(2023, 10, 10));
			});
		}

		[Test]
		public void Test_Method_EditBookingAsync_ShouldThrowExceptionIfYearsAreDifferent()
		{
			bookingService = new BookingService(repoMock!.Object, tenantServiceMock.Object);

			Assert.ThrowsAsync<InvalidOperationException>(async () =>
			{
				await bookingService.EditBookingAsync(new EditBookingDto(), "", "", new DateTime(2023, 10, 10), new DateTime(2024, 12, 10));
			});
		}

		[Test]
		public void Test_Method_EditBookingAsync_ShouldThrowExceptionIfBookingIsMoreThanMonth()
		{
			bookingService = new BookingService(repoMock!.Object, tenantServiceMock.Object);

			Assert.ThrowsAsync<InvalidOperationException>(async () =>
			{
				await bookingService.EditBookingAsync(new EditBookingDto(), "", "", new DateTime(2023, 9, 10), new DateTime(2023, 11, 10));
			});
		}

		[Test]
		public void Test_Method_EditBookingAsync_ShouldThrowExceptionIfBookingIsNotFound()
		{
			var bookingId = new Guid("e259d01d-c1d2-4bfb-835f-73e6e108c623");
			var userId = new Guid("66e6d1bb-525b-4b00-a2fa-ffed7eabc3be");

			var bookings = new List<Booking>()
			{
				new Booking()
				{
					Id = bookingId,
					IsActive = false,
					Tenant = new Tenant()
					{
						UserId = userId
					}
				}
			}
			.AsQueryable()
			.BuildMock();

			repoMock?.Setup(r => r.All<Booking>())
				.Returns(bookings);

			bookingService = new BookingService(repoMock!.Object, tenantServiceMock.Object);

			Assert.ThrowsAsync<InvalidOperationException>(async () =>
			{
				await bookingService
				.EditBookingAsync(new EditBookingDto(), bookingId.ToString(), userId.ToString(), new DateTime(2023, 10, 10), new DateTime(2023, 10, 11));
			});
		}

		[Test]
		public async Task Test_Method_EditBookingAsync_ShouldEditBooking()
		{
			var bookingId = new Guid("e259d01d-c1d2-4bfb-835f-73e6e108c623");
			var userId = new Guid("66e6d1bb-525b-4b00-a2fa-ffed7eabc3be");

			var editBookingDto = new EditBookingDto()
			{
				StartDate = "",
				EndDate = "",
				Guests = 5
			};

			var bookings = new List<Booking>()
			{
				booking
			}
		.AsQueryable()
		.BuildMock();

			repoMock?.Setup(r => r.All<Booking>())
				.Returns(bookings);

			bookingService = new BookingService(repoMock!.Object, tenantServiceMock.Object);

			var actualResult = (await bookingService
				.EditBookingAsync(editBookingDto,
				bookingId.ToString(),
				userId.ToString(),
				new DateTime(2023, 10, 13),
				new DateTime(2023, 10, 14)))
				.StartDate.Day;

			Assert.That(actualResult, Is.EqualTo(13));
		}

		[Test]
		public async Task Test_Method_GetAllUsersBookings_ShouldGetBookings()
		{
			var bookings = new List<Booking>()
			{
				booking
			}
			.AsQueryable()
			.BuildMock();

			repoMock?.Setup(r => r.All<Booking>())
				.Returns(bookings);

			bookingService = new BookingService(repoMock!.Object, tenantServiceMock.Object);

			var actualResult = (await bookingService
				.GetAllUsersBookings(booking.Tenant.UserId.ToString()))?
				.FirstOrDefault()?.StartDate.Day;

			Assert.That(actualResult, Is.EqualTo(10));
		}

		[Test]
		public async Task Test_Method_GetAllUsersBookingsBySearchAsync_ShouldGetBookingsThatMatch()
		{
			var bookings = new List<Booking>()
			{
				booking
			}
			.AsQueryable()
			.BuildMock();

			var searchParams = new GetAllUsersBookingsSearchParameters()
			{
				Page = 1,
				Title = "th"
			};

			repoMock?.Setup(r => r.All<Booking>())
				.Returns(bookings);

			bookingService = new BookingService(repoMock!.Object, tenantServiceMock.Object);

			var actualResult = (await bookingService
				.GetAllUsersBookingsBySearchAsync(searchParams, booking.Tenant.UserId.ToString()))?
				.FirstOrDefault()?.StartDate.Day;

			Assert.That(actualResult, Is.EqualTo(10));
		}

		[Test]
		public async Task Test_Method_GetAllUsersBookingsBySearchAsync_ShouldNotGetAnythingIfThereIsNoMatch()
		{
			var bookings = new List<Booking>()
			{
				booking
			}
			.AsQueryable()
			.BuildMock();

			var searchParams = new GetAllUsersBookingsSearchParameters()
			{
				Page = 1,
				Title = "2"
			};

			repoMock?.Setup(r => r.All<Booking>())
				.Returns(bookings);

			bookingService = new BookingService(repoMock!.Object, tenantServiceMock.Object);

			var actualResult = (await bookingService
				.GetAllUsersBookingsBySearchAsync(searchParams, booking.Tenant.UserId.ToString()))?.Count;

			Assert.That(actualResult, Is.EqualTo(0));
		}

		[Test]
		public async Task Test_Method_GetBookingByIdAsync_ShouldGetBooking()
		{
			var bookings = new List<Booking>()
			{
				booking
			}
			.AsQueryable()
			.BuildMock();

			repoMock?.Setup(r => r.All<Booking>())
				.Returns(bookings);

			bookingService = new BookingService(repoMock!.Object, tenantServiceMock.Object);

			var actualResult = (await bookingService
				.GetBookingByIdAsync(booking.Id.ToString(),
				booking.Tenant.UserId.ToString()))?
				.StartDate.Day;

			Assert.That(actualResult, Is.EqualTo(10));
		}

		[Test]
		public async Task Test_Method_GetBookingByIdAsync_ShouldReturnNullWhenCannotFindBooking()
		{
			var bookings = new List<Booking>()
			{
				booking
			}
			.AsQueryable()
			.BuildMock();

			repoMock?.Setup(r => r.All<Booking>())
				.Returns(bookings);

			bookingService = new BookingService(repoMock!.Object, tenantServiceMock.Object);

			var actualResult = (await bookingService
				.GetBookingByIdAsync(
				"8a1f80b5-952d-4d3e-959c-1bb877918282",
				"c1a535c8-5cc3-42c7-9d32-ad754331b1c0"))?
				.StartDate.Day;

			Assert.That(actualResult, Is.Null);
		}

		[Test]
		public async Task Test_Method_GetPropertyBookings_ShouldGetBookings()
		{
			var bookings = new List<Booking>()
			{
				booking
			}
			.AsQueryable()
			.BuildMock();

			repoMock?.Setup(r => r.All<Booking>())
				.Returns(bookings);

			bookingService = new BookingService(repoMock!.Object, tenantServiceMock.Object);

			var actualResult = (await bookingService
				.GetPropertyBookings(
				booking.Tenant.UserId.ToString(),
				booking.PropertyId.ToString()))?
				.FirstOrDefault()?.StartDate.Day;

			Assert.That(actualResult, Is.EqualTo(10));
		}

		[Test]
		public async Task Test_Method_GetPropertyBookings_ShouldReturnNullWhenCannotFindBooking()
		{
			var bookings = new List<Booking>()
			{
				booking
			}
			.AsQueryable()
			.BuildMock();

			repoMock?.Setup(r => r.All<Booking>())
				.Returns(bookings);

			bookingService = new BookingService(repoMock!.Object, tenantServiceMock.Object);

			var actualResult = (await bookingService
				.GetPropertyBookings(
				"8a1f80b5-952d-4d3e-959c-1bb877918282",
				"c1a535c8-5cc3-42c7-9d32-ad754331b1c0"))?
				.FirstOrDefault()?.StartDate.Day;

			Assert.That(actualResult, Is.Null);
		}
	}
}
