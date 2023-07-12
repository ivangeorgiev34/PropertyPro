import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import ILoaderState from "../interfaces/ILoaderState";

const initialState: ILoaderState = {
    isLoading: false
};

const loaderSlice = createSlice({
    name: "loader",
    initialState: initialState,
    reducers: {
        toggleLoaderOn: (state) => {
            state.isLoading = true;
        },
        toggleLoaderOff: (state) => {
            state.isLoading = false;
        }
    }
});

export const { toggleLoaderOn, toggleLoaderOff } = loaderSlice.actions;

export default loaderSlice.reducer;