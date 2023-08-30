import React, { useEffect, useState } from "react";
import styles from "./ReviewCreate.module.scss";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { toggleLoaderOff, toggleLoaderOn } from "../../store/loader";
import { useNavigate, useParams } from "react-router-dom";
import { createReview } from "../../services/reviewService";

export const ReviewCreate: React.FC = () => {
    const [description, setDescription] = useState<string>("");
    const [rating, setRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [errors, setErrors] = useState<string[]>([]);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { token, role } = useAppSelector(state => state.auth);
    const { propertyId } = useParams();

    useEffect(() => {
        if (role !== "Tenant") {
            navigate("/unauthorized");
        }
    });

    const generateStars = (): React.ReactNode => {
        const starsArray = Array.from<HTMLElement>({ length: 5 }).map((el, index) => {

            const ratingValue = index + 1;

            return (
                <label key={ratingValue} className={styles.star}>
                    <input
                        type="radio"
                        name="rating"
                        value={ratingValue}
                        onClick={() => setRating(ratingValue)} />
                    <i
                        data-testid={`star-${ratingValue}`}
                        key={`${index}`}
                        className={`fa-solid fa-star ${ratingValue <= (hoverRating || rating)
                            ? styles.yellowStar
                            : styles.greyStar}`}
                        onMouseEnter={() => setHoverRating(ratingValue)}
                        onMouseLeave={() => setHoverRating(0)}>
                    </i>
                </label>
            );
        });

        return starsArray;
    };

    const onCreateReviewFormSubmit: React.FormEventHandler<HTMLFormElement> = async (e: React.FormEvent<HTMLFormElement>) => {

        dispatch(toggleLoaderOn());

        e.preventDefault();

        setErrors([]);

        try {

            const response = await createReview(token!, propertyId!, rating, description);

            if (response.status === "Success") {
                navigate(-1);
            } else if (response.status === "Error") {
                setErrors(state => [...state, response.message]);
            }

        } catch (error: any) {
            setErrors(state => [...state, error]);
        } finally {
            dispatch(toggleLoaderOff());
        }

    };

    return (
        <div className={styles.reviewCreateWrapper}>
            <form className={styles.reviewCreateCard} onSubmit={onCreateReviewFormSubmit}
                data-testid="create-review-form">
                <h1>Create review</h1>
                <hr />
                <div className={styles.stars}>
                    {generateStars()}
                </div>
                <button type="button" className={styles.clearRatingBtn} onClick={() => setRating(0)}>Clear</button>
                <div className={styles.inputContainer}>
                    <label htmlFor="description">Description:</label>
                    <textarea name="description" id="description" rows={8} cols={30}
                        value={description}
                        onChange={(e) => setDescription(e.currentTarget.value)}>
                    </textarea>
                </div>
                <ul className={styles.errorsContainer}>
                    {errors.map(e => {
                        return (
                            <li key={e}>
                                <span className={styles.error}>
                                    {e}
                                </span>
                            </li>
                        );
                    })}
                </ul>
                <button className={styles.createReviewBtn}>Create</button>
            </form>
        </div >
    );
};