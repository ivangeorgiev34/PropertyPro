import React, { FormEventHandler, useEffect, useState } from "react";
import styles from "./Register.module.scss";
import { useForm } from "../../hooks/useForm/useForm";
import IRegisterForm from "../../interfaces/IRegisterForm";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { toggleLoaderOff, toggleLoaderOn } from "../../store/loader";
import { userRegister } from "../../services/authenticationService";
import { useError } from "../../hooks/useError/useError";
import { IRegisterFormErrors } from "../../interfaces/IRegisterFormErrors";
import { firstNameValidation } from "../../validators/profile/firstNameValidation/firstNameValidation";
import { middleNameValidation } from "../../validators/profile/middleNameValidation/middleNameValidation";
import { lastNameValidation } from "../../validators/profile/lastNameValidation/lastNameValidation";
import { ageValidation } from "../../validators/profile/ageValidation/ageValidation";
import { emailValidation } from "../../validators/profile/emailValidation/emailValidation";
import { passwordValidation } from "../../validators/profile/passwordValidation/passwordValidation";
import { passwordsMatchValidation } from "../../validators/profile/passwordsMatchValidation/passwordsMatchValidation";
import { usernameValidation } from "../../validators/usernameValidation";
import { phoneNumberValidation } from "../../validators/profile/phoneNumberValidation/phoneNumberValidation";

export const Register: React.FC = () => {

    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const [errors, setErrors] = useState<string[]>([]);

    const [role, setRole] = useState("Tenant");

    const { formErrors, onFormErrorChange } = useError<IRegisterFormErrors>({
        firstName: "",
        middleName: "",
        lastName: "",
        gender: "",
        age: "",
        email: "",
        username: "",
        phoneNumber: "",
        password: "",
        confirmPassword: ""
    });

    const { formValues, onFormChange } = useForm<IRegisterForm>({
        firstName: "",
        middleName: "",
        lastName: "",
        gender: "Male",
        age: 0,
        email: "",
        username: "",
        phoneNumber: "",
        password: "",
        confirmPassword: ""
    });


    const onRegisterFormSubmit: FormEventHandler<HTMLFormElement> = (e: React.FormEvent<HTMLFormElement>) => {

        dispatch(toggleLoaderOn());

        e.preventDefault();

        setErrors([]);

        userRegister(formValues, role)
            .then(res => {

                if (res.status === "Error") {

                    setErrors(state => [...state, res.message]);

                } else if (res.status === 400) {

                    setErrors(state => [...state, res.message]);

                } else {

                    navigate("/login");

                }

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

    return (
        <div className={styles.wrapper}>
            <div className={styles.formWrapper}>
                <div className={styles.registerOptions}>
                    <div className={styles.registerTenantOption}>
                        <button
                            className={role === "Tenant"
                                ? styles.registerTenantOptionSelected
                                : ""}
                            onClick={() => setRole("Tenant")}>
                            Register as tenant
                        </button>
                    </div>
                    <div className={styles.registerLandlordOption}>
                        <button
                            className={role === "Landlord"
                                ? styles.registerLandlordOptionSelected
                                : ""}
                            onClick={() => setRole("Landlord")}>
                            Register as landlord
                        </button>
                    </div>
                </div>
                <form className={styles.registerForm} onSubmit={onRegisterFormSubmit} data-testid="register-form">
                    <h2 className={styles.registerFormHeading}>Register in PropertyPro</h2>
                    <div className={styles.firstNameContainer}>
                        <label htmlFor="firstName">First name:</label>
                        <input type="text" name="firstName" placeholder="First name..."
                            value={formValues.firstName}
                            onChange={onFormChange}
                            onBlur={(e) => onFormErrorChange(e, firstNameValidation(formValues.firstName))} />
                        {<p className={styles.error}>{formErrors.firstName}</p>}
                    </div>
                    <div className={styles.middleNameContainer}>
                        <label htmlFor="middleName">Middle name:</label>
                        <input type="text" name="middleName" placeholder="Middle name..." value={formValues.middleName} onChange={onFormChange}
                            onBlur={(e) => onFormErrorChange(e, middleNameValidation(formValues.middleName))} />
                        {<p className={styles.error}>{formErrors.middleName}</p>}
                    </div>
                    <div className={styles.lastNameContainer}>
                        <label htmlFor="lastName">Last name:</label>
                        <input type="text" name="lastName" placeholder="Last name..." value={formValues.lastName} onChange={onFormChange}
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
                    <div className={styles.ageContainer}>
                        <label htmlFor="age">Age:</label>
                        <input type="number" name="age" value={formValues.age} onChange={onFormChange}
                            onBlur={(e) => onFormErrorChange(e, ageValidation(formValues.age))} />
                        {<p className={styles.error}>{formErrors.age}</p>}
                    </div>
                    <div className={styles.emailContainer}>
                        <label htmlFor="email">Email:</label>
                        <input type="text" name="email" placeholder="Email..." value={formValues.email} onChange={onFormChange}
                            onBlur={(e) => onFormErrorChange(e, emailValidation(formValues.email))} />
                        {<p className={styles.error}>{formErrors.email}</p>}
                    </div>
                    <div className={styles.usernameContainer}>
                        <label htmlFor="username">Username:</label>
                        <input type="text" name="username" placeholder="Username..." value={formValues.username} onChange={onFormChange}
                            onBlur={(e) => onFormErrorChange(e, usernameValidation(formValues.username))} />
                        {<p className={styles.error}>{formErrors.username}</p>}
                    </div>
                    <div className={styles.phoneNumberContainer}>
                        <label htmlFor="phoneNumber">Phone number:</label>
                        <input type="phone" name="phoneNumber" placeholder="Phone number..." value={formValues.phoneNumber} onChange={onFormChange}
                            onBlur={(e) => onFormErrorChange(e, phoneNumberValidation(formValues.phoneNumber))} />
                        {<p className={styles.error}>{formErrors.phoneNumber}</p>}
                    </div>
                    <div className={styles.passwordContainer}>
                        <label htmlFor="password">Password:</label>
                        <input type="password" name="password" placeholder="Password..." value={formValues.password} onChange={onFormChange}
                            onBlur={(e) => onFormErrorChange(e, passwordValidation(formValues.password))} />
                        {<p className={styles.error}>{formErrors.password}</p>}
                    </div>
                    <div className={styles.confirmPasswordContainer}>
                        <label htmlFor="confirmPassword">Confirm password:</label>
                        <input type="password" name="confirmPassword" placeholder="Confirm password..." value={formValues.confirmPassword} onChange={onFormChange}
                            onBlur={(e) => onFormErrorChange(e, passwordsMatchValidation(formValues.password, formValues.confirmPassword))} />
                        {<p className={styles.error}>{formErrors.confirmPassword}</p>}
                    </div>
                    <ul className={styles.errorsList}>
                        {errors.map(e =>
                            <li key={e} className={styles.errorListItem}>
                                <span className={styles.error}>{e}</span>
                            </li>
                        )}
                    </ul>
                    <span className={styles.loginLink}>
                        Already have an account?
                        <Link to={"/login"}> Click here to log in!</Link>
                    </span>
                    <button type="submit" disabled={areFormValuesIncorrect()} className={styles.registerBtn}>Register</button>
                </form>
            </div>
        </div>
    );
};