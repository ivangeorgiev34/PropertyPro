import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { getLandlordsProperties } from "../../services/propertyService";
import styles from "./MyProperties.module.scss";
import { error } from "console";
import { Property } from "../../components/property/Property";
import IProperty from "../../interfaces/IProperty";
import { toggleLoaderOff, toggleLoaderOn } from "../../store/loader";

export const MyProperties: React.FC = () => {

    const { role, id, token } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [myProperties, setMyProperties] = useState<IProperty[] | null>(null);
    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {

        dispatch(toggleLoaderOn());

        if (role !== "Landlord") {
            navigate("/unauthorized");
        }

        getLandlordsProperties(id!, token!)
            .then(res => {
                if (res.hasOwnProperty("properties")) {

                    setMyProperties(res.properties);

                } else if (res.status === "Error") {
                    setErrors(state => [...state, res.message]);
                }
            })
            .catch(err => {
                setErrors(state => [...state, err]);
            })

        dispatch(toggleLoaderOff());

    }, []);

    return (
        <div className={styles.propertyCardsContainer}>
            {myProperties?.map((p: IProperty) => <Property key={p.id} {...p} />)}
        </div>
    );
}