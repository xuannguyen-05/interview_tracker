import { z } from "zod";

export const createApplicationSchema = z.object({
    company_name: z
        .string()
        .trim()
        .min(1, "Company name is required")
        .max(150, "Company name must not exceed 150 characters"),

    position: z
        .string()
        .trim()
        .min(1, "Position is required")
        .max(150, "Position must not exceed 150 characters"),

    apply_date: z.coerce.date(),

    job_url: z
        .string()
        .trim()
        .url("Invalid job URL")
        .optional()
        .or(z.literal("")),

    notes: z
        .string()
        .trim()
        .max(1000, "Notes must not exceed 1000 characters")
        .optional()
});

export const updateApplicationSchema = createApplicationSchema
    .partial()
    .strict();

export const updateStatusSchema = z.object({
    status: z.enum([
        "APPLIED",
        "INTERVIEW",
        "OFFER",
        "REJECTED"
    ])
}).strict();


export const filterApplicationSchema = z.object({
    search: z.string().trim().optional(),

    status: z.enum([
        "APPLIED",
        "INTERVIEW",
        "OFFER",
        "REJECTED"
    ]).optional(),

    month: z.coerce.number().int().min(1).max(12).optional(),

    year: z.coerce.number().int().min(2000).max(2100).optional()
})