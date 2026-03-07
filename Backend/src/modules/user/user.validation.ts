import { z } from "zod";


export const createUserSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(1, "Name is required")
            .min(2, "Name must be at least 2 characters")
            .max(50, "Name too long")
            .trim(),

        email: z
            .string()
            .min(1, "Email is required")
            .email("Invalid email format")
            .trim()
            .toLowerCase(),

        password: z
            .string()
            .min(1, "Password is required")
            .min(6, "Password must be at least 6 characters")
            .max(32, "Password too long"),
    }).strict(),
});


export const updateUserSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(2, "Name must be at least 2 characters")
            .max(50, "Name too long")
            .trim()
            .optional(),

        email: z
            .string()
            .email("Invalid email format")
            .trim()
            .toLowerCase()
            .optional(),

        password: z
            .string()
            .min(6, "Password must be at least 6 characters")
            .max(32, "Password too long")
            .optional(),
    }).strict(),
});

export const resendVerificationSchema = z.object({
    body: z.object({
        email: z
            .string()
            .min(1, "Email is required")
            .email("Invalid email format")
            .trim()
            .toLowerCase(),
    }).strict(),
    params: z.object({}).passthrough(),
    query: z.object({}).passthrough(),
});

export const verifyEmailSchema = z.object({
    body: z.object({}).passthrough().optional(), 
    query: z.object({
        token: z.string().min(1, "Token is required"),
        email: z.string().min(1, "Email is required").email("Invalid email"),
    }),
    params: z.object({}).passthrough(),
});


export const loginUserSchema = z.object({
    body: z.object({
        email: z
            .string()
            .min(1, "Email is required")
            .email("Invalid email format")
            .trim()
            .toLowerCase(),

        password: z
            .string()
            .min(1, "Password is required"),

    }).strict(),
    params: z.object({}).passthrough(),
    query: z.object({}).passthrough(),
});

export const verifyLoginOTPSchema = z.object({
    body: z.object({
        email: z
            .string()
            .min(1, "Email is required")
            .email("Invalid email format")
            .trim()
            .toLowerCase(),

        otp: z
            .string()
            .min(1, "OTP is required")
            .length(6, "OTP must be 6 digits")
            .regex(/^\d+$/, "OTP must be numeric"),

    }).strict(),
    params: z.object({}).passthrough(),
    query: z.object({}).passthrough(),
});




export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type loginUserInput = z.infer<typeof loginUserSchema>;
export type VerifyLoginOTPInput = z.infer<typeof verifyLoginOTPSchema>;


