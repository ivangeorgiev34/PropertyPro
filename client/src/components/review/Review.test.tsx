import {
  fireEvent,
  getByText,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import IReview from "../../interfaces/review/IReview";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Review } from "./Review";
import { store } from "../../store/store";
import { login } from "../../store/auth";
import * as reviewService from "../../services/reviewService";

describe("Review", () => {
  const reviewProps: IReview = {
    id: "reviewId",
    stars: 3,
    description: "desc",
    tenant: {
      id: "tenantId",
      firstName: "tenant",
      middleName: "tenant",
      lastName: "tenant",
      age: 34,
      gender: "male",
      profilePicture: null,
    },
  };

  const onReviewDelete = (): void => {};

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("yellow stars and black stars are correctly loaded", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Review {...reviewProps} onReviewDelete={onReviewDelete} />
        </BrowserRouter>
      </Provider>
    );

    const yellowStarsCount = screen.getAllByTestId(/yellow-star/i).length;
    const blackStarsCount = screen.getAllByTestId(/black-star/i).length;

    expect(yellowStarsCount).toBe(3);
    expect(blackStarsCount).toBe(2);
  });

  test("delete button click error message span should be empty when window confirm is false", () => {
    store.dispatch(
      login({
        id: "tenantId",
      })
    );

    jest.spyOn(window, "confirm").mockReturnValue(false);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Review {...reviewProps} onReviewDelete={onReviewDelete} />
        </BrowserRouter>
      </Provider>
    );

    const deleteBtn = screen.getByRole("button", {
      name: /delete/i,
    });

    fireEvent.click(deleteBtn);

    const deleteError = screen.getByTestId("delete-error").textContent;

    expect(deleteError).toBe("");
  });

  test("delete button click error message span should not be empty when window confirm is true", () => {
    store.dispatch(
      login({
        id: "tenantId",
      })
    );

    jest.spyOn(window, "confirm").mockReturnValue(true);

    jest.spyOn(reviewService, "deleteReviewById").mockResolvedValue({
      status: "Error",
      message: "error message",
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Review {...reviewProps} onReviewDelete={onReviewDelete} />
        </BrowserRouter>
      </Provider>
    );

    const deleteBtn = screen.getByRole("button", {
      name: /delete/i,
    });

    fireEvent.click(deleteBtn);

    waitFor(() => {
      const deleteError = screen.getByText(/error message/i);

      expect(deleteError).toBeInTheDocument();
    });
  });

  test("delete button click should redirect to home page when request is successful", () => {
    store.dispatch(
      login({
        id: "tenantId",
      })
    );

    jest.spyOn(window, "confirm").mockReturnValue(true);

    jest.spyOn(reviewService, "deleteReviewById").mockResolvedValue({
      status: "Success",
      message: "success message",
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Review {...reviewProps} onReviewDelete={onReviewDelete} />
        </BrowserRouter>
      </Provider>
    );

    const deleteBtn = screen.getByRole("button", {
      name: /delete/i,
    });

    fireEvent.click(deleteBtn);

    const actualResult = window.location.href;
    const expectedResult = "http://localhost/";

    expect(actualResult).toBe(expectedResult);
  });

  test("profile picture should not show when tenant's profile picture is null", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Review {...reviewProps} onReviewDelete={onReviewDelete} />
        </BrowserRouter>
      </Provider>
    );

    const tenantProfilePicture: HTMLImageElement = screen.getByRole("img");

    const actualResult = tenantProfilePicture.src;
    const expectedResult =
      "https://thumbs.dreamstime.com/b/user-icon-flat-style-isolated-grey-background-user-icon-flat-style-isolated-grey-background-your-design-logo-131213475.jpg";

    expect(actualResult).toBe(expectedResult);
  });

  test("profile picture should show when tenant's profile picture is not null", () => {
    reviewProps.tenant.profilePicture = "";

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Review {...reviewProps} onReviewDelete={onReviewDelete} />
        </BrowserRouter>
      </Provider>
    );

    const tenantProfilePicture: HTMLImageElement = screen.getByRole("img");

    const actualResult = tenantProfilePicture.src;
    const expectedResult =
      "https://thumbs.dreamstime.com/b/user-icon-flat-style-isolated-grey-background-user-icon-flat-style-isolated-grey-background-your-design-logo-131213475.jpg";

    expect(actualResult).not.toBe(expectedResult);
  });

  test("edit link should redirect to review edit page", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Review {...reviewProps} onReviewDelete={onReviewDelete} />
        </BrowserRouter>
      </Provider>
    );

    const editLink = screen.getByRole("link", {
      name: /edit/i,
    });

    fireEvent.click(editLink);

    const actualResult = window.location.href;
    const expectedResult = "http://localhost/review/edit/reviewId";

    expect(actualResult).toBe(expectedResult);
  });
});
