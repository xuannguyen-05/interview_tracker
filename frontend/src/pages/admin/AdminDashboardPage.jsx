import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Briefcase,
  Activity,
  Award,
  Search,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  Radio,
  ChevronLeft,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { socket } from "@/socket/socket";
import {
  getAdminStatsApi,
  getAdminUsersApi,
  updateUserRoleApi
} from "@/services/adminService";
import { useAuthStore } from "@/stores/useAuthStore";

export default function AdminDashboardPage() {
  const { t, i18n } = useTranslation();
  const currentUser = useAuthStore((state) => state.user);

  // Stats state
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Real-time online stats
  const [onlineData, setOnlineData] = useState({
    registeredOnline: 0,
    totalConnected: 0
  });

  // Users state
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const [usersLoading, setUsersLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Action states
  const [updatingUserId, setUpdatingUserId] = useState(null);

  // Load stats
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await getAdminStatsApi();
      setStats(res.data);
      if (res.data?.online) {
        setOnlineData(res.data.online);
      }
    } catch (err) {
      console.error("Failed to load admin stats:", err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Load users
  const fetchUsers = useCallback(
    async (page = 1, search = searchQuery, role = roleFilter) => {
      try {
        setUsersLoading(true);
        const res = await getAdminUsersApi({
          page,
          limit: 10,
          search,
          role
        });
        setUsers(res.data.users);
        setPagination(res.data.pagination);
      } catch (err) {
        console.error("Failed to load admin users:", err);
      } finally {
        setUsersLoading(false);
      }
    },
    [searchQuery, roleFilter]
  );

  // Socket listener for real-time online updates
  useEffect(() => {
    const handleOnlineCount = (data) => {
      if (data) {
        setOnlineData({
          registeredOnline: data.count || 0,
          totalConnected: data.totalSockets || 0
        });
      }
    };

    socket.on("admin:online_count", handleOnlineCount);

    return () => {
      socket.off("admin:online_count", handleOnlineCount);
    };
  }, []);

  // Initial load
  useEffect(() => {
    fetchStats();
    fetchUsers(1);
  }, [fetchStats, fetchUsers]);

  // Handle Search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers(1, searchQuery, roleFilter);
  };

  // Handle Role filter change
  const handleRoleFilterChange = (newRole) => {
    setRoleFilter(newRole);
    fetchUsers(1, searchQuery, newRole);
  };

  // Change user role
  const handleToggleRole = async (targetUser) => {
    const nextRole = targetUser.role === "ADMIN" ? "USER" : "ADMIN";
    const confirmMsg =
      nextRole === "ADMIN"
        ? t("admin.confirmPromote", { name: targetUser.full_name })
        : t("admin.confirmDemote", { name: targetUser.full_name });

    if (!window.confirm(confirmMsg)) return;

    try {
      setUpdatingUserId(targetUser.user_id);
      await updateUserRoleApi(targetUser.user_id, nextRole);

      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === targetUser.user_id ? { ...u, role: nextRole } : u
        )
      );

      fetchStats();
    } catch (err) {
      console.error("Error updating role:", err);
      alert(err.response?.data?.message || "Failed to update user role");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const applicationsTotal = stats?.applications?.total || 0;
  const statusBy = stats?.applications?.byStatus || {
    APPLIED: 0,
    INTERVIEW: 0,
    OFFER: 0,
    REJECTED: 0
  };

  const currentLocale = i18n.language?.startsWith("vi") ? "vi-VN" : "en-US";

  return (
    <div className="w-full px-6 py-6 lg:px-8">
      {/* Top Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {t("admin.title")}
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              {t("admin.badge")}
            </span>
          </div>
          <p className="mt-1.5 text-sm text-slate-500">
            {t("admin.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Online Badge */}
          <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            </span>
            <span>
              {t("admin.liveOnline", { count: onlineData.registeredOnline })}
            </span>
          </div>

          {/* Refresh button */}
          <button
            type="button"
            onClick={() => {
              fetchStats();
              fetchUsers(pagination.page);
            }}
            disabled={statsLoading || usersLoading}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
            title={t("admin.refresh")}
          >
            <RefreshCw
              className={`h-4 w-4 ${statsLoading || usersLoading ? "animate-spin text-indigo-600" : ""}`}
            />
            <span className="hidden sm:inline">{t("admin.refresh")}</span>
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div id="overview" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 scroll-mt-24">
        {/* Total Users */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">{t("admin.totalUsers")}</p>
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900">
              {statsLoading ? "..." : (stats?.users?.total || 0).toLocaleString()}
            </span>
            <span className="text-xs font-medium text-slate-400">{t("admin.accounts")}</span>
          </div>
          <div className="mt-3 flex items-center text-xs text-emerald-600 font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            <span>{t("admin.newThisWeek", { count: stats?.users?.newThisWeek || 0 })}</span>
          </div>
        </div>

        {/* Total Applications */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">{t("admin.totalJobs")}</p>
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-sky-50 text-sky-600">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900">
              {statsLoading ? "..." : applicationsTotal.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-slate-400">{t("admin.systemWide")}</span>
          </div>
          <div className="mt-3 flex items-center text-xs text-slate-500">
            <span>
              {t("admin.averageJobs", {
                avg: stats?.users?.total ? (applicationsTotal / stats.users.total).toFixed(1) : 0
              })}
            </span>
          </div>
        </div>

        {/* Real-time Online */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">{t("admin.onlineNow")}</p>
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-emerald-600">
              {onlineData.registeredOnline}
            </span>
            <span className="text-xs font-medium text-slate-400">
              {t("admin.onlineDetails", { tabs: onlineData.totalConnected })}
            </span>
          </div>
          <div className="mt-3 flex items-center text-xs text-emerald-600 font-medium">
            <Radio className="mr-1.5 h-3.5 w-3.5 animate-pulse text-emerald-500" />
            <span>{t("admin.socketRealtime")}</span>
          </div>
        </div>

        {/* Success / Offer Rate */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">{t("admin.offerRate")}</p>
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-50 text-amber-600">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900">
              {statsLoading ? "..." : `${stats?.applications?.offerRate || 0}%`}
            </span>
            <span className="text-xs font-medium text-slate-400">
              {t("admin.offersCount", { count: statusBy.OFFER })}
            </span>
          </div>
          <div className="mt-3 flex items-center text-xs text-slate-500">
            <span>{t("admin.interviewRate", { rate: stats?.applications?.interviewRate || 0 })}</span>
          </div>
        </div>
      </div>

      {/* Application Status Distribution */}
      <div id="job-stats" className="mt-8 scroll-mt-24 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">
          {t("admin.statusDistributionTitle")}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          {t("admin.statusDistributionSubtitle")}
        </p>

        {/* Visual Progress Bar */}
        <div className="mt-6 h-3.5 w-full overflow-hidden rounded-full bg-slate-100 flex">
          {applicationsTotal > 0 ? (
            <>
              <div
                style={{ width: `${(statusBy.APPLIED / applicationsTotal) * 100}%` }}
                className="bg-slate-400 transition-all duration-500"
                title={`Applied: ${statusBy.APPLIED}`}
              />
              <div
                style={{ width: `${(statusBy.INTERVIEW / applicationsTotal) * 100}%` }}
                className="bg-amber-400 transition-all duration-500"
                title={`Interview: ${statusBy.INTERVIEW}`}
              />
              <div
                style={{ width: `${(statusBy.OFFER / applicationsTotal) * 100}%` }}
                className="bg-emerald-500 transition-all duration-500"
                title={`Offer: ${statusBy.OFFER}`}
              />
              <div
                style={{ width: `${(statusBy.REJECTED / applicationsTotal) * 100}%` }}
                className="bg-rose-400 transition-all duration-500"
                title={`Rejected: ${statusBy.REJECTED}`}
              />
            </>
          ) : (
            <div className="w-full bg-slate-200" />
          )}
        </div>

        {/* Legend Cards */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-slate-400"></span>
              <span className="text-sm font-medium text-slate-600">{t("admin.statusApplied")}</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-800">{statusBy.APPLIED}</p>
            <p className="text-xs text-slate-400">
              {t("admin.percentTotal", {
                percent: applicationsTotal ? ((statusBy.APPLIED / applicationsTotal) * 100).toFixed(1) : 0
              })}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-amber-400"></span>
              <span className="text-sm font-medium text-amber-900">{t("admin.statusInterview")}</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-amber-700">{statusBy.INTERVIEW}</p>
            <p className="text-xs text-amber-600/80">
              {t("admin.percentTotal", {
                percent: applicationsTotal ? ((statusBy.INTERVIEW / applicationsTotal) * 100).toFixed(1) : 0
              })}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
              <span className="text-sm font-medium text-emerald-900">{t("admin.statusOffer")}</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-emerald-700">{statusBy.OFFER}</p>
            <p className="text-xs text-emerald-600/80">
              {t("admin.percentTotal", {
                percent: applicationsTotal ? ((statusBy.OFFER / applicationsTotal) * 100).toFixed(1) : 0
              })}
            </p>
          </div>

          <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-400"></span>
              <span className="text-sm font-medium text-rose-900">{t("admin.statusRejected")}</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-rose-700">{statusBy.REJECTED}</p>
            <p className="text-xs text-rose-600/80">
              {t("admin.percentTotal", {
                percent: applicationsTotal ? ((statusBy.REJECTED / applicationsTotal) * 100).toFixed(1) : 0
              })}
            </p>
          </div>
        </div>
      </div>

      {/* User Management Section */}
      <div id="users-section" className="mt-8 scroll-mt-24 rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        {/* Section Header & Filters */}
        <div className="border-b border-slate-100 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {t("admin.userTableTitle")}
              </h2>
              <p className="text-sm text-slate-500">
                {t("admin.userTableSubtitle")}
              </p>
            </div>

            {/* Search & Filter Controls */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <form onSubmit={handleSearchSubmit} className="relative min-w-[240px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={t("admin.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </form>

              {/* Role Filter */}
              <div className="flex items-center gap-2">
                <select
                  value={roleFilter}
                  onChange={(e) => handleRoleFilterChange(e.target.value)}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm font-medium text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">{t("admin.allRoles")}</option>
                  <option value="USER">{t("admin.onlyUser")}</option>
                  <option value="ADMIN">{t("admin.onlyAdmin")}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">{t("admin.colUser")}</th>
                <th className="px-6 py-4">{t("admin.colAuth")}</th>
                <th className="px-6 py-4">{t("admin.colRole")}</th>
                <th className="px-6 py-4 text-center">{t("admin.colJobs")}</th>
                <th className="px-6 py-4">{t("admin.colStatus")}</th>
                <th className="px-6 py-4">{t("admin.colJoined")}</th>
                <th className="px-6 py-4 text-right">{t("admin.colAction")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usersLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    <RefreshCw className="mx-auto h-6 w-6 animate-spin text-indigo-500 mb-2" />
                    {t("admin.loadingUsers")}
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    {t("admin.noUsersFound")}
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const initial = u.full_name?.[0]?.toUpperCase() || "U";
                  const isCurrent = currentUser?.user_id === u.user_id;

                  return (
                    <tr
                      key={u.user_id}
                      className="transition hover:bg-slate-50/60"
                    >
                      {/* Name & Avatar */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                            {initial}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {u.full_name}
                              {isCurrent && (
                                <span className="ml-1.5 text-xs font-normal text-indigo-600">
                                  {t("admin.you")}
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Auth Type */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {u.auth_type === "google" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                            {t("admin.googleAuth")}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                            {t("admin.emailAuth")}
                          </span>
                        )}
                      </td>

                      {/* Role Badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {u.role === "ADMIN" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 ring-1 ring-inset ring-purple-700/20">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            ADMIN
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                            <UserCheck className="h-3.5 w-3.5 text-slate-400" />
                            USER
                          </span>
                        )}
                      </td>

                      {/* Total Applications */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center justify-center rounded-xl bg-slate-100 px-3 py-1 font-bold text-slate-800">
                          {u.total_applications}
                        </span>
                      </td>

                      {/* Online status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {u.is_online ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            {t("admin.online")}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                            <span className="h-2 w-2 rounded-full bg-slate-300" />
                            {t("admin.offline")}
                          </span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                        {new Date(u.created_at).toLocaleDateString(currentLocale, {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {!isCurrent && (
                          <button
                            type="button"
                            onClick={() => handleToggleRole(u)}
                            disabled={updatingUserId === u.user_id}
                            className={`inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-semibold shadow-sm transition ${
                              u.role === "ADMIN"
                                ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                                : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200"
                            }`}
                          >
                            {updatingUserId === u.user_id
                              ? t("admin.saving")
                              : u.role === "ADMIN"
                                ? t("admin.demoteToUser")
                                : t("admin.promoteToAdmin")}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 bg-slate-50/50">
          <p className="text-xs text-slate-500">
            {t("admin.pageInfo", {
              page: pagination.page,
              totalPages: pagination.totalPages || 1,
              total: pagination.total
            })}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1 || usersLoading}
              onClick={() => fetchUsers(pagination.page - 1)}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              {t("admin.prev")}
            </button>

            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages || usersLoading}
              onClick={() => fetchUsers(pagination.page + 1)}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
            >
              {t("admin.next")}
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
