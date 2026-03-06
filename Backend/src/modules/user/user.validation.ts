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

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;