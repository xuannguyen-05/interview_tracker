import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";

const TEST_JWT_SECRET = "test-secret-for-integration-tests";
process.env.JWT_SECRET = TEST_JWT_SECRET;

const { mockFindUnique, mockGetApplicationsService } = vi.hoisted(() => ({
  mockFindUnique: vi.fn(),
  mockGetApplicationsService: vi.fn()
}));

vi.mock("../src/config/prisma.js", () => ({
  default: {
    user: {
      findUnique: mockFindUnique
    }
  }
}));

vi.mock("../src/modules/application/application.service.js", () => ({
  getApplicationsService: mockGetApplicationsService
}));

import app from "../src/app.js";

describe("GET /api/application - Integration tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("trả 401 khi không có accessToken", async () => {
    const response = await request(app)
      .get("/api/application");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      code: "NO_TOKEN",
      message: "No token provided"
    });

    expect(mockFindUnique).not.toHaveBeenCalled();
  });

  it("trả 401 khi token hợp lệ nhưng user không tồn tại", async () => {
    const token = jwt.sign(
      { user_id: 999 },
      TEST_JWT_SECRET
    );

    mockFindUnique.mockResolvedValue(null);

    const response = await request(app)
      .get("/api/application")
      .set("Cookie", [`accessToken=${token}`]);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      code: "USER_NOT_VALID",
      message: "User not valid"
    });

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { user_id: 999 },
      select: { user_id: true }
    });
  });

  it("trả về danh sách application khi xác thực thành công", async () => {
    const token = jwt.sign(
      { user_id: 10 },
     TEST_JWT_SECRET
    );

    const applications = [
      {
        application_id: 1,
        company_name: "Google",
        position: "Backend Developer",
        status: "APPLIED"
      }
    ];

    mockFindUnique.mockResolvedValue({ user_id: 10 });
    mockGetApplicationsService.mockResolvedValue(applications);

    const response = await request(app)
      .get("/api/application")
      .set("Cookie", [`accessToken=${token}`]);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Get applications success",
      data: applications
    });

    expect(mockGetApplicationsService).toHaveBeenCalledWith(
      10,
      expect.objectContaining({})
    );
  });
});
