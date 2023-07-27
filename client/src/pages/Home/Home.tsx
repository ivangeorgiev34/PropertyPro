import React from "react";
import styles from "./Home.module.scss"
import { useAppSelector } from "../../hooks/reduxHooks";
import { GuestHome } from "../../components/home/GuestHome/GuestHome";

export const Home: React.FC = () => {

    const { token, role } = useAppSelector((state) => state.auth);

    return (
        <React.Fragment>
            {role === null
                ? <GuestHome />
                : null}
        </React.Fragment>
    );

};