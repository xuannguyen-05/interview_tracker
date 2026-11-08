import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import { useAuthStore } from "@/stores/useAuthStore"

import LoginPage from "@/pages/auth/LoginPage"
import RegisterPage from "@/pages/auth/RegisterPage"
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage"
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage"
import LandingPage from "@/pages/landing/LandingPage"
import NotFoundPage from "@/pages/errors/NotFoundPage"
import DashboardPage from "@/pages/dashboard/DashboardPage"
import ApplicationPage from "@/pages/application/ApplicationPage"
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage"
import AdminRoute from "@/components/auth/AdminRoute"
import MainLayout from "@/components/layout/MainLayout"
import AdminLayout from "@/components/layout/AdminLayout"
import { getMeApi } from "@/services/authService"

import ReactGA from "./lib/analytics"
import { useEffect } from "react"

function ProtectedRoute({ children }) {
  const { user } = useAuthStore()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role === "ADMIN") {
    return <Navigate to="/admin" replace />
  }

  return children
}

function PublicOnlyRoute({ children }) {
  const { user } = useAuthStore()

  if (user) {
    return <Navigate to={user.role === "ADMIN" ? "/admin" : "/application"} replace />
  }

  return children
}

export default function App() {
  const { user, setUser } = useAuthStore()

  const location = useLocation()

  // Đồng bộ thông tin người dùng mới nhất (ví dụ cập nhật role từ DB)
  useEffect(() => {
    if (user?.user_id) {
      getMeApi()
        .then((res) => {
          if (res?.data?.user) {
            setUser(res.data.user)
          }
        })
        .catch(() => {
          // Token không hợp lệ hoặc đã hết hạn
        })
    }
  }, [])

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
    })
  }, [location])

  return (
    <Routes>
      <Route
        path="/"
        element={
          user
            ? <Navigate to={user.role === "ADMIN" ? "/admin" : "/application"} replace />
            : <LandingPage />
        }
      />

      {/* Public routes */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/forgot-password"
        element={
          <PublicOnlyRoute>
            <ForgotPasswordPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/reset-password"
        element={
          <PublicOnlyRoute>
            <ResetPasswordPage />
          </PublicOnlyRoute>
        }
      />

      {/* Private routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/application"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ApplicationPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin route với Layout riêng biệt */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminDashboardPage />
            </AdminLayout>
          </AdminRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
