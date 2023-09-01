import { ageValidation } from "./ageValidation";

describe("Age validation", () => {

    test("should return: Age should be a whole number, when age is a floating type number", () => {
        const expectedResult = "Age should be a whole number";

        const actualResult = ageValidation(2.32);

        expect(actualResult).toBe(expectedResult);
    });

    test("should return: Age should be a positive number, when age is zero", () => {
        const expectedResult = "Age should be a positive number";

        const actualResult = ageValidation(0);

        expect(actualResult).toBe(expectedResult);
    });

    test("should return: Age should be a positive number, when age is less than zero", () => {
        const expectedResult = "Age should be a positive number";

        const actualResult = ageValidation(-1);

        expect(actualResult).toBe(expectedResult);
    });

    test("should return empty string, when there is no error", () => {
        const expectedResult = "";

        const actualResult = ageValidation(2);

        expect(actualResult).toBe(expectedResult);
    });
});