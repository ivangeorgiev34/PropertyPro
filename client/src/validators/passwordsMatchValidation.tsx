export const passwordsMatchValidation = (password: string, confirmPassword: string): string => {

    return password !== confirmPassword
        ? "Passwords are not the same"
        : "";
};