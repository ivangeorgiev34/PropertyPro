import React, { useState } from "react";
import styles from "./Booking.module.scss";
import IMyBookings from "../../interfaces/booking/IMyBookings";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { toggleLoaderOff, toggleLoaderOn } from "../../store/loader";
import { deleteBookingById } from "../../services/bookingService";

export const Booking: React.FC<IMyBookings> = (props) => {

    const [deleteError, setDeleteError] = useState<string>("");
    const dispatch = useAppDispatch();
    const { token } = useAppSelector(state => state.auth);
    const location = useLocation();
    const navigate = useNavigate();

    const onDeleteBookingClick = async () => {

        setDeleteError("");

        if (window.confirm("Are you sure you want to delete this booking?") === true) {

            dispatch(toggleLoaderOn());

            try {

                const response = await deleteBookingById(props.id, token!);

                if (response.status === "Error") {
                    setDeleteError(response.message);
                }

                navigate(location.pathname);

            } catch (error: any) {
                setDeleteError(error.toString());
            } finally {
                dispatch(toggleLoaderOff());
            }


        }
    }

    return (
        <div className={styles.bookingCard}>
            <h2>{props.property.title}</h2>
            <img
                className={styles.firstImage}
                src={`data:image/png;base64,${props.property.firstImage}`}
                alt="" />
            <p className={styles.bookingDates}>From {new Date(props.startDate).getDate()}/{Number(new Date(props.endDate).getMonth()) + 1}/{new Date(props.startDate).getFullYear()} to {new Date(props.endDate).getDate()}/{Number(new Date(props.endDate).getMonth()) + 1}/{new Date(props.endDate).getFullYear()}</p>
            <p className={styles.bookingGuests}>Guests: {props.guests}</p>
            <span data-testid="deleteErrorSpan" className={styles.error}>{deleteError}</span>
            <div className={styles.btnsContainer}>
                <Link className={styles.detailsBtn} to={`/property/details/${props.property.id}`}>
                    Details
                </Link>
                <Link className={styles.editBtn} to={`/booking/edit/${props.id}`}>Edit</Link>
                <button className={styles.deleteBtn} onClick={onDeleteBookingClick}>Delete</button>
            </div>
        </div>
    );
};