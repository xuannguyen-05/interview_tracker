import express from 'express';
import authRoutes from '../modules/auth/auth.route.js';
import applicationRoutes from '../modules/application/application.route.js';
import dashboardRoutes from '../modules/dashboard/dashboard.route.js';
import notificationRoutes from '../modules/notification/notification.route.js';
import adminRoutes from '../modules/admin/admin.route.js';

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/application", applicationRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/notification", notificationRoutes);
router.use("/admin", adminRoutes);

export default router;
