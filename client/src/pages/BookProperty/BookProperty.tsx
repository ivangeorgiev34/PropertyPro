import React, { FormEventHandler, useState } from "react";
import styles from "./BookProperty.module.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import IBookPropertyForm from "../../interfaces/booking/IBookPropertyForm";
import { useError } from "../../hooks/useError";
import IBookPropertyFormErrors from "../../interfaces/booking/IBookPropertyFormErrors";
import { startDateValidation } from "../../validators/booking/startDateValidation";
import { guestsValidation } from "../../validators/booking/guestsValidation";
import { endDateValidation } from "../../validators/booking/endDateValidation";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { toggleLoaderOff, toggleLoaderOn } from "../../store/loader";
import { createBooking } from "../../services/bookingService";

export const BookProperty: React.FC = () => {
    const { propertyId } = useParams();
    const dispatch = useAppDispatch();
    const { token } = useAppSelector(state => state.auth);
    const navigate = useNavigate();
    const [errors, setErrors] = useState<string[]>([]);

    const { formValues, onFormChange } = useForm<IBookPropertyForm>({
        startDate: "",
        endDate: "",
        guests: 1
    });

    const { formErrors, onFormErrorChange } = useError<IBookPropertyFormErrors>({
        startDate: "",
        endDate: "",
        guests: ""
    })

    const areFormValuesIncorrect = (): boolean => {
        for (let key in formErrors) {
            if (formErrors.hasOwnProperty(key) && (formErrors as Record<string, any>)[key] !== '') {
                return true;
            }
        }

        for (let key in formValues) {
            if (formValues.hasOwnProperty(key) && (formValues as Record<string, any>)[key] === '') {
                return true;
            }
        }

        return false;
    };

    const onFormSubmit: FormEventHandler<HTMLFormElement> = (e: React.FormEvent<HTMLFormElement>): void => {
        dispatch(toggleLoaderOn());

        e.preventDefault();

        setErrors([]);

        createBooking(propertyId!, token!, formValues)
            .then(res => {
                if (res.status === "Success") {
                    navigate("/my-bookings");
                } else if (res.status === "Error") {
                    setErrors(state => [...state, res.message]);
                }
            })
            .catch(err => {
                setErrors(state => [...state, err]);
            })

        dispatch(toggleLoaderOff());
    };

    return (
        <div className={styles.formWrapper}>
            <form onSubmit={onFormSubmit} className={styles.cardForm}>
                <h2>Create a booking</h2>
                <hr />
                <div className={styles.inputContainer}>
                    <label htmlFor="startDate">Start date:</label>
                    <input type="date" id="startDate" name="startDate"
                        min={"2023-09-01"}
                        max={"2025-01-01"}
                        value={formValues.startDate}
                        onChange={onFormChange}
                        onBlur={(e) => onFormErrorChange(e, startDateValidation(formValues.startDate, formValues.endDate))} />
                    <span className={styles.error}>{formErrors.startDate}</span>
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="endDate">End date:</label>
                    <input type="date" id="endDate" name="endDate"
                        min={"2023-09-01"}
                        max={"2025-01-01"}
                        value={formValues.endDate}
                        onChange={onFormChange}
                        onBlur={(e) => onFormErrorChange(e, endDateValidation(formValues.startDate, formValues.endDate))} />
                    <span className={styles.error}>{formErrors.endDate}</span>
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="guests">Guests:</label>
                    <input type="number" id="guests" name="guests"
                        value={formValues.guests}
                        onChange={onFormChange}
                        onBlur={(e) => onFormErrorChange(e, guestsValidation(formValues.guests))} />
                    <span className={styles.error}>{formErrors.guests}</span>
                </div>
                <ul className={styles.errorsContainer}>
                    {errors.map(e =>
                        <li key={e}>
                            <span className={styles.error}>{e}</span>
                        </li>)}
                </ul>
                <button className={styles.bookBtn} disabled={areFormValuesIncorrect()}>Book</button>
            </form>
        </div>
    );
};