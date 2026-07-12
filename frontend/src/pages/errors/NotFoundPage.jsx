import StatusShell from "@/components/errors/StatusShell"
import { useAuthStore } from "@/stores/useAuthStore"

export default function NotFoundPage() {
  const accessToken = useAuthStore((state) => state.accessToken)

  // Nếu đã đăng nhập thì cho quay về dashboard, còn chưa đăng nhập thì về login.
  const backTo = accessToken ? "/dashboard" : "/login"

  return (
    <StatusShell
      code="404"
      title="Không tìm thấy trang"
      description="Trang bạn đang tìm không tồn tại hoặc đã bị chuyển đi."
      primaryLabel="Quay lại"
      primaryTo={backTo}
      secondaryLabel="Đi tới đăng nhập"
      secondaryTo="/login"
    />
  )
}