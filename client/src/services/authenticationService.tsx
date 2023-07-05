import { BASE_URL } from "../constants/constants";

export async function userLogin(email: string, password: string) {
    try {
        const response = await fetch(`${BASE_URL}/account/login`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const userJson = await response.json();

        return userJson;

    } catch (error) {
        console.log(error);

        return error;
    }
}