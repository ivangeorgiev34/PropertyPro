import { phoneNumberValidation } from "./phoneNumberValidation";

describe("Phone number validation", () => {

    test("should return: Phone number is required, when phone number length is zero", () => {
        const expectedResult = "Phone number is required";

        const actualResult = phoneNumberValidation("");

        expect(actualResult).toBe(expectedResult);
    });

    test("should return: Invalid phone number, when phone number is invalid", () => {
        const expectedResult = "Invalid phone number";

        const actualResult = phoneNumberValidation("08785454321");

        expect(actualResult).toBe(expectedResult);
    });

    test("should return empty string, when there is no error", () => {
        const expectedResult = "";

        const actualResult = phoneNumberValidation("0878545432");

        expect(actualResult).toBe(expectedResult);
    });
});