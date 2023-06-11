using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PropertyPro.Infrastructure.Constants
{
    public static class InfrastructureConstants
    {
        public static class User
        {
            public const string FIRST_NAME_REQUIRED_ERROR_MESSAGE = "First name is required";
            public const string LAST_NAME_REQUIRED_ERROR_MESSAGE = "Last name is required";
            public const string EMAIL_REQUIRED_ERROR_MESSAGE = "Email is required";
            public const string EMAIL_VALIDATION_ERROR_MESSAGE = "Invalid email";
            public const string PASSWORDHASH_REQUIRED_ERROR_MESSAGE = "Password is required";

        }

        public static class Booking
        {
            public const string BOOKING_START_DATE_REQUIRED_ERROR_MESSAGE = "Start date is required";
            public const string BOOKING_END_DATE_REQUIRED_ERROR_MESSAGE = "End date is required";
            public const string BOOKING_GUESTS_REQUIRED_ERROR_MESSAGE = "Guests are required";
        }
    }
}
