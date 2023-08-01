import React, { Children } from "react";
import styles from "./Loader.module.scss";
import { useAppSelector } from "../../hooks/reduxHooks";
export const Loader: React.FC = () => {
    const { isLoading } = useAppSelector(state => state.loader);
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