using PropertyPro.Infrastructure.Constants;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PropertyPro.Infrastructure.Models
{
    public class Property
    {
        public Property()
        {
                this.Bookings = new List<Booking>();
            this.Reviews = new List<Review>();
        }
        [Key]
        public Guid Id { get; set; }

        [Required(ErrorMessage = InfrastructureConstants.Property.PROPERTY_TITLE_REQUIRED_ERROR_MESSAGE)]
        [MaxLength(InfrastructureConstants.Property.PROPERTY_TITLE_MAX_LENGTH_ERROR_MESSAGE)]
        public string Title { get; set; } = null!;

        public string? Description { get; set; }

        [Required(ErrorMessage = InfrastructureConstants.Property.PROPERTY_TYPE_REQUIRED_ERROR_MESSAGE)]
        public string Type { get; set; } = null!;

        [Required(ErrorMessage =InfrastructureConstants.Property.PROPERTY_TOWN_REQUIRED_ERROR_MESSAGE)]
        public string Town { get; set; } = null!;

        [Required(ErrorMessage = InfrastructureConstants.Property.PROPERTY_COUNTRY_REQUIRED_ERROR_MESSAGE)]
        public string Country { get; set; } = null!;

        [Required(ErrorMessage =InfrastructureConstants.Property.PROPERTY_MAX_GUESTS_COUNT_REQUIRED_ERROR_MESSAGE)]
        public int MaxGuestsCount { get; set; }

        [Required(ErrorMessage = InfrastructureConstants.Property.PROPERTY_BEDROOMS_COUNT_REQUIRED_ERROR_MESSAGE)]
        public int BedroomsCount { get; set; }

        [Required(ErrorMessage = InfrastructureConstants.Property.PROPERTY_BEDS_COUNT_REQUIRED_ERROR_MESSAGE)]
        public int BedsCount { get; set; }

        [Required(ErrorMessage = InfrastructureConstants.Property.PROPERTY_BATHROOMS_COUNT_REQUIRED_ERROR_MESSAGE)]
        public int BathroomsCount { get; set; }

        public ICollection<Booking>? Bookings { get; set; }

        public ICollection<Review>? Reviews { get; set; }

        [Required(ErrorMessage =InfrastructureConstants.Property.PROPERTY_LANDLORD_REQUIRED_ERROR_MESSAGE)]
        [ForeignKey(nameof(Landlord))]
        public Guid LandlordId { get; set; }
        public Landlord Landlord { get; set; } = null!;

    }
}
