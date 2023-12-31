import { act } from "react-dom/test-utils";
import { store } from "../../store/store";
import { login, logout } from "../../store/auth";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter, MemoryRouter, Route, Routes, useParams } from "react-router-dom";
import { ProfileEdit } from "./ProfileEdit";
import * as profileService from "../../services/profileService";
import { RouteObject } from "react-router-dom";

describe("Profile edit", () => {
    beforeEach(() => {
        const newPath = "/profile/edit/9912f704-ad61-465d-9d2b-0e78d8a16307";

        const newURL = window.location.origin + newPath;

        history.pushState({}, '', newURL);
    });

    afterEach(() => {
        jest.clearAllMocks();

        act(() => {
            store.dispatch(logout());
        });
    });

    test("should redirect to unauthorized page url upon render", () => {
        act(() => {
            store.dispatch(login({
                id: "9912f704-ad61-465d-9d2b-0e78d8a16307",
                role: "Landlord"
            }));
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <ProfileEdit />
                </BrowserRouter>
            </Provider>
        );

        const expectedResult = "http://localhost/unauthorized";

        expect(window.location.href).toBe(expectedResult);
    });

    test("should set initial profile information upon render", () => {
        act(() => {
            store.dispatch(login({
                id: "9912f704-ad61-465d-9d2b-0e78d8a16307",
                role: "Landlord",
                firstName: "ivan",
                middleName: "petrov",
                lastName: "georgiev",
                gender: "Male",
                age: 20
            }));
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <ProfileEdit />
                </BrowserRouter>
            </Provider>
        );

        const firstNameInput = screen.getAllByRole("textbox")[0] as HTMLInputElement;

        const expectedResult = "ivan";

        expect(firstNameInput.value).toBe(expectedResult);
    });

    test("edit profile form submit should redirect to profile information page url", async () => {
        act(() => {
            store.dispatch(login({
                id: "9912f704-ad61-465d-9d2b-0e78d8a16307",
                role: "Landlord",
                firstName: "ivan",
                middleName: "petrov",
                lastName: "georgiev",
                gender: "Male",
                age: 20
            }));
        });

        jest.spyOn(profileService, "editProfile")
            .mockResolvedValueOnce({
                status: "Success",
                content: {
                    user: {
                        firstName: "ivan",
                        middleName: "petrov",
                        lastName: "ivanov",
                        age: 23,
                        profilePicture: "",
                        gender: "male"
                    }
                }
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/profile/edit/:userId" element={<ProfileEdit />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        );

        const editProfileEdit = screen.getByTestId("edit-profile-form");
        act(() => {
            fireEvent.submit(editProfileEdit);
        });

        const expectedResult = "/profile/9912f704-ad61-465d-9d2b-0e78d8a16307";

        await waitFor(() => {
            expect(window.location.pathname).toBe(expectedResult);
        });
    });

    test("edit profile form submit should set errors", async () => {
        act(() => {
            store.dispatch(login({
                id: "9912f704-ad61-465d-9d2b-0e78d8a16307",
                role: "Landlord",
                firstName: "ivan",
                middleName: "petrov",
                lastName: "georgiev",
                gender: "Male",
                age: 20
            }));
        });

        jest.spyOn(profileService, "editProfile")
            .mockResolvedValueOnce({
                status: "Error",
                message: "error message"
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/profile/edit/:userId" element={<ProfileEdit />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        );

        const editProfileEdit = screen.getByTestId("edit-profile-form");
        act(() => {
            fireEvent.submit(editProfileEdit);
        });

        const errorSpan = await screen.findByText(/error message/i);

        await waitFor(() => {
            expect(errorSpan).toBeInTheDocument();
        });
    });

    test("areFormValuesIncorrect should disable edit button when there is input error", () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <ProfileEdit />
                </BrowserRouter>
            </Provider>
        );

        const firstNameInput = screen.getAllByRole("textbox")[0] as HTMLInputElement;

        act(() => {
            fireEvent.change(firstNameInput, {
                target: {
                    value: "trh"
                }
            });
            fireEvent.focus(firstNameInput);
            fireEvent.blur(firstNameInput);
        });

        const submitBtn = screen.getByRole("button", {
            name: /submit/i
        });

        const disabledAttribute = submitBtn.getAttribute("disabled");

        expect(disabledAttribute).toBeNull();
    });

    test("should upload file when file input is changed", () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <ProfileEdit />
                </BrowserRouter>
            </Provider>
        );

        const fileInput = screen.getByTestId("file-input") as HTMLInputElement;

        const file = new File(["rg"], "file.png", { type: "image.png" });

        act(() => {
            fireEvent.change(fileInput, {
                target: {
                    files: [file]
                }
            });

        });

        expect(fileInput.files![0]).toBe(file);
    });

});