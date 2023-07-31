import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import loader, { toggleLoaderOff, toggleLoaderOn } from "../../store/loader";
import { deletePropertyById, getLandlordPropertyById } from "../../services/propertyService";
import IProperty from "../../interfaces/IProperty";
import styles from "./PropertyDetails.module.scss";
import { JsxAttribute } from "typescript";
import IPropertyDetails from "../../interfaces/IPropertyDetails";

export const PropertyDetails: React.FC = () => {
    const { id, token, role } = useAppSelector((store) => store.auth)
    const { propertyId } = useParams();
    const [propertyDeatils, setPropertyDetails] = useState<IPropertyDetails | null>(null);
    const [currentImageCarousel, setCurrentImageCarousel] = useState<number>(1);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {

        dispatch(toggleLoaderOn());

        getLandlordPropertyById(propertyId!, token!)
            .then(res => {
                if (res.status === "Error") {

                    navigate("/notfound");

                } else if (res.hasOwnProperty("property")) {

                    setPropertyDetails(res.property);

                }
            })
            .catch(error => {
                navigate("/notfound");
            })

        dispatch(toggleLoaderOff());


    }, []);

    const rightArrowBtnClick = () => {
        if (currentImageCarousel === 3) {

            setCurrentImageCarousel(1);

            return;

        }

        setCurrentImageCarousel(state => state + 1);
    }

    const leftArrowBtnClick = (): void => {
        if (currentImageCarousel === 1) {

            setCurrentImageCarousel(3);

            return;

        }

        setCurrentImageCarousel(state => state - 1);
    }

    const onDeleteBtnClick = (): void => {

        if (window.confirm("Are you sure you want to delete this property?")) {

            dispatch(toggleLoaderOn());

            setDeleteError(null);

            deletePropertyById(propertyDeatils?.id!, token!)
                .then(res => {
                    if (res.status === "Error") {
                        setDeleteError(res.message);
                    } else {
                        navigate("/my-properties");
                    }
                })
                .catch(err => {
                    console.log(err);
                })

            dispatch(toggleLoaderOff());
        }
    };

    return (<React.Fragment>
        {propertyDeatils === null
            ? <div className={styles.propertyDetailsCardContainer}></div>
            : <div className={styles.propertyDetailsCardContainer}>
                <div className={styles.propertyDetailsCard}>
                    <div className={styles.propertyDetailsHeading}>
                        <h2>{propertyDeatils?.title}</h2>
                        {propertyDeatils?.reviewsCount === 0
                            ? <span>No reviews</span>
                            : <div className={styles.reviewsCount}>
                                <span><i className="fa-solid fa-star"></i>
                                    {propertyDeatils?.averageRating}</span>
                                <span>{propertyDeatils?.reviewsCount} {propertyDeatils?.reviewsCount! > 1 ? "Reviews" : "Review"}</span>
                            </div>}
                    </div>
                    <span>{propertyDeatils?.town}, {propertyDeatils?.country}</span>
                    <div className={styles.propertyImageCarousel}>
                        <button className={styles.leftArrowBtn} onClick={leftArrowBtnClick}>
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <button className={styles.rightArrowBtn} onClick={rightArrowBtnClick} >
                            <i className="fa-solid fa-arrow-right"></i>
                        </button>
                        <div className={styles.imageSelectedContainer}>
                            <div
                                className={`${styles.imageSelector} 
                ${currentImageCarousel === 1
                                        ? styles.imageSelected
                                        : null}`}>

                            </div>
                            <div
                                className={`${styles.imageSelector} 
                ${currentImageCarousel === 2
                                        ? styles.imageSelected
                                        : null}`}>

                            </div>
                            <div
                                className={`${styles.imageSelector} 
                ${currentImageCarousel === 3
                                        ? styles.imageSelected
                                        : null}`}>

                            </div>
                        </div>
                        {currentImageCarousel === 1
                            ? <img
                                className={styles.propertyImage}
                                src={propertyDeatils?.firstImage === null
                                    || propertyDeatils?.firstImage === undefined
                                    ? "https://mbaebooks.de/components/com_easyblog/themes/wireframe/images/placeholder-image.png"
                                    : `data:image/png;base64,${propertyDeatils?.firstImage}`}
                                alt="" />
                            : currentImageCarousel === 2
                                ? <img
                                    className={styles.propertyImage}
                                    src={propertyDeatils?.secondImage === null
                                        || propertyDeatils?.secondImage === undefined
                                        ? "https://mbaebooks.de/components/com_easyblog/themes/wireframe/images/placeholder-image.png"
                                        : `data:image/png;base64,${propertyDeatils?.secondImage}`}
                                    alt="" />
                                : currentImageCarousel === 3
                                    ? <img
                                        className={styles.propertyImage}
                                        src={propertyDeatils?.thirdImage === null
                                            || propertyDeatils?.thirdImage === undefined
                                            ? "https://mbaebooks.de/components/com_easyblog/themes/wireframe/images/placeholder-image.png"
                                            : `data:image/png;base64,${propertyDeatils?.thirdImage}`}
                                        alt="" />
                                    : null}
                    </div>
                    <h3>Entire {propertyDeatils?.type} hosted by: {propertyDeatils?.landlord.username}</h3>
                    <ul className={styles.roomsList}>
                        <li>{propertyDeatils?.maxGuestsCount} guests</li>
                        <li>{propertyDeatils?.bedroomsCount} bedrooms</li>
                        <li>{propertyDeatils?.bedsCount} beds</li>
                        <li>{propertyDeatils?.bathroomsCount} bathrooms</li>
                    </ul>
                    <hr />
                    <p className={styles.descriptionParagraph}>{propertyDeatils?.description}</p>
                    <h4>Guest price for one night: {propertyDeatils?.guestPricePerNight}$</h4>
                    {deleteError === null
                        ? null
                        : <p className={styles.error}>{deleteError}</p>}
                    {propertyDeatils?.landlord.id === id
                        ? <div className={styles.btnsContainer}>
                            <Link to={`/property/edit/${propertyDeatils.id}`} className={styles.editBtn}>Edit</Link>
                            <button className={styles.deleteBtn} onClick={onDeleteBtnClick}>Delete</button>
                        </div>
                        : role === "Tenant"
                            ? <Link to={`/property/book/${propertyDeatils.id}`}
                                className={styles.bookBtn}>
                                Book
                            </Link>
                            : null}
                </div>
            </div >}
    </React.Fragment>
    );
};