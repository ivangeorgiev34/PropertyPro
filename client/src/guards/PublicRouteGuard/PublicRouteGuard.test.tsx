import { Provider } from "react-redux";
import { login } from "../../store/auth";
import { store } from "../../store/store";
import { BrowserRouter } from "react-router-dom";
import { PublicRouteGuard } from "./PublicRouteGuard";
import { render } from "@testing-library/react";

describe("Public route guard", () => {

    test("public route guard should redirect to home page url when expires is not null", () => {
        store.dispatch(login({
            expires: ""
        }));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <PublicRouteGuard />
                </BrowserRouter>
            </Provider>
        );

        const actualResult = window.location.href;
        const expectedResult = "http://localhost/";

        expect(actualResult).toBe(expectedResult);
    });

});