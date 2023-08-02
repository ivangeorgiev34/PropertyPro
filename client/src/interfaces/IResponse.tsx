export default interface IResponse<T> {
    status: string,
    message: string,
    content?: T | null
}