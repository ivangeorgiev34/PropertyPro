import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import styles from "./MyBookings.module.scss";
import { getUsersBookings, getUsersBookingsBySearch } from "../../services/bookingService";
import IMyBookings from "../../interfaces/booking/IMyBookings";
import { toggleLoaderOff, toggleLoaderOn } from "../../store/loader";
import { Booking } from "../../components/booking/Booking";

export const MyBookings: React.FC = () => {

    const { role, token, id } = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [myBookings, setMyBookings] = useState<IMyBookings[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [searchOption, setSearchOption] = useState<string>("Title");
    const [searchValue, setSearchValue] = useState<string>("");
    const [searchErrors, setSearchErrors] = useState<string[]>([]);

    useEffect(() => {

        dispatch(toggleLoaderOn());

        if (role !== "Tenant") {
            navigate("/unauthorized");
        }

        getUsersBookings(token!)
            .then(res => {
                if (res.status === "Error") {
                    setErrors(state => [...state, res.message]);
                } else if (res.status === "Success") {
                    setMyBookings(res.content.bookings);
                }
                dispatch(toggleLoaderOff());
            })
            .catch(err => {
                setErrors(state => [...state, err]);
                dispatch(toggleLoaderOff());
            })

    }, [])

    const onViewAllBtnClick = () => {
        dispatch(toggleLoaderOn());

        setSearchErrors([]);

        getUsersBookings(token!)
            .then(res => {
                if (res.status === "Error") {
                    setErrors(state => [...state, res.message]);
                } else if (res.status === "Success") {
                    setMyBookings(res.content.bookings);
                }
            })
            .catch(err => {
                setErrors(state => [...state, err]);
                dispatch(toggleLoaderOff());
            })
            .finally(() => {
                dispatch(toggleLoaderOff());
            });
    }

    const onSeacrhSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        dispatch(toggleLoaderOn());

        setSearchErrors([]);

        e.preventDefault();

        try {
            const response = await getUsersBookingsBySearch(token!, searchOption, searchValue);

            if (response.status === "Error") {
                setMyBookings([]);
                setSearchErrors(state => [...state, response.message]);
            } else if (response.status === "Success") {
                setMyBookings(response.content.bookings);
            }

        } catch (error: any) {
            setSearchErrors(state => [...state, error]);
        } finally {
            dispatch(toggleLoaderOff());
        }
    }


    return (
        <div className={styles.bookingCardsWrapper}>
            <form className={styles.searchBarContainer}
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
                            <li>
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
        </div>
    );
}