import { startDateValidation } from "./startDateValidation";

describe("Start date validation", () => {

    test("should return: Invalid date, fill the fields that are missing, when start date is NaN",
        () => {
            const expectedResult = "Invalid date, fill the fields that are missing";

            const actualResult = startDateValidation("2024-10-00", "2024-10-11");

            expect(actualResult).toBe(expectedResult);
        });

    test("should return: Date must be before 1st of January 2025, when start date is before 1st of January 2025",
        () => {
            const expectedResult = "Date must be before 1st of January 2025";

            const actualResult = startDateValidation("2025-10-10", "2024-10-11");

            expect(actualResult).toBe(expectedResult);
        });

    test("should return: Date must be after 1st of September 2023, when start date is after 1st of September 2023",
        () => {
            const expectedResult = "Date must be after 1st of September 2023";

            const actualResult = startDateValidation("2022-10-10", "2024-10-11");

            expect(actualResult).toBe(expectedResult);
        });

    test("should return: Start date must be before end date, when start date is after end date",
        () => {
            const expectedResult = "Start date must be before end date";

            const actualResult = startDateValidation("2024-10-12", "2024-10-11");

            expect(actualResult).toBe(expectedResult);
        });

    test("should return empty string when there is no error",
        () => {
            const expectedResult = "";

            const actualResult = startDateValidation("2024-10-12", "2024-10-13");

            expect(actualResult).toBe(expectedResult);
        });
});