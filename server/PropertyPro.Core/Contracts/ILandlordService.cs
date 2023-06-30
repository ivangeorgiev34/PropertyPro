using PropertyPro.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PropertyPro.Core.Contracts
{
    public interface ILandlordService
    {
        Task<Landlord?> GetLandlordByUserIdAsync(string userId);

        Task CreateLandlordAsync(Guid userId);
    }
}
