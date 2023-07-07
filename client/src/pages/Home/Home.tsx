import React from "react";
import styles from "./Home.module.scss"
import { useAppSelector } from "../../hooks/reduxHooks";

export const Home: React.FC = () => {

    const { token } = useAppSelector((state) => state.auth);

    return (
        <p>{token === null ? "token is null" : "token is not null"}</p>
    );

};