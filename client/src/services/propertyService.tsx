import { BASE_URL } from "../constants/constants";

export async function getLandlordsProperties(userId: string, token: string) {
    try {
        const response = await fetch(`${BASE_URL}/property/properties/${userId}`, {
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