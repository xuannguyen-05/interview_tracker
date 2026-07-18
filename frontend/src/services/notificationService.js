import http from "./http"
import { toastService } from "./toastService"

export async function getNotifications() {
  const response = await http.get("/notification")
  return response.data
}

export async function getUnreadCount() {
  const response = await http.get("/notification/unread-count")
  return response.data
}

export async function markNotificationRead(notificationId) {
  try {
    const response = await http.patch(`/notification/${notificationId}/read`)
    toastService.showByModule("notification", "markAsRead", "success")
    return response.data
  } catch (error) {
    toastService.showByModule("notification", "markAsRead", "error")
    throw error
  }
}

export async function markAllNotificationsRead() {
  try {
    const response = await http.patch("/notification/read-all")
    toastService.showByModule("notification", "markAllAsRead", "success")
    return response.data
  } catch (error) {
    toastService.showByModule("notification", "markAllAsRead", "error")
    throw error
  }
}
