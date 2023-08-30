import { act } from "react-dom/test-utils";
import { store } from "../../store/store";
import { login, logout } from "../../store/auth";
import * as propertyService from "../../services/propertyService";
import * as reviewService from "../../services/reviewService";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PropertyDetails } from "./PropertyDetails";
import IPropertyDetails from "../../interfaces/IPropertyDetails";
import IReview from "../../interfaces/review/IReview";

describe("Property details", () => {

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

    const review: IReview = {
        id: "b1dbedb6-bbd7-4ca1-99ce-4ac72c7f6273",
        stars: 4,
        description: "ewe",
        tenant: {
            id: "ae1bbba1-0a12-4693-bb64-49180816a4ec",
            age: 22,
            firstName: "boris",
            middleName: "borisov",
            lastName: "borisov",
            gender: null,
            profilePicture: null
        }
    };

    const renderComponent = (): void => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path='/property/details/:propertyId' element={<PropertyDetails />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        );
    };

    afterEach(() => {
        act(() => {
            store.dispatch(logout());
        });

        jest.clearAllMocks();
    });

    beforeEach(() => {
        const newPath = "/property/details/fa294f38-c190-443b-9745-a8cfc3edfa7c";

        const newURL = window.location.origin + newPath;

        history.pushState({}, '', newURL);
    });

    test("should redirect to notfound page url when properties are not found upon render", async () => {
        jest.spyOn(propertyService, "getLandlordPropertyById")
            .mockResolvedValueOnce({
                status: "Error"
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path='/property/details/:propertyId' element={<PropertyDetails />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        );

        const expectedResult = "/notfound";

        await waitFor(() => {
            expect(window.location.pathname).toBe(expectedResult);
        });
    });

    test("should redirect to notfound page url when properties and response is rejected are not found upon render", async () => {
        jest.spyOn(propertyService, "getLandlordPropertyById")
            .mockRejectedValueOnce({});

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path='/property/details/:propertyId' element={<PropertyDetails />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        );

        const expectedResult = "/notfound";

        await waitFor(() => {
            expect(window.location.pathname).toBe(expectedResult);
        });
    });

    test("should set property details when it is found upon render", async () => {
        jest.spyOn(propertyService, "getLandlordPropertyById")
            .mockResolvedValueOnce({
                status: "Succes",
                property: property
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path='/property/details/:propertyId' element={<PropertyDetails />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        );

        const propertyTitle = await screen.findByRole("heading", {
            name: /title/i
        });

        expect(propertyTitle).toBeInTheDocument();
    });

    test("should set property reviews upon render", async () => {
        jest.spyOn(propertyService, "getLandlordPropertyById")
            .mockResolvedValueOnce({
                status: "Succes",
                property: property
            });

        jest.spyOn(reviewService, "getPropertyReviews")
            .mockResolvedValueOnce({
                status: "Error"
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path='/property/details/:propertyId' element={<PropertyDetails />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        );

        const reviewsErrorSpan = await screen.findByText(/Cannot load reviews of this property/i);

        expect(reviewsErrorSpan).toBeInTheDocument();
    });

    test("carousel right arrow button click should go to next image", async () => {
        jest.spyOn(propertyService, "getLandlordPropertyById")
            .mockResolvedValueOnce({
                status: "Succes",
                property: property
            });

        jest.spyOn(reviewService, "getPropertyReviews")
            .mockResolvedValueOnce({
                status: "Error"
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path='/property/details/:propertyId' element={<PropertyDetails />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        );

        const rightArrowBtn = (await screen.findAllByRole("button"))[1];
        act(() => {
            fireEvent.click(rightArrowBtn);
        });

        const secondCarouselImage = await screen.findByTestId("second-image");

        expect(secondCarouselImage).toBeVisible();
    });

    test("carousel left arrow button click should go to previous image", async () => {
        jest.spyOn(propertyService, "getLandlordPropertyById")
            .mockResolvedValueOnce({
                status: "Succes",
                property: property
            });

        jest.spyOn(reviewService, "getPropertyReviews")
            .mockResolvedValueOnce({
                status: "Error"
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path='/property/details/:propertyId' element={<PropertyDetails />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        );

        const rightArrowBtn = (await screen.findAllByRole("button"))[1];
        act(() => {
            fireEvent.click(rightArrowBtn);
            fireEvent.click(rightArrowBtn);
        });

        const leftArrowBtn = (await screen.findAllByRole("button"))[0];
        act(() => {
            fireEvent.click(leftArrowBtn);
        });

        const secondCarouselImage = await screen.findByTestId("second-image");

        expect(secondCarouselImage).toBeVisible();
    });

    test("carousel left arrow button click should go to third image when current image is the first one", async () => {
        jest.spyOn(propertyService, "getLandlordPropertyById")
            .mockResolvedValueOnce({
                status: "Succes",
                property: property
            });

        jest.spyOn(reviewService, "getPropertyReviews")
            .mockResolvedValueOnce({
                status: "Error"
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path='/property/details/:propertyId' element={<PropertyDetails />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        );

        const leftArrowBtn = (await screen.findAllByRole("button"))[0];
        act(() => {
            fireEvent.click(leftArrowBtn);
            fireEvent.click(leftArrowBtn);
        });

        const thirdCarouselImage = await screen.findByTestId("third-image");

        expect(thirdCarouselImage).toBeVisible();
    });

    test("delete button click should redirect to home page url if window.confirm is true", async () => {
        act(() => {
            store.dispatch(login({
                id: "fa294f38-c190-443b-9745-a8cfc3edfa7c"
            }));
        });

        jest.spyOn(window, "confirm")
            .mockReturnValueOnce(true);

        jest.spyOn(propertyService, "deletePropertyById")
            .mockResolvedValueOnce({
                status: "Error",
                message: "error message"
            });

        jest.spyOn(propertyService, "getLandlordPropertyById")
            .mockResolvedValueOnce({
                status: "Success",
                property: property
            });

        jest.spyOn(reviewService, "getPropertyReviews")
            .mockResolvedValueOnce({
                status: "Error"
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path='/property/details/:propertyId' element={<PropertyDetails />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        );

        const deleteBtn = await screen.findByTestId("delete-btn");
        act(() => {
            fireEvent.click(deleteBtn);
        });

        const expectedResult = "/";

        await waitFor(() => {
            expect(window.location.pathname).toBe(expectedResult);
        });
    });

    test("no reviews should appear when there is reviews count is zero", async () => {
        property.reviewsCount = 0;
        jest.spyOn(propertyService, "getLandlordPropertyById")
            .mockResolvedValueOnce({
                status: "Success",
                property: property
            });

        jest.spyOn(reviewService, "getPropertyReviews")
            .mockResolvedValueOnce({
                status: "Error"
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path='/property/details/:propertyId' element={<PropertyDetails />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        );

        const noReviewsSpan = await screen.findByText(/no reviews/i);

        await waitFor(() => {
            expect(noReviewsSpan).toBeInTheDocument();
        });
    });

    test("should be no content when there is no property details", () => {

        jest.spyOn(propertyService, "getLandlordPropertyById")
            .mockResolvedValueOnce({
                status: "Success",
                property: null
            });

        jest.spyOn(reviewService, "getPropertyReviews")
            .mockResolvedValueOnce({
                status: "Error"
            });

        renderComponent();

        const allBtnsCount = screen.queryAllByRole("button").length;

        expect(allBtnsCount).toBe(0);
    });

    test("first dot should be active when first image is the current one", async () => {

        jest.spyOn(propertyService, "getLandlordPropertyById")
            .mockResolvedValueOnce({
                status: "Success",
                property: property
            });

        jest.spyOn(reviewService, "getPropertyReviews")
            .mockResolvedValueOnce({
                status: "Error"
            });

        renderComponent();

        const firstDot = await screen.findByTestId("first-dot");

        expect(firstDot).toHaveClass("imageSelected");
    });

    test("second dot should be active when second image is the current one", async () => {

        jest.spyOn(propertyService, "getLandlordPropertyById")
            .mockResolvedValueOnce({
                status: "Success",
                property: property
            });

        jest.spyOn(reviewService, "getPropertyReviews")
            .mockResolvedValueOnce({
                status: "Error"
            });

        renderComponent();

        const rightArrowBtn = (await screen.findAllByRole("button"))[1];
        act(() => {
            fireEvent.click(rightArrowBtn);
        });

        const secondDot = await screen.findByTestId("second-dot");

        expect(secondDot).toHaveClass("imageSelected");
    });

    test("third dot should be active when third image is the current one", async () => {

        jest.spyOn(propertyService, "getLandlordPropertyById")
            .mockResolvedValueOnce({
                status: "Success",
                property: property
            });

        jest.spyOn(reviewService, "getPropertyReviews")
            .mockResolvedValueOnce({
                status: "Error"
            });

        renderComponent();

        const rightArrowBtn = (await screen.findAllByRole("button"))[1];
        act(() => {
            fireEvent.click(rightArrowBtn);
            fireEvent.click(rightArrowBtn);
        });

        const thirdDot = await screen.findByTestId("third-dot");

        expect(thirdDot).toHaveClass("imageSelected");
    });

    test("edit link should redirect to edit property page url", async () => {

        act(() => {
            store.dispatch(login({
                id: "fa294f38-c190-443b-9745-a8cfc3edfa7c"
            }));
        });

        jest.spyOn(propertyService, "getLandlordPropertyById")
            .mockResolvedValueOnce({
                status: "Success",
                property: property
            });

        jest.spyOn(reviewService, "getPropertyReviews")
            .mockResolvedValueOnce({
                status: "Error"
            });

        renderComponent();

        const editLink = await screen.findByRole("link", {
            name: /edit/i
        });
        act(() => {
            fireEvent.click(editLink);
        });

        const expectedResult = "/property/edit/0bf247ed-c686-44dd-b451-403aea169d3f";

        expect(window.location.pathname).toBe(expectedResult);
    });

    test("edit link should redirect to edit property page url", async () => {

        act(() => {
            store.dispatch(login({
                role: "Tenant"
            }));
        });

        jest.spyOn(propertyService, "getLandlordPropertyById")
            .mockResolvedValueOnce({
                status: "Success",
                property: property
            });

        jest.spyOn(reviewService, "getPropertyReviews")
            .mockResolvedValueOnce({
                status: "Error"
            });

        renderComponent();

        const bookLink = await screen.findByRole("link", {
            name: /book/i
        });
        act(() => {
            fireEvent.click(bookLink);
        });

        const expectedResult = "/property/book/0bf247ed-c686-44dd-b451-403aea169d3f";

        expect(window.location.pathname).toBe(expectedResult);
    });

    test("should show there are no reviews if role is landlord", async () => {

        act(() => {
            store.dispatch(login({
                role: "Landlord"
            }));
        });

        jest.spyOn(propertyService, "getLandlordPropertyById")
            .mockResolvedValueOnce({
                status: "Success",
                property: property
            });

        jest.spyOn(reviewService, "getPropertyReviews")
            .mockResolvedValueOnce({
                status: "Error"
            });

        renderComponent();

        const noReviewsSpan = await screen.findByRole("heading", {
            name: /no reviews!/i
        });

        expect(noReviewsSpan).toBeInTheDocument();
    });

    test("create review link should redirect to property create page url when role is tenant", async () => {

        act(() => {
            store.dispatch(login({
                role: "Tenant"
            }));
        });

        jest.spyOn(propertyService, "getLandlordPropertyById")
            .mockResolvedValueOnce({
                status: "Success",
                property: property
            });

        jest.spyOn(reviewService, "getPropertyReviews")
            .mockResolvedValueOnce({
                status: "Error"
            });

        renderComponent();

        const reviewCreate = await screen.findByRole("link", {
            name: /add a review/i
        });
        act(() => {
            fireEvent.click(reviewCreate);
        });

        const expectedResult = `/review/create/fa294f38-c190-443b-9745-a8cfc3edfa7c`;

        expect(window.location.pathname).toBe(expectedResult);
    });

});