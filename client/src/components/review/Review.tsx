import React, { useEffect, useState } from "react";
import styles from "./Review.module.scss";
import IReview from "../../interfaces/review/IReview";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { Link, useNavigate } from "react-router-dom";
import { toggleLoaderOff, toggleLoaderOn } from "../../store/loader";
import { deleteReviewById } from "../../services/reviewService";
import IResponse from "../../interfaces/IResponse";

export const Review: React.FC<IReview> = ({ id, stars, description, tenant }) => {
    const { id: userId, token } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [deleteError, setDeleteError] = useState<string>("");

    const generateStarReviews = (): React.ReactNode => {
        const yellowStarsArray = Array.from<HTMLElement>({ length: stars }).map((el, index) => {
            return <i key={`yellow-${index}`} className={`fa-solid fa-star ${styles.yellowStar}`} data-testid="yellow-star"></i>
        });

        const blackStarsArray = Array.from<HTMLElement>({ length: 5 - yellowStarsArray.length }).map((el, index) => {
            return <i key={`black-${index}`} className="fa-solid fa-star" data-testid="black-star"></i>
        });

        return [...yellowStarsArray, ...blackStarsArray];

    }

    const onDeleteReviewClick = async () => {

        setDeleteError("");

        if (window.confirm("Are you sure you want to delete your review?") === true) {

            dispatch(toggleLoaderOn());

            const response = await deleteReviewById(id, token!);

            if (response.status === "Error") {
                setDeleteError(response.message);
            } else {
                navigate("/");
            }

            dispatch(toggleLoaderOff());
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.tenantInfoContainerWrapper}>
                <div className={styles.tenantInfoContainer}>
                    <img className={styles.tenantProfilePicture} src={tenant.profilePicture === null
                        ? "https://thumbs.dreamstime.com/b/user-icon-flat-style-isolated-grey-background-user-icon-flat-style-isolated-grey-background-your-design-logo-131213475.jpg"
                        : `data:image/png;base64,${tenant.profilePicture!}`}
                        alt={`${tenant.firstName} ${tenant.firstName}'s profile picture`} />
                    <div className={styles.reviewStarsContainer}>
                        <h3 className={styles.tenantNames}>{tenant.firstName} {tenant.lastName}</h3>
                        <span className={styles.author}>{tenant.id === userId ? "By Me" : null}</span>
                        <div>
                            {generateStarReviews()}
                        </div>
                    </div>
                </div>
                <hr />
                <p className={styles.description}>{description}</p>
            </div>
            {tenant.id === userId
                ?
                <div className={styles.reviewBtnsContainerWrapper}>
                    <div className={styles.reviewBtnsContainer}>
                        <Link className={styles.reviewEditBtn} to={`/review/edit/${id}`}>Edit</Link>
                        <button
                            className={styles.reviewDeleteBtn}
                            onClick={onDeleteReviewClick}>
                            Delete
                        </button>
                    </div>
                    <span data-testid="delete-error" className={styles.error}>{deleteError}</span>
                </div>
                : null
            }
        </div >
    );
};