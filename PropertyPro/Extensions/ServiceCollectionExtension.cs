namespace PropertyPro.Extensions
{
    public static class ServiceCollectionExtension
    {

        public static void AddServices(this IServiceCollection services)
        {
            services.AddControllers();
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
        }
    }
}
