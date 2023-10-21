import { emailValidation } from "./emailValidation";

describe("Email validation", () => {

    test("should return: Email is required, when email length is zero", () => {

        const expectedResult = "Email is required";

        const actualResult = emailValidation("");

        expect(actualResult).toBe(expectedResult);
    });

    test("should return: Invalid email, when email is invalid", () => {

        const expectedResult = "Invalid email";

        const actualResult = emailValidation("peshoabvbg");

        expect(actualResult).toBe(expectedResult);
    });

    test("should return empty string, when there is no error", () => {

        const expectedResult = "";

        const actualResult = emailValidation("pesho@abv.bg");

        expect(actualResult).toBe(expectedResult);
    });
});