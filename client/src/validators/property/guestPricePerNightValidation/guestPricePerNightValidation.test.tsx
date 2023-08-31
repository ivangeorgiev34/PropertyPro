import { guestPricePerNightValidation } from "./guestPricePerNightValidation";

describe("Guest price per night validation", () => {

    test("should return: Guest price per night cannot be a negative number, when price is less than zero and is passed as string", () => {
        const expectedResult = "Guest price per night cannot be a negative number";

        const actualResult = guestPricePerNightValidation("-2.32");

        expect(actualResult).toBe(expectedResult);
    });

    test("should return empty string, when there is no error and is passed as string", () => {
        const expectedResult = "";

        const actualResult = guestPricePerNightValidation("2.21");

        expect(actualResult).toBe(expectedResult);
    });

    test("should return: Guest price per night cannot be a negative number, when price is less than zero", () => {
        const expectedResult = "Guest price per night cannot be a negative number";

        const actualResult = guestPricePerNightValidation(-2.32);

        expect(actualResult).toBe(expectedResult);
    });

    test("should return empty string, when there is no error", () => {
        const expectedResult = "";

        const actualResult = guestPricePerNightValidation(2.21);

        expect(actualResult).toBe(expectedResult);
    });
});