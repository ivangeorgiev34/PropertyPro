import { fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react";
import { useError } from "./useError";
import IBookPropertyFormErrors from "../../interfaces/booking/IBookPropertyFormErrors";
import { act } from "react-dom/test-utils";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { BookProperty } from "../../pages/BookProperty/BookProperty";
import { store } from "../../store/store";

describe("use error hook", () => {
    const initialFormErrors: IBookPropertyFormErrors = {
        startDate: "",
        endDate: "",
        guests: ""
    };

    test("formErrors property to be same as initial value", () => {
        const { result } = renderHook(() => useError<IBookPropertyFormErrors>(initialFormErrors));

        expect(initialFormErrors).toBe(result.current.formErrors);
    });

    test("formErrors should change correctly upon form submit", () => {
        const { result } = renderHook(() => useError<IBookPropertyFormErrors>(initialFormErrors));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <BookProperty />
                </BrowserRouter>
            </Provider>
        );

        const startDateInput = screen.getByTestId("start-date-test");
        const form = screen.getByTestId("form-test");

        fireEvent.change(startDateInput, {
            target: {
                value: "2025-10-10"
            }
        });
        fireEvent.submit(form);


        const actualResult = result.current.formErrors.startDate;
        const expectedResult = "Date must be before 1st of January 2025";

        waitFor(() => {
            expect(actualResult).toBe(expectedResult);
        });
    });
});