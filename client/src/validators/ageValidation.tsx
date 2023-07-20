export const ageValidation = (age: number): string => {

    const result = age.toString().length === 0
        ? "Age is required"
        : age <= 0
            ? "Age should be a positive number"
            : "";

    return result;
};