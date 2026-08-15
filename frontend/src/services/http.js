import axios from "axios"
import { useAuthStore } from "@/stores/useAuthStore"

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:7070/api",
  withCredentials: true,
})

http.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"]
  }
  return config
})

// Handle 401 errors globally - clear auth and redirect to login
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state
      const authStore = useAuthStore.getState()
      authStore.clearAccessToken()
      
      // Redirect to login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)

export default http