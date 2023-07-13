import React, { useState } from "react";

export function useError<T>(initialFormError: T) {

    let [formErrors, setFormErrors] = useState(initialFormError);

    const onFormErrorChange = (e: React.FormEvent<HTMLInputElement>, errorMessage: string) => {

        const eventTarget = e.currentTarget as HTMLInputElement;

        setFormErrors(state => ({ ...state, [eventTarget.name]: errorMessage }));

    };

    return {
        formErrors,
        onFormErrorChange
    };
}