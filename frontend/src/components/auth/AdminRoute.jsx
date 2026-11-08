import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

export default function AdminRoute({ children }) {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/application" replace />;
  }

  return children;
}
