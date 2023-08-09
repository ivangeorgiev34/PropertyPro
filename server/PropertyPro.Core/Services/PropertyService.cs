﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using PropertyPro.Core.Contracts;
using PropertyPro.Infrastructure.Common;
using PropertyPro.Infrastructure.Dtos.Landlord;
using PropertyPro.Infrastructure.Dtos.Property;
using PropertyPro.Infrastructure.Dtos.Query;
using PropertyPro.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace PropertyPro.Core.Services
{
	public class PropertyService : IPropertyService
	{
		private readonly IRepository repo;
		private readonly ILandlordService landlordService;
		public PropertyService(IRepository _repo,
			ILandlordService _landlordService)
		{
			this.repo = _repo;
			this.landlordService = _landlordService;
		}

		public async Task CreatePropertyAsync(string userId, CreatePropertyDto createPropertyDto, byte[] firstImageBytes, byte[]? secondImageBytes, byte[]? thirdImageBytes)
		{
			var landlord = await landlordService.GetLandlordByUserIdAsync(userId);

			if (landlord == null)
			{
				throw new InvalidOperationException("Landlord is not found");

			}

			var property = new Property()
			{
				LandlordId = landlord.Id,
				Title = createPropertyDto.Title,
				Description = createPropertyDto.Description,
				BathroomsCount = createPropertyDto.BathroomsCount,
				BedroomsCount = createPropertyDto.BedroomsCount,
				BedsCount = createPropertyDto.BedsCount,
				Country = createPropertyDto.Country,
				FirstImage = firstImageBytes,
				SecondImage = secondImageBytes,
				ThirdImage = thirdImageBytes,
				Type = createPropertyDto.Type,
				Town = createPropertyDto.Town,
				MaxGuestsCount = createPropertyDto.MaxGuestsCount,
				GuestPricePerNight = createPropertyDto.GuestPricePerNight,
				IsActive = true
			};

			await repo.AddAsync(property);
			await repo.SaveChangesAsync();
		}

		public async Task DeletePropertyAsync(string propertyId)
		{
			var property = await GetPropertyByIdAsync(propertyId);

			if (property == null)
			{
				throw new NullReferenceException("Property doesn't exist");
			}

			property.IsActive = false;

			await repo.SaveChangesAsync();
		}

		public async Task EditPropertyAsync(EditPropertyDto editPropertyDto, string propertyId, byte[] firstImage, byte[]? secondImage, byte[]? thirdImage)
		{
			var property = await GetPropertyByIdAsync(propertyId);

			if (property == null)
			{
				throw new InvalidOperationException("Unexpected error");
			}

			property.Title = editPropertyDto.Title;
			property.Description = editPropertyDto.Description;
			property.BathroomsCount = editPropertyDto.BathroomsCount;
			property.BedroomsCount = editPropertyDto.BedroomsCount;
			property.Type = editPropertyDto.Type;
			property.Town = editPropertyDto.Town;
			property.Country = editPropertyDto.Country;
			property.MaxGuestsCount = editPropertyDto.MaxGuestsCount;
			property.BedsCount = editPropertyDto.BedsCount;
			property.GuestPricePerNight = editPropertyDto.GuestPricePerNight;
			property.FirstImage = firstImage;
			property.SecondImage = secondImage;
			property.ThirdImage = thirdImage;

			await repo.SaveChangesAsync();
		}

		public async Task<List<GetAllPropertiesDto>> GetAllPropertiesAsync()
		{
			var properties = await repo.AllReadonly<Property>()
				 .Include(p => p.Landlord)
				 .ThenInclude(l => l.User)
				 .Where(p => p.IsActive == true)
				 .Select(p => new GetAllPropertiesDto
				 {
					 Id = p.Id,
					 Title = p.Title,
					 Type = p.Type,
					 BathroomsCount = p.BathroomsCount,
					 BedroomsCount = p.BedroomsCount,
					 BedsCount = p.BedsCount,
					 Country = p.Country,
					 Description = p.Description,
					 MaxGuestsCount = p.MaxGuestsCount,
					 GuestPricePerNight = p.GuestPricePerNight,
					 Town = p.Town,
					 FirstImage = Convert.ToBase64String(p.FirstImage),
					 SecondImage = p.SecondImage == null ? null : Convert.ToBase64String(p.SecondImage),
					 ThirdImage = p.ThirdImage == null ? null : Convert.ToBase64String(p.ThirdImage),
					 Landlord = new LandlordDto()
					 {
						 Id = p.Landlord.User.Id,
						 Email = p.Landlord.User.Email,
						 Age = p.Landlord.User.Age,
						 FirstName = p.Landlord.User.FirstName,
						 MiddleName = p.Landlord.User.MiddleName,
						 LastName = p.Landlord.User.LastName,
						 Gender = p.Landlord.User.Gender,
						 PhoneNumber = p.Landlord.User.PhoneNumber,
						 Username = p.Landlord.User.UserName
					 }

				 })
				 .ToListAsync();

			return properties;
		}

		public async Task<List<GetAllPropertiesDto>> GetAllPropertiesBySearchTermAsync(GetLandlordsPropertiesSearchParameters searchTerms, string userId)
		{

			var properties = await repo.AllReadonly<Property>()
				 .Include(p => p.Landlord)
				 .ThenInclude(l => l.User)
				 .Where(p => p.IsActive == true && p.Landlord.UserId == Guid.Parse(userId))
				 .Select(p => new GetAllPropertiesDto
				 {
					 Id = p.Id,
					 Title = p.Title,
					 Type = p.Type,
					 BathroomsCount = p.BathroomsCount,
					 BedroomsCount = p.BedroomsCount,
					 BedsCount = p.BedsCount,
					 Country = p.Country,
					 Description = p.Description,
					 MaxGuestsCount = p.MaxGuestsCount,
					 GuestPricePerNight = p.GuestPricePerNight,
					 Town = p.Town,
					 FirstImage = Convert.ToBase64String(p.FirstImage),
					 SecondImage = p.SecondImage == null ? null : Convert.ToBase64String(p.SecondImage),
					 ThirdImage = p.ThirdImage == null ? null : Convert.ToBase64String(p.ThirdImage),
					 Landlord = new LandlordDto()
					 {
						 Id = p.Landlord.User.Id,
						 Email = p.Landlord.User.Email,
						 Age = p.Landlord.User.Age,
						 FirstName = p.Landlord.User.FirstName,
						 MiddleName = p.Landlord.User.MiddleName,
						 LastName = p.Landlord.User.LastName,
						 Gender = p.Landlord.User.Gender,
						 PhoneNumber = p.Landlord.User.PhoneNumber,
						 Username = p.Landlord.User.UserName
					 }

				 })
				 .ToListAsync();

			List<GetAllPropertiesDto> searchedProperties = new List<GetAllPropertiesDto>();

			if (searchTerms.Title != null)
			{
				searchedProperties = properties
				   .AsQueryable()
				   .Where(p => p.Title.Contains(searchTerms.Title, StringComparison.OrdinalIgnoreCase))
				   .ToList();
			}
			else if (searchTerms.Town != null)
			{

				searchedProperties = properties
					.AsQueryable()
					.Where(p => p.Town.Contains(searchTerms.Town,StringComparison.OrdinalIgnoreCase))
					.ToList();
			}
			else if (searchTerms.Country != null)
			{
				searchedProperties = properties
					.AsQueryable()
					.Where(p => p.Country.Contains(searchTerms.Country, StringComparison.OrdinalIgnoreCase))
					.ToList();
			}

			return searchedProperties;
		}

		public async Task<List<GetLandlordsPropertiesDto>?> GetLandlordsPropertiesAsync(string userId)
		{

			var landlord = await landlordService.GetLandlordByUserIdAsync(userId);

			var landlordsProperties = await repo.All<Landlord>()
				.Include(l => l.Properties)
				.Where(l => l.UserId == Guid.Parse(userId))
				.Select(l => l.Properties
				.Where(p => p.IsActive == true)
				.Select(p => new GetLandlordsPropertiesDto
				{
					Id = p.Id,
					Title = p.Title,
					Type = p.Type,
					BathroomsCount = p.BathroomsCount,
					BedroomsCount = p.BedroomsCount,
					BedsCount = p.BedsCount,
					Country = p.Country,
					Description = p.Description,
					MaxGuestsCount = p.MaxGuestsCount,
					GuestPricePerNight = p.GuestPricePerNight,
					Town = p.Town,
					FirstImage = Convert.ToBase64String(p.FirstImage),
					SecondImage = p.SecondImage == null ? null : Convert.ToBase64String(p.SecondImage),
					ThirdImage = p.ThirdImage == null ? null : Convert.ToBase64String(p.ThirdImage),
					Landlord = new LandlordDto()
					{
						Id = Guid.Parse(userId),
						Email = landlord!.User.Email,
						Age = landlord.User.Age,
						FirstName = landlord.User.FirstName,
						LastName = landlord.User.LastName,
						MiddleName = landlord.User.MiddleName,
						Gender = landlord.User.Gender,
						PhoneNumber = landlord.User.PhoneNumber,
						Username = landlord.User.UserName,
					}
				})
				.ToList())
			.FirstOrDefaultAsync();

			return landlordsProperties;
		}

		public async Task<Property?> GetPropertyByIdAsync(string? propertyId)
		{
			if (propertyId == null)
			{
				return null!;
			}

			var property = await repo.All<Property>()
				.Include(p => p.Landlord)
				.FirstOrDefaultAsync(p => p.Id == Guid.Parse(propertyId));

			return property;
		}

		public async Task<GetPropertyByIdDto?> GetPropertyDtoByIdAsync(string propertyId)
		{
			var propertyDto = await repo.All<Property>()
				.Where(p => p.Id == Guid.Parse(propertyId) && p.IsActive == true)
				.Select(p => new GetPropertyByIdDto()
				{
					Id = p.Id,
					Title = p.Title,
					Type = p.Type,
					BathroomsCount = p.BathroomsCount,
					BedroomsCount = p.BedroomsCount,
					BedsCount = p.BedsCount,
					Country = p.Country,
					Description = p.Description,
					MaxGuestsCount = p.MaxGuestsCount,
					GuestPricePerNight = p.GuestPricePerNight,
					Town = p.Town,
					AverageRating = p.Reviews == null
					? 0.00d
					: p.Reviews.Count == 0
					? 0.00d
					: p.Reviews.Where(r => r.IsActive == true).Sum(r => r.Stars) / p.Reviews.Where(r => r.IsActive == true).ToArray().Length,
					ReviewsCount = p.Reviews != null ? p.Reviews.Where(r => r.IsActive == true).ToArray().Length : 0,
					FirstImage = Convert.ToBase64String(p.FirstImage),
					SecondImage = p.SecondImage == null ? null : Convert.ToBase64String(p.SecondImage),
					ThirdImage = p.ThirdImage == null ? null : Convert.ToBase64String(p.ThirdImage),
					Landlord = new LandlordDto()
					{
						Id = p.Landlord.User.Id,
						Email = p.Landlord.User.Email,
						Age = p.Landlord.User.Age,
						FirstName = p.Landlord.User.FirstName,
						MiddleName = p.Landlord.User.MiddleName,
						LastName = p.Landlord.User.LastName,
						Gender = p.Landlord.User.Gender,
						PhoneNumber = p.Landlord.User.PhoneNumber,
						Username = p.Landlord.User.UserName
					}
				})
				.FirstOrDefaultAsync();

			return propertyDto;
		}

		public async Task<bool> LandlordOwnsPropertyById(string? propertyId, string? userId)
		{
			if (propertyId == null || userId == null)
			{
				return false;
			}

			if (await PropertyExistsAsync(propertyId) == false)
			{
				return false;
			}

			var landlordOwnsProperty = await repo.AllReadonly<Property>()
				.Include(p => p.Landlord)
				.AnyAsync(p => p.Landlord.UserId == Guid.Parse(userId) && p.Id == Guid.Parse(propertyId));

			return landlordOwnsProperty;
		}

		public async Task<bool> PropertyExistsAsync(string? propertyId)
		{
			if (propertyId == null)
			{
				return false;
			}

			var propertyExists = await repo.AllReadonly<Property>()
				.AnyAsync(p => p.IsActive == true && p.Id == Guid.Parse(propertyId));

			return propertyExists;
		}
	}
}
