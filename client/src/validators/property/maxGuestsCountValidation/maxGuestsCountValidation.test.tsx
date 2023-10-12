import { maxGuestsCountValidation } from "./maxGuestsCountValidation";

describe("Max guests count validation", () => {

    test("should return: Max guests count must be a whole number, when guests count is a floating point type and is passed as string",
        () => {

            const expectedResult = "Max guests count must be a whole number";

            const actualResult = maxGuestsCountValidation("2.12");

            expect(actualResult).toBe(expectedResult);
        });

    test("should return: Max guests count must be more than zero, when guests count is zero and is passed as string",
        () => {

            const expectedResult = "Max guests count must be more than zero";

            const actualResult = maxGuestsCountValidation("0");

            expect(actualResult).toBe(expectedResult);
        });

    test("should return: Max guests count must be more than zero, when guests count is less than zero and is passed as string",
        () => {

            const expectedResult = "Max guests count must be more than zero";

            const actualResult = maxGuestsCountValidation("-2");

            expect(actualResult).toBe(expectedResult);
        });

    test("should return empty string, when there is no error and is passed as string",
        () => {

            const expectedResult = "";

            const actualResult = maxGuestsCountValidation("2");

            expect(actualResult).toBe(expectedResult);
        });

    test("should return: Max guests count must be a whole number, when guests count is a floating point type",
        () => {

            const expectedResult = "Max guests count must be a whole number";

            const actualResult = maxGuestsCountValidation(2.12);

            expect(actualResult).toBe(expectedResult);
        });

    test("should return: Max guests count must be more than zero, when guests count is zero",
        () => {

            const expectedResult = "Max guests count must be more than zero";

            const actualResult = maxGuestsCountValidation(0);

            expect(actualResult).toBe(expectedResult);
        });

    test("should return: Max guests count must be more than zero, when guests count is less than zero",
        () => {

            const expectedResult = "Max guests count must be more than zero";

            const actualResult = maxGuestsCountValidation(-2);

            expect(actualResult).toBe(expectedResult);
        });

    test("should return empty string, when there is no error",
        () => {

            const expectedResult = "";

            const actualResult = maxGuestsCountValidation(2);

            expect(actualResult).toBe(expectedResult);
        });
});