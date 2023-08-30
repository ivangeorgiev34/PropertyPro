import { act } from "react-dom/test-utils";
import { login, logout } from "../../store/auth";
import { store } from "../../store/store";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PropertyCreate } from "./PropertyCreate";
import * as propertyService from "../../services/propertyService";
import { MyProperties } from "../MyProperties/MyProperties";
import { Unauthorized } from "../Unauthorized/Unauthorized";

describe("Property create", () => {

    afterEach(() => {
        act(() => {
            store.dispatch(logout());
        });
    });

    beforeEach(() => {
        const newPath = "/property/create";

        const newURL = window.location.origin + newPath;

        history.pushState({}, '', newURL);
    });

    test("should redirect to unauthorized page url", () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path='/property/create' element={<PropertyCreate />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        );

        const expectedResult = "/unauthorized";

        expect(window.location.pathname).toBe(expectedResult);
    });

    test("areFormValuesIncorrect should disable create button when there is empty input field", () => {
        act(() => {
            store.dispatch(login({
                role: "Landlord"
            }));
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path='/property/create' element={<PropertyCreate />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        );

        const titleInput = screen.getAllByRole("textbox")[0] as HTMLInputElement;

        act(() => {
            fireEvent.focus(titleInput);
        });

        act(() => {
            fireEvent.blur(titleInput);
        });

        const submitBtn = screen.getByRole("button", {
            name: /submit/i
        });

        const submitBtnDisabledAttribute = submitBtn.getAttribute("disabled");

        expect(submitBtnDisabledAttribute).toBe("");
    });

    test("areFormValuesIncorrect should disable create button when there is form error", () => {
        act(() => {
            store.dispatch(login({
                role: "Landlord"
            }));
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path='/property/create' element={<PropertyCreate />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        );

        const titleInput = screen.getAllByRole("textbox")[0] as HTMLInputElement;

        act(() => {
            fireEvent.change(titleInput, {
                target: {
                    value: "hchbtgqtezrzpjdqiupddfpxcedezumvgrwzybzatphfxvpqjkbkwbeumpydpqhyknwvtgrzbwknnavyj"
                }
            });
        });

        act(() => {
            fireEvent.focus(titleInput);
        });

        act(() => {
            fireEvent.blur(titleInput);
        });

        const submitBtn = screen.getByRole("button", {
            name: /submit/i
        });

        const submitBtnDisabledAttribute = submitBtn.getAttribute("disabled");

        expect(submitBtnDisabledAttribute).toBe("");
    });

    test("property create form submit should redirect to my properties page url", async () => {
        act(() => {
            store.dispatch(login({
                role: "Landlord"
            }));
        });

        jest.spyOn(propertyService, "createProperty")
            .mockResolvedValueOnce({
                status: "Success"
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path='/property/create' element={<PropertyCreate />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        );

        const propertyCreateForm = screen.getByTestId("property-create-form");
        act(() => {
            fireEvent.submit(propertyCreateForm);
        });

        const expectedResult = "/my-properties";

        await waitFor(() => {
            expect(window.location.pathname).toBe(expectedResult);
        });
    });

    test("property create form submit should set error", async () => {
        act(() => {
            store.dispatch(login({
                role: "Landlord"
            }));
        });

        jest.spyOn(propertyService, "createProperty")
            .mockResolvedValueOnce({
                status: "Error",
                message: "error message"
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path='/property/create' element={<PropertyCreate />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        );

        const propertyCreateForm = screen.getByTestId("property-create-form");
        act(() => {
            fireEvent.submit(propertyCreateForm);
        });

        const errorSpan = await screen.findByText(/error message/i);

        expect(errorSpan).toBeInTheDocument();
    });


});