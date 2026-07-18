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