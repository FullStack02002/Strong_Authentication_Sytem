import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";
import type { LoginDTO, RegisterDTO, VerifyOTPDTO, ResendVerificationDTO } from "../../types/auth.types";




export const registerThunk = createAsyncThunk(
    "auth/register",
    async (data: RegisterDTO, { rejectWithValue }) => {
        try {
            return await authService.register(data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Registration failed");
        }
    }
);

export const loginThunk = createAsyncThunk(
    "auth/login",
    async (data: LoginDTO, { rejectWithValue }) => {
        try {
            return await authService.login(data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Login failed");
        }
    }
);

export const verifyLoginOTPThunk = createAsyncThunk(
    "auth/verifyLoginOTP",
    async (data: VerifyOTPDTO, { rejectWithValue }) => {
        try {
            const res = await authService.verifyLoginOTP(data);
            return res.data; // { user, accessToken }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "OTP verification failed");
        }
    }
);

export const restoreSession = createAsyncThunk(
    "auth/restoreSession",
    async (_, { rejectWithValue }) => {
        try {
            const refreshRes  = await authService.refreshToken();
            const accessToken = refreshRes.data.accessToken as string;
            const userRes     = await authService.getCurrentUser();
            return { user: userRes.data, accessToken };
        } catch {
            return rejectWithValue("Session expired");
        }
    }
);

export const resendVerificationThunk = createAsyncThunk(
    "auth/resendVerification",
    async (data: ResendVerificationDTO, { rejectWithValue }) => {
        try {
            return await authService.resendVerification(data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to resend");
        }
    }
);

export const logoutThunk = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            return await authService.logout();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Logout failed");
        }
    }
);