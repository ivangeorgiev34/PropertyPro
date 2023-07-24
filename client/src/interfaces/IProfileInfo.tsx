export default interface IProfileInfo {
    id: string,
    firstName: string,
    middleName: string,
    lastName: string,
    email: string,
    gender: string | null,
    profilePicture: string | null,
    phoneNumber: string,
    age: number
}