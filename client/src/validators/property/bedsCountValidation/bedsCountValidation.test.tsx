import { bedsCountValidation } from "./bedsCountValidation";

describe("Beds count validation", () => {

    test("should return: Beds count must be a whole number, when beds count is a floating type and is passed as string", () => {
        const expectedResult = "Beds count must be a whole number";

        const actualResult = bedsCountValidation("2.32");

        expect(actualResult).toBe(expectedResult);
    });

    test("should return: Beds count must be more than zero, when beds count is zero and is passed as string", () => {
        const expectedResult = "Beds count must be more than zero";

        const actualResult = bedsCountValidation("0");

        expect(actualResult).toBe(expectedResult);
    });

    test("should return: Beds count must be more than zero, when beds count is less than zero and is passed as string", () => {
        const expectedResult = "Beds count must be more than zero";

        const actualResult = bedsCountValidation("-1");

        expect(actualResult).toBe(expectedResult);
    });

    test("should return empty string, when there is no error and is passed as string", () => {
        const expectedResult = "";

        const actualResult = bedsCountValidation("2");

        expect(actualResult).toBe(expectedResult);
    });

    test("should return: Beds count must be a whole number, when beds count is a floating type", () => {
        const expectedResult = "Beds count must be a whole number";

        const actualResult = bedsCountValidation(2.32);

        expect(actualResult).toBe(expectedResult);
    });

    test("should return: Beds count must be more than zero, when beds count is zero", () => {
        const expectedResult = "Beds count must be more than zero";

        const actualResult = bedsCountValidation(0);

        expect(actualResult).toBe(expectedResult);
    });

    test("should return: Beds count must be more than zero, when beds count is less than zero", () => {
        const expectedResult = "Beds count must be more than zero";

        const actualResult = bedsCountValidation(-1);

        expect(actualResult).toBe(expectedResult);
    });

    test("should return empty string, when there is no error", () => {
        const expectedResult = "";

        const actualResult = bedsCountValidation(2);

        expect(actualResult).toBe(expectedResult);
    });
});