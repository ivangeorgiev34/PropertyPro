export const middleNameValidation = (middleName: string): string => {

    const result = middleName.length === 0 ? "Middle name is required" : "";

    return result;
};