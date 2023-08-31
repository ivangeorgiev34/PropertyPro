export const bedroomsCountValidation = (bedroomsCount: number | string): string => {
    if (typeof (bedroomsCount) === "string") {

        return Number.isInteger(Number.parseFloat(bedroomsCount.toString())) === false
            ? "Bedrooms count must be a whole number"
            : Number.parseFloat(bedroomsCount.toString()) <= 0
                ? "Bedrooms count must be more than zero"
                : "";
    }

    return Number.isInteger(bedroomsCount) === false
        ? "Bedrooms count must be a whole number"
        : bedroomsCount <= 0
            ? "Bedrooms count must be more than zero"
            : "";
};