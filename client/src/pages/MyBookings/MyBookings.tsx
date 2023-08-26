import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import styles from "./MyBookings.module.scss";
import { getUsersBookings, getUsersBookingsBySearch } from "../../services/bookingService";
import IMyBookings from "../../interfaces/booking/IMyBookings";
import { toggleLoaderOff, toggleLoaderOn } from "../../store/loader";
import { Booking } from "../../components/booking/Booking";

export const MyBookings: React.FC = () => {

    const { role, token } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [myBookings, setMyBookings] = useState<IMyBookings[]>([]);
    const [searchOption, setSearchOption] = useState<string>("Title");
    const [searchValue, setSearchValue] = useState<string>("");
    const [searchErrors, setSearchErrors] = useState<string[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState<number>(1);
    const [totalBookings, setTotalBookings] = useState<number>(0);

    useEffect(() => {

        dispatch(toggleLoaderOn());

        setSearchParams("");

        if (role !== "Tenant") {
            navigate("/unauthorized");
        }

        setSearchErrors([]);

        getUsersBookings(token!, 1)
            .then(res => {
                if (res.status === "Error") {
                    setMyBookings([]);
                    setTotalBookings(0);

                } else if (res.status === "Success") {

                    setMyBookings(res.content.bookings);
                    setTotalBookings(res.content.totalBookingsCount);

                }
                dispatch(toggleLoaderOff());
            })
            .catch(err => {
                dispatch(toggleLoaderOff());
            });
    }, []);

    const onViewAllBtnClick = () => {
        dispatch(toggleLoaderOn());

        setSearchErrors([]);

        if (role !== "Tenant") {
            navigate("/unauthorized");
        }

        setPage(1);

        setSearchValue("");

        getUsersBookings(token!, 1)
            .then(res => {
                if (res.status === "Success") {
                    setMyBookings(res.content.bookings);
                    setTotalBookings(res.content.totalBookingsCount);
                }
                dispatch(toggleLoaderOff());
            })
            .catch(err => {
                dispatch(toggleLoaderOff());
            });

        setSearchParams("");
    };

    const onSeacrhSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        dispatch(toggleLoaderOn());

        setSearchErrors([]);

        e.preventDefault();

        try {
            const response = await getUsersBookingsBySearch(token!, searchOption, searchValue, 1);

            if (response.status === "Error") {

                setMyBookings([]);
                setSearchErrors(state => [...state, response.message]);

            } else if (response.status === "Success") {

                setTotalBookings(response.content.totalBookingsCount);
                setMyBookings(response.content.bookings);

            }

        } catch (error: any) {
            setSearchErrors(state => [...state, error]);
        } finally {
            dispatch(toggleLoaderOff());
        }

        setSearchParams(`${searchOption.toLowerCase()}=${searchValue}`);
    };

    const onNextPageClick = async () => {

        dispatch(toggleLoaderOn());

        setSearchErrors([]);

        if (searchValue === "") {

            try {

                const response = await getUsersBookings(token!, page + 1);

                if (response.status === "Success") {
                    setPage(page => page + 1);
                    setMyBookings(response.content.bookings);
                } else if (response.status === "Error") {
                    setSearchErrors(state => [...state, response.message]);
                    setMyBookings([]);
                }

            } catch (error: any) {
                setSearchErrors(state => [...state, error]);
            } finally {
                dispatch(toggleLoaderOff());
            }

            setSearchParams(`page=${page + 1}`);

        } else {

            try {

                const response = await getUsersBookingsBySearch(token!, searchOption, searchValue, page + 1);

                if (response.status === "Success") {
                    setPage(page => page + 1);
                    setMyBookings(response.content.bookings);
                } else if (response.status === "Error") {
                    setSearchErrors(state => [...state, response.message]);
                    setMyBookings([]);
                }

            } catch (error: any) {
                setSearchErrors(state => [...state, error]);
            } finally {
                dispatch(toggleLoaderOff());
            }

            setSearchParams(`${searchOption.toLowerCase()}=${searchValue}&page=${page + 1}`);

        }
    };

    const onPreviousPageClick = async () => {
        dispatch(toggleLoaderOn());

        setSearchErrors([]);

        if (searchValue === "") {

            try {

                const response = await getUsersBookings(token!, page - 1);

                if (response.status === "Success") {
                    setPage(page => page - 1);
                    setMyBookings(response.content.bookings);
                } else if (response.status === "Error") {
                    setSearchErrors(state => [...state, response.message]);
                    setMyBookings([]);
                }

            } catch (error: any) {
                setSearchErrors(state => [...state, error]);
            } finally {
                dispatch(toggleLoaderOff());
            }

            if (page - 1 === 1) {
                setSearchParams("");
            } else {
                setSearchParams(`page=${page - 1}`);
            }

        } else {

            try {

                const response = await getUsersBookingsBySearch(token!, searchOption, searchValue, page - 1);

                if (response.status === "Success") {
                    setPage(page => page - 1);
                    setMyBookings(response.content.bookings);
                } else if (response.status === "Error") {
                    setSearchErrors(state => [...state, response.message]);
                    setMyBookings([]);
                }

            } catch (error: any) {
                setSearchErrors(state => [...state, error]);
            } finally {
                dispatch(toggleLoaderOff());
            }

            if (page - 1 === 1) {
                setSearchParams(`${searchOption.toLowerCase()}=${searchValue}`);
            } else {
                setSearchParams(`${searchOption.toLowerCase()}=${searchValue}&page=${page - 1}`);
            }

        }
    };

    return (
        <div className={styles.bookingCardsWrapper}>
            <form className={styles.searchBarContainer}
                data-testid="search-form"
                onSubmit={onSeacrhSubmit}>
                <input type="text" placeholder="Search" className={styles.searchInput}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)} />
                <select name="searchOptions" id={styles.searchOptions} onChange={(e) => setSearchOption(e.currentTarget.value)}>
                    <option value="title">Title</option>
                </select>
                <button className={styles.searchBtn}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                </button>
            </form>
            <div className={styles.viewAllBtnErrorsContainer}>
                <button className={styles.viewAllBtn} onClick={onViewAllBtnClick}>View All</button>
                <ul className={styles.errorsContainer}>
                    {searchErrors.map(err => {
                        return (
                            <li key={err}>
                                <span className={styles.error}>{err}</span>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className={styles.bookingCardContainer}>
                {myBookings.map((b: IMyBookings) => {
                    return (
                        <Booking key={b.id} {...b} />
                    );
                })}
            </div>
            <div className={styles.paginationBtns}>
                <button className={styles.paginationBtn}
                    disabled={page === 1}
                    onClick={onPreviousPageClick}>Previous
                </button>
                <span>{page}</span>
                <button className={styles.paginationBtn}
                    disabled={totalBookings - (page * 6) <= 0}
                    onClick={onNextPageClick}
                >Next
                </button>
            </div>
        </div>
    );
};