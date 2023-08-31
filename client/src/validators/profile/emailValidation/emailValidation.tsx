export const emailValidation = (email: string): string => {

    const result = email.length === 0
        ? "Email is required"
        : new RegExp('^[A-Za-z0-9_\.]+@[A-Za-z]+\.[A-Za-z]{2,3}$').test(email) === false
            ? "Invalid email"
            : "";

    return result;
};