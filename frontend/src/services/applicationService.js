import http from "./http"

export async function getApplications(params = {}) {
  const response = await http.get("/application", { params })
  return response.data
}

export async function createApplication(payload) {
  const response = await http.post("/application", payload)
  return response.data
}

export async function updateApplicationStatus(applicationId, status) {
  const response = await http.patch(`/application/${applicationId}/status`, { status })
  return response.data
}

export async function deleteApplication(applicationId) {
  const response = await http.delete(`/application/${applicationId}`)
  return response.data
}

export async function updateApplication(applicationId, payload) {
  const response = await http.patch(`/application/${applicationId}`, payload)
  return response.data
}
