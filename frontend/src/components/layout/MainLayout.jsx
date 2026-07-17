import Sidebar from "./Sidebar"

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f5f6f8] text-slate-900">
      <div className="relative flex min-h-screen">
        <div className="fixed left-0 top-0 bottom-0 z-10 h-screen">
          <Sidebar />
        </div>
        <div className="ml-[262px] min-w-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
