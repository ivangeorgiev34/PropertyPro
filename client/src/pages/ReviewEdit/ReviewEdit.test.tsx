import { Provider } from "react-redux";
import { store } from "../../store/store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ReviewEdit } from "./ReviewEdit";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { login } from "../../store/auth";
import * as reviewService from "../../services/reviewService";
import IReview from "../../interfaces/review/IReview";

describe("Review edit", () => {

    const review: IReview = {
        id: "b7dc7643-f8e2-420b-a0f7-e91b35986c28",
        stars: 3,
        description: "ereree",
        tenant: {
            id: "f52ad9b9-e852-49da-94aa-c64e6eda6cfd",
            age: 24,
            firstName: "petur",
            middleName: "ivanov",
            lastName: "ivanov",
            gender: null,
            profilePicture: null
        }
    };

    const renderComponent = (): void => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path='/review/edit/:reviewId' element={<ReviewEdit />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        );
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeEach(() => {
        const newPath = "/review/edit/b7dc7643-f8e2-420b-a0f7-e91b35986c28";

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

    test("should redirect to notfound page url when request response is error", async () => {

        jest.spyOn(reviewService, "getReviewById")
            .mockResolvedValueOnce({
                status: "Error"
            });

        renderComponent();

        const expectedResult = "/notfound";

        await waitFor(() => {
            expect(window.location.pathname).toBe(expectedResult);
        });
    });

    test("should set review when request response is success", async () => {

        jest.spyOn(reviewService, "getReviewById")
            .mockResolvedValueOnce({
                status: "Success",
                content: {
                    review: review
                }
            });

        renderComponent();

        const firstStar = await screen.findByTestId("star-1");
        const secondStar = await screen.findByTestId("star-2");
        const thirdStar = await screen.findByTestId("star-3");
        const fourthStar = await screen.findByTestId("star-4");
        const fifthStar = await screen.findByTestId("star-5");

        await waitFor(() => {
            expect(firstStar).toHaveClass("yellowStar");
            expect(secondStar).toHaveClass("yellowStar");
            expect(thirdStar).toHaveClass("yellowStar");
            expect(fourthStar).toHaveClass("greyStar");
            expect(fifthStar).toHaveClass("greyStar");
        });
    });

    test("should redirect to notfound page url when request response is rejected", async () => {

        jest.spyOn(reviewService, "getReviewById")
            .mockRejectedValueOnce({});

        renderComponent();

        const expectedResult = "/notfound";

        await waitFor(() => {
            expect(window.location.pathname).toBe(expectedResult);
        });
    });

    test("star mouse enter should make star and stars before it yellow", async () => {

        jest.spyOn(reviewService, "getReviewById")
            .mockResolvedValueOnce({
                status: "Success",
                content: {
                    review: review
                }
            });

        renderComponent();

        const firstStar = await screen.findByTestId("star-1");
        const secondStar = await screen.findByTestId("star-2");

        act(() => {
            fireEvent.mouseEnter(secondStar);
        });

        expect(firstStar).toHaveClass("yellowStar");
        expect(secondStar).toHaveClass("yellowStar");
    });

    test("star mouse leave should make star and stars before it grey", async () => {

        jest.spyOn(reviewService, "getReviewById")
            .mockResolvedValueOnce({
                status: "Success",
                content: {
                    review: review
                }
            });

        renderComponent();

        const firstStar = await screen.findByTestId("star-1");
        const secondStar = await screen.findByTestId("star-2");
        const thirdStar = await screen.findByTestId("star-3");
        const fourthStar = await screen.findByTestId("star-4");

        act(() => {
            fireEvent.mouseEnter(fourthStar);
        });

        act(() => {
            fireEvent.mouseLeave(fourthStar);
        });

        expect(firstStar).toHaveClass("yellowStar");
        expect(secondStar).toHaveClass("yellowStar");
        expect(thirdStar).toHaveClass("yellowStar");
        expect(fourthStar).toHaveClass("greyStar");
    });

    test("star click should make star and stars before it yellow", async () => {

        jest.spyOn(reviewService, "getReviewById")
            .mockResolvedValueOnce({
                status: "Success",
                content: {
                    review: review
                }
            });

        renderComponent();

        const firstStar = await screen.findByTestId("star-1");
        const secondStar = await screen.findByTestId("star-2");
        const thirdStar = await screen.findByTestId("star-3");
        const fourthStar = await screen.findByTestId("star-4");

        act(() => {
            fireEvent.mouseEnter(fourthStar);
        });

        act(() => {
            fireEvent.mouseLeave(fourthStar);
        });

        act(() => {
            fireEvent.click(fourthStar);
        });

        expect(firstStar).toHaveClass("yellowStar");
        expect(secondStar).toHaveClass("yellowStar");
        expect(thirdStar).toHaveClass("yellowStar");
        expect(fourthStar).toHaveClass("yellowStar");
    });

    test("clear button should make all stars grey", () => {
        jest.spyOn(reviewService, "getReviewById")
            .mockResolvedValueOnce({
                status: "Success",
                content: {
                    review: review
                }
            });

        renderComponent();

        const stars = screen.getAllByTestId(/star-/i);

        const clearBtn = screen.getByRole("button", {
            name: /clear/i
        });
        act(() => {
            fireEvent.click(clearBtn);
        });

        for (const star of stars) {
            expect(star).toHaveClass("greyStar");
        }
    });

    test("edit review form should navigate to previous page when request response is success", async () => {
        jest.spyOn(reviewService, "getReviewById")
            .mockResolvedValueOnce({
                status: "Success",
                content: {
                    review: review
                }
            });

        jest.spyOn(reviewService, "editReviewById")
            .mockResolvedValueOnce({
                status: "Success"
            });

        renderComponent();

        const editReviewForm = screen.getByTestId("edit-review-form");

        act(() => {
            fireEvent.submit(editReviewForm);
        });

        const expectedResult = "/review/edit/b7dc7643-f8e2-420b-a0f7-e91b35986c28";

        await waitFor(() => {
            expect(window.location.pathname).toBe(expectedResult);
        });
    });

    test("edit review form should navigate to previous page when request response is success", async () => {
        jest.spyOn(reviewService, "getReviewById")
            .mockResolvedValueOnce({
                status: "Success",
                content: {
                    review: review
                }
            });

        jest.spyOn(reviewService, "editReviewById")
            .mockResolvedValueOnce({
                status: "Error",
                message: "error message"
            });

        renderComponent();

        const editReviewForm = screen.getByTestId("edit-review-form");

        act(() => {
            fireEvent.submit(editReviewForm);
        });

        const errorSpan = await screen.findByText(/error message/i);

        expect(errorSpan).toBeInTheDocument();
    });
});