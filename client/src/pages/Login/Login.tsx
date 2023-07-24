import React, { FormEventHandler, FormHTMLAttributes, useState } from "react";
import styles from "./Login.module.scss"
import { Link } from "react-router-dom";
import { userLogin, userRegister } from "../../services/authenticationService";
import { useForm } from "../../hooks/useForm";
import { login } from "../../store/auth";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { useNavigate } from "react-router-dom";
import { toggleLoaderOff, toggleLoaderOn } from "../../store/loader"
import ILoginForm from "../../interfaces/ILoginForm";
import { useError } from "../../hooks/useError";
import { emailValidation } from "../../validators/emailValidation";
import { passwordValidation } from "../../validators/passwordValidation";


export const Login: React.FC = () => {

    const navigate = useNavigate();

    const { token } = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch()

    const { formValues, onFormChange } = useForm<ILoginForm>({
        email: "",
        password: ""
    });

    const { formErrors, onFormErrorChange } = useError<ILoginForm>({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState<string[]>([]);

    const onLogInFormSubmit: FormEventHandler<HTMLFormElement> = (e: React.FormEvent<HTMLFormElement>) => {

        dispatch(toggleLoaderOn());

        e.preventDefault();

        setErrors([]);

        userLogin(formValues.email, formValues.password)
            .then(res => {

                if (res.status === "Error") {

                    setErrors(state => [...state, res.message]);

                } else if (res.status === 400) {

                    if (res.errors.hasOwnProperty("Email") === true) {
                        setErrors(state => [...state, ...res.errors.Email])
                    }
                    if (res.errors.hasOwnProperty("Password") === true) {
                        setErrors(state => [...state, ...res.errors.Password])
                    }

                } else {

                    dispatch(login({
                        id: res.user.id,
                        firstName: res.user.firstName,
                        middleName: res.user.middleName,
                        lastName: res.user.lastName,
                        email: res.user.email,
                        gender: res.user.gender,
                        profilePicture: res.user.profilePicture,
                        phoneNumber: res.user.phoneNumber,
                        age: res.user.age,
                        role: res.user.role,
                        token: res.token,
                        expires: res.expires
                    }));

                    navigate("/home");

                }

                dispatch(toggleLoaderOff());
            });
    }

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
        <div className={styles.formWrapper}>
            <form className={styles.loginForm} onSubmit={onLogInFormSubmit}>
                <h2 className={styles.loginHeading}>Sign in to PropertyPro</h2>
                <div className={styles.emailContainer}>
                    <label htmlFor="email">Email:</label>
                    <input type="email" name="email" placeholder="Email..." value={formValues.email} onChange={onFormChange}
                        onBlur={(e) => onFormErrorChange(e, emailValidation(formValues.email))} />
                    {<p className={styles.error}>{formErrors.email}</p>}
                </div>
                <div className={styles.passwordContainer}>
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" placeholder="Password..." value={formValues.password} onChange={onFormChange}
                        onBlur={(e) => onFormErrorChange(e, passwordValidation(formValues.password))} />
                    {<p className={styles.error}>{formErrors.password}</p>}
                </div>
                <div className={styles.errorsContainer}>
                    {errors.map(e => {
                        return <p key={e} className={styles.error}>{e}</p>
                    })}
                </div>
                <span className={styles.registerLink}>
                    Don't have an account?
                    <Link to={"/register"}> Click here to register!</Link>
                </span>
                <button type="submit" disabled={areFormValuesIncorrect()} className={styles.loginBtn}>Log In</button>
            </form>
        </div >
    );
}