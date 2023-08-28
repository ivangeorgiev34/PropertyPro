import { fireEvent, render, screen } from "@testing-library/react";
import IProperty from "../../interfaces/IProperty";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Property } from "./Property";
import { store } from "../../store/store";

describe("Property", () => {

    const propertyProps: IProperty = {
        id: "propertyId",
        title: "title",
        description: null,
        type: "apartment",
        town: "sofia",
        country: "bulgaria",
        guestPricePerNight: 3.12,
        maxGuestsCount: 3,
        bedroomsCount: 3,
        bedsCount: 3,
        bathroomsCount: 3,
        firstImage: "",
        secondImage: null,
        thirdImage: null
    };

    test("props load correctly", () => {

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Property {...propertyProps} />
                </BrowserRouter>
            </Provider>
        );

        const propertyTitleElement = screen.getByRole("heading", {
            name: /title/i
        });

        expect(propertyTitleElement).toBeInTheDocument();
    });

    test("property detils link should redirect to property detils page url", () => {

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Property {...propertyProps} />
                </BrowserRouter>
            </Provider>
        );

        const propertyDetailsLink = screen.getByRole("link", {
            name: /details/i
        });

        fireEvent.click(propertyDetailsLink);

        const actualResult = window.location.href;
        const expectedResult = "http://localhost/property/details/propertyId";

        expect(actualResult).toBe(expectedResult);
    });

});