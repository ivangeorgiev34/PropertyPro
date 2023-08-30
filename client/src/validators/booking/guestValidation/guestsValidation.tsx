export const guestsValidation = (guests: number | string): string => {

    if (typeof (guests) === "string") {

        return Number.isInteger(Number.parseFloat(guests.toString())) === false
            ? "Guests must be a whole number"
            : Number.parseFloat(guests.toString()) <= 0
                ? "Guests must be more than zero"
                : "";
    }

    return Number.isInteger(guests) === false
        ? "Guests must be a whole number"
        : guests <= 0
            ? "Guests must be more than zero"
            : "";
}