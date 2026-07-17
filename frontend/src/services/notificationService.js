import http from "./http"

export async function getNotifications() {
  const response = await http.get("/notification")
  return response.data
}

export async function getUnreadCount() {
  const response = await http.get("/notification/unread-count")
  return response.data
}

export async function markNotificationRead(notificationId) {
  const response = await http.patch(`/notification/${notificationId}/read`)
  return response.data
}

export async function markAllNotificationsRead() {
  const response = await http.patch("/notification/read-all")
  return response.data
}
