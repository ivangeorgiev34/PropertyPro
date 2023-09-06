import { usernameValidation } from "./usernameValidation";

describe("Username validation", () => {

    test("should return: Username is required, when username length is zero", () => {
        const expectedResult = "Username is required";

        const actualResult = usernameValidation("");

        expect(actualResult).toBe(expectedResult);
    });

    test("should return empty string, when there is no error", () => {
        const expectedResult = "";

        const actualResult = usernameValidation("rehrr");

        expect(actualResult).toBe(expectedResult);
    });
});