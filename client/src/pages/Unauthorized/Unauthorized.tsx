import React from "react";
import styles from "./Unauthorized.module.scss"
import { useNavigate } from "react-router-dom";

export const Unauthorized: React.FC = () => {

    const navigate = useNavigate();
    return (
        <React.Fragment>
            <div className={styles.errorContainer}>
                <h2 className={styles.errorMessage}>401 Unauthorized</h2>
                <span className={styles.errorMessage}>You are not allowed to access this page</span>
            </div>
        </React.Fragment>
    );
}