import React from "react";
import styles from "./NotFound.module.scss";

export const NotFound: React.FC = () => {
    return (
        <div className={styles.errorContainerWrapper}>
            <div className={styles.errorContainer}>
                <h2 className={styles.errorMessage}>404 Not Found</h2>
                <span className={styles.errorMessage}>The resource you are searching for, doesn't exist</span>
            </div>
        </div>
    )
};