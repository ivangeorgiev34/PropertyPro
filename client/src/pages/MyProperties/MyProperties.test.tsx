import { render, waitFor, screen, findAllByRole, fireEvent } from "@testing-library/react";
import { login, logout } from "../../store/auth";
import { store } from "../../store/store";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MyProperties } from "./MyProperties";
import { act } from "react-dom/test-utils";
import * as propertyService from "../../services/propertyService";
import IProperty from "../../interfaces/IProperty";

describe("My properties", () => {

    const property: IProperty = {
        id: "propertyId",
        title: "title",
        description: null,
        type: "apartment",
        town: "sofia",
        country: "bulgaria",
        guestPricePerNight: 2.32,
        maxGuestsCount: 2,
        bedroomsCount: 2,
        bedsCount: 2,
        bathroomsCount: 2,
        firstImage: "",
        secondImage: null,
        thirdImage: null
    };

    afterEach(() => {
        act(() => {
            act(() => {
                store.dispatch(logout());
            });

            jest.clearAllMocks();
        });
    });

    beforeEach(() => {
        const newPath = "/my-properties";

        const newURL = window.location.origin + newPath;

        history.pushState({}, '', newURL);
    });

    test("should redirect to unauthorized page url when role is not landlord", async () => {
        act(() => {
            store.dispatch(login({
                role: "Tenant"
            }));
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyProperties />
                </BrowserRouter>
            </Provider>
        );

        const expectedResult = "/unauthorized";

        await waitFor(() => {
            expect(window.location.pathname).toBe(expectedResult);
        });
    });

    test("page number should be 1 upon mount of component", () => {
        act(() => {
            store.dispatch(login({
                role: "Landlord"
            }));
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyProperties />
                </BrowserRouter>
            </Provider>
        );

        const pageNumberSpan = screen.getByText("1");

        expect(pageNumberSpan).toBeInTheDocument();
    });

    test("should set my properties when request response is success", async () => {
        act(() => {
            store.dispatch(login({
                role: "Landlord"
            }));
        });

        act(() => {
            jest.spyOn(propertyService, "getLandlordsProperties")
                .mockResolvedValueOnce({
                    status: "Success",
                    content: {
                        properties: [
                            property,
                            property
                        ]
                    }
                });
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyProperties />
                </BrowserRouter>
            </Provider>
        );

        const propertyHeadingsCount = (await screen.findAllByRole("heading")).length;

        await waitFor(() => {
            expect(propertyHeadingsCount).toBe(2);
        });
    });

    test("should set my properties to be null when request response is error", () => {
        act(() => {
            store.dispatch(login({
                role: "Landlord"
            }));
        });

        act(() => {
            jest.spyOn(propertyService, "getLandlordsProperties")
                .mockResolvedValueOnce({
                    status: "Error"
                });
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyProperties />
                </BrowserRouter>
            </Provider>
        );

        const propertyHeadingsCount = screen.queryAllByRole("heading").length;

        expect(propertyHeadingsCount).toBe(0);
    });

    test("should set errors when request response is error", async () => {
        act(() => {
            store.dispatch(login({
                role: "Landlord"
            }));
        });

        act(() => {
            jest.spyOn(propertyService, "getLandlordsProperties")
                .mockResolvedValueOnce({
                    status: "Error",
                    message: "error message"
                });
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyProperties />
                </BrowserRouter>
            </Provider>
        );

        const errorMessageElement = await screen.findByText(/error message/i);

        expect(errorMessageElement).toBeInTheDocument();
    });

    test("search form submit should clear search errors", () => {
        act(() => {
            store.dispatch(login({
                role: "Landlord"
            }));
        });

        act(() => {
            jest.spyOn(propertyService, "getLandlordsProperties")
                .mockResolvedValueOnce({
                    status: "Error",
                    message: "error message"
                });
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyProperties />
                </BrowserRouter>
            </Provider>
        );

        act(() => {
            const searchForm = screen.getByTestId("search-form");
            fireEvent.submit(searchForm);
        });

        const errorMessageElement = screen.queryByText(/error message/i);

        expect(errorMessageElement).toBeNull();
    });

    test("search form submit should set my properties to be null when response is error", () => {
        act(() => {
            store.dispatch(login({
                role: "Landlord"
            }));
        });

        act(() => {
            jest.spyOn(propertyService, "getLandlordsProperties")
                .mockResolvedValueOnce({
                    status: "Success",
                    content: {
                        properties: [
                            property,
                            property
                        ]
                    }
                });

            jest.spyOn(propertyService, "getPropertiesBySearch")
                .mockResolvedValueOnce({
                    status: "Error",
                    message: "error message"
                });
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyProperties />
                </BrowserRouter>
            </Provider>
        );
        act(() => {
            const searchForm = screen.getByTestId("search-form");
            fireEvent.submit(searchForm);
        });

        const propertyHeadingsCount = screen.queryAllByRole("heading").length;

        expect(propertyHeadingsCount).toBe(0);
    });

    test("search form submit should search errors when response is error", async () => {
        act(() => {
            store.dispatch(login({
                role: "Landlord"
            }));
        });

        act(() => {
            jest.spyOn(propertyService, "getLandlordsProperties")
                .mockResolvedValueOnce({
                    status: "Success",
                    content: {
                        properties: [
                            property,
                            property
                        ]
                    }
                });

            jest.spyOn(propertyService, "getPropertiesBySearch")
                .mockResolvedValueOnce({
                    status: "Error",
                    message: "error message"
                });
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyProperties />
                </BrowserRouter>
            </Provider>
        );
        act(() => {
            const searchForm = screen.getByTestId("search-form");
            fireEvent.submit(searchForm);
        });

        const searchErrorElement = await screen.findByText(/error message/i);

        expect(searchErrorElement).toBeInTheDocument();
    });

    test("search form submit should set my properties when response is success", async () => {
        act(() => {
            store.dispatch(login({
                role: "Landlord"
            }));
        });

        act(() => {
            jest.spyOn(propertyService, "getLandlordsProperties")
                .mockResolvedValueOnce({
                    status: "Success",
                    content: {
                        properties: [
                        ]
                    }
                });

            jest.spyOn(propertyService, "getPropertiesBySearch")
                .mockResolvedValueOnce({
                    status: "Success",
                    content: {
                        properties: [
                            property,
                            property
                        ]
                    }
                });
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyProperties />
                </BrowserRouter>
            </Provider>
        );
        act(() => {
            const searchForm = screen.getByTestId("search-form");
            fireEvent.submit(searchForm);
        });

        const propertyHeadingsCount = (await screen.findAllByRole("heading")).length;

        expect(propertyHeadingsCount).toBe(2);
    });

    test("view all button click should redirect to unauthorized page url when role is not landlord", async () => {
        act(() => {
            store.dispatch(login({
                role: "Tenant"
            }));
        });

        act(() => {
            jest.spyOn(propertyService, "getLandlordsProperties")
                .mockResolvedValue({
                    status: "Success",
                    content: {
                        properties: [
                            property,
                            property
                        ]
                    }
                });
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyProperties />
                </BrowserRouter>
            </Provider>
        );
        act(() => {
            const viewAllBtn = screen.getByRole("button", {
                name: /view all/i
            });
            fireEvent.click(viewAllBtn);
        });

        const expectedResult = "http://localhost/unauthorized";

        await waitFor(() => {
            expect(window.location.href).toBe(expectedResult);
        });
    });

    test("view all button click should set my properties when request response is success", async () => {
        act(() => {
            store.dispatch(login({
                role: "Landlord"
            }));
        });

        act(() => {
            jest.spyOn(propertyService, "getLandlordsProperties")
                .mockResolvedValue({
                    status: "Success",
                    content: {
                        properties: [
                            property,
                            property
                        ]
                    }
                });
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyProperties />
                </BrowserRouter>
            </Provider>
        );

        act(() => {
            const viewAllBtn = screen.getByRole("button", {
                name: "View All"
            });
            fireEvent.click(viewAllBtn);
        });

        const propertiesHeadingsCount = (await screen.findAllByRole("heading")).length;

        await waitFor(() => {
            expect(propertiesHeadingsCount).toBe(2);
        });
    });

    test("view all button click should set my properties to be null when request response is error", () => {

        act(() => {
            store.dispatch(login({
                role: "Landlord"
            }));
        });

        act(() => {
            jest.spyOn(propertyService, "getLandlordsProperties")
                .mockResolvedValue({
                    status: "Error",
                    message: "error message"
                });
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyProperties />
                </BrowserRouter>
            </Provider>
        );

        act(() => {
            const viewAllBtn = screen.getByRole("button", {
                name: "View All"
            });
            fireEvent.click(viewAllBtn);
        });

        const propertiesHeadingsCount = screen.queryAllByRole("heading").length;

        expect(propertiesHeadingsCount).toBe(0);
    });

    test("view all button click should set errors when request response is error", async () => {

        act(() => {
            store.dispatch(login({
                role: "Landlord"
            }));
        });

        jest.spyOn(propertyService, "getLandlordsProperties")
            .mockResolvedValueOnce({
                status: "Error",
                message: "error message 1"
            })
            .mockResolvedValueOnce({
                status: "Error",
                message: "error message 2"
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyProperties />
                </BrowserRouter>
            </Provider>
        );

        act(() => {
            const viewAllBtn = screen.getByRole("button", {
                name: "View All"
            });
            fireEvent.click(viewAllBtn);
        });

        const errorSpan = await screen.findByText(/error message 2/i);

        await waitFor(() => {
            expect(errorSpan).toBeInTheDocument();
        });
    });

    test("view all button click should remove any search params", async () => {

        act(() => {
            store.dispatch(login({
                role: "Landlord"
            }));
        });

        jest.spyOn(propertyService, "getLandlordsProperties")
            .mockResolvedValueOnce({
                status: "Error",
                message: "error message 1"
            })
            .mockResolvedValueOnce({
                status: "Error",
                message: "error message 2"
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyProperties />
                </BrowserRouter>
            </Provider>
        );
        const viewAllBtn = screen.getByRole("button", {
            name: "View All"
        });

        act(() => {
            fireEvent.click(viewAllBtn);
        });

        const expectedResult = "";

        await waitFor(() => {
            expect(window.location.search).toBe(expectedResult);
        });
    });

    test("next page button click should set properties to be null when request response is error and search value is null", async () => {

        act(() => {
            store.dispatch(login({
                role: "Landlord"
            }));
        });

        jest.spyOn(propertyService, "getLandlordsProperties")
            .mockResolvedValueOnce({
                status: "Success",
                content: {
                    properties: [
                        property,
                        property
                    ]
                }
            })
            .mockResolvedValueOnce({
                status: "Error",
                message: "error message"
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyProperties />
                </BrowserRouter>
            </Provider>
        );

        const nextPageBtn = screen.getByRole("button", {
            name: /next/i
        });
        act(() => {
            fireEvent.click(nextPageBtn);
        });

        const propertiesHeadingsCount = screen.queryAllByRole("heading").length;

        await waitFor(() => {
            expect(propertiesHeadingsCount).toBe(0);
        });
    });

    test("next page button click should set my properties to be null when request response is error and search value is not null", async () => {

        act(() => {
            store.dispatch(login({
                role: "Landlord"
            }));
        });

        jest.spyOn(propertyService, "getLandlordsProperties")
            .mockResolvedValue({
                status: "Success",
                content: {
                    properties: [
                        property,
                        property
                    ]
                }
            });

        jest.spyOn(propertyService, "getPropertiesBySearch")
            .mockResolvedValue({
                status: "Error",
                message: "error message"
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyProperties />
                </BrowserRouter>
            </Provider>
        );

        const searchInput = screen.getByRole("textbox");
        act(() => {
            fireEvent.change(searchInput, {
                target: {
                    value: "search"
                }
            });
        });

        const nextPageBtn = screen.getByRole("button", {
            name: /next/i
        });
        act(() => {
            fireEvent.click(nextPageBtn);
        });

        const propertiesHeadingsCount = screen.queryAllByRole("heading").length;

        await waitFor(() => {
            expect(propertiesHeadingsCount).toBe(0);
        });
    });

    test("previous button click should set my properties to be null when request response is error and search is null", async () => {

        act(() => {
            store.dispatch(login({
                role: "Landlord"
            }));
        });

        jest.spyOn(propertyService, "getLandlordsProperties")
            .mockResolvedValueOnce({
                status: "Success",
                content: {
                    properties: [
                        property,
                        property
                    ]
                }
            })
            .mockResolvedValueOnce({
                status: "Error",
                message: "error message"
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyProperties />
                </BrowserRouter>
            </Provider>
        );

        const previousPageClick = screen.getByRole("button", {
            name: /previous/i
        });
        act(() => {
            fireEvent.click(previousPageClick);
        });

        const propertiesHeadingsCount = (await screen.findAllByRole("heading")).length;

        await waitFor(() => {
            expect(propertiesHeadingsCount).toBe(2);
        });
    });

    test("previous button click should decrease page when request response is success and search is null", async () => {

        act(() => {
            store.dispatch(login({
                role: "Landlord"
            }));
        });

        jest.spyOn(propertyService, "getLandlordsProperties")
            .mockResolvedValueOnce({
                status: "Error",
                message: "error message"
            })
            .mockResolvedValueOnce({
                status: "Success",
                content: {
                    properties: [
                        property,
                        property
                    ]
                }
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyProperties />
                </BrowserRouter>
            </Provider>
        );

        const nextPageClick = screen.getByRole("button", {
            name: /next/i
        });
        act(() => {
            fireEvent.click(nextPageClick);
        });

        const previousPageClick = screen.getByRole("button", {
            name: /previous/i
        });
        act(() => {
            fireEvent.click(previousPageClick);
        });

        const pageNumberSpan = await screen.findByText("1");

        await waitFor(() => {
            expect(pageNumberSpan).toBeInTheDocument();
        });
    });

    test("previous button click should decrease page and add empty search params when request response is success and search is null", async () => {

        act(() => {
            store.dispatch(login({
                role: "Landlord"
            }));
        });

        jest.spyOn(propertyService, "getLandlordsProperties")
            .mockResolvedValueOnce({
                status: "Error",
                message: "error message"
            })
            .mockResolvedValueOnce({
                status: "Success",
                content: {
                    properties: [
                        property,
                        property
                    ]
                }
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyProperties />
                </BrowserRouter>
            </Provider>
        );

        const nextPageClick = screen.getByRole("button", {
            name: /next/i
        });
        act(() => {
            fireEvent.click(nextPageClick);
        });

        const previousPageClick = screen.getByRole("button", {
            name: /previous/i
        });
        act(() => {
            fireEvent.click(previousPageClick);
        });

        const expectedResult = "";

        await waitFor(() => {
            expect(window.location.search).toBe(expectedResult);
        });
    });

    //     act(() => {
    //         store.dispatch(login({
    //             role: "Landlord"
    //         }));
    //     });

    //     jest.spyOn(propertyService, "getLandlordsProperties")
    //         .mockResolvedValueOnce({
    //             status: "Error",
    //             message: "error message"
    //         })
    //         .mockResolvedValueOnce({
    //             status: "Success",
    //             content: {
    //                 properties: [
    //                     property,
    //                     property
    //                 ]
    //             }
    //         });

    //     render(
    //         <Provider store={store}>
    //             <BrowserRouter>
    //                 <MyProperties />
    //             </BrowserRouter>
    //         </Provider>
    //     );

    //     const nextPageClick = screen.getByRole("button", {
    //         name: /next/i
    //     });
    //     act(() => {
    //         fireEvent.click(nextPageClick);
    //         fireEvent.click(nextPageClick);
    //     });

    //     const previousPageClick = screen.getByRole("button", {
    //         name: /previous/i
    //     });
    //     act(() => {
    //         fireEvent.click(previousPageClick);
    //     });

    //     const expectedResult = "page=2";

    //     await waitFor(() => {
    //         expect(window.location.search).toBe(expectedResult);
    //     });
    // });

    // test("previous button click should set search error when request response is error and search is not null", async () => {

    //     jest.spyOn(propertyService, "getLandlordsProperties")
    //         .mockResolvedValueOnce({
    //             status: "Success",
    //             content: {
    //                 properties: [
    //                     property,
    //                     property
    //                 ]
    //             }
    //         });

    //     jest.spyOn(propertyService, "getPropertiesBySearch")
    //         .mockResolvedValueOnce({
    //             status: "Error",
    //             message: "error message"
    //         });

    //     render(
    //         <Provider store={store}>
    //             <BrowserRouter>
    //                 <MyProperties />
    //             </BrowserRouter>
    //         </Provider>
    //     );

    //     const searchInput = screen.getByRole("textbox");
    //     act(() => {
    //         fireEvent.change(searchInput, {
    //             target: {
    //                 value: "search"
    //             }
    //         });
    //     });

    //     const previousPageBtn = screen.getByRole("button", {
    //         name: /previous/i
    //     });
    //     act(() => {
    //         fireEvent.click(previousPageBtn);
    //     });

    //     const errorSpan = await screen.findByText(/error message/i);

    //     await waitFor(() => {
    //         expect(errorSpan).toBeInTheDocument();
    //     });
    // });

    test("previous button click should set search error when request response is error and search is not null", async () => {

        jest.spyOn(propertyService, "getLandlordsProperties")
            .mockResolvedValueOnce({
                status: "Success",
                content: {
                    properties: [
                        property,
                        property
                    ]
                }
            });

        jest.spyOn(propertyService, "getPropertiesBySearch")
            .mockResolvedValueOnce({
                status: "Error",
                message: "error message"
            });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MyProperties />
                </BrowserRouter>
            </Provider>
        );

        const searchInput = screen.getByRole("textbox");
        act(() => {
            fireEvent.change(searchInput, {
                target: {
                    value: "search"
                }
            });
        });

        const previousPageBtn = screen.getByRole("button", {
            name: /previous/i
        });
        act(() => {
            fireEvent.click(previousPageBtn);
        });

        const propertiesHeadingsCount = screen.queryAllByRole("heading").length;

        await waitFor(() => {
            expect(propertiesHeadingsCount).toBe(0);
        });
    });

    //     jest.spyOn(propertyService, "getLandlordsProperties")
    //         .mockResolvedValueOnce({
    //             status: "Error",
    //             message: "error message"
    //         });

    //     jest.spyOn(propertyService, "getPropertiesBySearch")
    //         .mockResolvedValueOnce({
    //             status: "Success",
    //             content: {
    //                 properties: [
    //                     property,
    //                     property
    //                 ]
    //             }
    //         });

    //     render(
    //         <Provider store={store}>
    //             <BrowserRouter>
    //                 <MyProperties />
    //             </BrowserRouter>
    //         </Provider>
    //     );

    //     const searchInput = screen.getByRole("textbox");
    //     act(() => {
    //         fireEvent.change(searchInput, {
    //             target: {
    //                 value: "search"
    //             }
    //         });
    //     });

    //     const previousPageBtn = screen.getByRole("button", {
    //         name: /previous/i
    //     });
    //     act(() => {
    //         fireEvent.click(previousPageBtn);
    //     });

    //     const propertiesHeadingsCount = (await screen.findAllByRole("heading")).length;

    //     await waitFor(() => {
    //         expect(propertiesHeadingsCount).toBe(2);
    //     });
    // });

    // test("previous button click should decrease page when request response is success and search is not null", async () => {

    //     jest.spyOn(propertyService, "getLandlordsProperties")
    //         .mockResolvedValue({
    //             status: "Error",
    //             message: "error message"
    //         });

    //     jest.spyOn(propertyService, "getPropertiesBySearch")
    //         .mockResolvedValue({
    //             status: "Success",
    //             content: {
    //                 properties: [
    //                     property,
    //                     property
    //                 ]
    //             }
    //         });

    //     render(
    //         <Provider store={store}>
    //             <BrowserRouter>
    //                 <MyProperties />
    //             </BrowserRouter>
    //         </Provider>
    //     );

    //     const searchInput = screen.getByRole("textbox");
    //     act(() => {
    //         fireEvent.change(searchInput, {
    //             target: {
    //                 value: "search"
    //             }
    //         });
    //     });

    //     const nextPageBtn = screen.getByRole("button", {
    //         name: /next/i
    //     });
    //     act(() => {
    //         fireEvent.click(nextPageBtn);
    //         fireEvent.click(nextPageBtn);
    //     });

    //     const previousPageBtn = screen.getByRole("button", {
    //         name: /previous/i
    //     });
    //     act(() => {
    //         fireEvent.click(previousPageBtn);
    //     });

    //     const pageNumberSpan = await screen.findByText("2");

    //     await waitFor(() => {
    //         expect(pageNumberSpan).toBeInTheDocument();
    //     });
    // });

    // test("previous button click should decrease page should set search param when page number is 2 when request response is success and search is not null", async () => {

    //     jest.spyOn(propertyService, "getLandlordsProperties")
    //         .mockResolvedValue({
    //             status: "Error",
    //             message: "error message"
    //         });

    //     jest.spyOn(propertyService, "getPropertiesBySearch")
    //         .mockResolvedValue({
    //             status: "Success",
    //             content: {
    //                 properties: [
    //                     property,
    //                     property
    //                 ]
    //             }
    //         });

    //     render(
    //         <Provider store={store}>
    //             <BrowserRouter>
    //                 <MyProperties />
    //             </BrowserRouter>
    //         </Provider>
    //     );

    //     const searchOption = screen.getByRole("combobox") as HTMLSelectElement;
    //     fireEvent.change(searchOption, {
    //         target: {
    //             value: "country"
    //         }
    //     });

    //     const searchInput = screen.getByRole("textbox");
    //     act(() => {
    //         fireEvent.change(searchInput, {
    //             target: {
    //                 value: "search"
    //             }
    //         });
    //     });

    //     const nextPageBtn = screen.getByRole("button", {
    //         name: /next/i
    //     });
    //     act(() => {
    //         fireEvent.click(nextPageBtn);
    //     });

    //     const previousPageBtn = screen.getByRole("button", {
    //         name: /previous/i
    //     });
    //     act(() => {
    //         fireEvent.click(previousPageBtn);
    //     });

    //     const expectedResult = "?country=search";

    //     await waitFor(() => {
    //         expect(window.location.search).toBe(expectedResult);
    //     });
    // });

    // test("previous button click should decrease page should set search param when page number is 2 when request response is success and search is not null", async () => {

    //     jest.spyOn(propertyService, "getLandlordsProperties")
    //         .mockResolvedValue({
    //             status: "Error",
    //             message: "error message"
    //         });

    //     jest.spyOn(propertyService, "getPropertiesBySearch")
    //         .mockResolvedValue({
    //             status: "Success",
    //             content: {
    //                 properties: [
    //                     property,
    //                     property
    //                 ]
    //             }
    //         });

    //     render(
    //         <Provider store={store}>
    //             <BrowserRouter>
    //                 <MyProperties />
    //             </BrowserRouter>
    //         </Provider>
    //     );

    //     const searchOption = screen.getByRole("combobox") as HTMLSelectElement;
    //     fireEvent.change(searchOption, {
    //         target: {
    //             value: "country"
    //         }
    //     });

    //     const searchInput = screen.getByRole("textbox");
    //     act(() => {
    //         fireEvent.change(searchInput, {
    //             target: {
    //                 value: "search"
    //             }
    //         });
    //     });

    //     const nextPageBtn = screen.getByRole("button", {
    //         name: /next/i
    //     });
    //     act(() => {
    //         fireEvent.click(nextPageBtn);
    //         fireEvent.click(nextPageBtn);
    //     });

    //     const previousPageBtn = screen.getByRole("button", {
    //         name: /previous/i
    //     });
    //     act(() => {
    //         fireEvent.click(previousPageBtn);
    //     });

    //     const expectedResult = "?country=search&page=2";

    //     await waitFor(() => {
    //         expect(window.location.search).toBe(expectedResult);
    //     });
    // });
});