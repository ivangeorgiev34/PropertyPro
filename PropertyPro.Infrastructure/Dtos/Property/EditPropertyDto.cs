﻿using PropertyPro.Infrastructure.Constants;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PropertyPro.Infrastructure.Dtos.Property
{
    public class EditPropertyDto
    {
        [Required(ErrorMessage = InfrastructureConstants.Property.PROPERTY_TITLE_REQUIRED_ERROR_MESSAGE)]
        [MaxLength(InfrastructureConstants.Property.PROPERTY_TITLE_MAX_LENGTH_ERROR_MESSAGE)]
        public string Title { get; set; } = null!;

        public string? Description { get; set; }

        [Required(ErrorMessage = InfrastructureConstants.Property.PROPERTY_TYPE_REQUIRED_ERROR_MESSAGE)]
        public string Type { get; set; } = null!;

        [Required(ErrorMessage = InfrastructureConstants.Property.PROPERTY_TOWN_REQUIRED_ERROR_MESSAGE)]
        public string Town { get; set; } = null!;

        [Required(ErrorMessage = InfrastructureConstants.Property.PROPERTY_COUNTRY_REQUIRED_ERROR_MESSAGE)]
        public string Country { get; set; } = null!;

        [Required(ErrorMessage = InfrastructureConstants.Property.PROPERTY_MAX_GUESTS_COUNT_REQUIRED_ERROR_MESSAGE)]
        public int MaxGuestsCount { get; set; }

        [Required(ErrorMessage = InfrastructureConstants.Property.PROPERTY_BEDROOMS_COUNT_REQUIRED_ERROR_MESSAGE)]
        public int BedroomsCount { get; set; }

        [Required(ErrorMessage = InfrastructureConstants.Property.PROPERTY_BEDS_COUNT_REQUIRED_ERROR_MESSAGE)]
        public int BedsCount { get; set; }

        [Required(ErrorMessage = InfrastructureConstants.Property.PROPERTY_BATHROOMS_COUNT_REQUIRED_ERROR_MESSAGE)]
        public int BathroomsCount { get; set; }

        [Required(ErrorMessage = InfrastructureConstants.Property.PROPERTY_FIRST_IMAGE_REQUIRED_ERROR_MESSAGE)]
        public byte[] FirstImage { get; set; } = null!;

        public byte[]? SecondImage { get; set; }

        public byte[]? ThirdImage { get; set; }
    }
}
