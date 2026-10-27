
import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockFindFirst, mockUpdate, mockCreate, mockTransaction, mockNotify } =
    vi.hoisted(() => ({
        mockFindFirst: vi.fn(),
        mockUpdate: vi.fn(),
        mockCreate: vi.fn(),
        mockTransaction: vi.fn(),
        mockNotify: vi.fn()
    }));

vi.mock("../src/config/prisma.js", () => ({
    default: {
        application: {
            findFirst: mockFindFirst,
            update: mockUpdate
        },
        statusHistory: {
            create: mockCreate
        },
        $transaction: mockTransaction
    }
}));

vi.mock("../src/modules/notification/notification.helper.js", () => ({
    default: mockNotify
}));

vi.mock("../src/utils/upload.js", () => ({
    default: vi.fn()
}));

vi.mock("../src/config/cloudinary.js", () => ({
    default: {
        uploader: {
            destroy: vi.fn()
        }
    }
}));

import { updateStatusApplicationService } from
    "../src/modules/application/application.service.js";

describe("updateStatusApplicationService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("không cập nhật nếu trạng thái mới giống trạng thái hiện tại", async () => {
        const existingApplication = {
            application_id: 1,
            user_id: 10,
            status: "INTERVIEW",
            is_deleted: false
        };

        mockFindFirst.mockResolvedValue(existingApplication);

        const result = await updateStatusApplicationService(
            1,
            10,
            { status: "INTERVIEW" }
        );

        expect(result).toEqual(existingApplication);
        expect(mockFindFirst).toHaveBeenCalledOnce();
        expect(mockUpdate).not.toHaveBeenCalled();
        expect(mockTransaction).not.toHaveBeenCalled();
        expect(mockNotify).not.toHaveBeenCalled();
    });

    it("cập nhật status và tạo lịch sử khi status thay đổi", async () => {
        const existingApplication = {
            application_id: 1,
            user_id: 10,
            status: "APPLIED",
            is_deleted: false
        };

        const updatedApplication = {
            ...existingApplication,
            status: "INTERVIEW"
        };

        mockFindFirst.mockResolvedValue(existingApplication);

        mockTransaction.mockImplementation(async (callback) => {
            const tx = {
                application: {
                    update: mockUpdate
                },
                statusHistory: {
                    create: mockCreate
                }
            };

            return callback(tx);
        });

        mockUpdate.mockResolvedValue(updatedApplication);
        mockCreate.mockResolvedValue({});

        const result = await updateStatusApplicationService(
            1,
            10,
            { status: "INTERVIEW" }
        );

        expect(result).toEqual(updatedApplication);

        expect(mockUpdate).toHaveBeenCalledWith({
            where: { application_id: 1 },
            data: {
                status: "INTERVIEW",
                last_status_changed_at: expect.any(Date)
            }
        });

        expect(mockCreate).toHaveBeenCalledWith({
            data: {
                application_id: 1,
                old_status: "APPLIED",
                new_status: "INTERVIEW"
            }
        });

        expect(mockNotify).toHaveBeenCalledWith({
            application_id: 1,
            user_id: 10,
            type: "INTERVIEW"
        });
    });
});
