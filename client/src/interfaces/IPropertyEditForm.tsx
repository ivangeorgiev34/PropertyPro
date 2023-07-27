export default interface IPropertyEditForm {
    title: string,
    description: string,
    type: string,
    town: string,
    country: string,
    guestPricePerNight: number,
    maxGuestsCount: number,
    bedroomsCount: number,
    bedsCount: number,
    bathroomsCount: number,
    firstImage: File | null
}