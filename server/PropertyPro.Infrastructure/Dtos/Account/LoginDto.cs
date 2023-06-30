using PropertyPro.Infrastructure.Constants;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PropertyPro.Infrastructure.Dtos.Account
{
    public class LoginDto
    {
        [EmailAddress(ErrorMessage =InfrastructureConstants.LoginDto.LOGIN_DTO_EMAIL_INVALID_ERROR_MESSAGE)]
        [Required(ErrorMessage =InfrastructureConstants.LoginDto.LOGIN_DTO_EMAIL_REQUIRED_ERROR_MESSAGE)]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = InfrastructureConstants.LoginDto.LOGIN_DTO_PASSWORD_REQUIRED_ERROR_MESSAGE)]
        public string Password { get; set; } = null!;
    }
}
