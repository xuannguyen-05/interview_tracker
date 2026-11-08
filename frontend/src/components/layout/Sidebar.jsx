/* eslint-disable no-unused-vars, no-undef, no-empty */
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  ShieldCheck,
  Plus,
  Bell,
  LogOut,
  Users,
  Briefcase
} from "lucide-react";

import { useAuthStore } from "@/stores/useAuthStore";
import { getUnreadCount } from "@/services/notificationService";
import { toastService } from "@/services/toastService";
import NotificationPanel from "@/components/notification/NotificationPanel";
import { useTranslation } from "react-i18next";

import { socket } from "@/socket/socket";

import http from "@/services/http";

export default function Sidebar() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "ADMIN";
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (isAdmin) return; // Admin does not need candidate notifications

    async function loadUnreadCount() {
      try {
        const count = await getUnreadCount();
        setUnreadCount(count.data?.count || 0);
      } catch (err) {
        console.error(err);
      }
    }
    loadUnreadCount();
  }, [isAdmin]);

  useEffect(() => {
    if (!user?.user_id) return;

    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
      socket.emit("register", user.user_id);
    };

    const handleNotification = (notification) => {
      if (!isAdmin) {
        setUnreadCount((prev) => prev + 1);
      }
    };

    socket.on("connect", handleConnect);
    socket.on("notification:new", handleNotification);

    if (!socket.connected) {
      socket.connect();
    } else {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("notification:new", handleNotification);
    };
  }, [user?.user_id, isAdmin]);

  function openQuickAdd() {
    window.dispatchEvent(new CustomEvent("quickAdd"));
  }

  async function handleSignOut() {
    try {
      socket.disconnect();

      await http.post("/auth/logout");

      toastService.showByModule("auth", "logout", "success");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  const fullName = user?.full_name?.trim() || (isAdmin ? "Admin" : "User");
  const email = user?.email?.trim() || "No email";
  const avatarInitial = fullName[0]?.toUpperCase() || (isAdmin ? "A" : "U");

  const navClassName = ({ isActive }) =>
    `flex items-center gap-4 rounded-2xl px-5 py-4 text-[15px] font-semibold transition ${
      isActive
        ? "bg-indigo-50 text-indigo-700"
        : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
    }`;

  const scrollToSection = (id) => {
    if (window.location.pathname !== "/admin") {
      navigate("/admin");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <aside className="hidden h-full w-[262px] shrink-0 border-r border-black/[0.06] bg-white lg:block">
      <div className="flex h-full flex-col">
        {/* If Admin: show dedicated admin navigation */}
        {isAdmin ? (
          <nav className="flex flex-1 flex-col gap-2 px-5 pt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              {t("admin.systemAdmin")}
            </p>

            <button
              type="button"
              onClick={() => scrollToSection("overview")}
              className="flex w-full items-center gap-3.5 rounded-2xl bg-indigo-50 px-4 py-3.5 text-left text-[14px] font-semibold text-indigo-700 transition hover:bg-indigo-100/70"
            >
              <LayoutDashboard className="h-5 w-5 text-indigo-600" />
              {t("admin.overview")}
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("job-stats")}
              className="flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-left text-[14px] font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
            >
              <Briefcase className="h-5 w-5 text-slate-500" />
              {t("admin.jobStats")}
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("users-section")}
              className="flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-left text-[14px] font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
            >
              <Users className="h-5 w-5 text-slate-500" />
              {t("admin.userManagement")}
            </button>
          </nav>
        ) : (
          /* If regular Candidate User: show normal navigation */
          <nav className="flex flex-1 flex-col gap-3 px-5 pt-3">
            <NavLink to="/dashboard" className={navClassName}>
              <LayoutDashboard className="h-5 w-5 text-slate-500" />
              {t("sidebar.dashboard")}
            </NavLink>

            <NavLink to="/application" className={navClassName}>
              <BriefcaseBusiness className="h-5 w-5" />
              {t("sidebar.myApplications")}
            </NavLink>

            <button
              type="button"
              onClick={openQuickAdd}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5" />
              {t("sidebar.quickAddJob")}
            </button>
          </nav>
        )}

        {/* Bottom User Area */}
        <div className="border-t border-black/[0.06] px-6 py-6 text-sm text-slate-600 relative mt-auto shrink-0">
          {/* Notifications button: only for regular candidates, not admin */}
          {!isAdmin && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="flex items-center justify-between w-full py-2 text-base transition hover:text-slate-950"
              >
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-slate-500" />
                  {t("sidebar.notifications")}
                </div>

                {unreadCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-xs text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              <NotificationPanel
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
                onUnreadChange={setUnreadCount}
              />
            </div>
          )}

          <button
            type="button"
            onClick={handleSignOut}
            className={`${!isAdmin ? "mt-3" : ""} flex items-center gap-3 py-2 text-base transition hover:text-rose-600`}
          >
            <LogOut className="h-5 w-5 text-slate-500" />
            {t("sidebar.signOut")}
          </button>

          <div className="mt-6 flex items-center gap-3">
            <div
              className={`grid h-8 w-8 place-items-center rounded-full text-sm font-semibold ${
                isAdmin
                  ? "bg-purple-100 text-purple-700"
                  : "bg-indigo-50 text-indigo-600"
              }`}
            >
              {avatarInitial}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-sm font-semibold text-slate-900">{fullName}</p>
                {isAdmin && (
                  <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-extrabold text-purple-700">
                    ADMIN
                  </span>
                )}
              </div>
              <p className="truncate text-xs text-slate-400">{email}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
