import Sidebar from "./Sidebar"

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f5f6f8] text-slate-900">
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="min-w-0 flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  )
}
