import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import IAuthState from "../interfaces/IAuthState";

export const initialState: IAuthState ={
    id: null,
    firstName: null,
    middleName: null,
    lastName: null,
    email: null,
    gender: null,
    profilePicture: null,
    phoneNumber: null,
    age: null,
    token: null
};

const authSlice = createSlice({
    name:"auth",
    initialState:initialState,
    reducers:{
        login(state,action: PayloadAction<IAuthState>){
            state.id = action.payload.id;
            state.firstName = action.payload.firstName;
            state.middleName = action.payload.middleName;
            state.lastName = action.payload.lastName;
            state.email = action.payload.email;
            state.gender = action.payload.gender;
            state.profilePicture = action.payload.profilePicture;
            state.phoneNumber = action.payload.phoneNumber;
            state.age = action.payload.age;
            state.token = action.payload.token;
        },
        logout(state){
            state.id = null;
            state.firstName = null;
            state.middleName = null;
            state.lastName = null;
            state.email = null;
            state.gender = null;
            state.profilePicture = null;
            state.phoneNumber = null;
            state.age = null;
            state.token = null;
        },
    }
});

export const authActions = authSlice.actions;

export default authSlice.reducer;