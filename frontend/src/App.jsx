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
import MainLayout from "@/components/layout/MainLayout"

import ReactGA from "./lib/analytics";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
  const { accessToken } = useAuthStore()

  // Nếu chưa đăng nhập thì đá về trang login
  if (!accessToken) {
    return <Navigate to="/login" replace />
  }

  return children
}

function PublicOnlyRoute({ children }) {
  const { accessToken } = useAuthStore()

  // Nếu đã đăng nhập thì không cho quay lại login/register
  if (accessToken) {
    return <Navigate to="/" replace />
  }

  return children
}

export default function App() {
  const { accessToken } = useAuthStore()

  const location = useLocation();

    useEffect(() => {

        ReactGA.send({
            hitType: "pageview",
            page: location.pathname + location.search,
        });

    }, [location]);

  return (
    <Routes>
      <Route
        path="/"
        element={accessToken ? <Navigate to="/application" replace /> : <LandingPage />}
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

      {/* Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}