using PropertyPro.Infrastructure.Dtos.Property;
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
    }
}
