import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../store/store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Register } from "./Register";
import * as authenticationService from "../../services/authenticationService";

describe("Register", () => {

    const renderComponent = (): void => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path='/register' element={<Register />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        );
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeEach(() => {
        const newPath = "/register";

        const newURL = window.location.origin + newPath;

        history.pushState({}, '', newURL);
    });

    test("register form submit should set register errors when response request is error", async () => {

        jest.spyOn(authenticationService, "userRegister")
            .mockResolvedValueOnce({
                status: "Error",
                message: "error message"
            });

        renderComponent();

        const registerForm = screen.getByTestId("register-form");
        act(() => {
            fireEvent.submit(registerForm);
        });

        const errorSpan = await screen.findByText(/error message/i);

        expect(errorSpan).toBeInTheDocument();
    });

    test("register form submit should set register errors when response request is status code 400", async () => {

        jest.spyOn(authenticationService, "userRegister")
            .mockResolvedValueOnce({
                status: 400,
                message: "error message"
            });

        renderComponent();

        const registerForm = screen.getByTestId("register-form");
        act(() => {
            fireEvent.submit(registerForm);
        });

        const errorSpan = await screen.findByText(/error message/i);

        expect(errorSpan).toBeInTheDocument();
    });

    test("register form submit should redirect to login page url when request response is success", async () => {

        jest.spyOn(authenticationService, "userRegister")
            .mockResolvedValueOnce({
                status: "Success",
            });

        renderComponent();

        const registerForm = screen.getByTestId("register-form");
        act(() => {
            fireEvent.submit(registerForm);
        });

        const expectedResult = "/login";

        await waitFor(() => {
            expect(window.location.pathname).toBe(expectedResult);
        });
    });

    test("submit button should be disabled when there is empty input field", () => {

        renderComponent();

        const firstNameInput = screen.getAllByRole("textbox")[0];
        act(() => {
            fireEvent.focus(firstNameInput);
        });

        act(() => {
            fireEvent.blur(firstNameInput);
        });

        const registerBtn = screen.getByRole("button", {
            name: "Register"
        });

        const registerBtnDisabledAttribute = registerBtn.getAttribute("disabled");

        expect(registerBtnDisabledAttribute).toBe("");
    });

    test("submit button should be disabled when there is form error", () => {

        renderComponent();

        const ageInput = screen.getByRole("spinbutton");
        act(() => {
            fireEvent.focus(ageInput);
        });

        act(() => {
            fireEvent.change(ageInput, {
                target: {
                    value: -2
                }
            });
        });

        act(() => {
            fireEvent.blur(ageInput);
        });

        const registerBtn = screen.getByRole("button", {
            name: "Register"
        });

        const registerBtnDisabledAttribute = registerBtn.getAttribute("disabled");

        expect(registerBtnDisabledAttribute).toBe("");
    });

    test("register as tenant button should be enabled upon component mount", () => {
        renderComponent();

        const registerAsTenantBtn = screen.getByRole("button", {
            name: /register as tenant/i
        });

        expect(registerAsTenantBtn).toHaveClass("registerTenantOptionSelected");
    });

    test("register as tenant button click should enabled register as tenant option", () => {
        renderComponent();

        const registerAsLandlordBtn = screen.getByRole("button", {
            name: /register as landlord/i
        });
        act(() => {
            fireEvent.click(registerAsLandlordBtn);
        });

        const registerAsTenantBtn = screen.getByRole("button", {
            name: /register as tenant/i
        });
        act(() => {
            fireEvent.click(registerAsTenantBtn);
        });

        expect(registerAsTenantBtn).toHaveClass("registerTenantOptionSelected");
    });

    test("register as landlord button click should enabled register as landlord option", () => {
        renderComponent();

        const registerAsLandlordBtn = screen.getByRole("button", {
            name: /register as landlord/i
        });
        act(() => {
            fireEvent.click(registerAsLandlordBtn);
        });

        expect(registerAsLandlordBtn).toHaveClass("registerLandlordOptionSelected");
    });

    test("click here to log in link should redirect to login page url", () => {
        renderComponent();

        const clickHereToLogintLink = screen.getByRole("link", {
            name: /click here to log in!/i
        });
        act(() => {
            fireEvent.click(clickHereToLogintLink);
        });

        const expectedResult = "/login";

        expect(window.location.pathname).toBe(expectedResult);
    });

});