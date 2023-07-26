import React from "react";
import IProperty from "../../interfaces/IProperty";
import styles from "./Property.module.scss";
import { Link } from "react-router-dom";

export const MyProperty: React.FC<IProperty> = (props) => {
    return (
        <div className={styles.myPropertyCard}>
            <img className={styles.myPropertyCardImage}
                src={`data:image/png;base64,${props.firstImage}`}
                alt="" />
            <h2>{props.title}</h2>
            <p>{props.description}</p>
            <p>{props.type} in {props.town}, {props.country}</p>
            <Link to={`/property/details/${props.id}`} className={styles.propertyDetails}>Details</Link>
        </div>
    );
};