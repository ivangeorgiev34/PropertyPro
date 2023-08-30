import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../store/store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ReviewCreate } from "./ReviewCreate";
import { login } from "../../store/auth";
import { act } from "react-dom/test-utils";
import * as reviewService from "../../services/reviewService";

describe("Review create", () => {

    const renderComponent = (): void => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path='/review/create/:propertyId' element={<ReviewCreate />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        );
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeEach(() => {
        const newPath = "/review/create/b7dc7643-f8e2-420b-a0f7-e91b35986c28";

        const newURL = window.location.origin + newPath;

        history.pushState({}, '', newURL);

        act(() => {
            store.dispatch(login({
                role: "Tenant"
            }));
        });
    });

    test("should redirect to unauthorized page url when role is not tenant", () => {

        act(() => {
            store.dispatch(login({
                role: "Landlord"
            }));
        });

        renderComponent();

        const expectedResult = "/unauthorized";

        expect(window.location.pathname).toBe(expectedResult);
    });

    test("should generate stars correctly upon component mount", () => {

        renderComponent();

        const starsCount = screen.getAllByTestId(/star-/i).length;

        expect(starsCount).toBe(5);
    });

    test("star mouse enter should make the star and stars before it yellow", () => {

        renderComponent();

        const firstStar = screen.getByTestId("star-1");
        const secondStar = screen.getByTestId("star-2");
        const thirdStar = screen.getByTestId("star-3");

        act(() => {
            fireEvent.mouseEnter(thirdStar);
        });

        expect(firstStar).toHaveClass("yellowStar");
        expect(secondStar).toHaveClass("yellowStar");
        expect(thirdStar).toHaveClass("yellowStar");
    });

    test("star mouse leave should make the star and stars before it grey", () => {

        renderComponent();

        const firstStar = screen.getByTestId("star-1");
        const secondStar = screen.getByTestId("star-2");
        const thirdStar = screen.getByTestId("star-3");

        act(() => {
            fireEvent.mouseEnter(thirdStar);
        });

        act(() => {
            fireEvent.mouseLeave(thirdStar);
        });

        expect(firstStar).toHaveClass("greyStar");
        expect(secondStar).toHaveClass("greyStar");
        expect(thirdStar).toHaveClass("greyStar");
    });

    test("star click should make the star and stars before it yellow", () => {

        renderComponent();

        const firstStar = screen.getByTestId("star-1");
        const secondStar = screen.getByTestId("star-2");
        const thirdStar = screen.getByTestId("star-3");

        act(() => {
            fireEvent.click(thirdStar);
        });

        expect(firstStar).toHaveClass("yellowStar");
        expect(secondStar).toHaveClass("yellowStar");
        expect(thirdStar).toHaveClass("yellowStar");
    });

    test("clear button should clear all yellow stars", () => {

        renderComponent();

        const firstStar = screen.getByTestId("star-1");
        const secondStar = screen.getByTestId("star-2");
        const thirdStar = screen.getByTestId("star-3");

        act(() => {
            fireEvent.click(thirdStar);
        });

        const clearnBtn = screen.getByRole("button", {
            name: /clear/i
        });

        act(() => {
            fireEvent.click(clearnBtn);
        });

        expect(firstStar).toHaveClass("greyStar");
        expect(secondStar).toHaveClass("greyStar");
        expect(thirdStar).toHaveClass("greyStar");
    });

    test("review create form submit should set error when request response is error", async () => {

        jest.spyOn(reviewService, "createReview")
            .mockResolvedValueOnce({
                status: "Error",
                message: "error message"
            });

        renderComponent();

        const reviewCreateForm = screen.getByTestId("create-review-form");

        act(() => {
            fireEvent.submit(reviewCreateForm);
        });

        const errorSpan = await screen.findByText(/error message/i);

        expect(errorSpan).toBeInTheDocument();
    });

    test("review create form submit should redirect to previous page url when request response is success", async () => {

        act(() => {
            store.dispatch(login({
                role: "Tenant"
            }));
        });

        jest.spyOn(reviewService, "createReview")
            .mockResolvedValueOnce({
                status: "Success"
            });

        renderComponent();

        const reviewCreateForm = screen.getByTestId("create-review-form");

        act(() => {
            fireEvent.submit(reviewCreateForm);
        });

        const expectedResult = "/review/create/b7dc7643-f8e2-420b-a0f7-e91b35986c28";

        await waitFor(() => {
            expect(window.location.pathname).toBe(expectedResult);
        });
    });

    test("review create form submit should be called with correct number of stars", () => {

        const createReviewSpy = jest.spyOn(reviewService, "createReview")
            .mockResolvedValueOnce({
                status: "Error",
                message: "error message"
            });

        renderComponent();

        const thirdStar = screen.getByTestId("star-3");

        act(() => {
            fireEvent.click(thirdStar);
        });

        const reviewCreateForm = screen.getByTestId("create-review-form");

        act(() => {
            fireEvent.submit(reviewCreateForm);
        });

        expect(createReviewSpy)
            .toHaveBeenCalledWith(undefined, "b7dc7643-f8e2-420b-a0f7-e91b35986c28", 3, "");
    });
});