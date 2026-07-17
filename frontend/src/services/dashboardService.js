import http from "./http"

export async function getDashboard() {
  const response = await http.get("/dashboard")
  return response.data
}

export async function getMonthlyStats(year) {
  const response = await http.get("/dashboard/monthly", {
    params: year ? { year } : undefined,
  })
  return response.data
}
