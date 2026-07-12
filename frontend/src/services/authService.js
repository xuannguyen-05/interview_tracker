import http from "./http"

export async function loginApi(payload) {
  const response = await http.post("/auth/login", payload)
  return response.data
}

export async function registerApi(payload) {
  const response = await http.post("/auth/register", payload)
  return response.data
}