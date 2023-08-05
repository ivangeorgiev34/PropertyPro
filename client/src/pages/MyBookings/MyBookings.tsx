import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import styles from "./MyBookings.module.scss";
import { getUsersBookings } from "../../services/bookingService";
import IMyBookings from "../../interfaces/booking/IMyBookings";
import { toggleLoaderOff, toggleLoaderOn } from "../../store/loader";
import { Booking } from "../../components/booking/Booking";

export const MyBookings: React.FC = () => {

    const { role, token } = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [myBookings, setMyBookings] = useState<IMyBookings[]>([]);
    const [errors, setErrors] = useState<string[]>([]);

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

    return (
        <div className={styles.bookingCardsWrapper}>
            {myBookings.map((b: IMyBookings) => {
                return (
                    <Booking key={b.id} {...b} />
                );
            })}
        </div>
    );
}