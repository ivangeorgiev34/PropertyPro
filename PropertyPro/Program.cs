using Microsoft.EntityFrameworkCore;
using PropertyPro.Extensions;
using PropertyPro.Infrastructure.Data;

namespace PropertyPro
{
    public class Program
    {
        public static void Main(string[] args)
        {

            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddDbContext<PropertyProDbContext>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("PropertyProConnectionString"));
            });

            ServiceCollectionExtension.AddServices(builder.Services);

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();
            app.UseAuthentication();


            app.MapControllers();

            app.Run();
        }
    }
}