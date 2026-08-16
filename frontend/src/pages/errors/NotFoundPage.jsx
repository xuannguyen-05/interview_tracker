import StatusShell from "@/components/errors/StatusShell"
import { useAuthStore } from "@/stores/useAuthStore"

export default function NotFoundPage() {
  const user = useAuthStore((state) => state.user)

  const backTo = user ? "/dashboard" : "/login"

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