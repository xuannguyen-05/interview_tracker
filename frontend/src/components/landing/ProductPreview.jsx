const PREVIEW_COLUMNS = [
  {
    title: "Applied",
    color: "#3B82F6",
    bg: "#EFF6FF",
    cards: [
      { company: "FPT Software", role: "Frontend Intern", meta: "Applied 2d ago" },
      { company: "VNG", role: "Backend Intern", meta: "Applied 5d ago", warn: true },
    ],
  },
  {
    title: "Interview",
    color: "#8B5CF6",
    bg: "#F5F3FF",
    cards: [{ company: "Google", role: "STEP Intern", meta: "Round 1 scheduled" }],
  },
  {
    title: "Offer",
    color: "#10B981",
    bg: "#ECFDF5",
    cards: [{ company: "Grab", role: "SWE Intern", meta: "Offer received" }],
  },
  {
    title: "Rejected",
    color: "#EF4444",
    bg: "#FEF2F2",
    cards: [{ company: "Amazon", role: "SDE Intern", meta: "Closed" }],
  },
]

export default function ProductPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-2xl shadow-slate-900/10">
      <div className="flex items-center gap-2 border-b border-black/[0.06] bg-slate-50 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-3 truncate text-xs text-slate-400">app.interviewtracker.io/application</span>
      </div>

      <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        {PREVIEW_COLUMNS.map((column) => (
          <div
            key={column.title}
            className="rounded-xl border border-black/[0.06] p-2"
            style={{ backgroundColor: column.bg }}
          >
            <div className="mb-2 flex items-center gap-2 px-1">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: column.color }} />
              <span className="text-xs font-semibold text-slate-800">{column.title}</span>
              <span className="text-xs text-slate-400">{column.cards.length}</span>
            </div>

            <div className="space-y-2">
              {column.cards.map((card) => (
                <div
                  key={card.company}
                  className={`rounded-lg border bg-white p-3 shadow-sm ${
                    card.warn ? "border-amber-300" : "border-black/[0.06]"
                  }`}
                >
                  <p className="text-sm font-bold text-slate-900">{card.company}</p>
                  <p className="text-xs text-slate-500">{card.role}</p>
                  <p className={`mt-2 text-[11px] ${card.warn ? "text-amber-600" : "text-slate-400"}`}>
                    {card.meta}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
