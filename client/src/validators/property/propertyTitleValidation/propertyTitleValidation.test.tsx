import { propertyTitleValidation } from "./propertyTitleValidation";

describe("Property title validation", () => {

    test("should return: Title is required, when title length is zero", () => {
        const expectedResult = "Title is required";

        const actualResult = propertyTitleValidation("");

        expect(actualResult).toBe(expectedResult);
    });

    test("should return: Title cannot be more than 80 symbols, when title length is more than 80", () => {
        const expectedResult = "Title cannot be more than 80 symbols";

        const actualResult = propertyTitleValidation("ncmmrtbyenquwuzvaibxwgrqczebridfdtdbpztvdunjgnvuynxyazyigbnvgvpvnyattjapkfzyggnfr");

        expect(actualResult).toBe(expectedResult);
    });

    test("should return empty string, when there is no error", () => {
        const expectedResult = "";

        const actualResult = propertyTitleValidation("rthtrtr");

        expect(actualResult).toBe(expectedResult);
    });
});