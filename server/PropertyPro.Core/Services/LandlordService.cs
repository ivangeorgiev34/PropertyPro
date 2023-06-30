using Microsoft.EntityFrameworkCore;
using PropertyPro.Core.Contracts;
using PropertyPro.Infrastructure.Common;
using PropertyPro.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PropertyPro.Core.Services
{
    public class LandlordService : ILandlordService
    {
        private readonly IRepository repo;
        public LandlordService(IRepository _repo)
        {
                this.repo  =_repo;
        }

        public async Task CreateLandlordAsync(Guid userId)
        {
            var landlord = new Landlord()
            {
                Id = Guid.NewGuid(),
                UserId = userId
            };

            await repo.AddAsync(landlord);
            await repo.SaveChangesAsync();
        }

        public async Task<Landlord?> GetLandlordByUserIdAsync(string userId)
        {
            var landlord =await repo.All<Landlord>()
                .Include(l=>l.User)
                .FirstOrDefaultAsync(l=>l.UserId == Guid.Parse(userId));

            return landlord;
        }
    }
}
