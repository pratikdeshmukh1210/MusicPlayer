import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
        user: JSON.parse(localStorage.getItem("user")) || null,
    },
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true;
            state.user = action.payload;
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("user", JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.user = null;
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("user");
        },
        register: (state, action) => {
            // For simplicity, we'll just log them in upon registration
            state.isLoggedIn = true;
            state.user = action.payload;
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("user", JSON.stringify(action.payload));
        }
    },
});

export const { login, logout, register } = authSlice.actions;
export default authSlice.reducer;
