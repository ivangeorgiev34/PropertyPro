using PropertyPro.Infrastructure.Dtos.Property;
using PropertyPro.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PropertyPro.Core.Contracts
{
    public interface IPropertyService
    {
        Task<List<GetAllPropertiesDto>> GetAllPropertiesAsync();

        Task<bool> PropertyExistsAsync(string? propertyId);

        Task<bool> LandlordOwnsPropertyById(string? propertyId,string? userId);

        Task DeletePropertyAsync(string propertyId);

        Task<List<GetLandlordsPropertiesDto>?> GetLandlordsPropertiesAsync(string userId);

        Task CreatePropertyAsync(string userId,CreatePropertyDto createPropertyDto, byte[] firstImageBytes, byte[]? secondImageBytes, byte[]? thirdImageBytes);

        Task EditPropertyAsync(EditPropertyDto editPropertyDto, string propertyId, byte[] firstImage, byte[]? secondImage, byte[]? thirdImage);

        Task<Property?> GetPropertyByIdAsync(string? propertyId);

        Task<PropertyDto?> GetPropertyByIdAsync(string propertyId,string userId);
    }
}
