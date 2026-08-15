import { useState, useEffect } from "react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/services/notificationService";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useTranslation } from "react-i18next";
import { socket } from "@/socket/socket";

const getNotificationCompany = (notification, t) =>
  notification?.application?.company_name || t("notifications.defaultCompany");

const getNotificationTitle = (notification, t) =>
  t(`notifications.${notification?.type}.title`, {
    defaultValue: notification?.type || t("application.notifications.defaultTitle"),
  });

const getNotificationMessage = (notification, t) =>
  t(`notifications.${notification?.type}.message`, {
    company: getNotificationCompany(notification, t),
    defaultValue: "",
  });

export default function NotificationPanel({ isOpen, onClose, onUnreadChange }) {
  const { t, i18n } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleRealtimeNotification = (newNotification) => {
      setNotifications((prev) => {
        const exists = prev.some(
          (item) => item.notification_id === newNotification?.notification_id,
        );

        if (exists) return prev;

        return [newNotification, ...prev];
      });
    };

    socket.on("notification:new", handleRealtimeNotification);

    return () => {
      socket.off("notification:new", handleRealtimeNotification);
    };
  }, [isOpen]);

  async function loadNotifications() {
    setLoading(true);
    setError("");
    try {
      const res = await getNotifications();
      const data = res.data || [];

      setNotifications(data);

      onUnreadChange?.(data.filter((n) => !n.is_read).length);
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, t("application.loadError")));
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAsRead(notificationId) {
    try {
      await markNotificationRead(notificationId);
      setNotifications((prev) => {
        const updated = prev.map((n) =>
          n.notification_id === notificationId ? { ...n, is_read: true } : n,
        );

        onUnreadChange?.(updated.filter((n) => !n.is_read).length);

        return updated;
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function handleMarkAllAsRead() {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => {
        const updated = prev.map((n) => ({
          ...n,
          is_read: true,
        }));

        onUnreadChange?.(0);

        return updated;
      });
    } catch (err) {
      console.error(err);
    }
  }

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="fixed left-[262px] top-[68px] z-50 h-[calc(100vh-68px)] w-96 overflow-y-auto rounded-r-2xl border border-slate-200 bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3">
          <h3 className="font-semibold">{t("application.notifications.title")}</h3>
          <button
            onClick={onClose}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          <button
            onClick={handleMarkAllAsRead}
            className="w-full text-left text-sm text-indigo-600 hover:text-indigo-700 mb-4"
          >
            {t("application.notifications.markAllAsRead")}
          </button>
          {loading ? (
            <div className="px-4 py-8 text-center text-sm text-slate-400">
              {t("application.notifications.loading")}
            </div>
          ) : error ? (
            <div className="px-4 py-8 text-center text-sm text-rose-600">
              {error}
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-slate-400">
              {t("application.notifications.empty")}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((notification) => {
                const notificationTitle = getNotificationTitle(notification, t);
                const notificationMessage = getNotificationMessage(notification, t);
                const locale = i18n.language === "vi" ? "vi-VN" : "en-US";

                return (
                  <div
                    key={notification.notification_id}
                    className={`px-4 py-3 hover:bg-slate-50 cursor-pointer ${
                      !notification.is_read ? "bg-indigo-50" : ""
                    }`}
                    onClick={() =>
                      !notification.is_read &&
                      handleMarkAsRead(notification.notification_id)
                    }
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">
                          {notificationTitle}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {notificationMessage}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {new Date(notification.created_at).toLocaleString(locale, {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <div className="h-2 w-2 rounded-full bg-indigo-600" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
