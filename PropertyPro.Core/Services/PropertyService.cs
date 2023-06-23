using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using PropertyPro.Core.Contracts;
using PropertyPro.Infrastructure.Common;
using PropertyPro.Infrastructure.Dtos.Landlord;
using PropertyPro.Infrastructure.Dtos.Property;
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
                IsActive = true
            };

            await repo.AddAsync(property);
            await repo.SaveChangesAsync();
        }

        public async Task<List<GetAllPropertiesDto>> GetAllPropertiesAsync()
        {
            var properties = await repo.AllReadonly<Property>()
                 .Include(p => p.Landlord)
                 .ThenInclude(l=>l.User)
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
                     Town = p.Town,
                     FirstImage = Convert.ToBase64String(p.FirstImage),
                     SecondImage = p.SecondImage == null ? null : Convert.ToBase64String(p.SecondImage),
                     ThirdImage = p.ThirdImage == null ? null : Convert.ToBase64String(p.ThirdImage),
                     Landlord = new LandlordDto()
                     {
                        Id = p.Landlord.User.Id,
                        Email = p.Landlord.User.Email,
                        Age=p.Landlord.User.Age,
                        FirstName=p.Landlord.User.FirstName,
                        MiddleName=p.Landlord.User.MiddleName,
                        LastName=p.Landlord.User.LastName,
                        Gender=p.Landlord.User.Gender,
                        PhoneNumber=p.Landlord.User.PhoneNumber,
                        Username=p.Landlord.User.UserName
                     }
                     
                 })
                 .ToListAsync();

            return properties;
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
                    Town = p.Town,
                    FirstImage = Convert.ToBase64String(p.FirstImage),
                    SecondImage = p.SecondImage == null ? null : Convert.ToBase64String(p.SecondImage),
                    ThirdImage = p.ThirdImage == null ? null : Convert.ToBase64String(p.ThirdImage),
                    Landlord = new LandlordDto()
                    {
                        Id= Guid.Parse(userId),
                        Email =landlord.User.Email,
                        Age=landlord.User.Age,
                        FirstName=landlord.User.FirstName,
                        LastName=landlord.User.LastName,
                        MiddleName=landlord.User.MiddleName,
                        Gender=landlord.User.Gender,
                        PhoneNumber=landlord.User.PhoneNumber,
                        Username=landlord.User.UserName,
                    }
                })
                .ToList())
            .FirstOrDefaultAsync();

            return landlordsProperties;
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
