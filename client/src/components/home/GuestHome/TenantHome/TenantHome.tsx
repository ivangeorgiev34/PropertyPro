import React, { useEffect, useState } from "react";
import styles from "./TenantHome.module.scss";
import IProperty from "../../../../interfaces/IProperty";
import { useAppDispatch, useAppSelector } from "../../../../hooks/reduxHooks";
import { Link, useNavigate } from "react-router-dom";
import { toggleLoaderOff, toggleLoaderOn } from "../../../../store/loader";
import { getAllProperties } from "../../../../services/propertyService";
import { Property } from "../../../property/Property";

export const TenantHome: React.FC = () => {
    const { token, role } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [allProperties, setAllProperties] = useState<IProperty[]>([]);

    useEffect(() => {

        dispatch(toggleLoaderOn());

        if (role !== "Tenant") {
            navigate("unauthorized");
        }

        getAllProperties(token!)
            .then(res => {

                if (res.status === "Success") {
                    setAllProperties(res.content)
                }

            })
            .catch(err => {
                navigate("unauthorized");
            })
            .finally(() => {
                dispatch(toggleLoaderOff());
            });

    }, [])

    return (
        <div>
            <div className={styles.propertyCards}>
                {allProperties.map(p => {
                    return (
                        <div key={p.id} className={styles.propertyCard}>
                            <img className={styles.propertyCardImage}
                                src={`data:image/png;base64,${p.firstImage}`}
                                alt="" />
                            <h2>{p.title}</h2>
                            <p>{p.type} in {p.town}, {p.country}</p>
                            <p><b>{p.guestPricePerNight}$</b> per guest per night</p>
                            <Link to={`/property/details/${p.id}`} className={styles.propertyDetails}>Details</Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}