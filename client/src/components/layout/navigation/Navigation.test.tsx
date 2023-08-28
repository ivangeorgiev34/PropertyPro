import { fireEvent, render, screen } from "@testing-library/react";
import { login, logout } from "../../../store/auth";
import { store } from "../../../store/store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Navigation } from "./Navigation";

describe("Navigation", () => {

    afterEach(() => {
        store.dispatch(logout());
        jest.clearAllMocks();
    });

    test("profile picture should not be set if there isn't one", () => {

        store.dispatch(login({
            id: "rere",
            token: "hrr",
            profilePicture: null,
            role: "Tenant",
            firstName: "tenant",
            lastName: "tenant"
        }));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Navigation />
                </BrowserRouter>
            </Provider>
        );

        const profilePictureElement = screen.getAllByRole("img")[1];
        const actualResult =
            (profilePictureElement as HTMLImageElement).src ===
            "https://thumbs.dreamstime.com/b/user-icon-flat-style-isolated-grey-background-user-icon-flat-style-isolated-grey-background-your-design-logo-131213475.jpg";

        expect(actualResult).toBeTruthy();
    });

    test("profile picture should be set if there is one", () => {

        store.dispatch(login({
            id: "rere",
            token: "hrr",
            profilePicture: "",
            role: "Tenant",
            firstName: "tenant",
            lastName: "tenant"
        }));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Navigation />
                </BrowserRouter>
            </Provider>
        );

        const profilePictureElement = screen.getAllByRole("img")[1];
        const actualResult =
            (profilePictureElement as HTMLImageElement).src !==
            "https://thumbs.dreamstime.com/b/user-icon-flat-style-isolated-grey-background-user-icon-flat-style-isolated-grey-background-your-design-logo-131213475.jpg";

        expect(actualResult).toBeTruthy();
    });

    test("tenant role links should load when role is tenant", () => {

        store.dispatch(login({
            id: "rere",
            token: "hrr",
            profilePicture: "",
            role: "Tenant",
            firstName: "tenant",
            lastName: "tenant"
        }));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Navigation />
                </BrowserRouter>
            </Provider>
        );

        const explorePropertiesLink = screen.getByRole("link", {
            name: /explore properties/i
        });

        expect(explorePropertiesLink).toBeInTheDocument();
    });

    test("landlord role links should load when role is landlord", () => {

        store.dispatch(login({
            id: "rere",
            token: "hrr",
            profilePicture: "",
            role: "Landlord",
            firstName: "landlord",
            lastName: "landlord"
        }));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Navigation />
                </BrowserRouter>
            </Provider>
        );

        const meyPropertiesLink = screen.getByRole("link", {
            name: /my properties/i
        });

        expect(meyPropertiesLink).toBeInTheDocument();
    });

    test("profile link and greting should load when token is not null", () => {

        store.dispatch(login({
            id: "profileId",
            token: "",
            profilePicture: "",
            role: "Landlord",
            firstName: "landlord",
            lastName: "landlord"
        }));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Navigation />
                </BrowserRouter>
            </Provider>
        );

        const greetingListItem = screen.getByText(/hello, landlord landlord!/i);

        expect(greetingListItem).toBeInTheDocument();
    });

    test("profile link click should redirect to correct url", () => {

        store.dispatch(login({
            id: "profileId",
            token: "",
            profilePicture: "",
            role: "Landlord",
            firstName: "landlord",
            lastName: "landlord"
        }));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Navigation />
                </BrowserRouter>
            </Provider>
        );

        const profileLink = screen.getAllByRole("link")[3];

        fireEvent.click(profileLink);

        const actualResult = window.location.href;
        const expectedResult = "http://localhost/profile/profileId";

        expect(actualResult).toBe(expectedResult);
    });

    test("logout link click should logout user", () => {

        store.dispatch(login({
            id: "profileId",
            token: "",
            profilePicture: "",
            role: "Landlord",
            firstName: "landlord",
            lastName: "landlord"
        }));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Navigation />
                </BrowserRouter>
            </Provider>
        );

        const logoutLink = screen.getByRole("link", {
            name: /logout/i
        });

        fireEvent.click(logoutLink);

        const actualResult = window.location.href;
        const expectedResult = "http://localhost/";

        expect(actualResult).toBe(expectedResult);
    });

    test("login link click should redirect to login page url", () => {

        store.dispatch(login({
            id: "profileId",
            token: null,
            profilePicture: "",
            role: "Landlord",
            firstName: "landlord",
            lastName: "landlord"
        }));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Navigation />
                </BrowserRouter>
            </Provider>
        );

        const loginLink = screen.getByRole("link", {
            name: /login/i
        });

        fireEvent.click(loginLink);

        const actualResult = window.location.href;
        const expectedResult = "http://localhost/login";

        expect(actualResult).toBe(expectedResult);
    });

    test("register link click should redirect to register page url", () => {

        store.dispatch(login({
            id: "profileId",
            token: null,
            profilePicture: "",
            role: "Landlord",
            firstName: "landlord",
            lastName: "landlord"
        }));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Navigation />
                </BrowserRouter>
            </Provider>
        );

        const registerLink = screen.getByRole("link", {
            name: /register/i
        });

        fireEvent.click(registerLink);

        const actualResult = window.location.href;
        const expectedResult = "http://localhost/register";

        expect(actualResult).toBe(expectedResult);
    });

    test("my properties link click should redirect to my properties page url when role is landlord", () => {

        store.dispatch(login({
            id: "profileId",
            token: "",
            profilePicture: "",
            role: "Landlord",
            firstName: "landlord",
            lastName: "landlord"
        }));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Navigation />
                </BrowserRouter>
            </Provider>
        );

        const myPropertiesLink = screen.getByRole("link", {
            name: /my properties/i
        });

        fireEvent.click(myPropertiesLink);

        const actualResult = window.location.href;
        const expectedResult = "http://localhost/my-properties";

        expect(actualResult).toBe(expectedResult);
    });

    test("create property link click should redirect to create property page url when role is landlord", () => {

        store.dispatch(login({
            id: "profileId",
            token: "",
            profilePicture: "",
            role: "Landlord",
            firstName: "landlord",
            lastName: "landlord"
        }));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Navigation />
                </BrowserRouter>
            </Provider>
        );

        const createProperty = screen.getByRole("link", {
            name: /create a property/i
        });

        fireEvent.click(createProperty);

        const actualResult = window.location.href;
        const expectedResult = "http://localhost/property/create";

        expect(actualResult).toBe(expectedResult);
    });

    test("my bookings link click should redirect to my bookings page url when role is tenant", () => {

        store.dispatch(login({
            id: "profileId",
            token: "",
            profilePicture: "",
            role: "Tenant",
            firstName: "tenant",
            lastName: "tenant"
        }));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Navigation />
                </BrowserRouter>
            </Provider>
        );

        const myBookingsLink = screen.getByRole("link", {
            name: /my bookings/i
        });

        fireEvent.click(myBookingsLink);

        const actualResult = window.location.href;
        const expectedResult = "http://localhost/my-bookings";

        expect(actualResult).toBe(expectedResult);
    });

    test("my bookings link click should redirect to my bookings page url when role is tenant", () => {

        store.dispatch(login({
            id: "profileId",
            token: "",
            profilePicture: "",
            role: "Tenant",
            firstName: "tenant",
            lastName: "tenant"
        }));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Navigation />
                </BrowserRouter>
            </Provider>
        );

        const explorePropertiesLink = screen.getByRole("link", {
            name: /explore properties/i
        });

        fireEvent.click(explorePropertiesLink);

        const actualResult = window.location.href;
        const expectedResult = "http://localhost/";

        expect(actualResult).toBe(expectedResult);
    });

    test("my bookings link click should redirect to my bookings page url when role is tenant", () => {

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Navigation />
                </BrowserRouter>
            </Provider>
        );

        const homePageLogoLink = screen.getAllByRole("link")[0];

        fireEvent.click(homePageLogoLink);

        const actualResult = window.location.href;
        const expectedResult = "http://localhost/";

        expect(actualResult).toBe(expectedResult);
    });
});