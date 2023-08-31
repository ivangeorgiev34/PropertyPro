import { act, fireEvent, render, screen } from "@testing-library/react";
import { login } from "../../store/auth";
import { store } from "../../store/store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Unauthorized } from "./Unauthorized";
import { Provider } from "react-redux";

describe("Unauthorized", () => {

    const renderComponent = (): void => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path='/unauthorized' element={<Unauthorized />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        );
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeEach(() => {
        const newPath = "/unauthorized";

        const newURL = window.location.origin + newPath;

        history.pushState({}, '', newURL);
    });

    test("back to home ", () => {
        renderComponent();

        const backToHomeLink = screen.getByRole("link");

        act(() => {
            fireEvent.click(backToHomeLink);
        });

        const expectedResult = "/";

        expect(window.location.pathname).toBe(expectedResult);
    });
});