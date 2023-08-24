import { screen, render, fireEvent, waitFor } from "@testing-library/react"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { TenantHome } from "./TenantHome"
import { store } from "../../../../store/store"
import { login, logout } from "../../../../store/auth"
import * as propertyService from "../../../../services/propertyService"

describe("Tenant home", () => {

    afterEach(() => {
        jest.restoreAllMocks();
        store.dispatch(logout());
    });

    const mockGetAllPropertiesBySearch = () => {
        jest.spyOn(propertyService, "getAllPropertiesBySearch")
            .mockResolvedValue({
                status: "Success",
                message: "successful message",
                content: {
                    properties: [
                        {
                            id: "eer5",
                            title: "first property",
                            description: null,
                            type: "apartment",
                            town: "",
                            country: "",
                            guestPricePerNight: 1,
                            maxGuestsCount: 2,
                            bedroomsCount: 3,
                            bedsCount: 3,
                            bathroomsCount: 3,
                            firstImage: "",
                            secondImage: null,
                            thirdImage: null
                        },
                        {
                            id: "eer4",
                            title: "second property",
                            description: null,
                            type: "apartment",
                            town: "",
                            country: "",
                            guestPricePerNight: 1,
                            maxGuestsCount: 2,
                            bedroomsCount: 3,
                            bedsCount: 3,
                            bathroomsCount: 3,
                            firstImage: "",
                            secondImage: null,
                            thirdImage: null
                        }
                    ],
                    totalPropertiesCount: 2
                }
            });
    };

    const mockGetAllProperties = () => {
        jest.spyOn(propertyService, "getAllProperties")
            .mockResolvedValue({
                status: "Success",
                message: "successful message",
                content: {
                    properties: [
                        {
                            id: "eer5",
                            title: "first property",
                            description: null,
                            type: "apartment",
                            town: "",
                            country: "",
                            guestPricePerNight: 1,
                            maxGuestsCount: 2,
                            bedroomsCount: 3,
                            bedsCount: 3,
                            bathroomsCount: 3,
                            firstImage: "",
                            secondImage: null,
                            thirdImage: null
                        },
                        {
                            id: "eer4",
                            title: "second property",
                            description: null,
                            type: "apartment",
                            town: "",
                            country: "",
                            guestPricePerNight: 1,
                            maxGuestsCount: 2,
                            bedroomsCount: 3,
                            bedsCount: 3,
                            bathroomsCount: 3,
                            firstImage: "",
                            secondImage: null,
                            thirdImage: null
                        }
                    ],
                    totalPropertiesCount: 2
                }
            });
    };

    test("role is not tenant should redirect to unauthorized", () => {

        store.dispatch(login({
            role: "Landlord",
            expires: new Date().toString()
        }));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <TenantHome />
                </BrowserRouter>
            </Provider>
        );

        const actualResult = window.location.href;
        const expectedResult = "http://localhost/unauthorized";

        waitFor(() => {
            expect(actualResult).toBe(expectedResult);
        })
    })

    test("token is expired should redirect to login", () => {

        store.dispatch(login({
            expires: new Date().toString()
        }));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <TenantHome />
                </BrowserRouter>
            </Provider>
        );

        const actualResult = window.location.href;
        const expectedResult = "http://localhost/login";

        waitFor(() => {
            expect(actualResult).toBe(expectedResult);
        });
    });

    test("initial page should be 1", () => {

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <TenantHome />
                </BrowserRouter>
            </Provider>
        );

        const pageNumberSpan = screen.getByText("1");

        expect(pageNumberSpan).toBeInTheDocument();
    });

    test("should set properties when request is successful", async () => {

        mockGetAllProperties();

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <TenantHome />
                </BrowserRouter>
            </Provider>
        )

        const propertyTitleHeadingsCount = (await screen.findAllByRole("heading")).length;
        expect(propertyTitleHeadingsCount).toBe(2);
    });

    test("should set properties to be zero when request is not successful", async () => {

        jest.spyOn(propertyService, "getAllProperties")
            .mockResolvedValue({
                status: "Error",
                message: "error message"
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <TenantHome />
                </BrowserRouter>
            </Provider>
        );

        const propertyTitleHeadingsCount = screen.queryAllByRole("heading").length;
        const errorMessageSpan = await screen.findByText("error message");

        expect(propertyTitleHeadingsCount).toBe(0);
        expect(errorMessageSpan).toBeInTheDocument();
    })

    test("search should set page to 1", () => {

        mockGetAllProperties();

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <TenantHome />
                </BrowserRouter>
            </Provider>
        );

        const searchBtn = screen.getAllByRole("button")[0];

        fireEvent.click(searchBtn);

        const pageNumberSpan = screen.getByText("1");

        expect(pageNumberSpan).toBeInTheDocument();
    });

    test("search should set properties when request is successful", async () => {

        mockGetAllPropertiesBySearch();

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <TenantHome />
                </BrowserRouter>
            </Provider>
        );

        const searchBtn = screen.getAllByRole("button")[0];

        fireEvent.click(searchBtn);

        const propertyTitleHeadingsCount = (await screen.findAllByRole("heading")).length;

        expect(propertyTitleHeadingsCount).toBe(2);
    });

    test("search should not set properties when request is not successful", async () => {

        jest.spyOn(propertyService, "getAllPropertiesBySearch")
            .mockResolvedValue({
                status: "Error",
                message: "error message"
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <TenantHome />
                </BrowserRouter>
            </Provider>
        );

        const searchBtn = screen.getAllByRole("button")[0];

        fireEvent.click(searchBtn);

        const propertyTitleHeadingsCount = screen.queryAllByRole("heading").length;
        const errorSpan = await screen.findByText("error message");

        expect(propertyTitleHeadingsCount).toBe(0);
        expect(errorSpan).toBeInTheDocument();
    });

    test("search set search params in url", () => {

        mockGetAllPropertiesBySearch();

        store.dispatch(login({
            role: "Tenant",
            expires: new Date(2025, 10, 10).toString()
        }))

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <TenantHome />
                </BrowserRouter>
            </Provider>
        );

        const searchInput: HTMLInputElement = screen.getByRole("textbox");
        searchInput.value = "search";

        const searchOption: HTMLSelectElement = screen.getByRole("combobox");
        searchOption.value = "Title";

        const searchBtn = screen.getAllByRole("button")[0];

        fireEvent.click(searchBtn);

        const actualResult = window.location.href;
        const expectedResult = "http://localhost/?title=search"

        waitFor(() => {
            expect(actualResult).toBe(expectedResult);
        });
    });

    test("view all button click should set page to 1", () => {
        store.dispatch(login({
            role: "Tenant",
            expires: new Date(2025, 10, 10).toString()
        }));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <TenantHome />
                </BrowserRouter>
            </Provider>
        );

        const nextPageBtn = screen.getByRole("button", {
            name: /next/i
        });

        const viewAllBtn = screen.getByRole("button", {
            name: /view all/i
        });

        fireEvent.click(nextPageBtn);

        fireEvent.click(viewAllBtn);

        const pageNumberSpan = screen.getByText("1");

        expect(pageNumberSpan).toBeInTheDocument();
    });

    test("view all button click should redirect to unauthorized when promise is rejected", () => {
        store.dispatch(login({
            role: "Tenant",
            expires: new Date(2025, 10, 10).toString()
        }));

        jest.spyOn(propertyService, "getAllProperties")
            .mockRejectedValue({});

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <TenantHome />
                </BrowserRouter>
            </Provider>
        );

        const viewAllBtn = screen.getByRole("button", {
            name: /view all/i
        });

        fireEvent.click(viewAllBtn);

        const actualResult = window.location.href;
        const expectedResult = "http://localhost:3000/unauthorized";

        waitFor(() => {
            expect(actualResult).toBe(expectedResult);
        });
    });

    test("view all button click should load all properties", async () => {
        store.dispatch(login({
            role: "Tenant",
            expires: new Date(2025, 10, 10).toString()
        }));

        mockGetAllProperties();

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <TenantHome />
                </BrowserRouter>
            </Provider>
        );

        const viewAllBtn = screen.getByRole("button", {
            name: /view all/i
        });

        fireEvent.click(viewAllBtn);

        const propertyTitleHeadingsCount = (await screen.findAllByRole("heading")).length;

        expect(propertyTitleHeadingsCount).toBe(2);
    });

    test("view all button click should load all properties", () => {
        store.dispatch(login({
            role: "Tenant",
            expires: new Date(2025, 10, 10).toString()
        }));

        mockGetAllProperties();

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <TenantHome />
                </BrowserRouter>
            </Provider>
        );

        const searchInput: HTMLInputElement = screen.getByRole("textbox");
        searchInput.value = "search";

        const searchOption: HTMLSelectElement = screen.getByRole("combobox");
        searchOption.value = "Title";

        const searchBtn = screen.getAllByRole("button")[0];
        fireEvent.click(searchBtn);

        const viewAllBtn = screen.getByRole("button", {
            name: /view all/i
        });
        fireEvent.click(viewAllBtn);

        const actualResult = window.location.href;
        const expectedResult = "http://localhost/";

        waitFor(() => {
            expect(actualResult).toBe(expectedResult);
        });
    });

    test("next page button click should only add page to url when search field is empty", () => {

        store.dispatch(login({
            role: "Tenant",
            expires: new Date(2025, 10, 10).toString()
        }));

        mockGetAllProperties();

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <TenantHome />
                </BrowserRouter>
            </Provider>
        );

        const nextPageBtn = screen.getByText("Next");

        fireEvent.click(nextPageBtn);

        const actualResult = window.location.href;
        const expectedResult = "http://localhost:3000/?page=2";

        waitFor(() => {
            expect(actualResult).toBe(expectedResult);
        })
    });

    test("next page button click should increase page number to url when search field is empty", async () => {

        store.dispatch(login({
            role: "Tenant",
            expires: new Date(2025, 10, 10).toString()
        }));

        mockGetAllProperties();

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <TenantHome />
                </BrowserRouter>
            </Provider>
        );

        const nextPageBtn = screen.getByText("Next");

        fireEvent.click(nextPageBtn);

        waitFor(async () => {
            const pageNumberSpan = await screen.findByText(2);

            expect(pageNumberSpan).toBeInTheDocument();
        })
    });

    test("next page button click should change url correctly when search field is not empty", async () => {

        store.dispatch(login({
            role: "Tenant",
            expires: new Date(2025, 10, 10).toString()
        }));

        mockGetAllPropertiesBySearch();

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <TenantHome />
                </BrowserRouter>
            </Provider>
        );

        const searchInput: HTMLInputElement = screen.getByRole("textbox");
        searchInput.value = "search";

        const searchOption: HTMLSelectElement = screen.getByRole("combobox");
        searchOption.value = "Title";

        const searchBtn = screen.getAllByRole("button")[0];

        fireEvent.click(searchBtn);

        const nextPageBtn = screen.getByText("Next");

        fireEvent.click(nextPageBtn);

        const actualResult = window.location.href;
        const expectedResult = "http://localhost/?title=search&page=2";

        waitFor(async () => {
            const pageNumberSpan = await screen.findByText("2");

            expect(actualResult).toBe(expectedResult);
            expect(pageNumberSpan).toBeInTheDocument();
        });
    });

    test("previous page button click should not have page number in url when search field is empty", () => {

        store.dispatch(login({
            role: "Tenant",
            expires: new Date(2025, 10, 10).toString()
        }));

        mockGetAllProperties();

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <TenantHome />
                </BrowserRouter>
            </Provider>
        );

        const nextPageBtn = screen.getByText("Next");

        fireEvent.click(nextPageBtn);

        const previousPageBtn = screen.getByText("Previous");

        fireEvent.click(previousPageBtn);

        const actualResult = window.location.href;
        const expectedResult = "http://localhost/";

        waitFor(async () => {
            expect(actualResult).toBe(expectedResult);
        });
    });

    test("previous page button click should have page number in url when search field is empty", () => {

        store.dispatch(login({
            role: "Tenant",
            expires: new Date(2025, 10, 10).toString()
        }));

        mockGetAllProperties();

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <TenantHome />
                </BrowserRouter>
            </Provider>
        );

        const nextPageBtn = screen.getByText("Next");

        fireEvent.click(nextPageBtn);
        fireEvent.click(nextPageBtn);

        const previousPageBtn = screen.getByText("Previous");

        fireEvent.click(previousPageBtn);

        const actualResult = window.location.href;
        const expectedResult = "http://localhost/?page=2";

        waitFor(async () => {
            expect(actualResult).toBe(expectedResult);
        });
    });

    test("previous page button click should not have page number in url when search field is not empty", () => {

        store.dispatch(login({
            role: "Tenant",
            expires: new Date(2025, 10, 10).toString()
        }));

        mockGetAllPropertiesBySearch();

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <TenantHome />
                </BrowserRouter>
            </Provider>
        );

        const searchInput: HTMLInputElement = screen.getByRole("textbox");
        searchInput.value = "search";

        const searchOption: HTMLSelectElement = screen.getByRole("combobox");
        searchOption.value = "Title";

        const searchBtn = screen.getAllByRole("button")[0];

        fireEvent.click(searchBtn);

        const nextPageBtn = screen.getByText("Next");

        fireEvent.click(nextPageBtn);

        const previousPageBtn = screen.getByText("Previous");

        fireEvent.click(previousPageBtn);

        const actualResult = window.location.href;
        const expectedResult = "http://localhost/title=search";

        waitFor(async () => {
            expect(actualResult).toBe(expectedResult);
        });
    });

    test("previous page button click should have page number in url when search field is not empty", async () => {

        store.dispatch(login({
            role: "Tenant",
            expires: new Date(2025, 10, 10).toString()
        }));

        mockGetAllPropertiesBySearch();

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <TenantHome />
                </BrowserRouter>
            </Provider>
        );

        const searchInput: HTMLInputElement = screen.getByRole("textbox");
        searchInput.value = "search";

        const searchOption: HTMLSelectElement = screen.getByRole("combobox");
        searchOption.value = "Title";

        const searchBtn = screen.getAllByRole("button")[0];

        fireEvent.click(searchBtn);

        const nextPageBtn = screen.getByText("Next");

        fireEvent.click(nextPageBtn);
        fireEvent.click(nextPageBtn);

        const previousPageBtn = screen.getByText("Previous");

        fireEvent.click(previousPageBtn);

        const actualResult = window.location.href;
        const expectedResult = "http://localhost/title=search&page=2";

        waitFor(async () => {
            expect(actualResult).toBe(expectedResult);
        });
    });
});