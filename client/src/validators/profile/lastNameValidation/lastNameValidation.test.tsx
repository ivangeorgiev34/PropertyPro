import { lastNameValidation } from "./lastNameValidation";

describe("Last name validation", () => {

    test("should return: Last name is required, when last name length is zero", () => {
        const expectedResult = "Last name is required";

        const actualResult = lastNameValidation("");

        expect(actualResult).toBe(expectedResult);
    });

    test("should return empty string, when there is no error", () => {
        const expectedResult = "";

        const actualResult = lastNameValidation("rtht");

        expect(actualResult).toBe(expectedResult);
    });
});