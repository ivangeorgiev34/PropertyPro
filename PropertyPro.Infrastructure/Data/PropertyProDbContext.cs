using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PropertyPro.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PropertyPro.Infrastructure.Data
{
    public class PropertyProDbContext : IdentityDbContext<User,IdentityRole<Guid>,Guid>
    {
        public PropertyProDbContext(DbContextOptions<PropertyProDbContext> options) : base(options)
        {
        }

        public PropertyProDbContext()
        {
        }


        public DbSet<Tenant>? Tenants { get; set; }

        public DbSet<Landlord>? Landlords { get; set; }

        public DbSet<Booking>? Bookings { get; set; }

        public DbSet<Property>? Properties { get; set; }

        public DbSet<Review>? Reviews { get; set; }
    }
}
