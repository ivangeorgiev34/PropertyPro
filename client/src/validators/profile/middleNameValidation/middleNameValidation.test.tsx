import { middleNameValidation } from "./middleNameValidation";

describe("Middle name validation", () => {

    test("should return: Middle name is required, when middle name length is zero", () => {
        const expectedResult = "Middle name is required";

        const actualResult = middleNameValidation("");

        expect(actualResult).toBe(expectedResult);
    });

    test("should return empty string, when there is no error", () => {
        const expectedResult = "";

        const actualResult = middleNameValidation("rhre");

        expect(actualResult).toBe(expectedResult);
    });
});