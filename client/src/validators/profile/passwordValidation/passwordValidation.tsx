export const passwordValidation = (password: string): string => {

    const result = password.length === 0
        ? "Password is required"
        : password.length < 6
            ? "Password must be at least 6 symbols"
            : "";

    return result;
};