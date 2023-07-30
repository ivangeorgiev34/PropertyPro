export const bedsCountValidation = (bedsCount: number | string): string => {
    if (typeof (bedsCount) === "string") {

        return Number.isInteger(Number.parseFloat(bedsCount.toString())) === false
            ? "Beds count must be a whole number"
            : Number.parseFloat(bedsCount.toString()) <= 0
                ? "Beds count must be more than zero"
                : "";
    }

    return Number.isInteger(bedsCount) === false
        ? "Beds count must be a whole number"
        : bedsCount <= 0
            ? "Beds count must be more than zero"
            : "";
};