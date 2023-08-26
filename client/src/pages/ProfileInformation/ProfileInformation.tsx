import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../hooks/reduxHooks";
import { JsxElement } from "typescript";
import IProfileInfo from "../../interfaces/IProfileInfo";
import styles from "./ProfileInformation.module.scss";

export const ProfileInformation: React.FC = () => {
    const { userId } = useParams();
    const {
        id,
        firstName,
        middleName,
        lastName,
        email,
        gender,
        profilePicture,
        phoneNumber,
        age } = useAppSelector((state) => state.auth);

    const [isAuthorized, setIsAuthorized] = useState(true);
    const [profileInfo, setProfileInfo] = useState<IProfileInfo>();

    useEffect(() => {
        if (userId !== id || userId === null || id === null) {
            setIsAuthorized(false);
        } else {
            setProfileInfo({
                id: id!,
                firstName: firstName!,
                middleName: middleName!,
                lastName: lastName!,
                email: email!,
                gender: gender!,
                profilePicture: profilePicture!,
                phoneNumber: phoneNumber!,
                age: age!
            });
        }


    }, []);

    return (
        <React.Fragment>
            {isAuthorized === false
                ? <Navigate to={"/unauthorized"} />
                :
                <div className={styles.cardWrapper}>
                    <section className={styles.card}>
                        <h2>Profile information</h2>
                        <img
                            className={styles.profilePicture}
                            src={profileInfo?.profilePicture === null || profileInfo?.profilePicture === undefined
                                ? "https://thumbs.dreamstime.com/b/user-icon-flat-style-isolated-grey-background-user-icon-flat-style-isolated-grey-background-your-design-logo-131213475.jpg"
                                : `data:image/png;base64,${profileInfo?.profilePicture}`}
                            alt="profilePicture"
                        />
                        <div className={styles.informationContainer}>
                            <label>Full name:</label>
                            <span>{profileInfo?.firstName} {profileInfo?.middleName} {profileInfo?.lastName}</span>
                        </div>
                        <div className={styles.informationContainer}>
                            <label>Gender:</label>
                            <span>{profileInfo?.gender}</span>
                        </div>
                        <div className={styles.informationContainer}>
                            <label>Age:</label>
                            <span>{profileInfo?.age}</span>
                        </div>
                        <div className={styles.informationContainer}>
                            <label>Email:</label>
                            <span>{profileInfo?.email}</span>
                        </div>
                        <div className={styles.informationContainer}>
                            <label>Phone number:</label>
                            <span>{profileInfo?.phoneNumber}</span>
                        </div>
                        <Link to={`/profile/edit/${id}`} className={styles.editBtn}>Edit</Link>
                    </section>
                </div>
            }
        </React.Fragment>
    );
};