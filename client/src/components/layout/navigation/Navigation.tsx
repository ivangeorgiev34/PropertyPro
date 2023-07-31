import React, { useEffect, useState } from "react";
import styles from "./Navigation.module.scss";
import { Link } from "react-router-dom";
import { logout } from "../../../store/auth";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";

export const Navigation: React.FC = () => {

    const { token, profilePicture, id, role, firstName, lastName } = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch();

    const [hasProfilePicture, setHasProfilePicture] = useState(false);

    useEffect(() => {
        if (profilePicture === null) {
            setHasProfilePicture(false);
        } else {
            setHasProfilePicture(true);
        }
    }, []);

    return (
        <header>
            <nav id={styles.navBar}>
                <div className={styles.menu}>
                    <Link to={"/home"} className={styles.logo}>
                        <img className={styles.navLogoPicture} src="clipart-house-logo-6.png" alt="propertypro-logo" />
                        PropertyPro
                    </Link>
                    <ul>
                        {role !== null
                            ? role === "Tenant"
                                ? <li className={styles.navBarItem}><Link className={styles.myBookings} to={"/my-bookings"}>My bookings</Link></li>
                                : role === "Landlord"
                                    ? <React.Fragment>
                                        <li className={styles.navBarItem}>
                                            <Link className={styles.myProperties} to={"/my-properties"}>My properties
                                            </Link>
                                        </li>
                                        <li className={styles.navBarItem}>
                                            <Link className={styles.myProperties} to={"/property/create"}>Create a property
                                            </Link>
                                        </li>
                                    </React.Fragment>
                                    : null
                            : null}
                    </ul>
                </div>
                <ul>
                    {token === null
                        ? <React.Fragment>
                            <li className={styles.navBarItem}><Link className={styles.loginBtn} to={"/login"} >Login</Link></li>
                            <li className={styles.navBarItem}><Link className={styles.registerBtn} to={"/register"} >Register</Link></li>
                        </React.Fragment>
                        : <React.Fragment>
                            <li className={`${styles.navBarItem} ${styles.greeting}`}>Hello, {firstName} {lastName}!</li>
                            <li className={`${styles.navBarItem} ${styles.navBarItem}`}>
                                <Link to={`/profile/${id}`}>
                                    <img className={styles.profilePicture} src={
                                        profilePicture === null
                                            ? "https://thumbs.dreamstime.com/b/user-icon-flat-style-isolated-grey-background-user-icon-flat-style-isolated-grey-background-your-design-logo-131213475.jpg"
                                            : `data:image/png;base64,${profilePicture!}`
                                    } alt="profile picture" />
                                </Link>
                            </li>
                            <li className={styles.navBarItem}>
                                <Link className={styles.logoutBtn} onClick={() => dispatch(logout())} to={"/home"}>
                                    Logout
                                </Link>
                            </li>
                        </React.Fragment>
                    }
                </ul>
            </nav>
        </header>
    );

}