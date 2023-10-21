import { tokenExpiresValidation } from "./tokenExpiresValidation";

describe("Token expires validation", () => {

    test("should return true, when token expiration time is equal to date.now", () => {
        const expectedResult = true;

        const actualResult = tokenExpiresValidation(new Date(Date.now()).toString());

        expect(actualResult).toBe(expectedResult);
    });

    test("should return true, when token expiration time is less than date.now", () => {
        const expectedResult = true;

        const actualResult = tokenExpiresValidation("2023-08-30");

        expect(actualResult).toBe(expectedResult);
    });

    test("should return false, when token expiration time is bigger than date.now", () => {
        const expectedResult = false;

        const actualResult = tokenExpiresValidation("2023-09-10");

        expect(actualResult).toBe(expectedResult);
    });
});