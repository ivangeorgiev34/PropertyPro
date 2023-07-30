export const propertyTitleValidation = (title: string): string => {
    console.log(title);
    return title.length === 0
        ? "Title is required"
        : title.length > 80
            ? "Title cannot be more than 80 symbols"
            : "";
};