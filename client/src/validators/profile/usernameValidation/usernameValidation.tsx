export const usernameValidation = (username: string): string => {

    return username.length === 0
        ? "Username is required"
        : "";

};