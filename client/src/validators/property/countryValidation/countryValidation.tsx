export const countryValidation = (country: string): string => {
    return country.length === 0 ? "Country is required" : "";
};