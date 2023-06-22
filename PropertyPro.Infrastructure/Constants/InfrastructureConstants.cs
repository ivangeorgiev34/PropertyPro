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
            public const string MIDDLE_NAME_REQUIRED_ERROR_MESSAGE = "Last name is required";
            public const int AGE_MIN_VALUE = 18;
            public const int AGE_MAX_VALUE = 150;
            public const string AGE_REQUIRED_ERROR_MESSAGE = "Age is required";
        }

        public static class Booking
        {
            public const string BOOKING_START_DATE_REQUIRED_ERROR_MESSAGE = "Start date is required";
            public const string BOOKING_END_DATE_REQUIRED_ERROR_MESSAGE = "End date is required";
            public const string BOOKING_GUESTS_REQUIRED_ERROR_MESSAGE = "Guests are required";
            public const string BOOKING_TENANT_REQUIRED_ERROR_MESSAGE = "Every booking must have a tenant";
            public const string BOOKING_PROPERTY_REQUIRED_ERROR_MESSAGE = "Every booking must have a property";
        }

        public static class Property
        {
            public const string PROPERTY_TYPE_REQUIRED_ERROR_MESSAGE = "Property type is required";
            public const string PROPERTY_MAX_GUESTS_COUNT_REQUIRED_ERROR_MESSAGE = "Max guests count is required";
            public const string PROPERTY_BEDROOMS_COUNT_REQUIRED_ERROR_MESSAGE = "Bedrooms count is required";
            public const string PROPERTY_BEDS_COUNT_REQUIRED_ERROR_MESSAGE = "Beds count is required";
            public const string PROPERTY_BATHROOMS_COUNT_REQUIRED_ERROR_MESSAGE = "Bathrooms count is required";
            public const string PROPERTY_TITLE_REQUIRED_ERROR_MESSAGE = "Title is required";
            public const int PROPERTY_TITLE_MAX_LENGTH_ERROR_MESSAGE =  80;
            public const string PROPERTY_LANDLORD_REQUIRED_ERROR_MESSAGE = "Every property must have a landlord";
            public const string PROPERTY_TOWN_REQUIRED_ERROR_MESSAGE = "Town is required";
            public const string PROPERTY_COUNTRY_REQUIRED_ERROR_MESSAGE = "Country is required";
            public const string PROPERTY_FIRST_IMAGE_REQUIRED_ERROR_MESSAGE = "First image is required";
        }

        public static class Review
        {
            public const string REVIEW_STARS_REQUIRED_ERROR_MESSAGE = "Stars are required";
            public const double REVIEW_STARS_MIN_VALUE_ERROR_MESSAGE = 0;
            public const double REVIEW_STARS_MAX_VALUE_ERROR_MESSAGE = 5;
            public const string REVIEW_PROPERTY_REQUIRED_ERROR_MESSAGE = "Every review must have a property";
            public const string REVIEW_TENANT_REQUIRED_ERROR_MESSAGE = "Every review must have a tenant";
        }

        public static class LoginDto
        {
            public const string LOGIN_DTO_EMAIL_REQUIRED_ERROR_MESSAGE = "Email is required";
            public const string LOGIN_DTO_EMAIL_INVALID_ERROR_MESSAGE = "Invalid email";

            public const string LOGIN_DTO_PASSWORD_REQUIRED_ERROR_MESSAGE = "Password is required";
        }

        public static class RegisterDto
        {
            public const string REGISTER_DTO_PASSWORDS_MATCH_ERROR_MESSAGE = "Passwords do not match";
            public const string REGISTER_DTO_PHONE_INVALID_ERROR_MESSAGE = "Invalid phone number";
        }
    }
}
