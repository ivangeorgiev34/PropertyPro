import { bathroomsCountValidation } from "./bathroomsCountValidation";

describe("Bathrooms count validation", () => {

    test("should return: Bathrooms count must be a whole number, when number is a floating point type and is passed as string",
        () => {
            const expectedResult = "Bathrooms count must be a whole number";

            const actualResult = bathroomsCountValidation("2.22");

            expect(actualResult).toBe(expectedResult);
        });

    test("should return: Bathrooms count must be more than zero, when number is zero and is passed as string",
        () => {
            const expectedResult = "Bathrooms count must be more than zero";

            const actualResult = bathroomsCountValidation("0");

            expect(actualResult).toBe(expectedResult);
        });

    test("should return: Bathrooms count must be more than zero, when number is less than zero and is passed as string",
        () => {
            const expectedResult = "Bathrooms count must be more than zero";

            const actualResult = bathroomsCountValidation("-1");

            expect(actualResult).toBe(expectedResult);
        });

    test("should return empty string when there is no error and is passed as string",
        () => {
            const expectedResult = "";

            const actualResult = bathroomsCountValidation("2");

            expect(actualResult).toBe(expectedResult);
        });

    test("should return: Bathrooms count must be a whole number, when number is a floating point type",
        () => {
            const expectedResult = "Bathrooms count must be a whole number";

            const actualResult = bathroomsCountValidation(2.22);

            expect(actualResult).toBe(expectedResult);
        });

    test("should return: Bathrooms count must be more than zero, when number is zero",
        () => {
            const expectedResult = "Bathrooms count must be more than zero";

            const actualResult = bathroomsCountValidation(0);

            expect(actualResult).toBe(expectedResult);
        });

    test("should return: Bathrooms count must be more than zero, when number is less than zero",
        () => {
            const expectedResult = "Bathrooms count must be more than zero";

            const actualResult = bathroomsCountValidation(-1);

            expect(actualResult).toBe(expectedResult);
        });

    test("should return empty string when there is no error",
        () => {
            const expectedResult = "";

            const actualResult = bathroomsCountValidation(2);

            expect(actualResult).toBe(expectedResult);
        });

});