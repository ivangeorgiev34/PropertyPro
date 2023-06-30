using PropertyPro.Infrastructure.Constants;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PropertyPro.Infrastructure.Dtos.Account
{
    public class RegisterDto
    {
        [Required(ErrorMessage = InfrastructureConstants.User.FIRST_NAME_REQUIRED_ERROR_MESSAGE)]
        public string FirstName { get; set; } = null!;

        [Required(ErrorMessage = InfrastructureConstants.User.MIDDLE_NAME_REQUIRED_ERROR_MESSAGE)]
        public string MiddleName { get; set; } = null!;

        [Required(ErrorMessage = InfrastructureConstants.User.LAST_NAME_REQUIRED_ERROR_MESSAGE)]
        public string LastName { get; set; } = null!;

        public string? Gender { get; set; }

        [Required(ErrorMessage = InfrastructureConstants.User.AGE_REQUIRED_ERROR_MESSAGE)]
        [Range(InfrastructureConstants.User.AGE_MIN_VALUE, InfrastructureConstants.User.AGE_MAX_VALUE, ErrorMessage = InfrastructureConstants.User.AGE_REQUIRED_ERROR_MESSAGE)]
        public int Age { get; set; }

        public string? Email { get; set; }

        public string? Username { get; set; }

        [Phone(ErrorMessage =InfrastructureConstants.RegisterDto.REGISTER_DTO_PHONE_INVALID_ERROR_MESSAGE)]
        public string? PhoneNumber { get; set; }

        public string? Password { get; set; }

        [Compare(nameof(Password),ErrorMessage =InfrastructureConstants.RegisterDto.REGISTER_DTO_PASSWORDS_MATCH_ERROR_MESSAGE)]
        public string? ConfirmPassword { get; set; }

    }
}
