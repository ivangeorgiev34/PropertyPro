export const phoneNumberValidation = (phoneNumber: string): string => {

    const result = phoneNumber.length === 0
        ? "Phone number is required"
        : new RegExp('^0[0-9]{9}$').test(phoneNumber) === false
            ? "Invalid phone number"
            : "";

    return result;
};