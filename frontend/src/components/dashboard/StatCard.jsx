export default function StatCard({ icon, label, value, sub }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <div className="mt-2">
            <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
          </div>
          {sub && <p className="mt-1 text-sm text-slate-400">{sub}</p>}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
          {icon}
        </div>
      </div>
    </div>
  )
}
