using PropertyPro.Infrastructure.Constants;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PropertyPro.Infrastructure.Dtos.Review
{
    public class EditReviewDto
    {
        [Required(ErrorMessage = InfrastructureConstants.Review.REVIEW_STARS_REQUIRED_ERROR_MESSAGE)]
        [Range(InfrastructureConstants.Review.REVIEW_STARS_MIN_VALUE_ERROR_MESSAGE, InfrastructureConstants.Review.REVIEW_STARS_MAX_VALUE_ERROR_MESSAGE)]
        public double Stars { get; set; }

        public string? Description { get; set; }
    }
}
