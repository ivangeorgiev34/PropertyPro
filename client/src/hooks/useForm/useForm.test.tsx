import { act, createEvent, fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react";
import IPropertyCreateForm from "../../interfaces/IPropertyCreateForm";
import { useForm } from "./useForm";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PropertyCreate } from "../../pages/PropertyCreate/PropertyCreate";
import { store } from "../../store/store";
import React from "react";

describe("use form hook", () => {

    const initialFormValues: IPropertyCreateForm = {
        title: "",
        description: "",
        type: "Apartment",
        town: "",
        country: "",
        guestPricePerNight: 0.0,
        maxGuestsCount: 0,
        bedroomsCount: 0,
        bedsCount: 0,
        bathroomsCount: 0,
        firstImage: null,
        secondImage: null,
        thirdImage: null
    };

    test("formValues property to be same as initial value", () => {

        const { result } = renderHook(() => useForm<IPropertyCreateForm>(initialFormValues));

        expect(initialFormValues).toBe(result.current.formValues);
    });

    test("onFormChange should change formValues correctly", async () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <PropertyCreate />
                </BrowserRouter>
            </Provider>
        );

        const titleInput = screen.getAllByRole("textbox")[0] as HTMLInputElement;

        fireEvent.change(titleInput, {
            target: {
                value: "title"
            }
        });

        await waitFor(() => {
            expect(titleInput.value).toBe("title");
        });
    });
    //     render(
    //         <Provider store={store}>
    //             <BrowserRouter>
    //                 <PropertyCreate />
    //             </BrowserRouter>
    //         </Provider>
    //     );

    //     const firstImageInput = screen.getByTestId("first-image-input") as HTMLInputElement;

    //     act(() => {
    //         fireEvent.change(firstImageInput, {
    //             target: {
    //                 files: [
    //                     new File(['file contents'], 'example.png', { type: 'image/png' })
    //                 ]
    //             }
    //         });
    //     });

    //     await waitFor(() => {
    //         expect(firstImageInput.files?.length).toBe(1);
    //     });
    // });

    test("setDefaultValues should change formValues correctly", async () => {

        const { result } = renderHook(() => useForm<IPropertyCreateForm>(initialFormValues));

        act(async () => {
            initialFormValues.title = "title";
            result.current.setDefaultValues(initialFormValues);
        });

        expect(result.current.formValues.title).toBe("title");
    });
});