import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../hooks/reduxHooks";
import styles from "./Landlord.module.scss";
import { useEffect, useState } from "react";
import { logout } from "../../../../store/auth";
import { tokenExpiresValidation } from "../../../../validators/tokenExpiresValidation";

export const LandlordHome: React.FC = () => {

    const dispatch = useAppDispatch();
    const { firstName, lastName, expires, role } = useAppSelector(state => state.auth);
    const navigate = useNavigate();

    useEffect(() => {

        if (role !== "Landlord") {

            navigate("unauthorized");

        } else if (tokenExpiresValidation(expires!) === true) {

            dispatch(logout());

            navigate("/login");
        }

    }, [])

    return (
        <div className={styles.landlordHomeContainer}>
            <h1>Welcome to PropertyPro, {firstName} {lastName}!</h1>
            <hr />
            <div className={styles.actionCards}>
                <div className={styles.actionCard}>
                    <h3>Create property</h3>
                    <hr />
                    <p>List a property of yours, for rental, so tenants can rent it!</p>
                    <Link to={"/property/create"} className={styles.createPropertyBtn}>Create property</Link>
                </div>
                <div className={styles.actionCard}>
                    <h3>My properties</h3>
                    <hr />
                    <p>Take a look at your own listed properties in PropertyPro!</p>
                    <Link to={"/my-properties"} className={styles.myPropertiesBtn}>My properties</Link>
                </div>
            </div>
        </div>
    );
}