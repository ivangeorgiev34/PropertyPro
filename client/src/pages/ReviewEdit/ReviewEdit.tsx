import React, { MouseEventHandler, useEffect, useMemo, useState } from "react";
import styles from "./ReviewEdit.module.scss";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { useNavigate, useParams } from "react-router-dom";
import { toggleLoaderOff, toggleLoaderOn } from "../../store/loader";
import { editReviewById, getReviewById } from "../../services/reviewService";
import IResponse from "../../interfaces/IResponse";
import IReview from "../../interfaces/review/IReview";

export const ReviewEdit: React.FC = () => {

    const { token, role } = useAppSelector(state => state.auth);
    const { reviewId } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [review, setReview] = useState<IReview | null>(null);
    const [rating, setRating] = useState<number>(0);
    const [description, setDescription] = useState<string>("");
    const [errors, setErrors] = useState<string[]>([]);
    const [hoverRating, setHoverRating] = useState<number>(0);

    useMemo(() => {
        setRating(review?.stars!);
        setDescription(review?.description!);
    }, [review]);

    useEffect(() => {

        dispatch(toggleLoaderOn());

        if (role !== "Tenant") {
            navigate("/unauthorized");
        }

        getReviewById(reviewId!, token!)
            .then(res => {
                if (res.status === "Error") {
                    navigate("/notfound");
                } else if (res.status === "Success") {
                    setReview(res.content.review);
                }

                dispatch(toggleLoaderOff());
            })
            .catch(err => {
                navigate("/notfound");

                dispatch(toggleLoaderOff());
            });
    }, []);

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

    const onFormSubmit: React.FormEventHandler<HTMLFormElement> = async (e: React.FormEvent<HTMLFormElement>) => {

        dispatch(toggleLoaderOn());

        e.preventDefault();

        setErrors([]);

        try {
            const response = await editReviewById(reviewId!, token!, rating, description);

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
        <div className={styles.editReviewCardWrapper}>
            <form className={styles.editReviewCard} onSubmit={onFormSubmit} data-testid="edit-review-form">
                <h2>Edit review</h2>
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
                <button className={styles.submitBtn}>Submit</button>
            </form>
        </div>
    );
};