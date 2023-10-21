import { townValidation } from "./townValidation";

describe("Town validation", () => {

    test("should return: Town is required, when town length is zero", () => {

        const expectedResult = "Town is required";

        const actualResult = townValidation("");

        expect(actualResult).toBe(expectedResult);
    });

    test("should return empty string, when there is no error", () => {

        const expectedResult = "";

        const actualResult = townValidation("tter");

        expect(actualResult).toBe(expectedResult);
    });
});