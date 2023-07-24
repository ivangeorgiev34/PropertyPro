import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/reduxHooks";
import { getLandlordsProperties } from "../../services/propertyService";
import styles from "./MyProperties.module.scss";
import { error } from "console";

export const MyProperties: React.FC = () => {

    const { role, id, token } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();
    const [myProperties, setMyProperties] = useState([]);
    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {

        if (role !== "Landlord") {
            navigate("/unauthorized");
        }

        getLandlordsProperties(id!, token!)
            .then(res => {
                if (res.hasOwnProperty("properties")) {
                    //set properties
                } else if (res.status === "Error") {
                    setErrors(state => [...state, res.message]);
                }
            })


    }, []);

    return (
        <React.Fragment>
            {errors.length === 0
                ? <p>my properties</p>
                : errors.map(e => <span key={e}>{e}</span>)}
        </React.Fragment>
    );
}