import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { Navigate, Outlet } from "react-router-dom";
import { logout } from "../store/auth";
export const PublicRouteGuard: React.FC = () => {
    const { expires } = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch();

    if (expires !== null) {

        return <Navigate to={"/home"} />;

    } else if (new Date(expires!).getTime() >= Date.now()) {

        return <Navigate to={"/home"} />;

    }

    return <Outlet />;

};