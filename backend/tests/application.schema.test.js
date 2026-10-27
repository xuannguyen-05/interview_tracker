import { describe, it, expect } from "vitest";

import {
    createApplicationSchema,
    updateStatusSchema
} from "../src/modules/application/application.schema.js";

describe("createApplicationSchema", () => {
    it("chấp nhận dữ liệu hợp lệ", () => {
        const data = {
            company_name: "Google",
            position: "Backend Developer",
            apply_date: "2026-10-26",
            job_url: "https://careers.google.com",
            notes: "Ứng tuyển vị trí Backend Developer"
        };

        const result = createApplicationSchema.safeParse(data);

        expect(result.success).toBe(true);
    });

    it("từ chối khi thiếu tên công ty", () => {
        const data = {
            company_name: "",
            position: "Backend Developer",
            apply_date: "2026-10-26"
        };

        const result = createApplicationSchema.safeParse(data);

        expect(result.success).toBe(false);
    });

    it("từ chối khi URL không hợp lệ", () => {
        const data = {
            company_name: "Google",
            position: "Backend Developer",
            apply_date: "2026-10-26",
            job_url: "not-a-valid-url"
        };

        const result = createApplicationSchema.safeParse(data);

        expect(result.success).toBe(false);
    });

    it("từ chối khi notes vượt quá 1000 ký tự", () => {
        const data = {
            company_name: "Google",
            position: "Backend Developer",
            apply_date: "2026-10-26",
            notes: "a".repeat(1001)
        };

        const result = createApplicationSchema.safeParse(data);

        expect(result.success).toBe(false);
    });
});

describe("updateStatusSchema", () => {
    it("chấp nhận trạng thái hợp lệ", () => {
        const result = updateStatusSchema.safeParse({
            status: "INTERVIEW"
        });

        expect(result.success).toBe(true);
    });

    it("từ chối trạng thái không hợp lệ", () => {
        const result = updateStatusSchema.safeParse({
            status: "UNKNOWN"
        });

        expect(result.success).toBe(false);
    });
});