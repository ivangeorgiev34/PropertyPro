export const townValidation = (town: string): string => {
    return town.length === 0 ? "Town is required" : "";
};