import React, { FormEventHandler, useEffect, useState } from "react";
import IProfileInfo from "../../interfaces/IProfileInfo";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { useNavigate, useParams } from "react-router-dom";
import IProfileEdit from "../../interfaces/IProfileEdit";
import { useForm } from "../../hooks/useForm/useForm";
import { useError } from "../../hooks/useError/useError";
import styles from "./ProfileEdit.module.scss";
import IProfileEditErrors from "../../interfaces/IProfileEditErrors";
import { toggleLoaderOff, toggleLoaderOn } from "../../store/loader";
import { editProfile } from "../../services/profileService";
import { updateUserInformation } from "../../store/auth";
import { firstNameValidation } from "../../validators/profile/firstNameValidation/firstNameValidation";
import { middleNameValidation } from "../../validators/profile/middleNameValidation/middleNameValidation";
import { lastNameValidation } from "../../validators/profile/lastNameValidation/lastNameValidation";
import { ageValidation } from "../../validators/profile/ageValidation/ageValidation";

export const ProfileEdit: React.FC = () => {

    const { userId } = useParams();
    const navigate = useNavigate();

    const {
        id,
        firstName,
        middleName,
        lastName,
        email,
        gender,
        profilePicture,
        phoneNumber,
        token,
        age } = useAppSelector((state) => state.auth);

    const dispatch = useAppDispatch();

    const [picture, setPicture] = useState<File>();
    const [errors, setErrors] = useState<string[]>([]);
    const [profileInfo, setProfileInfo] = useState<IProfileEdit>();

    const { formValues, onFormChange } = useForm<IProfileEdit>({
        firstName: firstName!,
        middleName: middleName!,
        lastName: lastName!,
        gender: gender!,
        age: age!
    });

    const { formErrors, onFormErrorChange } = useError<IProfileEditErrors>({
        firstName: "",
        middleName: "",
        lastName: "",
        gender: "",
        profilePicture: "",
        age: ""
    });

    useEffect(() => {
        if (userId !== id || userId === null || id === null) {
            navigate("/unauthorized");
        } else {

            setProfileInfo({
                firstName: firstName!,
                middleName: middleName!,
                lastName: lastName!,
                gender: gender!,
                age: age!
            });
        }

    }, []);


    const onEditProfileForm: FormEventHandler<HTMLFormElement> = (e: React.FormEvent<HTMLFormElement>) => {

        dispatch(toggleLoaderOn());

        e.preventDefault();

        setErrors([]);

        const formData = new FormData();

        formData.append("FirstName", formValues.firstName);
        formData.append("middleName", formValues.middleName);
        formData.append("lastName", formValues.lastName);
        formData.append("age", formValues.age.toString());

        if (gender !== undefined) {
            formData.append("gender", formValues.gender!);
        }

        if (picture !== undefined) {
            formData.append("profilePicture", picture);
        }

        editProfile(id!, formData, token!)
            .then(res => {

                if (res.status === "Success") {

                    dispatch(updateUserInformation({
                        firstName: res.content.user.firstName,
                        middleName: res.content.user.middleName,
                        lastName: res.content.user.lastName,
                        age: res.content.user.age,
                        profilePicture: res.content.user.profilePicture,
                        gender: res.content.user.gender
                    }));

                    navigate(`/profile/${id}`);

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

    const fileInputChange = (e: React.FormEvent<HTMLInputElement>): void => {
        if (e.currentTarget.files![0] !== null) {
            setPicture(e.currentTarget.files![0]);
        }
    };

    return (
        <div className={styles.formWrapper}>
            <form className={styles.editProfileForm} onSubmit={onEditProfileForm} data-testid="edit-profile-form">
                <h2>Edit your profile</h2>
                <div className={styles.inputContainer}>
                    <input onChange={fileInputChange} id="profilePicture" name="profilePicture" type="file"
                        accept="image/png, image/jpg, image/jpeg"
                        data-testid="file-input" />
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="firstName">First name:</label>
                    <input value={formValues.firstName} type="text" placeholder="First name..." name="firstName"
                        onChange={onFormChange}
                        onBlur={(e) => onFormErrorChange(e, firstNameValidation(formValues.firstName))} />
                    {<p className={styles.error}>{formErrors.firstName}</p>}
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="middleName">Middle name:</label>
                    <input value={formValues.middleName} type="text" placeholder="Middle name..." name="middleName"
                        onChange={onFormChange}
                        onBlur={(e) => onFormErrorChange(e, middleNameValidation(formValues.middleName))} />
                    {<p className={styles.error}>{formErrors.middleName}</p>}
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="lastName">Last name:</label>
                    <input value={formValues.lastName} type="text" placeholder="Last name..." name="lastName"
                        onChange={onFormChange}
                        onBlur={(e) => onFormErrorChange(e, lastNameValidation(formValues.lastName))} />
                    {<p className={styles.error}>{formErrors.lastName}</p>}
                </div>
                <div className={styles.genderContainer}>
                    <div>
                        <label htmlFor="male">Male</label>
                        <input type="radio" id="male" name="gender" value="Male"
                            checked={formValues.gender === "Male"}
                            onChange={onFormChange} />
                    </div>
                    <div>
                        <label htmlFor="female">Female</label>
                        <input type="radio" id="female" name="gender" value="Female"
                            checked={formValues.gender === "Female"}
                            onChange={onFormChange} />
                    </div>
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="age">Age:</label>
                    <input value={formValues.age} type="number" placeholder="Age..." name="age"
                        onChange={onFormChange}
                        onBlur={(e) => onFormErrorChange(e, ageValidation(formValues.age))} />
                    {<p className={styles.error}>{formErrors.age}</p>}
                </div>
                <ul className={styles.errorsList}>
                    {errors.map(e =>
                        <li key={e} className={styles.errorListItem}>
                            <span className={styles.error}>{e}</span>
                        </li>
                    )}
                </ul>
                <button type="submit" disabled={areFormValuesIncorrect()} className={styles.submitBtn}>Submit</button>
            </form>
        </div>
    );
};