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

export async function editReviewById(reviewId: string, token: string, rating: number, description: string) {
    try {
        const response = await fetch(`${BASE_URL}/review/edit/${reviewId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                stars: rating,
                description: description
            })
        });

        const propertiesJson = await response.json();

        return propertiesJson;

    } catch (error) {
        return error;
    }
}

export async function createReview(token: string, propertyId: string, rating: number, description: string) {
    try {
        const response = await fetch(`${BASE_URL}/review/create/${propertyId}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                stars: rating,
                description: description
            })
        });

        const propertiesJson = await response.json();

        return propertiesJson;

    } catch (error) {
        return error;
    }
}