import { useState, useEffect } from "react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/services/notificationService";
import { getErrorMessage } from "@/utils/getErrorMessage";

export default function NotificationPanel({ isOpen, onClose, onUnreadChange }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
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
      setError(getErrorMessage(err, "Could not load notifications."));
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
      <div className="fixed left-[262px] top-0 z-50 w-96 h-screen overflow-y-auto rounded-r-2xl border border-slate-200 bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3">
          <h3 className="font-semibold">Notifications</h3>
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
            Mark all as read
          </button>
          {loading ? (
            <div className="px-4 py-8 text-center text-sm text-slate-400">
              Loading...
            </div>
          ) : error ? (
            <div className="px-4 py-8 text-center text-sm text-rose-600">
              {error}
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-slate-400">
              No notifications
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((notification) => (
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
                        {notification.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {new Date(notification.created_at).toLocaleString(
                          "vi-VN",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <div className="h-2 w-2 rounded-full bg-indigo-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
