export const bathroomsCountValidation = (bathroomsCount: number | string): string => {
    if (typeof (bathroomsCount) === "string") {

        return Number.isInteger(Number.parseFloat(bathroomsCount.toString())) === false
            ? "Bathrooms count must be a whole number"
            : Number.parseFloat(bathroomsCount.toString()) <= 0
                ? "Bathrooms count must be more than zero"
                : "";
    }

    return Number.isInteger(bathroomsCount) === false
        ? "Bathrooms count must be a whole number"
        : bathroomsCount <= 0
            ? "Bathrooms count must be more than zero"
            : "";
};