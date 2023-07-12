import React from "react";
import styles from "./Loader.module.scss";

export const Loader: React.FC = () => {

    return (
        <div>
            <div className={styles.overlay}>
                <div className={styles.spinner}>
                    <div className={styles.ldsRoller}>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>
        </div>
    );
};