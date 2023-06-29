using PropertyPro.Infrastructure.Constants;
using PropertyPro.Infrastructure.Dtos.Landlord;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PropertyPro.Infrastructure.Dtos.Property
{
    public class GetAllPropertiesDto
    {
        public Guid Id { get; set; }

        public string Title { get; set; } = null!;

        public string? Description { get; set; }

        public string Type { get; set; } = null!;

        public string Town { get; set; } = null!;

        public string Country { get; set; } = null!;

        public double GuestPricePerNight { get; set; }

        public int MaxGuestsCount { get; set; }

        public int BedroomsCount { get; set; }

        public int BedsCount { get; set; }

        public int BathroomsCount { get; set; }

        public string FirstImage { get; set; } = null!;

        public string? SecondImage { get; set; }

        public string? ThirdImage { get; set; }

        public LandlordDto Landlord{ get; set; } = null!;
    }
}
