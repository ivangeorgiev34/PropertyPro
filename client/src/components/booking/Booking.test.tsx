import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Booking } from "./Booking";
import { store } from "../../store/store";
import IMyBookings from "../../interfaces/booking/IMyBookings";
import * as bookingService from "../../services/bookingService";

describe("Booking", () => {

    const bookingProps: IMyBookings = {
        id: "thrttrhtrh",
        startDate: new Date(2023, 10, 9).toString(),
        endDate: new Date(2023, 10, 10).toString(),
        guests: 5,
        property: {
            id: "rrereer",
            title: "title",
            description: null,
            type: "apartment",
            town: "sofia",
            country: "bulgaria",
            guestPricePerNight: 4.32,
            maxGuestsCount: 4,
            bedroomsCount: 4,
            bedsCount: 4,
            bathroomsCount: 4,
            firstImage: "",
            secondImage: null,
            thirdImage: null
        },
        tenant: {
            id: "erg4rw",
            age: 41,
            firstName: "tenant",
            middleName: "tenant",
            lastName: "tenant",
            gender: "male",
            profilePicture: null
        }
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("renders props correctly", () => {

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Booking {...bookingProps} />
                </BrowserRouter>
            </Provider>
        );

        const propertyTitle = screen.getByRole("heading", {
            name: /title/i
        });

        expect(propertyTitle).toBeInTheDocument();
    });

    test("delete span is empty is window confirm is false", () => {

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Booking {...bookingProps} />
                </BrowserRouter>
            </Provider>
        );

        const deleteErrorSpan = screen.getByTestId("deleteErrorSpan").textContent;

        expect(deleteErrorSpan).toBe("");
    });

    test("delete span should be delete error message", () => {

        jest.spyOn(window, "confirm")
            .mockReturnValue(true);

        jest.spyOn(bookingService, "deleteBookingById")
            .mockResolvedValue({
                status: "Error",
                message: "error message"
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Booking {...bookingProps} />
                </BrowserRouter>
            </Provider>
        );

        waitFor(() => {
            const deleteErrorSpan = screen.getByText("error message");

            expect(deleteErrorSpan).toBeInTheDocument();
        });
    });
});