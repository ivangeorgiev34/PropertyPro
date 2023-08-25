import { render } from "@testing-library/react";
import { login } from "../../store/auth";
import { store } from "../../store/store";
import { Provider } from "react-redux";
import { PrivateRouteGuard } from "./PrivateRouteGuard";
import { BrowserRouter } from "react-router-dom";

describe("Private Route Guard", () => {

    test("private route guard should navigate to login page url when expires is null", () => {
        store.dispatch(login({
            expires: null
        }));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <PrivateRouteGuard />
                </BrowserRouter>
            </Provider>
        );

        const actualValue = window.location.href;
        const expectedValue = "http://localhost/login";

        expect(actualValue).toBe(expectedValue);
    });

    test("private route guard should navigate to login page url when expires date is less or equal to date now", () => {
        store.dispatch(login({
            expires: new Date(2023, 9, 24).toString()
        }));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <PrivateRouteGuard />
                </BrowserRouter>
            </Provider>
        );

        const actualValue = window.location.href;
        const expectedValue = "http://localhost/login";

        expect(actualValue).toBe(expectedValue);
    });
});