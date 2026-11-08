import http from "./http";

export async function getAdminStatsApi() {
  const response = await http.get("/admin/stats");
  return response.data;
}

export async function getAdminUsersApi(params = {}) {
  const response = await http.get("/admin/users", { params });
  return response.data;
}

export async function updateUserRoleApi(userId, role) {
  const response = await http.patch(`/admin/users/${userId}/role`, { role });
  return response.data;
}
