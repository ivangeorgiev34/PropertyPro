import { endDateValidation } from "./endDateValidation";

describe("End date validation", () => {

    test("should return: Invalid date, fill the fields that are missing, when end date is a NaN", () => {

        const expectedResult = "Invalid date, fill the fields that are missing";

        const actualResult = endDateValidation("2025-10-10", "2025-00-00");

        expect(actualResult).toBe(expectedResult);
    });

    test("should return: Date must be before 1st of January 2025, when end date is before 1st of January 2025",
        () => {

            const expectedResult = "Date must be before 1st of January 2025";

            const actualResult = endDateValidation("2025-10-10", "2025-10-10");

            expect(actualResult).toBe(expectedResult);
        });

    test("should return: Date must be after 1st of September 2023, when end date is after 1st of September 2023",
        () => {

            const expectedResult = "Date must be after 1st of September 2023";

            const actualResult = endDateValidation("2025-10-10", "2022-10-10");

            expect(actualResult).toBe(expectedResult);
        });

    test("should return: Start date must be before end date, when start date date is after end date",
        () => {

            const expectedResult = "Start date must be before end date";

            const actualResult = endDateValidation("2024-12-12", "2024-10-10");

            expect(actualResult).toBe(expectedResult);
        });

    test("should return empty string when there is no error",
        () => {

            const expectedResult = "";

            const actualResult = endDateValidation("2024-12-12", "2024-12-13");

            expect(actualResult).toBe(expectedResult);
        });
});