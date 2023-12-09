import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import IAuthState from "../interfaces/IAuthState";
import { act } from "react-dom/test-utils";
import IProfileInfo from "../interfaces/IProfileInfo";
import IUpdateUserInformation from "../interfaces/IUpdateUserInformation";

export const initialState: IAuthState =
  localStorage.getItem("auth") === null
    ? {
        id: null,
        firstName: null,
        middleName: null,
        lastName: null,
        email: null,
        gender: null,
        profilePicture: null,
        phoneNumber: null,
        age: null,
        role: null,
        token: null,
        expires: null,
      }
    : JSON.parse(localStorage.getItem("auth")!);

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    login: (state, action: PayloadAction<IAuthState>) => {
      state.id = action.payload.id;
      state.firstName = action.payload.firstName;
      state.middleName = action.payload.middleName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.gender = action.payload.gender;
      state.profilePicture = action.payload.profilePicture;
      state.phoneNumber = action.payload.phoneNumber;
      state.age = action.payload.age;
      state.role = action.payload.role;
      state.token = action.payload.token;
      state.expires = action.payload.expires;

      localStorage.setItem("auth", JSON.stringify(action.payload));
    },
    updateUserInformation: (
      state,
      action: PayloadAction<IUpdateUserInformation>
    ) => {
      state.firstName = action.payload.firstName;
      state.middleName = action.payload.middleName;
      state.lastName = action.payload.lastName;
      state.gender = action.payload.gender;
      state.profilePicture = action.payload.profilePicture;
      state.age = action.payload.age;

      localStorage.setItem("auth", JSON.stringify(state));
    },
    logout: (state) => {
      state.id = null;
      state.firstName = null;
      state.middleName = null;
      state.lastName = null;
      state.email = null;
      state.gender = null;
      state.profilePicture = null;
      state.phoneNumber = null;
      state.age = null;
      state.role = null;
      state.token = null;
      state.expires = null;

      localStorage.removeItem("auth");
    },
  },
});

export const { logout, login, updateUserInformation } = authSlice.actions;

export default authSlice.reducer;
