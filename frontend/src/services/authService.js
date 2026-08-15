import http from "./http"
import { toastService } from "./toastService"

export async function loginApi(payload) {
  try {
    const response = await http.post("/auth/login", payload)
    toastService.showByModule("auth", "login", "success")
    return response.data
  } catch (error) {
    toastService.showByModule("auth", "login", "error")
    throw error
  }
}

export async function googleLoginApi(payload) {
  try {
    const response = await http.post("/auth/google", payload)
    toastService.showByModule("auth", "google", "success")
    return response.data
  } catch (error) {
    toastService.showByModule("auth", "google", "error")
    throw error
  }
}

export async function registerApi(payload) {
  try {
    const response = await http.post("/auth/register", payload)
    toastService.showByModule("auth", "register", "success")
    return response.data
  } catch (error) {
    toastService.showByModule("auth", "register", "error")
    throw error
  }
}

export async function forgotPasswordApi(payload) {
  try {
    const response = await http.post("/auth/forgot-password", payload)
    toastService.showByModule("auth", "forgotPassword", "success")
    return response.data
  } catch (error) {
    toastService.showByModule("auth", "forgotPassword", "error")
    throw error
  }
}

export async function resetPasswordApi(payload) {
  try {
    const response = await http.post("/auth/reset-password", payload)
    toastService.showByModule("auth", "resetPassword", "success")
    return response.data
  } catch (error) {
    toastService.showByModule("auth", "resetPassword", "error")
    throw error
  }
}