import React, { Children } from "react";
import styles from "./Loader.module.scss";
interface ILoader {
    children: React.ReactNode;
}
export const Loader: React.FC<ILoader> = ({ children }) => {

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
            {children}
        </div>
    );
};