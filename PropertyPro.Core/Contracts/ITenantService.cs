using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PropertyPro.Core.Contracts
{
    public interface ITenantService
    {
        Task CreateTenantAsync(Guid userId);
    }
}
