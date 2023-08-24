import { Provider } from "react-redux";
import { useAppSelector } from "../../../../hooks/reduxHooks";
import { BrowserRouter } from "react-router-dom";
import { LandlordHome } from "./LandlordHome";
import { store } from "../../../../store/store";
import { render, screen, fireEvent } from "@testing-library/react";
import { login, logout } from "../../../../store/auth";

describe("Landlord home", () => {

    afterEach(() => {
        jest.clearAllMocks();
        store.dispatch(logout());
    });

    test("role is not landlord should redirect to unauthorized", () => {

        store.dispatch(login({
            role: "Tenant"
        }));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <LandlordHome />
                </BrowserRouter>
            </Provider>
        );

        const actualResult = window.location.href;
        const expectedResult = "http://localhost/unauthorized";

        expect(actualResult).toBe(expectedResult);
    })

    test("token is invalid should redirect to login page", () => {

        store.dispatch(login({
            role: "Landlord",
            expires: new Date().toString()
        }));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <LandlordHome />
                </BrowserRouter>
            </Provider>
        );

        const actualResult = window.location.href;
        const expectedResult = "http://localhost/login";

        const authState = store.getState();

        expect(actualResult).toBe(expectedResult);
        expect(authState.auth.id).toBeNull();
    })

    test("create property link should redirect correctly", () => {

        store.dispatch(login({
            role: "Landlord",
            expires: new Date(2025, 10, 10).toString()
        }));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <LandlordHome />
                </BrowserRouter>
            </Provider>
        );

        const createPropertyBtn = screen.getAllByText(/create property/i)[1];

        fireEvent.click(createPropertyBtn);

        const actualResult = window.location.href;
        const expectedResult = "http://localhost/property/create";

        expect(actualResult).toBe(expectedResult);
    });

    test("my properties link should redirect correctly", () => {

        store.dispatch(login({
            role: "Landlord",
            expires: new Date(2025, 10, 10).toString()
        }));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <LandlordHome />
                </BrowserRouter>
            </Provider>
        );

        const myPropertiesBtn = screen.getAllByText(/my properties/i)[1];

        fireEvent.click(myPropertiesBtn);

        const actualResult = window.location.href;
        const expectedResult = "http://localhost/my-properties";

        expect(actualResult).toBe(expectedResult);
    })

})