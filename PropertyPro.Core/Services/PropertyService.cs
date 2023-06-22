using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using PropertyPro.Core.Contracts;
using PropertyPro.Infrastructure.Common;
using PropertyPro.Infrastructure.Dtos.Property;
using PropertyPro.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
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
                MaxGuestsCount = createPropertyDto.MaxGuestsCount
            };

            await repo.AddAsync(property);
            await repo.SaveChangesAsync();
        }

        public async Task<List<GetAllPropertiesDto>> GetAllPropertiesAsync()
        {
            var properties = await repo.AllReadonly<Property>()
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
                     FirstImage  = Convert.ToBase64String(p.FirstImage),
                     SecondImage = p.SecondImage == null ? null : Convert.ToBase64String(p.SecondImage),
                     ThirdImage = p.ThirdImage == null ? null : Convert.ToBase64String(p.ThirdImage)
                 })
                 .ToListAsync();

            return properties;
        }
    }
}
