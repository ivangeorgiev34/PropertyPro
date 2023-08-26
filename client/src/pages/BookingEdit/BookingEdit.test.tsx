import { findByRole, screen, render, waitFor, fireEvent, renderHook } from "@testing-library/react";
import { login, logout } from "../../store/auth";
import { store } from "../../store/store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { BookingEdit } from "./BookingEdit";
import { act } from "react-dom/test-utils";
import * as bookingService from "../../services/bookingService";
import IBookingEdit from "../../interfaces/booking/IBookingEdit";
import { useForm } from "../../hooks/useForm/useForm";

describe("Booking edit", () => {

    const booking: IBookingEdit = {
        id: "bookingId",
        startDate: "2023-10-10",
        endDate: "2023-10-11",
        guests: 5,
        tenant: {
            id: "tenantId",
            age: 17,
            firstName: "tenant",
            middleName: "tenant",
            lastName: "tenant",
            gender: "male",
            profilePicture: null
        },
        property: {
            id: "propertyId",
            title: "title",
            description: null,
            type: "apartment",
            town: "sofia",
            country: "bulgaria",
            guestPricePerNight: 2,
            maxGuestsCount: 2,
            bedroomsCount: 2,
            bedsCount: 2,
            bathroomsCount: 2,
            firstImage: "",
            secondImage: null,
            thirdImage: null

        }
    };

    afterEach(() => {
        act(() => {
            store.dispatch(logout());
        });

        jest.clearAllMocks();
    });

    test("booking edit should redirect to unauthorized page url when role is not tenant", () => {

        act(() => {
            store.dispatch(login({
                role: "Landlord"
            }));
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <BookingEdit />
                </BrowserRouter>
            </Provider>
        );

        const actualResult = window.location.href;
        const expectedResult = "http://localhost/unauthorized";

        expect(actualResult).toBe(expectedResult);
    });

    test("should redirect to notfound page url if request status is error", async () => {

        act(() => {
            store.dispatch(login({
                role: "Tenant"
            }));
        });

        jest.spyOn(bookingService, "getBookingById")
            .mockResolvedValue({
                status: "Error",
                message: "error message"
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <BookingEdit />
                </BrowserRouter>
            </Provider>
        );

        const expectedResult = "http://localhost/notfound";

        await waitFor(() => {
            expect(window.location.href).toBe(expectedResult);
        });
    });

    test("should redirect to notfound page url if request is rejected", async () => {

        act(() => {
            store.dispatch(login({
                role: "Tenant"
            }));
        });

        jest.spyOn(bookingService, "getBookingById")
            .mockRejectedValue({});

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <BookingEdit />
                </BrowserRouter>
            </Provider>
        );

        const expectedResult = "http://localhost/notfound";

        await waitFor(() => {
            expect(window.location.href).toBe(expectedResult);
        });
    });

    test("should set booking when request status is success", async () => {
        act(() => {
            store.dispatch(login({
                role: "Tenant"
            }));
        });

        jest.spyOn(bookingService, "getBookingById")
            .mockResolvedValue({
                status: "Success",
                message: "success message",
                content: {
                    booking: booking
                }
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <BookingEdit />
                </BrowserRouter>
            </Provider>
        );

        const editBookingHeading = await screen.findByRole("heading", {
            name: /edit booking/i
        });

        await waitFor(() => {
            expect(editBookingHeading).toBeInTheDocument();
        });
    });

    test("should set booking edit error when request response is error", async () => {
        act(() => {
            store.dispatch(login({
                role: "Tenant"
            }));
        });

        jest.spyOn(bookingService, "getBookingById")
            .mockResolvedValue({
                status: "Success",
                message: "success message",
                content: {
                    booking: booking
                }
            });

        jest.spyOn(bookingService, "editBookingById")
            .mockResolvedValue({
                status: "Error",
                message: "error message"
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <BookingEdit />
                </BrowserRouter>
            </Provider>
        );

        const editForm = await screen.findByTestId("edit-booking-form");
        fireEvent.submit(editForm);

        const editErrorSpan = await screen.findByText(/error message/i);

        await waitFor(() => {
            expect(editErrorSpan).toBeInTheDocument();
        });
    });

    test("should redirect to my bookings page url when request response is success", async () => {
        act(() => {
            store.dispatch(login({
                role: "Tenant"
            }));
        });

        jest.spyOn(bookingService, "editBookingById")
            .mockResolvedValueOnce({
                status: "Success",
                message: "success message"
            });

        jest.spyOn(bookingService, "getBookingById")
            .mockResolvedValue({
                status: "Success",
                message: "success message",
                content: {
                    booking: booking
                }
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <BookingEdit />
                </BrowserRouter>
            </Provider>
        );

        const editForm = await screen.findByTestId("edit-booking-form");
        fireEvent.submit(editForm);

        const expectedResult = "http://localhost/my-bookings";

        await waitFor(() => {
            expect(window.location.href).toBe(expectedResult);
        });
    });

    test("should send correct form values to editBookingById", async () => {
        act(() => {
            store.dispatch(login({
                role: "Tenant"
            }));
        });

        jest.spyOn(bookingService, "getBookingById")
            .mockResolvedValue({
                status: "Success",
                message: "success message",
                content: {
                    booking: booking
                }
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <BookingEdit />
                </BrowserRouter>
            </Provider>
        );

        const editForm = await screen.findByTestId("edit-booking-form");
        fireEvent.submit(editForm);

        const { result } = renderHook(() => useForm(booking));

        await waitFor(() => {
            expect(result.current.formValues.startDate).toBe(booking.startDate);
        });
    });
});