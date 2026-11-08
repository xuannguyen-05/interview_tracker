import asyncHandler from "../../utils/asyncHandler.js";
import {
    getAdminStatsService,
    getAdminUsersService,
    updateUserRoleService
} from "./admin.service.js";

const getStats = asyncHandler(async (req, res) => {
    const stats = await getAdminStatsService();

    res.status(200).json({
        message: "Get admin statistics success",
        data: stats
    });
});

const getUsers = asyncHandler(async (req, res) => {
    const { page, limit, search, role } = req.query;

    const result = await getAdminUsersService({
        page,
        limit,
        search,
        role
    });

    res.status(200).json({
        message: "Get admin users success",
        data: result
    });
});

const updateUserRole = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;

    const updatedUser = await updateUserRoleService(
        Number(userId),
        role,
        req.user.user_id
    );

    res.status(200).json({
        message: "Update user role success",
        data: updatedUser
    });
});

export {
    getStats,
    getUsers,
    updateUserRole
};
