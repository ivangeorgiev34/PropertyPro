using Microsoft.EntityFrameworkCore;
using PropertyPro.Core.Contracts;
using PropertyPro.Infrastructure.Common;
using PropertyPro.Infrastructure.Dtos.Tenant;
using PropertyPro.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PropertyPro.Core.Services
{
    public class TenantService : ITenantService
    {
        private readonly IRepository repo;
        public TenantService(IRepository _repo)
        {
                this.repo = _repo;
        }
        public async Task CreateTenantAsync(Guid userId)
        {
            var tenant = new Tenant()
            {
                UserId = userId,
                Id = Guid.NewGuid()
            };

            await repo.AddAsync(tenant);
            await repo.SaveChangesAsync();
        }

        public async Task<TenantDto?> GetTenantByUserId(Guid userId)
        {
            var tenantDto = await repo.All<Tenant>()
                 .Include(t => t.User)
                 .Where(t => t.UserId == userId)
                 .Select(t => new TenantDto()
                 {
                     Id = t.Id,
                     FirstName = t.User.FirstName,
                     MiddleName = t.User.MiddleName,
                     LastName = t.User.LastName,
                     Age = t.User.Age,
                     Gender = t.User.Gender,
                     ProfilePicture = t.User.ProfilePicture != null
                     ? Convert.ToBase64String(t.User.ProfilePicture)
                     : null
                 })
                 .FirstOrDefaultAsync();

            return tenantDto;
        }
    }
}
