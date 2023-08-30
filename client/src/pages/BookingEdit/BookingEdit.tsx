import React, { FormEventHandler, useEffect, useMemo, useState } from "react";
import styles from "./BookingEdit.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { editBookingById, getBookingById } from "../../services/bookingService";
import { toggleLoaderOff, toggleLoaderOn } from "../../store/loader";
import IBookingEdit from "../../interfaces/booking/IBookingEdit";
import { useForm } from "../../hooks/useForm/useForm";
import IBookingEditForm from "../../interfaces/booking/IBookingEditForm";
import { useError } from "../../hooks/useError/useError";
import IBookingEditFormErrors from "../../interfaces/booking/IBookingEditFormErrors";
import { guestsValidation } from "../../validators/booking/guestValidation/guestsValidation";
import { startDateValidation } from "../../validators/booking/startDateValidation/startDateValidation";
import { endDateValidation } from "../../validators/booking/endDateValidation/endDateValidation";
import IResponse from "../../interfaces/IResponse";

export const BookingEdit: React.FC = () => {

    const [booking, setBooking] = useState<IBookingEdit | null>(null);
    const { role, token } = useAppSelector(state => state.auth);
    const { formValues, onFormChange, setDefaultValues } = useForm<IBookingEditForm | null>(null);
    const { formErrors, onFormErrorChange } = useError<IBookingEditFormErrors>({
        startDate: "",
        endDate: "",
        guests: ""
    });
    const [editError, setEditError] = useState<string>("");
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { bookingId } = useParams();

    useMemo(() => {
        if (booking !== null) {
            setDefaultValues({
                startDate: `${new Date(booking.startDate).getFullYear().toString()}-${(new Date(booking.startDate).getMonth() + 1).toString()}-${new Date(booking.startDate).getDate().toString()}`,
                endDate: `${new Date(booking.endDate).getFullYear().toString()}-${(new Date(booking.endDate).getMonth() + 1).toString()}-${new Date(booking.endDate).getDate().toString()}`,
                guests: booking.guests,
            });
        }
    }, [booking]);

    useEffect(() => {

        dispatch(toggleLoaderOn());

        if (role !== "Tenant") {
            navigate("/unauthorized");
        }

        getBookingById(bookingId!, token!)
            .then(res => {
                if (res.status === "Success") {
                    setBooking(res.content.booking);
                } else if (res.status === "Error") {
                    navigate("/notfound");
                }
            })
            .catch(err => {
                navigate("/notfound");
            })
            .finally(() => {
                dispatch(toggleLoaderOff());
            });

    }, []);

    const onEditBookingFormSubmit: FormEventHandler<HTMLFormElement> = async (e: React.FormEvent<HTMLFormElement>) => {

        dispatch(toggleLoaderOn());

        setEditError("");

        e.preventDefault();

        try {
            const response = await editBookingById(bookingId!, formValues!, token!);

            if (response.status === "Error") {
                setEditError(response.message);
            } else if (response.status === "Success") {
                navigate("/my-bookings");
            }

        } catch (error: any) {

            setEditError(error.toString());

        } finally {

            dispatch(toggleLoaderOff());

        }


    };

    return (
        <React.Fragment>
            {booking !== null
                ? <div className={styles.bookingEditCardWrapper}>
                    <form data-testid="edit-booking-form" className={styles.bookingEditCard} onSubmit={onEditBookingFormSubmit}>
                        <h2>Edit booking</h2>
                        <hr />
                        <div className={styles.inputContainer}>
                            <label htmlFor="startDate">Start date:</label>
                            <input type="date" id="startDate" name="startDate"
                                min={"2023-09-01"}
                                max={"2025-01-01"}
                                value={formValues?.startDate}
                                onChange={onFormChange}
                                onBlur={(e) => onFormErrorChange(e, startDateValidation(formValues?.startDate!, formValues?.endDate!))} />
                            <span className={styles.error}>{formErrors.startDate}</span>
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="endDate">End date:</label>
                            <input type="date" id="endDate" name="endDate"
                                min={"2023-09-01"}
                                max={"2025-01-01"}
                                value={formValues?.endDate}
                                onChange={onFormChange}
                                onBlur={(e) => onFormErrorChange(e, endDateValidation(formValues?.startDate!, formValues?.endDate!))} />
                            <span className={styles.error}>{formErrors.endDate}</span>
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="guests">Guests:</label>
                            <input type="number" id="guests" name="guests" value={formValues?.guests} onChange={onFormChange}
                                onBlur={(e) => onFormErrorChange(e, guestsValidation(formValues?.guests!))} />
                            <span className={styles.error}>{formErrors.guests}</span>
                        </div>
                        <span className={styles.error}>{editError}</span>
                        <button className={styles.submitBtn}>Submit</button>
                    </form>
                </div>
                : null}
        </React.Fragment>
    );
};