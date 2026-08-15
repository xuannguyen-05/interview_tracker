import { z } from "zod";

export const registerSchema = z.object({
    full_name: z
        .string()
        .trim()
        .min(1, "Full name is required"),

    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Invalid email"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
}).strict();

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Invalid email"),

    password: z.string().min(1, "Password is required")
}).strict();


export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
});

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(1, "Token is required."),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters."),
});

export const googleLoginSchema = z.object({
    credential: z.string().min(1)
})