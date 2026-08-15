import http from "./http"
import { toastService } from "./toastService"
import { buildApplicationFormData } from "@/utils/buildApplicationFormData"

export async function getApplications(params = {}) {
  const response = await http.get("/application", { params })
  return response.data
}

export async function createApplication(payload) {
  try {
    const formData = buildApplicationFormData(payload)
    const response = await http.post("/application", formData)
    toastService.showByModule("application", "create", "success")
    return response.data
  } catch (error) {
    toastService.showByModule("application", "create", "error")
    throw error
  }
}

export async function updateApplicationStatus(applicationId, status) {
  try {
    const response = await http.patch(`/application/${applicationId}/status`, { status })
    toastService.showByModule("application", "updateStatus", "success")
    return response.data
  } catch (error) {
    toastService.showByModule("application", "updateStatus", "error")
    throw error
  }
}

export async function deleteApplication(applicationId) {
  try {
    const response = await http.delete(`/application/${applicationId}`)
    toastService.showByModule("application", "delete", "success")
    return response.data
  } catch (error) {
    toastService.showByModule("application", "delete", "error")
    throw error
  }
}

export async function updateApplication(applicationId, payload) {
  try {
    const formData = buildApplicationFormData(payload)
    const response = await http.patch(`/application/${applicationId}`, formData)
    toastService.showByModule("application", "update", "success")
    return response.data
  } catch (error) {
    toastService.showByModule("application", "update", "error")
    throw error
  }
}
