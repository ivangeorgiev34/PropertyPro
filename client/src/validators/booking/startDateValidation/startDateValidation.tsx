export const startDateValidation = (startDate: string, endDate: string): string => {

    if (Number.isNaN(Date.parse(startDate))) {
        return "Invalid date, fill the fields that are missing"
    }

    if (Date.parse("2025-01-01") <= Date.parse(startDate)) {
        return "Date must be before 1st of January 2025";
    } else if (Date.parse("2023-09-01") >= Date.parse(startDate)) {
        return "Date must be after 1st of September 2023";
    }

    if (Date.parse(startDate) >= Date.parse(endDate)) {
        return "Start date must be before end date";
    }

    return "";
};