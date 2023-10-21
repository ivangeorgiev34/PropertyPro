import { passwordsMatchValidation } from "./passwordsMatchValidation";

describe("Passwords match validation", () => {

    test("should return: Passwords are not the same, when passwords are not the same", () => {
        const expectedResult = "Passwords are not the same";

        const actualResult = passwordsMatchValidation("reg", "ewrgwe");

        expect(actualResult).toBe(expectedResult);
    });

    test("should return empty string, when there is no error", () => {
        const expectedResult = "";

        const actualResult = passwordsMatchValidation("reg", "reg");

        expect(actualResult).toBe(expectedResult);
    });
});