import { act } from "react-dom/test-utils";
import { store } from "../../store/store";
import { login, logout } from "../../store/auth";
import { findByText, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Home } from "./Home";

describe("Home", () => {

    afterEach(() => {
        act(() => {
            store.dispatch(logout());
        });
    });

    beforeEach(() => {
        const mockIntersectionObserver = jest.fn();
        mockIntersectionObserver.mockReturnValue({
            observe: () => null,
            unobserve: () => null,
            disconnect: () => null
        });
        window.IntersectionObserver = mockIntersectionObserver;
    });

    test("guest home should render when role is null", async () => {
        act(() => {
            store.dispatch(login({
                role: null
            }));
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Home />
                </BrowserRouter>
            </Provider>
        );

        const guestHomeMotoSpan = await screen.findByText("PROPERTY RENTAL PORTAL");

        expect(guestHomeMotoSpan).toBeInTheDocument();
    });

    test("tenant home should render when role is tenant", async () => {
        act(() => {
            store.dispatch(login({
                role: "Tenant"
            }));
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Home />
                </BrowserRouter>
            </Provider>
        );

        const viewAllBtn = await screen.findByRole("button", {
            name: /View All/i
        });

        expect(viewAllBtn).toBeInTheDocument();
    });

    test("landlord home should render when role is landlord", async () => {
        act(() => {
            store.dispatch(login({
                role: "Landlord"
            }));
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Home />
                </BrowserRouter>
            </Provider>
        );

        const myPropertiesHeading = await screen.findByRole("heading", {
            name: /my properties/i
        });

        expect(myPropertiesHeading).toBeInTheDocument();
    });
});