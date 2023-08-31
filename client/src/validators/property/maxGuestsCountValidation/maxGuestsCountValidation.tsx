export const maxGuestsCountValidation = (maxGuestsCount: number | string): string => {

    if (typeof (maxGuestsCount) === "string") {

        return Number.isInteger(Number.parseFloat(maxGuestsCount.toString())) === false ? "Max guests count must be a whole number"
            : Number.parseFloat(maxGuestsCount.toString()) <= 0 ? "Max guests count must be more than zero" : "";
    }

    return Number.isInteger(maxGuestsCount) === false ? "Max guests count must be a whole number"
        : maxGuestsCount <= 0
            ? "Max guests count must be more than zero"
            : "";
};