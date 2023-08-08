import { json } from "react-router-dom";
import { BASE_URL } from "../constants/constants";
import IBookPropertyForm from "../interfaces/booking/IBookPropertyForm";
import IBookingEditForm from "../interfaces/booking/IBookingEditForm";

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

export async function editBookingById(id: string, formValues: IBookingEditForm, token: string) {
    try {
        const response = await fetch(`${BASE_URL}/booking/edit/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "content-type": "application/json"
            },
            body: JSON.stringify(formValues)
        });

        const responseJson = await response.json();

        return responseJson;

    } catch (error) {
        return error;
    }
}

export async function getUsersBookingsBySearch(token: string, searchTerm: string, searchValue: string) {
    try {
        const response = await fetch(`${BASE_URL}/booking/bookings/search?${searchTerm}=${searchValue}`, {
            method: "GET",
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