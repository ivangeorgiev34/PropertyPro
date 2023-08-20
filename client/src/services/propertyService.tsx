import { BASE_URL } from "../constants/constants";
import IPropertyCreateForm from "../interfaces/IPropertyCreateForm";

export async function getLandlordsProperties(userId: string, token: string, page: number) {
    try {
        const response = await fetch(`${BASE_URL}/property/properties/${userId}?page=${page}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const propertiesJson = await response.json();

        return propertiesJson;

    } catch (error) {
        return error;
    }
}

export async function getLandlordPropertyById(propertyId: string, token: string) {
    try {
        const response = await fetch(`${BASE_URL}/property/${propertyId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const propertiesJson = await response.json();

        return propertiesJson;

    } catch (error) {
        return error;
    }
}

export async function deletePropertyById(propertyId: string, token: string) {
    try {
        const response = await fetch(`${BASE_URL}/property/delete/${propertyId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const propertiesJson = await response.json();

        return propertiesJson;

    } catch (error) {
        return error;
    }
}

export async function editPropertyById(propertyId: string, formData: FormData, token: string) {
    try {
        const response = await fetch(`${BASE_URL}/property/edit/${propertyId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        const propertiesJson = await response.json();

        return propertiesJson;

    } catch (error) {
        return error;
    }
}

export async function createProperty(token: string, formData: FormData) {
    try {
        const response = await fetch(`${BASE_URL}/property/create`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        const propertiesJson = await response.json();

        return propertiesJson;

    } catch (error) {
        return error;
    }
}

export async function getAllProperties(token: string, page: number) {
    try {
        const response = await fetch(`${BASE_URL}/property/properties?page=${page}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const propertiesJson = await response.json();

        return propertiesJson;

    } catch (error) {
        return error;
    }
}

export async function getPropertiesBySearch(token: string, searchTerm: string, searchValue: string, page: number) {
    try {
        const response = await fetch(`${BASE_URL}/property/properties/search?${searchTerm}=${searchValue}&page=${page}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const propertiesJson = await response.json();

        return propertiesJson;

    } catch (error) {
        return error;
    }
}

export async function getAllPropertiesBySearch(token: string, searchTerm: string, searchValue: string, page: number) {
    try {
        const response = await fetch(`${BASE_URL}/property/properties/all/search?${searchTerm}=${searchValue}&page=${page}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const propertiesJson = await response.json();

        return propertiesJson;

    } catch (error) {
        return error;
    }
}