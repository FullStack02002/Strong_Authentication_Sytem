import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "../../types/auth.types";
import { registerThunk,loginThunk,verifyLoginOTPThunk,restoreSession,logoutThunk } from "./authThunks";

const initialState: AuthState = {
    user:            null,
    accessToken:     null,
    isAuthenticated: false,
    loading:         false,
    error:           null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken     = action.payload;
            state.isAuthenticated = true;
        },

        clearAuth: (state) => {
            state.user            = null;
            state.accessToken     = null;
            state.isAuthenticated = false;
            state.error           = null;
        },

        clearError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {

        builder
            .addCase(registerThunk.pending, (state) => {
                state.loading = true;
                state.error   = null;
            })
            .addCase(registerThunk.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(registerThunk.rejected, (state, action) => {
                state.loading = false;
                state.error   = action.payload as string;
            });

        builder
            .addCase(loginThunk.pending, (state) => {
                state.loading = true;
                state.error   = null;
            })
            .addCase(loginThunk.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false;
                state.error   = action.payload as string;
            });

        builder
            .addCase(verifyLoginOTPThunk.pending, (state) => {
                state.loading = true;
                state.error   = null;
            })
            .addCase(verifyLoginOTPThunk.fulfilled, (state, action) => {
                state.loading         = false;
                state.user            = action.payload.user;
                state.accessToken     = action.payload.accessToken;
                state.isAuthenticated = true;
            })
            .addCase(verifyLoginOTPThunk.rejected, (state, action) => {
                state.loading = false;
                state.error   = action.payload as string;
            });

        builder
            .addCase(restoreSession.pending, (state) => {
                state.loading = true;
            })
            .addCase(restoreSession.fulfilled, (state, action) => {
                state.loading         = false;
                state.user            = action.payload.user;
                state.accessToken     = action.payload.accessToken;
                state.isAuthenticated = true;
            })
            .addCase(restoreSession.rejected, (state) => {
                state.loading         = false;
                state.isAuthenticated = false;
            });

        builder
            .addCase(logoutThunk.fulfilled, (state) => {
                state.user            = null;
                state.accessToken     = null;
                state.isAuthenticated = false;
            });
    },
});

export const { setAccessToken, clearAuth, clearError } = authSlice.actions;
export default authSlice.reducer;