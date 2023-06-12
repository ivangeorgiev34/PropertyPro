using PropertyPro.Infrastructure.Constants;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PropertyPro.Infrastructure.Models
{
    public class User
    {
        [Key]
        public Guid Id { get; set; }

        [Required(ErrorMessage = InfrastructureConstants.User.FIRST_NAME_REQUIRED_ERROR_MESSAGE)]
        public string FirstName { get; set; } = null!;

        [Required(ErrorMessage = InfrastructureConstants.User.LAST_NAME_REQUIRED_ERROR_MESSAGE)]
        public string LastName { get; set; } = null!;

        [Required(ErrorMessage = InfrastructureConstants.User.PHONE_NUMBER_REQUIRED_ERROR_MESSAGE)]
        [Phone(ErrorMessage = InfrastructureConstants.User.PHONE_NUMBER_VALIDATION_ERROR_MESSAGE)]
        public string PhoneNumber { get; set; } = null!;

        public byte[]? ProfilePicture { get; set; }

        [Required(ErrorMessage = InfrastructureConstants.User.EMAIL_REQUIRED_ERROR_MESSAGE)]
        [EmailAddress(ErrorMessage = InfrastructureConstants.User.EMAIL_VALIDATION_ERROR_MESSAGE)]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage =InfrastructureConstants.User.PASSWORDHASH_REQUIRED_ERROR_MESSAGE)]
        public string PasswordHash { get; set; } = null!;
    }
}
