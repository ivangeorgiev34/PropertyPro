import { BASE_URL } from "../constants/constants";
import IBookPropertyForm from "../interfaces/booking/IBookPropertyForm";

export async function createBooking(propertyId: string, token: string, formValues: IBookPropertyForm) {
    try {
        const response = await fetch(`${BASE_URL}/booking/create/${propertyId}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formValues)
        });

        const responseJson = await response.json();

        return responseJson;

    } catch (error) {
        return error;
    }
}

export async function getUsersBookings(token: string) {
    try {
        const response = await fetch(`${BASE_URL}/booking/bookings`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });

        const responseJson = await response.json();

        return responseJson;

    } catch (error) {
        return error;
    }
}

export async function deleteBookingById(id: string, token: string) {
    try {
        const response = await fetch(`${BASE_URL}/booking/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const responseJson = await response.json();

        return responseJson;

    } catch (error) {
        return error;
    }
}

export async function getBookingById(id: string, token: string) {
    try {
        const response = await fetch(`${BASE_URL}/booking/bookings/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });

        const responseJson = await response.json();

        return responseJson;

    } catch (error) {
        return error;
    }
}