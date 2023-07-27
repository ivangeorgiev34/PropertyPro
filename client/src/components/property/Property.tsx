import React from "react";
import IProperty from "../../interfaces/IProperty";
import styles from "./Property.module.scss";
import { Link } from "react-router-dom";

export const Property: React.FC<IProperty> = (props) => {
    return (
        <div className={styles.myPropertyCard}>
            <div className={styles.myPropertyCardContent}>
                <img className={styles.myPropertyCardImage}
                    src={`data:image/png;base64,${props.firstImage}`}
                    alt="" />
                <h2>{props.title}</h2>
                <p>{props.description}</p>
                <p>{props.type} in {props.town}, {props.country}</p>
            </div>
            <Link to={`/property/details/${props.id}`} className={styles.propertyDetails}>Details</Link>
        </div>
    );
};