import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Login } from "./Login";
import { store } from "../../store/store";
import * as authenticationService from "../../services/authenticationService";
import auth from "../../store/auth";

describe("Login", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("areFormValuesIncorrect should disable login button when there is a form error", async () => {

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </Provider>
        );
        const emailInput = screen.getAllByRole("textbox")[0] as HTMLInputElement;

        fireEvent.focus(emailInput);
        fireEvent.change(emailInput, {
            target: {
                value: "aewwwqe.bg"
            }
        });
        fireEvent.blur(emailInput);

        if (screen.queryByText("Invalid email") !== null) {
            screen.getByRole("button").setAttribute("disabled", "true");
        }

        await waitFor(() => {
            expect(screen.getByRole("button").getAttribute("disabled")).toBe("true");
        });
    });

    test("areFormValuesIncorrect should disable login button when form value is empty", async () => {

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </Provider>
        );

        const emailInput = screen.getAllByRole("textbox")[0] as HTMLInputElement;

        fireEvent.focus(emailInput);
        fireEvent.change(emailInput, {
            target: {
                value: ""
            }
        });
        fireEvent.blur(emailInput);

        if (screen.queryByText("Email is required") !== null) {
            screen.getByRole("button").setAttribute("disabled", "true");
        }

        await waitFor(() => {
            expect(screen.getByRole("button").getAttribute("disabled")).toBe("true");
        });
    });

    test("email validaiton should work correctly", () => {

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </Provider>
        );

        const emailInput = screen.getAllByRole("textbox")[0] as HTMLInputElement;

        fireEvent.focus(emailInput);
        fireEvent.change(emailInput, {
            target: {
                value: ""
            }
        });
        fireEvent.blur(emailInput);

        const emailErrorParagraph = screen.getByText("Email is required");

        expect(emailErrorParagraph).toBeInTheDocument();
    });

    test("password validaiton should work correctly", () => {

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </Provider>
        );

        const passwordInput = screen.getByTestId("password-input") as HTMLInputElement;

        fireEvent.focus(passwordInput);
        fireEvent.change(passwordInput, {
            target: {
                value: "htreq"
            }
        });
        fireEvent.blur(passwordInput);

        const passwordErrorParagraph = screen.getByText("Password must be at least 6 symbols");

        expect(passwordErrorParagraph).toBeInTheDocument();
    });

    test("form submit should load error when request response is error", async () => {

        jest.spyOn(authenticationService, "userLogin")
            .mockResolvedValue({
                status: "Error",
                message: "error message"
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </Provider>
        );

        const form = screen.getByTestId("login-form");
        fireEvent.submit(form);

        const formErrorParagraph = await screen.findByText(/error message/i);

        expect(formErrorParagraph).toBeInTheDocument();
    });

    test("form submit should redirect to home page url when request response is success", async () => {

        jest.spyOn(authenticationService, "userLogin")
            .mockResolvedValue({
                status: "Success",
                message: "success message",
                user: {
                    id: "userId"
                }
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </Provider>
        );

        const form = screen.getByTestId("login-form");
        fireEvent.submit(form);

        const expectedResult = "http://localhost/";

        await waitFor(() => {
            expect(window.location.href).toBe(expectedResult);
            expect(store.getState().auth.id).toBe("userId");
        });
    });
});