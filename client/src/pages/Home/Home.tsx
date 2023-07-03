import React from "react";
import styles from "./Home.module.scss"
import { useAppSelector } from "../../hooks/reduxHooks";

export const Home :React.FC = () => {

    const {token} = useAppSelector((state)=>state.auth);
    console.log(token);

return(
    <p>{token === null ? "null" : "not null"}</p>
); 

};