import { passwordValidation } from "./passwordValidation";

describe("Password validation", () => {

    test("should return: Password is required, when password length is zero", () => {
        const expectedResult = "Password is required";

        const actualResult = passwordValidation("");

        expect(actualResult).toBe(expectedResult);
    });

    test("should return: Password must be at least 6 symbols, when password length is less than six", () => {
        const expectedResult = "Password must be at least 6 symbols";

        const actualResult = passwordValidation("rewg");

        expect(actualResult).toBe(expectedResult);
    });

    test("should return empty string, when there is no error", () => {
        const expectedResult = "";

        const actualResult = passwordValidation("qwertyu");

        expect(actualResult).toBe(expectedResult);
    });
});