import React, { useEffect, useState } from "react";
import styles from "./TenantHome.module.scss";
import IProperty from "../../../../interfaces/IProperty";
import { useAppDispatch, useAppSelector } from "../../../../hooks/reduxHooks";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toggleLoaderOff, toggleLoaderOn } from "../../../../store/loader";
import { getAllProperties, getAllPropertiesBySearch } from "../../../../services/propertyService";
import { Property } from "../../../property/Property";
import { versions } from "process";
import { logout } from "../../../../store/auth";
import { tokenExpiresValidation } from "../../../../validators/tokenExpiresValidation";

export const TenantHome: React.FC = () => {
    const { token, role, expires } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [allProperties, setAllProperties] = useState<IProperty[]>([]);
    const [searchOption, setSearchOption] = useState<string>("Title");
    const [searchValue, setSearchValue] = useState<string>("");
    const [searchErrors, setSearchErrors] = useState<string[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalProperties, setTotalProperties] = useState<number>(0);

    useEffect(() => {

        dispatch(toggleLoaderOn());

        if (role !== "Tenant") {
            navigate("/unauthorized");
        } else if (tokenExpiresValidation(expires!) === true) {

            dispatch(logout());

            navigate("/login");
        }

        setSearchErrors([]);

        setPage(1);

        getAllProperties(token!, page)
            .then(res => {

                if (res.status === "Success") {
                    setAllProperties(res.content.properties);
                    setTotalProperties(res.content.totalPropertiesCount);
                } else if (res.status === "Error") {
                    setAllProperties([]);
                    setSearchErrors(state => [...state, res.message]);
                }

            })
            .catch(err => {
                navigate("/unauthorized");
            })
            .finally(() => {
                dispatch(toggleLoaderOff());
            });

        setSearchParams("");

    }, [])

    const onSeacrhSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        dispatch(toggleLoaderOn());

        if (role !== "Tenant") {
            navigate("/unauthorized");
        }

        setSearchErrors([]);

        setPage(1);

        e.preventDefault();

        try {
            const response = await getAllPropertiesBySearch(token!, searchOption, searchValue, 1);

            if (response.status === "Error") {
                setAllProperties([]);
                setSearchErrors(state => [...state, response.message])
            } else if (response.status === "Success") {
                setAllProperties(response.content.properties);
                setTotalProperties(response.content.totalPropertiesCount);
            }
        } catch (error) {

        } finally {
            dispatch(toggleLoaderOff());
        }

        setSearchParams(`${searchOption.toLowerCase()}=${searchValue}`);
    }

    const onViewAllBtnClick = () => {
        dispatch(toggleLoaderOn());

        if (role !== "Tenant") {
            navigate("/unauthorized");
        }

        setSearchErrors([]);

        setPage(1);

        setSearchValue("");

        getAllProperties(token!, 1)
            .then(res => {

                if (res.status === "Success") {
                    setAllProperties(res.content.properties);
                    setTotalProperties(res.content.totalPropertiesCount);
                } else if (res.status === "Error") {
                    setAllProperties([]);
                    setSearchErrors(state => [...state, res.message]);
                }

            })
            .catch(err => {
                navigate("/unauthorized");
            })
            .finally(() => {
                dispatch(toggleLoaderOff());
            });

        setSearchParams("");
    }

    const onNextPageClick = async () => {
        dispatch(toggleLoaderOn());

        if (role !== "Tenant") {
            navigate("/unauthorized");
        }

        if (searchValue === "") {

            try {
                const response = await getAllProperties(token!, page + 1);

                if (response.status === "Error") {
                    setAllProperties([]);
                    setSearchErrors(state => [...state, response.message])
                } else if (response.status === "Success") {
                    setAllProperties(response.content.properties);
                    setTotalProperties(response.content.totalPropertiesCount);
                    setSearchParams(`page=${page + 1}`);
                    setPage(state => state + 1);
                }
            } catch (error) {

            } finally {
                dispatch(toggleLoaderOff());
            }

        } else {
            try {
                const response = await getAllPropertiesBySearch(token!, searchOption, searchValue, page + 1);

                if (response.status === "Error") {
                    setAllProperties([]);
                    setSearchErrors(state => [...state, response.message])
                } else if (response.status === "Success") {
                    setAllProperties(response.content.properties);
                    setTotalProperties(response.content.totalPropertiesCount);
                    setSearchParams(`${searchOption.toLowerCase()}=${searchValue}&page=${page + 1}`);
                    setPage(state => state + 1);
                }
            } catch (error) {

            } finally {
                dispatch(toggleLoaderOff());
            }
        }
    }

    const onPreviousPageClick = async () => {
        dispatch(toggleLoaderOn());

        if (role !== "Tenant") {
            navigate("/unauthorized");
        }

        if (searchValue === "") {

            try {
                const response = await getAllProperties(token!, page - 1);

                if (response.status === "Error") {
                    setAllProperties([]);
                    setSearchErrors(state => [...state, response.message])
                } else if (response.status === "Success") {
                    setAllProperties(response.content.properties);
                    setTotalProperties(response.content.totalPropertiesCount);
                    setSearchParams(`page=${page - 1}`);

                    if (page - 1 === 1) {
                        setSearchParams("");
                    } else {
                        setSearchParams(`page=${page - 1}`);
                    }

                    setPage(state => state - 1);
                }
            } catch (error) {

            } finally {
                dispatch(toggleLoaderOff());
            }

        } else {
            try {
                const response = await getAllPropertiesBySearch(token!, searchOption, searchValue, page - 1);

                if (response.status === "Error") {
                    setAllProperties([]);
                    setSearchErrors(state => [...state, response.message])
                } else if (response.status === "Success") {
                    setAllProperties(response.content.properties);
                    setTotalProperties(response.content.totalPropertiesCount);

                    if (page - 1 === 1) {
                        setSearchParams(`${searchOption.toLowerCase()}=${searchValue}`);
                    } else {
                        setSearchParams(`${searchOption.toLowerCase()}=${searchValue}&page=${page - 1}`);
                    }

                    setPage(state => state - 1);
                }
            } catch (error) {

            } finally {
                dispatch(toggleLoaderOff());
            }
        }
    }

    return (
        <React.Fragment>
            <div className={styles.searchBarContainerWrapper}>
                <form className={styles.searchBarContainer}
                    onSubmit={onSeacrhSubmit}>
                    <input type="text" placeholder="Search" className={styles.searchInput}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)} />
                    <select name="searchOptions" id={styles.searchOptions} onChange={(e) => setSearchOption(e.currentTarget.value)}>
                        <option value="title">Title</option>
                        <option value="town">Town</option>
                        <option value="country">Country</option>
                    </select>
                    <button className={styles.searchBtn}><i className="fa-solid fa-magnifying-glass"></i></button>
                </form>
                <button className={styles.viewAllBtn} onClick={onViewAllBtnClick}>View All</button>
                <ul className={styles.errorsContainer}>
                    {searchErrors.map(err => {
                        return (
                            <li key={err}>
                                <span className={styles.error}>{err}</span>
                            </li>
                        );
                    })}
                </ul>
            </div>
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
            <div className={styles.paginationBtnsWrapper}>
                <div className={styles.paginationBtns}>
                    <button className={styles.paginationBtn}
                        disabled={page === 1}
                        onClick={onPreviousPageClick}>
                        Previous
                    </button>
                    <span>{page}</span>
                    <button className={styles.paginationBtn}
                        disabled={totalProperties - (page * 6) <= 0}
                        onClick={onNextPageClick}>
                        Next
                    </button>
                </div>
            </div>
        </React.Fragment>
    );
}