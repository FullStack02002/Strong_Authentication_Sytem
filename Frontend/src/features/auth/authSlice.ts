import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "../../types/auth.types";
import {
    registerThunk,
    verifyEmailThunk,
    resendVerificationThunk,
    loginThunk,
    verifyLoginOTPThunk,
    restoreSession,
    logoutThunk,
} from "./authThunks";

const initialState: AuthState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    loading: false,
    registerLoading: false,
    verifyingemail: false,
    emailverified: false,
    resendingemail: false,
    verifyEmailFailed: false
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
            state.isAuthenticated = true;
        },
        clearAuth: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
        },
        resetVerifyState: (state) => {
            state.emailverified = false;
            state.verifyingemail = false;
            state.resendingemail = false;
            state.verifyEmailFailed = false;

        },
    },
    extraReducers: (builder) => {

        // ── Register ──
        builder
            .addCase(registerThunk.pending, (state) => { state.registerLoading = true; })
            .addCase(registerThunk.fulfilled, (state) => { state.registerLoading = false; })
            .addCase(registerThunk.rejected, (state) => {
                state.registerLoading = false;
            });

        // ── Verify Email ──
        builder
            .addCase(verifyEmailThunk.pending, (state) => { state.verifyingemail = true; state.emailverified = false; state.verifyEmailFailed = false; })
            .addCase(verifyEmailThunk.fulfilled, (state) => { state.verifyingemail = false; state.emailverified = true; state.verifyEmailFailed = false; })
            .addCase(verifyEmailThunk.rejected, (state) => {
                state.verifyingemail = false;
                state.emailverified = false;
                state.verifyEmailFailed = true;
            });

        // ── Resend Verification ──
        builder
            .addCase(resendVerificationThunk.pending, (state) => { state.resendingemail = true; })
            .addCase(resendVerificationThunk.fulfilled, (state) => { state.resendingemail = false; })
            .addCase(resendVerificationThunk.rejected, (state) => {
                state.resendingemail = false;
            });

        // ── Login ──
        builder
            .addCase(loginThunk.pending, (state) => { state.loading = true; })
            .addCase(loginThunk.fulfilled, (state) => { state.loading = false; })
            .addCase(loginThunk.rejected, (state) => {
                state.loading = false;
            });

        // ── Verify Login OTP ──
        builder
            .addCase(verifyLoginOTPThunk.pending, (state) => { state.loading = true; })
            .addCase(verifyLoginOTPThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.isAuthenticated = true;
            })
            .addCase(verifyLoginOTPThunk.rejected, (state) => {
                state.loading = false;
            });

        // ── Restore Session ──
        builder
            .addCase(restoreSession.pending, (state) => { state.loading = true; })
            .addCase(restoreSession.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.isAuthenticated = true;
            })
            .addCase(restoreSession.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
            });

        // ── Logout ──
        builder
            .addCase(logoutThunk.fulfilled, (state) => {
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
            });
    },
});

export const { setAccessToken, clearAuth, resetVerifyState } = authSlice.actions;
export default authSlice.reducer;