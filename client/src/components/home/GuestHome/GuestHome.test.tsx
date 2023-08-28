import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { GuestHome } from "./GuestHome";
import { store } from "../../../store/store";

describe("Guest home", () => {

    beforeEach(() => {
        const mockIntersectionObserver = jest.fn();
        mockIntersectionObserver.mockReturnValue({
            observe: () => null,
            unobserve: () => null,
            disconnect: () => null
        });
        window.IntersectionObserver = mockIntersectionObserver;
    });

    test("register link should redirect to register page url", async () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <GuestHome />
                </BrowserRouter>
            </Provider>
        );

        const registerLink = screen.getByRole("link", {
            name: /get started!/i
        });

        fireEvent.click(registerLink);

        const expectResult = "http://localhost/register";

        await waitFor(() => {
            expect(window.location.href).toBe(expectResult);
        });
    });

    test("login link should redirect to login page url", async () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <GuestHome />
                </BrowserRouter>
            </Provider>
        );

        const loginLink = screen.getByRole("link", {
            name: /sign in!/i
        });

        fireEvent.click(loginLink);

        const expectResult = "http://localhost/login";

        await waitFor(() => {
            expect(window.location.href).toBe(expectResult);
        });
    });
});