import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../hooks/reduxHooks";
import styles from "./MyBookings.module.scss";

export const MyBookings: React.FC = () => {

    const { role } = useAppSelector((state) => state.auth)
    const navigate = useNavigate();

    useEffect(() => {

        if (role !== "Tenant") {
            navigate("/unauthorized");
        }

    }, [])

    return (
        <React.Fragment>
            <p>my bookings</p>
        </React.Fragment>
    );
}