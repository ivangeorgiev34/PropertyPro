import { BASE_URL } from "../constants/constants";

export async function editProfile(userId: string, formData: FormData, token: string) {

    try {
        const response = await fetch(`${BASE_URL}/account/edit/${userId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        const responseJson = await response.json();

        return responseJson;

    } catch (error) {
        return error;
    }

}