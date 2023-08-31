import { guestsValidation } from "./guestsValidation";

describe("Guest validation", () => {

    test("should return: Guests must be a whole number, when grade is a floating point number and is passed as string",
        () => {
            const expectedResult = "Guests must be a whole number";

            const actualResult = guestsValidation("2.43");

            expect(actualResult).toBe(expectedResult);
        });

    test("should return: Guests must be more than zero, when grade is zero and is passed as string",
        () => {
            const expectedResult = "Guests must be more than zero";

            const actualResult = guestsValidation("0");

            expect(actualResult).toBe(expectedResult);
        });

    test("should return: Guests must be more than zero, when grade is less than zero and is passed as string",
        () => {
            const expectedResult = "Guests must be more than zero";

            const actualResult = guestsValidation("-2");

            expect(actualResult).toBe(expectedResult);
        });

    test("should return: Guests must be a whole number, when grade a floating point number",
        () => {
            const expectedResult = "Guests must be a whole number";

            const actualResult = guestsValidation(2.12);

            expect(actualResult).toBe(expectedResult);
        });

    test("should return: Guests must be more than zero, when grade is zero",
        () => {
            const expectedResult = "Guests must be more than zero";

            const actualResult = guestsValidation(0);

            expect(actualResult).toBe(expectedResult);
        });

    test("should return: Guests must be more than zero, when grade is less than zero",
        () => {
            const expectedResult = "Guests must be more than zero";

            const actualResult = guestsValidation(-3);

            expect(actualResult).toBe(expectedResult);
        });

    test("should return empty string when there is no error",
        () => {
            const expectedResult = "";

            const actualResult = guestsValidation(2);

            expect(actualResult).toBe(expectedResult);
        });
});