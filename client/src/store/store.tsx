import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from "./auth"
import loaderReducer from "./loader";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loader: loaderReducer
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
