export const tokenExpiresValidation: Function = (tokenExpiration: string): boolean => {
    return new Date(tokenExpiration!).getTime() <= Date.now()
}