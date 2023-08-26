import React, { FormEventHandler, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { getLandlordsProperties, getPropertiesBySearch } from "../../services/propertyService";
import styles from "./MyProperties.module.scss";
import { Property } from "../../components/property/Property";
import IProperty from "../../interfaces/IProperty";
import { toggleLoaderOff, toggleLoaderOn } from "../../store/loader";

export const MyProperties: React.FC = () => {

    const navigate = useNavigate();
    const { role, id, token } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const [myProperties, setMyProperties] = useState<IProperty[] | null>(null);
    const [searchOption, setSearchOption] = useState<string>("Title");
    const [searchValue, setSearchValue] = useState<string>("");
    const [searchErrors, setSearchErrors] = useState<string[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState<number>(1);
    const [totalProperties, setTotalProperties] = useState<number>(0);

    useEffect(() => {

        dispatch(toggleLoaderOn());

        setSearchParams("");

        if (role !== "Landlord") {
            navigate("/unauthorized");
        }

        setSearchErrors([]);

        setPage(1);

        getLandlordsProperties(id!, token!, 1)
            .then(res => {
                if (res.status === "Success") {
                    setMyProperties(res.content.properties);
                    setTotalProperties(res.content.totalPropertiesCount);

                } else if (res.status === "Error") {
                    setMyProperties([]);
                    setSearchErrors(state => [...state, res.message]);
                    setTotalProperties(0);
                }
            })
            .catch(err => {
                setSearchErrors(state => [...state, err]);
            })
            .finally(() => {
                dispatch(toggleLoaderOff());
            });
    }, []);

    const onSeacrhSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        dispatch(toggleLoaderOn());

        setSearchErrors([]);

        e.preventDefault();

        try {
            const response = await getPropertiesBySearch(token!, searchOption, searchValue, 1);

            if (response.status === "Error") {
                setMyProperties([]);
                setSearchErrors(state => [...state, response.message]);
            } else if (response.status === "Success") {
                setMyProperties(response.content.properties);
                setTotalProperties(response.content.totalPropertiesCount);
            }
        } catch (error: any) {
            setSearchErrors(state => [...state, error]);
        } finally {
            dispatch(toggleLoaderOff());
        }

        setSearchParams(`${searchOption.toLowerCase()}=${searchValue}`);
    };

    const onViewAllBtnClick = () => {
        dispatch(toggleLoaderOn());

        setSearchErrors([]);

        if (role !== "Landlord") {
            navigate("/unauthorized");
        }

        setSearchErrors([]);

        setPage(1);

        setSearchValue("");

        getLandlordsProperties(id!, token!, 1)
            .then(res => {
                if (res.status === "Success") {
                    setMyProperties(res.content.properties);
                    setTotalProperties(res.content.totalPropertiesCount);

                } else if (res.status === "Error") {
                    setMyProperties([]);
                    setSearchErrors(state => [...state, res.message]);
                    setTotalProperties(0);
                }
            })
            .catch(err => {
                setSearchErrors(state => [...state, err]);
            })
            .finally(() => {
                dispatch(toggleLoaderOff());
            });

        setSearchParams("");
    };

    const onNextPageClick = async () => {
        dispatch(toggleLoaderOn());

        setSearchErrors([]);

        if (searchValue === "") {

            try {
                const response = await getLandlordsProperties(id!, token!, page + 1);

                if (response.status === "Error") {
                    setMyProperties([]);
                    setSearchErrors(state => [...state, response.message]);
                    setTotalProperties(0);
                } else if (response.status === "Success") {
                    setMyProperties(response.content.properties);
                    setTotalProperties(response.content.totalPropertiesCount);
                    setPage(state => state + 1);
                }
            } catch (error: any) {
                setSearchErrors(state => [...state, error]);
            } finally {
                dispatch(toggleLoaderOff());
            }

            setSearchParams(`page=${page + 1}`);

        } else {

            try {
                const response = await getPropertiesBySearch(token!, searchOption, searchValue, page + 1);

                if (response.status === "Error") {
                    setMyProperties([]);
                    setSearchErrors(state => [...state, response.message]);
                } else if (response.status === "Success") {
                    setMyProperties(response.content.properties);
                    setTotalProperties(response.content.totalPropertiesCount);
                    setPage(state => state + 1);
                }
            } catch (error: any) {
                setSearchErrors(state => [...state, error]);
            } finally {
                dispatch(toggleLoaderOff());
            }

            setSearchParams(`${searchOption.toLowerCase()}=${searchValue}&page=${page + 1}`);

        }
    };

    const onPreviousPageClick = async () => {
        dispatch(toggleLoaderOn());

        setSearchErrors([]);

        if (searchValue === "") {

            try {
                const response = await getLandlordsProperties(id!, token!, page - 1);

                if (response.status === "Error") {
                    setMyProperties([]);
                    setSearchErrors(state => [...state, response.message]);
                    setTotalProperties(0);
                } else if (response.status === "Success") {
                    setMyProperties(response.content.properties);
                    setTotalProperties(response.content.totalPropertiesCount);
                    setPage(state => state - 1);
                }
            } catch (error: any) {
                setSearchErrors(state => [...state, error]);
            } finally {
                dispatch(toggleLoaderOff());
            }

            if (page - 1 === 1) {
                setSearchParams("");
            } else {
                setSearchParams(`page=${page - 1}`);
            }

        } else {

            try {
                const response = await getPropertiesBySearch(token!, searchOption, searchValue, page - 1);

                if (response.status === "Error") {
                    setMyProperties([]);
                    setSearchErrors(state => [...state, response.message]);
                } else if (response.status === "Success") {
                    setMyProperties(response.content.properties);
                    setTotalProperties(response.content.totalPropertiesCount);
                    setPage(state => state - 1);
                }
            } catch (error: any) {
                setSearchErrors(state => [...state, error]);
            } finally {
                dispatch(toggleLoaderOff());
            }

            if (page - 1 === 1) {
                setSearchParams(`${searchOption.toLowerCase()}=${searchValue}`);
            } else {
                setSearchParams(`${searchOption.toLowerCase()}=${searchValue}&page=${page - 1}`);
            }
        }
    };

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
                        <option value="country">Country</option>
                    </select>
                    <button className={styles.searchBtn}><i className="fa-solid fa-magnifying-glass"></i></button>
                </form>
                <button className={styles.viewAllBtn} onClick={onViewAllBtnClick}>View All</button>
                <ul className={styles.errorsContainer}>
                    {searchErrors.map(err => {
                        return (
                            <li>
                                <span key={err} className={styles.error}>{err}</span>
                            </li>
                        );
                    })}
                </ul>
                <div className={styles.propertyCardsContainer}>
                    {myProperties?.map((p: IProperty) => <Property key={p.id} {...p} />)}
                </div>
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
};