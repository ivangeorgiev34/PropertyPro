using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using PropertyPro.Core.Contracts;
using PropertyPro.Core.Services;
using PropertyPro.Infrastructure.Common;
using PropertyPro.Infrastructure.Data;
using PropertyPro.Infrastructure.Models;

namespace PropertyPro.Extensions
{
    public static class ServiceCollectionExtension
    {

        public static void AddServices(this IServiceCollection services)
        {
            services.AddControllers();
            services.AddSwaggerGen();
            services.AddIdentity<User, IdentityRole<Guid>>(options =>
            {
                options.SignIn.RequireConfirmedAccount = false;
                options.Password.RequireDigit = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireDigit = false;
            })
                .AddEntityFrameworkStores<PropertyProDbContext>()
                .AddDefaultTokenProviders();
            services.AddCors(options =>
            {
                //options.AddPolicy("LocalServer", policy =>
                //{
                //    policy.WithOrigins("http://127.0.0.1:5500")
                //    .AllowAnyMethod()
                //    .AllowAnyHeader();
                //});

                options.AddPolicy("LocalServer", policy =>
                {
                    policy.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
                });
            });
           

            services.AddScoped<IRepository,Repository>();
            services.AddScoped<IPropertyService, PropertyService>();
            services.AddScoped<ILandlordService, LandlordService>();
            services.AddScoped<ITenantService,TenantService>();
            services.AddScoped<IAccountService, AccountService>();
        }
    }
}
