import { BASE_URL } from "../constants/constants";
import IRegisterForm from "../interfaces/IRegisterForm";

export async function userLogin(email: string, password: string) {
  try {
    const response = await fetch(`${BASE_URL}/account/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const userJson = await response.json();

    return userJson;
  } catch (error) {
    return error;
  }
}

export async function userRegister(formValues: IRegisterForm, role: string) {
  try {
    const postMethod = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(formValues),
    };

    const response = await fetch(
      `${BASE_URL}/account/register/${role.toLowerCase()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      }
    );

    const responseJson = response.json();

    return responseJson;
  } catch (error) {
    return error;
  }
}
