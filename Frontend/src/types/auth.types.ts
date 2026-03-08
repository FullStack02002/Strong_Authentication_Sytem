export interface IUser {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "user";
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AuthState {
    user: IUser | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface RegisterDTO {
    name: string;
    email: string;
    password: string;
}

export interface VerifyOTPDTO {
    email: string;
    otp: string;
}

export interface ResendVerificationDTO {
    email: string;
}