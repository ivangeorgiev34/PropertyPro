import React from "react";
import styles from "./Home.module.scss"
import { useAppSelector } from "../../hooks/reduxHooks";
import { GuestHome } from "../../components/home/GuestHome/GuestHome";
import { TenantHome } from "../../components/home/GuestHome/TenantHome/TenantHome";
import { LandlordHome } from "../../components/home/GuestHome/LandlordHome/LandlordHome";

export const Home: React.FC = () => {

    const { token, role } = useAppSelector((state) => state.auth);

    return (
        <React.Fragment>
            {role === null
                ? <GuestHome />
                : role === "Tenant"
                    ? <TenantHome />
                    : role === "Landlord"
                        ? <LandlordHome />
                        : null}
        </React.Fragment>
    );

};