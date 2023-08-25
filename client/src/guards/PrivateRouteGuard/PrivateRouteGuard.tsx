import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { Navigate, Outlet } from "react-router-dom";
import { logout } from "../../store/auth";

export const PrivateRouteGuard: React.FC = () => {
    const { expires } = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch();

    if (expires === null) {

        return <Navigate to={"/login"} />;

    } else if (new Date(expires!).getTime() <= Date.now()) {

        dispatch(logout());

        return <Navigate to={"/login"} />;

    }

    return <Outlet />;
};