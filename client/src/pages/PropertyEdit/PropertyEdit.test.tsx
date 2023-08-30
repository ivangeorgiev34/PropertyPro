import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../store/store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PropertyEdit } from "./PropertyEdit";
import { login, logout } from "../../store/auth";
import { act } from "react-dom/test-utils";
import * as propertyService from "../../services/propertyService";
import IPropertyDetails from "../../interfaces/IPropertyDetails";

describe("Property edit", () => {

    const renderComponent = (): void => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path='/property/edit/:propertyId' element={<PropertyEdit />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        );
    };

    const property: IPropertyDetails = {
        id: "0bf247ed-c686-44dd-b451-403aea169d3f",
        title: "title",
        description: null,
        type: "apartment",
        town: "sofia",
        country: "bulgaria",
        guestPricePerNight: 23.12,
        maxGuestsCount: 2,
        bedroomsCount: 2,
        bedsCount: 2,
        bathroomsCount: 2,
        averageRating: 2.32,
        reviewsCount: 5,
        firstImage: "",
        secondImage: null,
        thirdImage: null,
        landlord: {
            id: "fa294f38-c190-443b-9745-a8cfc3edfa7c",
            email: "landlord@abv.bg",
            age: 23,
            firstName: "nasko",
            middleName: "sirakov",
            lastName: "sirakov",
            gender: null,
            phoneNumber: "0878545421",
            username: "naso"
        }
    };

    afterEach(() => {
        act(() => {
            store.dispatch(logout());
        });

        jest.clearAllMocks();
    });

    beforeEach(() => {
        const newPath = "/property/edit/0bf247ed-c686-44dd-b451-403aea169d3f";

        const newURL = window.location.origin + newPath;

        history.pushState({}, '', newURL);

        act(() => {
            store.dispatch(login({
                role: "Landlord",
                id: "fa294f38-c190-443b-9745-a8cfc3edfa7c"
            }));
        });
    });

    test("should redirect to unauthorized page url when role is not landlord upon mount", () => {
        act(() => {
            store.dispatch(login({
                role: "Tenant"
            }));
        });

        renderComponent();

        const expectedResult = "/unauthorized";

        expect(window.location.pathname).toBe(expectedResult);
    });

    test("should redirect to notfound page url when landlord properties are not found", async () => {
        jest.spyOn(propertyService, "getLandlordPropertyById")
            .mockResolvedValueOnce({
                status: "Error"
            });

        renderComponent();

        const expectedResult = "/notfound";

        await waitFor(() => {
            expect(window.location.pathname).toBe(expectedResult);
        });
    });

    test("should redirect to unauthorized page url when property landlord id is not the logged user's id", async () => {
        const wrongLandlordIdProperty: IPropertyDetails = {
            id: "0bf247ed-c686-44dd-b451-403aea169d3f",
            title: "title",
            description: null,
            type: "apartment",
            town: "sofia",
            country: "bulgaria",
            guestPricePerNight: 23.12,
            maxGuestsCount: 2,
            bedroomsCount: 2,
            bedsCount: 2,
            bathroomsCount: 2,
            averageRating: 2.32,
            reviewsCount: 5,
            firstImage: "",
            secondImage: null,
            thirdImage: null,
            landlord: {
                id: "fa294f38-c190-443b-9745-a8cfc3edfa7q",
                email: "landlord@abv.bg",
                age: 23,
                firstName: "nasko",
                middleName: "sirakov",
                lastName: "sirakov",
                gender: null,
                phoneNumber: "0878545421",
                username: "naso"
            }
        };

        jest.spyOn(propertyService, "getLandlordPropertyById")
            .mockResolvedValueOnce({
                status: "Success",
                property: wrongLandlordIdProperty
            });

        renderComponent();

        const expectedResult = "/unauthorized";

        await waitFor(() => {
            expect(window.location.pathname).toBe(expectedResult);
        });
    });

    test("should set property when property landlord id is the logged user's id", async () => {
        act(() => {
            store.dispatch(login({
                role: "Landlord",
                id: "fa294f38-c190-443b-9745-a8cfc3edfa7c"
            }));
        });

        jest.spyOn(propertyService, "getLandlordPropertyById")
            .mockResolvedValueOnce({
                status: "Success",
                property: property
            });

        renderComponent();

        const titleInput = (await screen.findAllByRole("textbox"))[0] as HTMLInputElement;

        const expectedResult = "title";

        await waitFor(() => {
            expect(titleInput.value).toBe(expectedResult);
        });
    });

    test("should redirect to notfound when response request is rejected", async () => {
        jest.spyOn(propertyService, "getLandlordPropertyById")
            .mockRejectedValueOnce({});

        renderComponent();

        const expectedResult = "/notfound";

        await waitFor(() => {
            expect(window.location.pathname).toBe(expectedResult);
        });
    });

    test("submit button should be disabled when there is a form error", async () => {

        act(() => {
            store.dispatch(login({
                role: "Landlord",
                id: "fa294f38-c190-443b-9745-a8cfc3edfa7c"
            }));
        });

        jest.spyOn(propertyService, "getLandlordPropertyById")
            .mockResolvedValueOnce({
                status: "Success",
                property: property
            });

        renderComponent();

        const titleInput = (await screen.findAllByRole("textbox"))[0] as HTMLInputElement;
        act(() => {
            fireEvent.change(titleInput, {
                target: {
                    value: "wzdmaizxxncnyidnmzgwvcmwyiqnzaubujuxkmzjpcejhbzzrdrdcpjnnbbkerbiekbtuabpmvbqzjhgw"
                }
            });
        });

        const submitBtn = await screen.findByRole("button", {
            name: /submit/i
        });
        const disabledAttribute = submitBtn.getAttribute("disabled");

        expect(disabledAttribute).toBe("");
    });

    test("submit button should be disabled when there empty form input", async () => {

        jest.spyOn(propertyService, "getLandlordPropertyById")
            .mockResolvedValueOnce({
                status: "Success",
                property: property
            });

        renderComponent();

        const titleInput = (await screen.findAllByRole("textbox"))[0] as HTMLInputElement;

        act(() => {
            fireEvent.focus(titleInput);
        });

        act(() => {
            fireEvent.blur(titleInput);
        });

        const submitBtn = await screen.findByRole("button", {
            name: /submit/i
        });
        const disabledAttribute = submitBtn.getAttribute("disabled");

        expect(disabledAttribute).toBe("");
    });

    test("property edit form submit should redirect to my properties page url when request response is success", async () => {

        jest.spyOn(propertyService, "getLandlordPropertyById")
            .mockResolvedValueOnce({
                status: "Success",
                property: property
            });

        jest.spyOn(propertyService, "editPropertyById")
            .mockResolvedValueOnce({
                status: "Success",
            });

        renderComponent();

        const editPropertyForm = await screen.findByTestId("edit-property-form");

        act(() => {
            fireEvent.submit(editPropertyForm);
        });

        const expectedResult = "/my-properties";

        await waitFor(() => {
            expect(window.location.pathname).toBe(expectedResult);
        });
    });

    test("property edit form submit should set error when request response is error", async () => {

        jest.spyOn(propertyService, "getLandlordPropertyById")
            .mockResolvedValueOnce({
                status: "Success",
                property: property
            });

        jest.spyOn(propertyService, "editPropertyById")
            .mockResolvedValueOnce({
                status: "Error",
                message: "error message"
            });

        renderComponent();

        const editPropertyForm = await screen.findByTestId("edit-property-form");

        act(() => {
            fireEvent.submit(editPropertyForm);
        });

        const errorSpan = await screen.findByText(/error message/i);

        expect(errorSpan).toBeInTheDocument();
    });

});