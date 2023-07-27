import ILandlord from "./ILandlord"

export default interface IPropertyDetails {
    id: string,
    title: string,
    description: string | null,
    type: string,
    town: string,
    country: string,
    guestPricePerNight: number,
    maxGuestsCount: number,
    bedroomsCount: number,
    bedsCount: number,
    bathroomsCount: number,
    averageRating: number,
    reviewsCount: number,
    firstImage: string,
    secondImage: string | null,
    thirdImage: string | null
    landlord: ILandlord
}