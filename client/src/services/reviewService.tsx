import { BASE_URL } from "../constants/constants";

export async function getPropertyReviews(propertyId: string, token: string) {
    try {
        const response = await fetch(`${BASE_URL}/property/${propertyId}/reviews`, {
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

export async function deleteReviewById(reviewId: string, token: string) {
    try {
        const response = await fetch(`${BASE_URL}/review/delete/${reviewId}`, {
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

export async function getReviewById(reviewId: string, token: string) {
    try {
        const response = await fetch(`${BASE_URL}/review/${reviewId}`, {
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