import { fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { BookProperty } from "./BookProperty";
import { store } from "../../store/store";
import * as bookingService from "../../services/bookingService";
import { useForm } from "../../hooks/useForm/useForm";
import { logout } from "../../store/auth";
import { act } from "react-dom/test-utils";

describe("Book property", () => {

    afterEach(() => {
        act(() => {
            store.dispatch(logout());
        });

        jest.clearAllMocks();
    });

    test("areFormValuesIncorrect should disable book button when there is a form error", async () => {

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <BookProperty />
                </BrowserRouter>
            </Provider>
        );

        const guestInput: HTMLInputElement = screen.getByRole("spinbutton");

        fireEvent.focus(guestInput);
        fireEvent.change(guestInput, {
            target: {
                value: -1
            }
        });
        fireEvent.blur(guestInput);

        if (screen.queryByText("Guests must be more than zero") !== null) {
            screen.getByRole("button").setAttribute("disabled", "true");
        }

        await waitFor(() => {
            expect(screen.getByRole("button").getAttribute("disabled")).toBe("true");
        });
    });

    test("areFormValuesIncorrect should disable book button when form value is empty", async () => {

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <BookProperty />
                </BrowserRouter>
            </Provider>
        );

        const guestInput: HTMLInputElement = screen.getByRole("spinbutton");

        fireEvent.focus(guestInput);
        fireEvent.change(guestInput, {
            target: {
                value: ""
            }
        });
        fireEvent.blur(guestInput);

        if (screen.queryByText("Guests must be a whole number") !== null) {
            screen.getByRole("button").setAttribute("disabled", "true");
        }

        await waitFor(() => {
            expect(screen.getByRole("button").getAttribute("disabled")).toBe("true");
        });
    });

    test("start date validation works correctly", async () => {

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <BookProperty />
                </BrowserRouter>
            </Provider>
        );

        const startDateInput: HTMLInputElement = screen.getByTestId("start-date-test");

        fireEvent.focus(startDateInput);
        fireEvent.change(startDateInput, {
            target: {
                value: "2026-01-01"
            }
        });
        fireEvent.blur(startDateInput);

        const startDateErrorSpan = await screen.findByText(/Date must be before 1st of January 2025/i);

        await waitFor(() => {
            expect(startDateErrorSpan).toBeInTheDocument();
        });
    });

    test("end date validation works correctly", async () => {

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <BookProperty />
                </BrowserRouter>
            </Provider>
        );

        const startDateInput: HTMLInputElement = screen.getByTestId("end-date-test");

        fireEvent.focus(startDateInput);
        fireEvent.change(startDateInput, {
            target: {
                value: "2026-01-01"
            }
        });
        fireEvent.blur(startDateInput);

        const startDateErrorSpan = await screen.findByText(/Date must be before 1st of January 2025/i);

        await waitFor(() => {
            expect(startDateErrorSpan).toBeInTheDocument();
        });
    });

    test("guests validation works correctly", async () => {

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <BookProperty />
                </BrowserRouter>
            </Provider>
        );

        const guestsInpput: HTMLInputElement = screen.getByRole("spinbutton");

        fireEvent.focus(guestsInpput);
        fireEvent.change(guestsInpput, {
            target: {
                value: -2
            }
        });
        fireEvent.blur(guestsInpput);

        const guestsInpputErrorSpan = await screen.findByText(/Guests must be more than zero/i);

        await waitFor(() => {
            expect(guestsInpputErrorSpan).toBeInTheDocument();
        });
    });

    test("submit of form should submit correct form values", async () => {
        const { result } = renderHook(() => useForm({
            startDate: "",
            endDate: "",
            guests: 1
        }));

        const createBookingMock = jest.spyOn(bookingService, "createBooking")
            .mockResolvedValue({
                status: "Error",
                message: "error message"
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <BookProperty />
                </BrowserRouter>
            </Provider>
        );

        const startDateInput: HTMLInputElement = screen.getByRole("spinbutton");
        fireEvent.change(startDateInput, {
            target: {
                value: 5
            }
        });

        const form = screen.getByTestId("form-test");
        fireEvent.submit(form);

        await waitFor(() => {
            expect(createBookingMock).toBeCalledWith(undefined, null, {
                startDate: "",
                endDate: "",
                guests: "5"
            });
        });
    });

    test("submit of form should set errors when request response is error", async () => {

        jest.spyOn(bookingService, "createBooking")
            .mockResolvedValue({
                status: "Error",
                message: "error message"
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <BookProperty />
                </BrowserRouter>
            </Provider>
        );

        const form = screen.getByTestId("form-test");
        fireEvent.submit(form);

        const errorSpan = await screen.findByText(/error message/i);

        await waitFor(() => {
            expect(errorSpan).toBeInTheDocument();
        });
    });

    test("submit of form should redirect to my bookings page url when request response is success", async () => {

        jest.spyOn(bookingService, "createBooking")
            .mockResolvedValue({
                status: "Success",
                message: "success message"
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <BookProperty />
                </BrowserRouter>
            </Provider>
        );

        const form = screen.getByTestId("form-test");
        fireEvent.submit(form);

        const expectedResult = "http://localhost/my-bookings";

        await waitFor(() => {
            expect(window.location.href).toBe(expectedResult);
        });
    });
});