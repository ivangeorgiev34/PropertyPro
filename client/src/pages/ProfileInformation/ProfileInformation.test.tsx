import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { store } from "../../store/store";
import { ProfileInformation } from "./ProfileInformation";
import { login, logout } from "../../store/auth";
import { act } from "react-dom/test-utils";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useParams } from "react-router-dom";

describe("Profile information", () => {

    afterEach(() => {
        act(() => {
            store.dispatch(logout());
        });
    });

    beforeEach(() => {
        const newPath = "/profile/fb7abc02-9ce1-44db-ab5b-3ab7aa939990";

        const newURL = window.location.origin + newPath;

        history.pushState({}, '', newURL);
    });

    test("should redirect to unauthorized when user's id is not the same as the id in the url", () => {

        window.location.href = "http://localhost/profile/fb7abc02-9ce1-44db-ab5b-3ab7aa939992";

        act(() => {
            store.dispatch(login({
                id: "fb7abc02-9ce1-44db-ab5b-3ab7aa939990"
            }));
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <ProfileInformation />
                </BrowserRouter>
            </Provider>
        );

        const expectedResult = "http://localhost/unauthorized";

        expect(window.location.href).toBe(expectedResult);
    });

    test("should set profile information", async () => {
        act(() => {
            store.dispatch(login({
                id: "fb7abc02-9ce1-44db-ab5b-3ab7aa939990",
                firstName: "petur",
                middleName: "ivanov",
                lastName: "georgiev",
                age: 24,
                email: "petur@abv.bg",
                profilePicture: "",
                phoneNumber: "0878434321",
                gender: "male"
            }));
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/profile/:userId" element={<ProfileInformation />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        );

        const emailSpan = await screen.findByText(/petur@abv.bg/i);

        await waitFor(async () => {

            expect(emailSpan).toBeInTheDocument();
        });
    });

    test("edit button should redirect to profile edit page url", async () => {
        act(() => {
            store.dispatch(login({
                id: "fb7abc02-9ce1-44db-ab5b-3ab7aa939990",
                firstName: "petur",
                middleName: "ivanov",
                lastName: "georgiev",
                age: 24,
                email: "petur@abv.bg",
                profilePicture: "",
                phoneNumber: "0878434321",
                gender: "male"
            }));
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/profile/:userId" element={<ProfileInformation />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        );
        const editBtn = await screen.findByRole("link", {
            name: /edit/i
        });
        act(() => {
            fireEvent.click(editBtn);
        });

        const expectedResult = "/profile/edit/fb7abc02-9ce1-44db-ab5b-3ab7aa939990";

        await waitFor(() => {

            expect(window.location.pathname).toBe(expectedResult);
        });
    });
});