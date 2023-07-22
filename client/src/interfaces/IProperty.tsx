export default interface IProperty {
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
    firstImage: string,
    secondImage: string | null,
    thirdImage: string | null
};