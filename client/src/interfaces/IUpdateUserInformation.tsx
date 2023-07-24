export default interface IUpdateUserInformation {
    firstName: string,
    middleName: string,
    lastName: string,
    gender: string | null,
    profilePicture: string | null,
    age: number
}