import { Provider } from "react-redux";
import { store } from "../../store/store";
import { BrowserRouter } from "react-router-dom";
import { NotFound } from "./NotFound";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Not found", () => {

    test("Back to home link should redirect to home page url", () => {

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <NotFound />
                </BrowserRouter>
            </Provider>
        );

        const backToHomeLink = screen.getByRole("link", {
            name: /back to home/i
        });
        fireEvent.click(backToHomeLink);

        const expectedResult = "http://localhost/";

        expect(window.location.href).toBe(expectedResult);
    });
});