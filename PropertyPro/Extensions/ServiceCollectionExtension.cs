﻿using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
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
                options.AddPolicy("LocalServer", policy =>
                {
                    policy.WithOrigins("http://127.0.0.1:5500")
                    .AllowAnyMethod()
                    .AllowAnyHeader();
                });
            });
           

            services.AddScoped<IRepository,Repository>();
        }
    }
}
