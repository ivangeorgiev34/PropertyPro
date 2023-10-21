import { countryValidation } from "./countryValidation";

describe("Country validation", () => {

    test("should return: Country is required, when country length is zero", () => {
        const expectedResult = "Country is required";

        const actualResult = countryValidation("");

        expect(actualResult).toBe(expectedResult);
    });

    test("should return empty string, when there is no error", () => {
        const expectedResult = "";

        const actualResult = countryValidation("trre");

        expect(actualResult).toBe(expectedResult);
    });
});