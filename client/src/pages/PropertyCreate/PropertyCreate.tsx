import React, { FormEventHandler, useEffect, useState } from "react";
import styles from "./PropertyCreate.module.scss";
import { useForm } from "../../hooks/useForm/useForm";
import IPropertyCreateForm from "../../interfaces/IPropertyCreateForm";
import { useError } from "../../hooks/useError/useError";
import IPropertyCreateFormErrors from "../../interfaces/IPropertyCreateFormErrors";
import { propertyTitleValidation } from "../../validators/property/propertyTitleValidation";
import { townValidation } from "../../validators/property/townValidation";
import { countryValidation } from "../../validators/property/countryValidation";
import { guestPricePerNightValidation } from "../../validators/property/guestPricePerNightValidation";
import { maxGuestsCountValidation } from "../../validators/property/maxGuestsCountValidation";
import { bedroomsCountValidation } from "../../validators/property/bedroomsCountValidation";
import { bedsCountValidation } from "../../validators/property/bedsCountValidation";
import { bathroomsCountValidation } from "../../validators/property/bathroomsCountValidation";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { toggleLoaderOff, toggleLoaderOn } from "../../store/loader";
import { createProperty } from "../../services/propertyService";
import { useNavigate } from "react-router-dom";

export const PropertyCreate: React.FC = () => {

    const [errors, setErrors] = useState<string[]>([]);
    const dispatch = useAppDispatch();
    const { token, role } = useAppSelector(state => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (role !== "Landlord") {
            navigate("/unauthorized");
        }
    }, []);

    const { formValues, onFormChange, onFormChangeImage } = useForm<IPropertyCreateForm>({
        title: "",
        description: "",
        type: "Apartment",
        town: "",
        country: "",
        guestPricePerNight: 0.0,
        maxGuestsCount: 0,
        bedroomsCount: 0,
        bedsCount: 0,
        bathroomsCount: 0,
        firstImage: null,
        secondImage: null,
        thirdImage: null
    });

    const { formErrors, onFormErrorChange } = useError<IPropertyCreateFormErrors>({
        title: "",
        description: "",
        type: "",
        town: "",
        country: "",
        guestPricePerNight: "",
        maxGuestsCount: "",
        bedroomsCount: "",
        bedsCount: "",
        bathroomsCount: "",
        firstImage: ""
    });

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

    const firstImageChange = (e: React.FormEvent<HTMLInputElement>): void => {
        const eventTarget = e.currentTarget as HTMLInputElement;
        console.log(eventTarget);
        if (eventTarget.files?.item(0) === null) {
            onFormErrorChange(e, "First image is required");
        } else {
            onFormErrorChange(e, "");
        }
    };

    const onFormSubmit: FormEventHandler<HTMLFormElement> = (e: React.FormEvent<HTMLFormElement>): void => {
        dispatch(toggleLoaderOn());

        e.preventDefault();

        setErrors([]);

        const formData = new FormData();

        formData.append("title", formValues.title);
        formData.append("description", formValues.description);
        formData.append("type", formValues.type);
        formData.append("town", formValues.town);
        formData.append("country", formValues.country);
        formData.append("guestPricePerNight", formValues.guestPricePerNight.toString());
        formData.append("maxGuestsCount", formValues.maxGuestsCount.toString());
        formData.append("bedroomsCount", formValues.bedroomsCount.toString());
        formData.append("bedsCount", formValues.bedsCount.toString());
        formData.append("bathroomsCount", formValues.bathroomsCount.toString());

        if (formValues.firstImage !== null) {
            formData.append("firstImage", formValues.firstImage);
        }

        if (formValues.secondImage !== null) {
            formData.append("secondImage", formValues.secondImage);
        }

        if (formValues.thirdImage !== null) {
            formData.append("thirdImage", formValues.thirdImage);
        }

        createProperty(token!, formData)
            .then(res => {
                if (res.status === "Success") {
                    navigate("/my-properties");
                } else if (res.status === "Error") {
                    setErrors(state => [...state, res.message]);
                }

                dispatch(toggleLoaderOff());
            })
            .catch(err => {
                setErrors(state => [...state, err]);

                dispatch(toggleLoaderOff());
            });

    };
    return (
        <div className={styles.cardWrapper}>
            <form onSubmit={onFormSubmit} className={styles.card}>
                <h2>Create property</h2>
                <hr />
                <div className={styles.imageContainer}>
                    <label htmlFor="firstImage">First image:</label>
                    <input data-testid="first-image-input" type="file" accept="image/png, image/jpg, image/jpeg" name="firstImage" onChange={(e) => {
                        firstImageChange(e);
                        onFormChangeImage(e);
                    }} />
                    <span className={styles.error}>{formErrors.firstImage}</span>
                </div>
                <div className={styles.imageContainer}>
                    <label htmlFor="secondImage">Second image:</label>
                    <input type="file" accept="image/png, image/jpg, image/jpeg" name="secondImage" onChange={onFormChangeImage} />
                </div>
                <div className={styles.imageContainer}>
                    <label htmlFor="thirdImage">Third image:</label>
                    <input type="file" accept="image/png, image/jpg, image/jpeg" name="thirdImage" onChange={onFormChangeImage} />
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="title">Title:</label>
                    <input id="title" type="text" name="title" placeholder="Title..."
                        value={formValues?.title}
                        onChange={onFormChange}
                        onBlur={(e) => onFormErrorChange(e, propertyTitleValidation(formValues?.title))} />
                    <span className={styles.error}>{formErrors.title}</span>
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="description">Description:</label>
                    <input id="description" name="description" placeholder="Description..."
                        value={formValues?.description}
                        onChange={onFormChange} />
                    <span className={styles.error}>{formErrors.description}</span>
                </div>
                <div className={styles.inputContainer}>
                    <div className={styles.typeContainer}>
                        <label htmlFor="apartment">Apartment:</label>
                        <input type="radio" id="apartment" name="type" value="Apartment" onChange={onFormChange} checked={formValues.type === "Apartment"} />
                    </div>
                    <div className={styles.typeContainer}>
                        <label htmlFor="house">House:</label>
                        <input type="radio" id="house" name="type" value="House" onChange={onFormChange} checked={formValues.type === "House"} />
                    </div>
                    <div className={styles.typeContainer}>
                        <label htmlFor="room">Room:</label>
                        <input type="radio" name='type' id='room' value="Room" onChange={onFormChange} checked={formValues.type === "Room"} />
                    </div>
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="town">Town:</label>
                    <input id="town" name="town" placeholder="Town..."
                        value={formValues?.town}
                        onChange={onFormChange}
                        onBlur={(e) => onFormErrorChange(e, townValidation(formValues?.town))} />
                    <span className={styles.error}>{formErrors.town}</span>
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="country">Country:</label>
                    <input id="country" name="country" placeholder="Country..."
                        value={formValues?.country}
                        onChange={onFormChange}
                        onBlur={(e) => onFormErrorChange(e, countryValidation(formValues?.country))} />
                    <span className={styles.error}>{formErrors.country}</span>
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="guestPricePerNight">Guest price per night:</label>
                    <input type="number" id="guestPricePerNight" name="guestPricePerNight" placeholder="Guest price per night..."
                        value={formValues?.guestPricePerNight}
                        onChange={onFormChange}
                        onBlur={(e) => onFormErrorChange(e, guestPricePerNightValidation(formValues?.guestPricePerNight))} />
                    <span className={styles.error}>{formErrors.guestPricePerNight}</span>
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="maxGuestsCount">Max guests count:</label>
                    <input type="number" id="maxGuestsCount" name="maxGuestsCount" placeholder="Max guests count..."
                        value={formValues?.maxGuestsCount}
                        onChange={onFormChange}
                        onBlur={(e) => onFormErrorChange(e, maxGuestsCountValidation(formValues?.maxGuestsCount))} />
                    <span className={styles.error}>{formErrors.maxGuestsCount}</span>
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="bedroomsCount">Bedrooms count:</label>
                    <input type="number" id="bedroomsCount" name="bedroomsCount" placeholder="Bedrooms count..."
                        value={formValues?.bedroomsCount}
                        onChange={onFormChange}
                        onBlur={(e) => onFormErrorChange(e, bedroomsCountValidation(formValues?.bedroomsCount))} />
                    <span className={styles.error}>{formErrors.bedroomsCount}</span>
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="bedsCount">Beds count:</label>
                    <input type="number" id="bedsCount" name="bedsCount" placeholder="Beds count..."
                        value={formValues?.bedsCount}
                        onChange={onFormChange}
                        onBlur={(e) => onFormErrorChange(e, bedsCountValidation(formValues?.bedsCount))} />
                    <span className={styles.error}>{formErrors.bedsCount}</span>
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="bathroomsCount">Bathrooms count:</label>
                    <input type="number" id="bathroomsCount" name="bathroomsCount" placeholder="Bathrooms count..."
                        value={formValues?.bathroomsCount}
                        onChange={onFormChange}
                        onBlur={(e) => onFormErrorChange(e, bathroomsCountValidation(formValues?.bathroomsCount))} />
                    <span className={styles.error}>{formErrors.bathroomsCount}</span>
                </div>
                <ul className={styles.errorsContainer}>
                    {errors.map(e =>
                        <li key={e}>
                            <span className={styles.error}>{e}</span>
                        </li>
                    )}
                </ul>
                <button disabled={areFormValuesIncorrect() || formValues.firstImage === null} className={styles.submitBtn}>Submit</button>
            </form>
        </div>
    );
};