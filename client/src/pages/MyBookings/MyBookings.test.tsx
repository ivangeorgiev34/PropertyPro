import { Provider } from "react-redux";
import { login, logout } from "../../store/auth";
import { store } from "../../store/store";
import { BrowserRouter } from "react-router-dom";
import { MyBookings } from "./MyBookings";
import { render, waitFor, screen, fireEvent, findAllByRole } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import * as bookingService from "../../services/bookingService";
import IMyBookings from "../../interfaces/booking/IMyBookings";

describe("My bookings", () => {

    const booking: IMyBookings = {
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
        jest.clearAllMocks();

        act(() => {
            store.dispatch(logout());
        });
    });

    test("should redirect to unauthorized page url when role is not landlord", async () => {
        act(() => {
            store.dispatch(login({
                role: "Landlord"
            }));
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyBookings />
                </BrowserRouter>
            </Provider>
        );

        const expectedResult = "http://localhost/unauthorized";

        await waitFor(() => {
            expect(window.location.href).toBe(expectedResult);
        });
    });

    test("books count should be zero when request response is error upon render of component", async () => {

        act(() => {
            store.dispatch(login({
                role: "Tenant"
            }));
        });

        jest.spyOn(bookingService, "getUsersBookings")
            .mockResolvedValue({
                status: "Error",
                message: "error message"
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyBookings />
                </BrowserRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.queryAllByRole("heading").length).toBe(0);
        });
    });

    test("books should be set when request response is success upon render of component", async () => {

        act(() => {
            store.dispatch(login({
                role: "Tenant"
            }));
        });

        jest.spyOn(bookingService, "getUsersBookings")
            .mockResolvedValue({
                status: "Success",
                message: "success message",
                content: {
                    bookings: [
                        booking,
                        booking
                    ]
                }
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyBookings />
                </BrowserRouter>
            </Provider>
        );

        const headingsCount = (await screen.findAllByRole("heading")).length;

        expect(headingsCount).toBe(2);
    });

    test("view all button click should redirect to unauthorized page url when role is not tenant", async () => {

        act(() => {
            store.dispatch(login({
                role: "Landlord"
            }));
        });

        jest.spyOn(bookingService, "getUsersBookings")
            .mockResolvedValue({
                status: "Success",
                message: "success message",
                content: {
                    bookings: [
                        booking,
                        booking
                    ]
                }
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyBookings />
                </BrowserRouter>
            </Provider>
        );

        const viewAllBtn = screen.getByRole("button", {
            name: /view all/i
        });

        fireEvent.click(viewAllBtn);

        const expectedResult = "http://localhost/unauthorized";

        await waitFor(() => {
            expect(window.location.href).toBe(expectedResult);
        });
    });

    test("view all button click should set my bookings when status is success", async () => {
        act(() => {
            store.dispatch(login({
                role: "Tenant"
            }));
        });

        jest.spyOn(bookingService, "getUsersBookings")
            .mockResolvedValue({
                status: "Success",
                message: "success message",
                content: {
                    bookings: [
                        booking,
                        booking
                    ]
                }
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyBookings />
                </BrowserRouter>
            </Provider>
        );

        const viewAllBtn = screen.getByRole("button", {
            name: /view all/i
        });

        fireEvent.click(viewAllBtn);

        const bookingHeadingsCount = (await screen.findAllByRole("heading")).length;

        expect(bookingHeadingsCount).toBe(2);
    });

    test("search form submit should set my bookings count to zero and load errors when status is error", async () => {
        act(() => {
            store.dispatch(login({
                role: "Tenant"
            }));
        });

        jest.spyOn(bookingService, "getUsersBookings")
            .mockResolvedValue({
                status: "Success",
                message: "success message",
                content: {
                    bookings: [
                        booking,
                        booking
                    ]
                }
            });

        jest.spyOn(bookingService, "getUsersBookingsBySearch")
            .mockResolvedValue({
                status: "Error",
                message: "error message"
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyBookings />
                </BrowserRouter>
            </Provider>
        );

        const searchForm = screen.getByTestId("search-form");
        fireEvent.submit(searchForm);

        const bookingsHeadingsCount = screen.queryAllByRole("heading").length;

        const errorSpan = await screen.findByText(/error message/i);

        expect(bookingsHeadingsCount).toBe(0);
        expect(errorSpan).toBeInTheDocument();
    });

    test("search form submit should set my bookings when status is success", async () => {

        act(() => {
            store.dispatch(login({
                role: "Tenant"
            }));
        });

        jest.spyOn(bookingService, "getUsersBookings")
            .mockResolvedValue({
                status: "Success",
                message: "success message",
                content: {
                    bookings: [
                        booking,
                        booking
                    ]
                }
            });

        jest.spyOn(bookingService, "getUsersBookingsBySearch")
            .mockResolvedValue({
                status: "Success",
                message: "success message",
                content: {
                    bookings: [
                        booking,
                        booking
                    ]
                }
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyBookings />
                </BrowserRouter>
            </Provider>
        );

        const searchForm = screen.getByTestId("search-form");
        fireEvent.submit(searchForm);

        const bookingsHeadingsCount = (await screen.findAllByRole("heading")).length;

        expect(bookingsHeadingsCount).toBe(2);
    });

    test("search form submit should set search params in url", async () => {
        act(() => {
            store.dispatch(login({
                role: "Tenant"
            }));
        });

        jest.spyOn(bookingService, "getUsersBookings")
            .mockResolvedValue({
                status: "Success",
                message: "success message",
                content: {
                    bookings: [
                        booking,
                        booking
                    ]
                }
            });

        jest.spyOn(bookingService, "getUsersBookingsBySearch")
            .mockResolvedValue({
                status: "Success",
                message: "success message",
                content: {
                    bookings: [
                        booking,
                        booking
                    ]
                }
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyBookings />
                </BrowserRouter>
            </Provider>
        );

        const searchInput = screen.getByRole("textbox") as HTMLInputElement;
        fireEvent.change(searchInput, {
            target: {
                value: "booking"
            }
        });

        const searchForm = screen.getByTestId("search-form");
        fireEvent.submit(searchForm);

        const expectedResult = "?title=booking";

        await waitFor(() => {
            expect(window.location.search).toBe(expectedResult);
        });
    });

    test("next page click when searchValue is empty should set bookings when request response is success", async () => {
        act(() => {
            store.dispatch(login({
                role: "Tenant"
            }));
        });

        jest.spyOn(bookingService, "getUsersBookings")
            .mockResolvedValue({
                status: "Success",
                message: "success message",
                content: {
                    bookings: [
                        booking,
                        booking
                    ]
                }
            });

        jest.spyOn(bookingService, "getUsersBookingsBySearch")
            .mockResolvedValue({
                status: "Success",
                message: "success message",
                content: {
                    bookings: [
                        booking,
                        booking
                    ]
                }
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyBookings />
                </BrowserRouter>
            </Provider>
        );

        const bookingsHeadingsCount = (await screen.findAllByRole("heading")).length;

        await waitFor(async () => {
            expect(bookingsHeadingsCount).toBe(2);
        });
    });

    test("next page click when searchValue is empty should set bookings to be null when request response is error", async () => {
        act(() => {
            store.dispatch(login({
                role: "Tenant"
            }));
        });

        jest.spyOn(bookingService, "getUsersBookings")
            .mockResolvedValue({
                status: "Error",
                message: "error message"
            });

        jest.spyOn(bookingService, "getUsersBookingsBySearch")
            .mockResolvedValue({
                status: "Success",
                message: "success message",
                content: {
                    bookings: [
                        booking,
                        booking
                    ]
                }
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyBookings />
                </BrowserRouter>
            </Provider>
        );

        const bookingsHeadingsCount = screen.queryAllByRole("heading").length;

        await waitFor(async () => {
            expect(bookingsHeadingsCount).toBe(0);
        });
    });

    test("next page click when searchValue is not empty should set bookings when request response is success", async () => {
        act(() => {
            store.dispatch(login({
                role: "Tenant"
            }));
        });

        jest.spyOn(bookingService, "getUsersBookings")
            .mockResolvedValue({
                status: "Success",
                message: "success message",
                content: {
                    bookings: [
                        booking,
                        booking
                    ]
                }
            });

        jest.spyOn(bookingService, "getUsersBookingsBySearch")
            .mockResolvedValue({
                status: "Success",
                message: "success message",
                content: {
                    bookings: [
                        booking,
                        booking
                    ]
                }
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyBookings />
                </BrowserRouter>
            </Provider>
        );
        const searchInput = screen.getByRole("textbox");
        fireEvent.change(searchInput, {
            target: {
                value: "booking"
            }
        });

        const bookingsHeadingsCount = (await screen.findAllByRole("heading")).length;

        await waitFor(() => {
            expect(bookingsHeadingsCount).toBe(2);
        });
    });

    test("next page click when searchValue is not empty should set bookings to be null when request response is error", async () => {
        act(() => {
            store.dispatch(login({
                role: "Tenant"
            }));
        });

        jest.spyOn(bookingService, "getUsersBookings")
            .mockResolvedValue({
                status: "Error",
                message: "error message"
            });

        jest.spyOn(bookingService, "getUsersBookingsBySearch")
            .mockResolvedValue({
                status: "Success",
                message: "success message",
                content: {
                    bookings: [
                        booking,
                        booking
                    ]
                }
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyBookings />
                </BrowserRouter>
            </Provider>
        );
        const searchInput = screen.getByRole("textbox");
        fireEvent.change(searchInput, {
            target: {
                value: "booking"
            }
        });

        const bookingsHeadingsCount = screen.queryAllByRole("heading").length;

        await waitFor(() => {
            expect(bookingsHeadingsCount).toBe(0);
        });
    });

    test("previous page click when searchValue is empty should set bookings when request response is success", async () => {
        act(() => {
            store.dispatch(login({
                role: "Tenant"
            }));
        });

        jest.spyOn(bookingService, "getUsersBookings")
            .mockResolvedValue({
                status: "Success",
                message: "success message",
                content: {
                    bookings: [
                        booking,
                        booking
                    ]
                }
            });

        jest.spyOn(bookingService, "getUsersBookingsBySearch")
            .mockResolvedValue({
                status: "Success",
                message: "success message",
                content: {
                    bookings: [
                        booking,
                        booking
                    ]
                }
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyBookings />
                </BrowserRouter>
            </Provider>
        );

        const bookingsHeadingsCount = (await screen.findAllByRole("heading")).length;

        await waitFor(() => {
            expect(bookingsHeadingsCount).toBe(2);
        });
    });

    test("previous page click when searchValue is empty should set bookings to be null when request response is error", async () => {
        act(() => {
            store.dispatch(login({
                role: "Tenant"
            }));
        });

        jest.spyOn(bookingService, "getUsersBookings")
            .mockResolvedValue({
                status: "Error",
                message: "error message"
            });

        jest.spyOn(bookingService, "getUsersBookingsBySearch")
            .mockResolvedValue({
                status: "Success",
                message: "success message",
                content: {
                    bookings: [
                        booking,
                        booking
                    ]
                }
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyBookings />
                </BrowserRouter>
            </Provider>
        );

        const bookingsHeadingsCount = screen.queryAllByRole("heading").length;

        await waitFor(() => {
            expect(bookingsHeadingsCount).toBe(0);
        });
    });

    test("previous page click when searchValue is not empty should set bookings when request response is success", async () => {
        act(() => {
            store.dispatch(login({
                role: "Tenant"
            }));
        });

        jest.spyOn(bookingService, "getUsersBookings")
            .mockResolvedValue({
                status: "Success",
                message: "success message",
                content: {
                    bookings: [
                        booking,
                        booking
                    ]
                }
            });

        jest.spyOn(bookingService, "getUsersBookingsBySearch")
            .mockResolvedValue({
                status: "Success",
                message: "success message",
                content: {
                    bookings: [
                        booking,
                        booking
                    ]
                }
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyBookings />
                </BrowserRouter>
            </Provider>
        );
        const searchInput = screen.getByRole("textbox");
        fireEvent.change(searchInput, {
            target: {
                value: "booking"
            }
        });

        const bookingsHeadingsCount = (await screen.findAllByRole("heading")).length;

        await waitFor(() => {
            expect(bookingsHeadingsCount).toBe(2);
        });
    });

    test("previous page click when searchValue is not empty should set bookings to be null when request response is error", async () => {
        act(() => {
            store.dispatch(login({
                role: "Tenant"
            }));
        });

        jest.spyOn(bookingService, "getUsersBookings")
            .mockResolvedValue({
                status: "Error",
                message: "error message"
            });

        jest.spyOn(bookingService, "getUsersBookingsBySearch")
            .mockResolvedValue({
                status: "Success",
                message: "success message",
                content: {
                    bookings: [
                        booking,
                        booking
                    ]
                }
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyBookings />
                </BrowserRouter>
            </Provider>
        );
        const searchInput = screen.getByRole("textbox");
        fireEvent.change(searchInput, {
            target: {
                value: "booking"
            }
        });

        const bookingsHeadingsCount = screen.queryAllByRole("heading").length;

        await waitFor(() => {
            expect(bookingsHeadingsCount).toBe(0);
        });
    });

    test("previous page button should be disabled", async () => {

        act(() => {
            store.dispatch(login({
                role: "Tenant"
            }));
        });

        jest.spyOn(bookingService, "getUsersBookings")
            .mockResolvedValue({
                status: "Error",
                message: "error message"
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyBookings />
                </BrowserRouter>
            </Provider>
        );

        const previousPageBtn = screen.getByRole("button", {
            name: /previous/i
        });

        const disabledAttribute = previousPageBtn.getAttribute("disabled");

        expect(disabledAttribute).toBe("");
    });

    test("previous page button should be disabled", async () => {

        act(() => {
            store.dispatch(login({
                role: "Tenant"
            }));
        });

        jest.spyOn(bookingService, "getUsersBookings")
            .mockResolvedValue({
                status: "Success",
                message: "success message",
                content: {
                    bookings: [
                        booking,
                        booking
                    ],
                    totalBookingsCount: 5
                }
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyBookings />
                </BrowserRouter>
            </Provider>
        );

        const nextPageBtn = screen.getByRole("button", {
            name: /next/i
        });

        const disabledAttribute = nextPageBtn.getAttribute("disabled");

        expect(disabledAttribute).toBe("");
    });
});