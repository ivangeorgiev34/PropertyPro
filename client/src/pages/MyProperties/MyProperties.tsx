import React, { FormEventHandler, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { getLandlordsProperties, getPropertiesBySearch } from "../../services/propertyService";
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
    const [searchOption, setSearchOption] = useState<string>("Title");
    const [searchValue, setSearchValue] = useState<string>("");
    const [searchErrors, setSearchErrors] = useState<string[]>([]);

    useEffect(() => {

        dispatch(toggleLoaderOn());

        if (role !== "Landlord") {
            navigate("/unauthorized");
        }

        getLandlordsProperties(id!, token!)
            .then(res => {
                if (res.hasOwnProperty("properties")) {

                    setMyProperties(res.properties);
                }

                dispatch(toggleLoaderOff());
            });
    }, []);

    const onSeacrhSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        dispatch(toggleLoaderOn());

        setSearchErrors([]);

        e.preventDefault();

        try {
            const response = await getPropertiesBySearch(token!, searchOption, searchValue);

            if (response.status === "Error") {
                setMyProperties([]);
                setSearchErrors(state => [...state, response.message])
            } else if (response.status === "Success") {
                setMyProperties(response.content);
            }
        } catch (error) {

        } finally {
            dispatch(toggleLoaderOff());
        }
    }

    const onViewAllBtnClick = () => {
        dispatch(toggleLoaderOn());

        setSearchErrors([]);

        getLandlordsProperties(id!, token!)
            .then(res => {
                if (res.hasOwnProperty("properties")) {

                    setMyProperties(res.properties);
                }

                dispatch(toggleLoaderOff());
            });
    }

    return (
        <React.Fragment>
            <div className={styles.myPropertiesWrapper}>
                <form className={styles.searchBarContainer}
                    onSubmit={onSeacrhSubmit}>
                    <input type="text" placeholder="Search" className={styles.searchInput}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)} />
                    <select name="searchOptions" id={styles.searchOptions} onChange={(e) => setSearchOption(e.currentTarget.value)}>
                        <option value="title">Title</option>
                        <option value="town">Town</option>
                        <option value="country">Title</option>
                    </select>
                    <button className={styles.searchBtn}><i className="fa-solid fa-magnifying-glass"></i></button>
                </form>
                <button className={styles.viewAllBtn} onClick={onViewAllBtnClick}>View All</button>
                <ul className={styles.errorsContainer}>
                    {searchErrors.map(err => {
                        return (
                            <li>
                                <span className={styles.error}>{err}</span>
                            </li>
                        );
                    })}
                </ul>
                <div className={styles.propertyCardsContainer}>
                    {myProperties?.map((p: IProperty) => <Property key={p.id} {...p} />)}
                </div>
            </div>
        </React.Fragment>
    );
}