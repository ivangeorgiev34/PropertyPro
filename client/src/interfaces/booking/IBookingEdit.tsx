import IProperty from "../IProperty";
import ITenant from "../ITenant";

export default interface IBookingEdit {
    id: string,
    startDate: string,
    endDate: string,
    guests: number,
    tenant: ITenant,
    property: IProperty
}