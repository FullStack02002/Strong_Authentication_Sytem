import axiosInstance from "./axiosInstance";
import type { LoginDTO, RegisterDTO, VerifyOTPDTO, ResendVerificationDTO } from "../types/auth.types";

const authService = {

    register: async (data: RegisterDTO) => {
        const res = await axiosInstance.post("/users/register", data);
        return res.data;
    },

    login: async (data: LoginDTO) => {
        const res = await axiosInstance.post("/users/login", data);
        return res.data;
    },

    verifyLoginOTP: async (data: VerifyOTPDTO) => {
        const res = await axiosInstance.post("/users/login/verify-otp", data);
        return res.data;
    },

    verifyEmail: async (token: string, email: string) => {
        const res = await axiosInstance.get(`/users/verify-email?token=${token}&email=${email}`);
        return res.data;
    },

    resendVerification: async (data: ResendVerificationDTO) => {
        const res = await axiosInstance.post("/users/resend-verify", data);
        return res.data;
    },

    refreshToken: async () => {
        const res = await axiosInstance.post("/users/refresh-token");
        return res.data;
    },

    getCurrentUser: async () => {
        const res = await axiosInstance.get("/users/me");
        return res.data;
    },

    logout: async () => {
        const res = await axiosInstance.post("/users/logout");
        return res.data;
    },
};

export default authService;