import React, { FormEventHandler, useEffect, useMemo, useState } from "react";
import styles from "./PropertyEdit.module.scss";
import IPropertyDetails from "../../interfaces/IPropertyDetails";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { toggleLoaderOff, toggleLoaderOn } from "../../store/loader";
import { useNavigate, useParams } from "react-router-dom";
import { editPropertyById, getLandlordPropertyById } from "../../services/propertyService";
import { useForm } from "../../hooks/useForm/useForm";
import IPropertyEditForm from "../../interfaces/IPropertyEditForm";
import { useError } from "../../hooks/useError/useError";
import IPropertyEditFormErrors from "../../interfaces/IPropertyEditFormErrors";
import { propertyTitleValidation } from "../../validators/property/propertyTitleValidation";
import { townValidation } from "../../validators/property/townValidation";
import { countryValidation } from "../../validators/property/countryValidation/countryValidation";
import { guestPricePerNightValidation } from "../../validators/property/guestPricePerNightValidation/guestPricePerNightValidation";
import { maxGuestsCountValidation } from "../../validators/property/maxGuestsCountValidation";
import { bedroomsCountValidation } from "../../validators/property/bedroomsCountValidation/bedroomsCountValidation";
import { bathroomsCountValidation } from "../../validators/property/bathroomsCountValidation/bathroomsCountValidation";
import { bedsCountValidation } from "../../validators/property/bedsCountValidation/bedsCountValidation";

export const PropertyEdit: React.FC = () => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { propertyId } = useParams();
    const [property, setProperty] = useState<IPropertyDetails | null>(null);
    const { id, role, token } = useAppSelector(state => state.auth);
    const [errors, setErrors] = useState<string[]>([]);

    const { formValues, setDefaultValues, onFormChange, onFormChangeImage } = useForm<IPropertyEditForm | null>(null);

    const { formErrors, onFormErrorChange } = useError<IPropertyEditFormErrors>({
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

    useMemo(() => {
        if (property !== null) {
            setDefaultValues({
                title: property?.title!,
                description: property?.description!,
                type: property?.type!,
                town: property?.town!,
                country: property?.country!,
                guestPricePerNight: property?.guestPricePerNight!,
                maxGuestsCount: property?.maxGuestsCount!,
                bedroomsCount: property?.bedroomsCount!,
                bedsCount: property?.bedsCount!,
                bathroomsCount: property?.bathroomsCount!,
                firstImage: null,
                secondImage: null,
                thirdImage: null
            });
        }
    }, [property]);

    useEffect(() => {
        dispatch(toggleLoaderOn());

        if (role !== "Landlord") {
            navigate("/unauthorized");
        }

        getLandlordPropertyById(propertyId!, token!)
            .then(res => {
                if (res.status === "Error") {

                    navigate("/notfound");

                } else if (res.hasOwnProperty("property")) {

                    if (res.property.landlord.id !== id) {
                        navigate("/unauthorized");
                    } else {
                        setProperty(res.property);
                    }
                }

                dispatch(toggleLoaderOff());

            })
            .catch(error => {
                navigate("/notfound");

                dispatch(toggleLoaderOff());

            });
    }, []);

    const firstImageChange = (e: React.FormEvent<HTMLInputElement>): void => {
        if (e.currentTarget.files?.item(0) === null) {
            onFormErrorChange(e, "First image is required");
        } else {
            onFormErrorChange(e, "");
        }
    };

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

    const onFormSubmit: FormEventHandler<HTMLFormElement> = (e: React.FormEvent<HTMLFormElement>) => {

        dispatch(toggleLoaderOn());

        e.preventDefault();

        setErrors([]);

        const formData = new FormData();

        formData.append("title", formValues!.title);
        formData.append("description", formValues!.description);
        formData.append("type", formValues!.type);
        formData.append("town", formValues!.town);
        formData.append("country", formValues!.country);
        formData.append("guestPricePerNight", formValues!.guestPricePerNight.toString());
        formData.append("maxGuestsCount", formValues!.maxGuestsCount.toString());
        formData.append("bedroomsCount", formValues!.bedroomsCount.toString());
        formData.append("bedsCount", formValues!.bedsCount.toString());
        formData.append("bathroomsCount", formValues!.bathroomsCount.toString());

        if (formValues!.firstImage !== null) {
            formData.append("firstImage", formValues!.firstImage);
        }

        if (formValues!.secondImage !== null) {
            formData.append("secondImage", formValues!.secondImage);
        }

        if (formValues!.thirdImage !== null) {
            formData.append("thirdImage", formValues!.thirdImage);
        }


        editPropertyById(propertyId!, formData, token!)
            .then(res => {
                if (res.status === "Success") {
                    navigate("/my-properties");
                } else if (res.status === "Error") {
                    setErrors(state => [...state, res.message]);
                }
                dispatch(toggleLoaderOff());
            })
            .catch(error => {
                setErrors(state => [...state, error]);

                dispatch(toggleLoaderOff());
            });

    };

    return (
        <React.Fragment>
            {property !== null && formValues !== null
                ?
                <div className={styles.cardWrapper}>
                    <form onSubmit={onFormSubmit} className={styles.card} data-testid="edit-property-form">
                        <div className={styles.imageContainer}>
                            <label htmlFor="firstImage">First image:</label>
                            <input type="file" accept="image/png, image/jpg, image/jpeg" name="firstImage" onChange={(e) => {
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
                            {errors.map(e => <li key={e}><span className={styles.error}>{e}</span></li>)}
                        </ul>
                        <button disabled={areFormValuesIncorrect() || formValues.firstImage === null} className={styles.submitBtn}>Submit</button>
                    </form>
                </div>
                : <div className={styles.cardWrapper}></div>}
        </React.Fragment >
    );
};