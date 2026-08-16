/* eslint-disable no-unused-vars, no-undef, no-empty */
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { useAuthStore } from "@/stores/useAuthStore";
import { getUnreadCount } from "@/services/notificationService";
import { toastService } from "@/services/toastService";
import NotificationPanel from "@/components/notification/NotificationPanel";
import { useTranslation } from "react-i18next";

import { socket } from "@/socket/socket";

function Icon({ name, className = "h-4 w-4" }) {
  const paths = {
    board: "M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z",
    dashboard: "M4 5h6v6H4V5Zm10 0h6v4h-6V5ZM4 15h6v4H4v-4Zm10-2h6v6h-6v-6Z",
    plus: "M12 5v14M5 12h14",
    bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7M10 19a2 2 0 0 0 4 0",
    logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  };

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={paths[name]}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken);
  const user = useAuthStore((state) => state.user);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    async function loadUnreadCount() {
      try {
        const count = await getUnreadCount();
        setUnreadCount(count.data?.count || 0);
      } catch (err) {
        console.error(err);
      }
    }
    loadUnreadCount();
  }, []);

  useEffect(() => {
    if (!user?.user_id) return;

    socket.connect();

    if (socket.connected) {
      socket.emit("register", user.user_id);
    } else {
      socket.once("connect", () => {
        socket.emit("register", user.user_id);
      });
    }

    const handleNotification = (notification) => {

      setUnreadCount((prev) => prev + 1);
    };

    socket.on("notification:new", handleNotification);

    return () => {
      socket.off("notification:new", handleNotification);
    };
  }, [user]);

  function openQuickAdd() {
    window.dispatchEvent(new CustomEvent("quickAdd"));
  }

  function handleSignOut() {
    socket.disconnect();

    clearAccessToken();
    toastService.showByModule("auth", "logout", "success");
    navigate("/login", { replace: true });
  }

  const fullName = user?.full_name?.trim() || "User";
  const email = user?.email?.trim() || "No email";
  const avatarInitial = fullName[0]?.toUpperCase() || "U";

  const navClassName = ({ isActive }) =>
    `flex items-center gap-4 rounded-2xl px-5 py-4 text-[15px] font-semibold transition ${
      isActive
        ? "bg-indigo-50 text-indigo-700"
        : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
    }`;

  return (
    <aside className="hidden h-full w-[262px] shrink-0 border-r border-black/[0.06] bg-white lg:block">
      <div className="flex h-full flex-col">
        <nav className="flex flex-1 flex-col gap-3 px-5 pt-3">
          <NavLink to="/dashboard" className={navClassName}>
            <Icon name="dashboard" className="h-5 w-5 text-slate-500" />
            {t("sidebar.dashboard")}
          </NavLink>

          <NavLink to="/application" className={navClassName}>
            <Icon name="board" className="h-5 w-5" />
            {t("sidebar.myApplications")}
          </NavLink>

          <button
            type="button"
            onClick={openQuickAdd}
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
          >
            <Icon name="plus" className="h-5 w-5" />
            {t("sidebar.quickAddJob")}
          </button>
        </nav>

        <div className="border-t border-black/[0.06] px-6 py-6 text-sm text-slate-600 relative mt-auto shrink-0">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="flex items-center justify-between w-full py-2 text-base transition hover:text-slate-950"
            >
              <div className="flex items-center gap-3">
                <Icon name="bell" className="h-5 w-5 text-slate-500" />
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
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-3 flex items-center gap-3 py-2 text-base transition hover:text-slate-950"
          >
            <Icon name="logout" className="h-5 w-5 text-slate-500" />
            {t("sidebar.signOut")}
          </button>

          <div className="mt-6 flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-600">
              {avatarInitial}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950">{fullName}</p>
              <p className="text-xs text-slate-400">{email}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
