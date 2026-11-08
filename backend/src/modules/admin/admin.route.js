import express from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import adminMiddleware from "../../middlewares/admin.middleware.js";
import { getStats, getUsers, updateUserRole } from "./admin.controller.js";

const router = express.Router();

// Tất cả các route bên dưới đều yêu cầu đăng nhập và có role ADMIN
router.use(authMiddleware, adminMiddleware);

router.get("/stats", getStats);
router.get("/users", getUsers);
router.patch("/users/:userId/role", updateUserRole);

export default router;
