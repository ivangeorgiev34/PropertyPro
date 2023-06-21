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
        public PropertyService(IRepository _repo)
        {
            this.repo = _repo;
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
                     Town = p.Town
                 })
                 .ToListAsync();

            return properties;
        }
    }
}
