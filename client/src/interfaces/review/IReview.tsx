import ITenant from "../ITenant";

export default interface IReview {
    id: string,
    stars: number,
    description: string,
    tenant: ITenant
}