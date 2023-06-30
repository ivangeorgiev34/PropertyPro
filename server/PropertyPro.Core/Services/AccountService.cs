using PropertyPro.Core.Contracts;
using PropertyPro.Infrastructure.Common;
using PropertyPro.Infrastructure.Dtos.Account;
using PropertyPro.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace PropertyPro.Core.Services
{
    public class AccountService : IAccountService
    {
        private IRepository repo;
        public AccountService(IRepository _repo)
        {
            this.repo = _repo;
        }
        public async Task EditProfileAsync(User user, EditProfileDto editProfileDto)
        {
            byte[]? imageBytes = null;

            if (editProfileDto.ProfilePicture != null)
            {
                using (var ms = new MemoryStream())
                {
                    await editProfileDto.ProfilePicture.CopyToAsync(ms);
                    imageBytes = ms.ToArray();
                }
            }

            user.FirstName = editProfileDto.FirstName;
            user.MiddleName = editProfileDto.MiddleName;
            user.LastName = editProfileDto.LastName;
            user.Age = editProfileDto.Age;
            user.Gender = editProfileDto.Gender;
            user.ProfilePicture = imageBytes;

            await repo.SaveChangesAsync();
        }
    }
}
