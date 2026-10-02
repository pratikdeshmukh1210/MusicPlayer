import { configureStore } from "@reduxjs/toolkit";
import musicReducer from "../features/musicSlice";
import authReducer from "../features/authSlice";

export const store = configureStore({

    reducer: {
        music: musicReducer,
        auth: authReducer,
    },
});