import { useNavigate } from "react-router-dom"

import { useAuthStore } from "@/stores/useAuthStore"

export default function DashboardPage() {
  const navigate = useNavigate()
  const accessToken = useAuthStore((state) => state.accessToken)
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken)

  function handleLogout() {
    // Xoá token demo để quay lại luồng public.
    clearAccessToken()
    navigate("/login", { replace: true })
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="text-sm font-medium text-indigo-600">Interview Tracker</p>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Đăng xuất
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-6 md:grid-cols-3">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2">
            <p className="text-sm font-medium text-slate-500">Xin chào</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Bạn đã đăng nhập thành công</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Đây là private page tối thiểu để mình nối tiếp sang module dashboard thật. Sau này
              sẽ tách tiếp sidebar, kanban board, modal và thống kê.
            </p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Auth state</p>
            <div className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-medium text-slate-900">accessToken</p>
              <p className="mt-2 break-all font-mono text-xs text-slate-500">
                {accessToken ?? "null"}
              </p>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}