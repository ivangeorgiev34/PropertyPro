using PropertyPro.Infrastructure.Dtos.Account;
using PropertyPro.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PropertyPro.Core.Contracts
{
    public interface IAccountService
    {
        Task EditProfileAsync(User user, EditProfileDto editProfileDto);
    }
}
