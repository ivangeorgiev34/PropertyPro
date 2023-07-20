export const lastNameValidation = (lastName: string): string => {

    const result = lastName.length === 0 ? "Last name is required" : "";

    return result;
};