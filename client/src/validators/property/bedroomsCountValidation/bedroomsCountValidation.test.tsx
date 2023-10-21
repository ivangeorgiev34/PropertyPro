import { bedroomsCountValidation } from "./bedroomsCountValidation";

describe("Bedrooms count validation", () => {

    test("should return: Bedrooms count must be a whole number, when number is floating point type and is passed as string",
        () => {
            const expectedResult = "Bedrooms count must be a whole number";

            const actualResult = bedroomsCountValidation("2.12");

            expect(actualResult).toBe(expectedResult);
        });

    test("should return: Bedrooms count must be more than zero, when number is zero and is passed as string",
        () => {
            const expectedResult = "Bedrooms count must be more than zero";

            const actualResult = bedroomsCountValidation("0");

            expect(actualResult).toBe(expectedResult);
        });

    test("should return: Bedrooms count must be more than zero, when number is less than zero and is passed as string",
        () => {
            const expectedResult = "Bedrooms count must be more than zero";

            const actualResult = bedroomsCountValidation("-1");

            expect(actualResult).toBe(expectedResult);
        });

    test("should return empty string, when there is no error and is passed as string",
        () => {
            const expectedResult = "";

            const actualResult = bedroomsCountValidation("2");

            expect(actualResult).toBe(expectedResult);
        });

    test("should return: Bedrooms count must be a whole number, when number is floating point type",
        () => {
            const expectedResult = "Bedrooms count must be a whole number";

            const actualResult = bedroomsCountValidation(2.12);

            expect(actualResult).toBe(expectedResult);
        });

    test("should return: Bedrooms count must be more than zero, when number is zero",
        () => {
            const expectedResult = "Bedrooms count must be more than zero";

            const actualResult = bedroomsCountValidation(0);

            expect(actualResult).toBe(expectedResult);
        });

    test("should return: Bedrooms count must be more than zero, when number is less than zero",
        () => {
            const expectedResult = "Bedrooms count must be more than zero";

            const actualResult = bedroomsCountValidation(-1);

            expect(actualResult).toBe(expectedResult);
        });

    test("should return empty string, when there is no error",
        () => {
            const expectedResult = "";

            const actualResult = bedroomsCountValidation(2);

            expect(actualResult).toBe(expectedResult);
        });


});