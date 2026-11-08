import prisma from "../../config/prisma.js";
import { getOnlineUsers, getOnlineUsersCount } from "../../config/socket.js";
import AppError from "../../utils/AppError.js";

const getAdminStatsService = async () => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
        totalUsers,
        newUsersThisWeek,
        totalApplications,
        statusCounts
    ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({
            where: {
                created_at: {
                    gte: sevenDaysAgo
                }
            }
        }),
        prisma.application.count({
            where: {
                is_deleted: false
            }
        }),
        prisma.application.groupBy({
            by: ['status'],
            where: {
                is_deleted: false
            },
            _count: {
                application_id: true
            }
        })
    ]);

    const statusMap = {
        APPLIED: 0,
        INTERVIEW: 0,
        OFFER: 0,
        REJECTED: 0
    };

    statusCounts.forEach((item) => {
        statusMap[item.status] = item._count.application_id;
    });

    const offerRate = totalApplications > 0
        ? Number(((statusMap.OFFER / totalApplications) * 100).toFixed(1))
        : 0;

    const interviewRate = totalApplications > 0
        ? Number((((statusMap.INTERVIEW + statusMap.OFFER) / totalApplications) * 100).toFixed(1))
        : 0;

    const onlineStats = getOnlineUsersCount();

    return {
        users: {
            total: totalUsers,
            newThisWeek: newUsersThisWeek
        },
        applications: {
            total: totalApplications,
            byStatus: statusMap,
            offerRate,
            interviewRate
        },
        online: onlineStats
    };
};

const getAdminUsersService = async ({ page = 1, limit = 10, search = "", role = "" }) => {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    if (search && search.trim()) {
        const keyword = search.trim();
        where.OR = [
            { full_name: { contains: keyword, mode: "insensitive" } },
            { email: { contains: keyword, mode: "insensitive" } }
        ];
    }

    if (role && (role === "USER" || role === "ADMIN")) {
        where.role = role;
    }

    const [total, users] = await Promise.all([
        prisma.user.count({ where }),
        prisma.user.findMany({
            where,
            skip,
            take: limitNum,
            orderBy: {
                created_at: "desc"
            },
            select: {
                user_id: true,
                full_name: true,
                email: true,
                role: true,
                google_id: true,
                created_at: true,
                updated_at: true,
                _count: {
                    select: {
                        applications: {
                            where: {
                                is_deleted: false
                            }
                        }
                    }
                }
            }
        })
    ]);

    const onlineMap = getOnlineUsers();

    const formattedUsers = users.map((u) => ({
        user_id: u.user_id,
        full_name: u.full_name,
        email: u.email,
        role: u.role,
        auth_type: u.google_id ? "google" : "email",
        created_at: u.created_at,
        total_applications: u._count.applications,
        is_online: onlineMap.has(u.user_id)
    }));

    return {
        users: formattedUsers,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum)
        }
    };
};

const updateUserRoleService = async (targetUserId, newRole, currentAdminId) => {
    if (newRole !== "USER" && newRole !== "ADMIN") {
        throw new AppError("Invalid role", 400, "INVALID_ROLE");
    }

    const targetUser = await prisma.user.findUnique({
        where: { user_id: targetUserId }
    });

    if (!targetUser) {
        throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    // Prevent admin from demoting themselves
    if (targetUserId === currentAdminId && newRole !== "ADMIN") {
        throw new AppError("You cannot remove your own admin privileges", 400, "CANNOT_DEMOTE_SELF");
    }

    const updatedUser = await prisma.user.update({
        where: { user_id: targetUserId },
        data: { role: newRole },
        select: {
            user_id: true,
            full_name: true,
            email: true,
            role: true
        }
    });

    return updatedUser;
};

export {
    getAdminStatsService,
    getAdminUsersService,
    updateUserRoleService
};
