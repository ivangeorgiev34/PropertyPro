export const firstNameValidation = (firstName: string): string => {

    const result = firstName.length === 0 ? "First name is required" : "";

    return result;
};