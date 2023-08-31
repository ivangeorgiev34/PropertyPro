export const ageValidation = (age: number): string => {

    const result = age.toString().length === 0
        ? "Age is required"
        : Number.isInteger(Number.parseFloat(age.toString())) === false
            ? "Age should be a whole number"
            : age <= 0
                ? "Age should be a positive number"
                : "";

    return result;
};