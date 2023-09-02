import { firstNameValidation } from "./firstNameValidation";

describe("First name validation", () => {

    test("should return: First name is required, when first name length is zero", () => {
        const expectedResult = "First name is required";

        const actualResult = firstNameValidation("");

        expect(actualResult).toBe(expectedResult);
    });

    test("should return empty string, when there is no error", () => {
        const expectedResult = "";

        const actualResult = firstNameValidation("rthrt");

        expect(actualResult).toBe(expectedResult);
    });
});