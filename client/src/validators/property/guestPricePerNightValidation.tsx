export const guestPricePerNightValidation = (guestPricePerNight: number | string): string => {
    console.log(typeof (guestPricePerNight));
    if (typeof (guestPricePerNight) === "string") {

        return Number.parseFloat(guestPricePerNight) < 0 ? "Guest price per night cannot be a negative number" : "";
    }
    return guestPricePerNight < 0 ? "Guest price per night cannot be a negative number" : "";
};