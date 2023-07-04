import React, { useState } from "react";

type formValue = {
    email: string,
    password: string
};

export function useForm(initialFormValues: formValue) {

    let [formValues, setFormValues] = useState(initialFormValues);

    const onFormChange = (e: React.FormEvent<HTMLInputElement>) => {

        const eventTarget = e.currentTarget as HTMLInputElement;

        setFormValues(state => ({ ...state, [eventTarget.name]: eventTarget.value }));
    };

    return {
        formValues,
        onFormChange
    };
}