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
    }
}
