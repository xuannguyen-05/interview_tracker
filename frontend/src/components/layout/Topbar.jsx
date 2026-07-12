import { useState } from "react"

export default function Topbar({ onQuickAdd }) {
  const [q, setQ] = useState("")

  return (
    <div className="border-b border-slate-100 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-[420px]">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search company or position..."
              className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded-full bg-slate-50 px-3 py-1 text-sm">All</button>
            <button className="rounded-full bg-slate-50 px-3 py-1 text-sm">Applied</button>
            <button className="rounded-full bg-slate-50 px-3 py-1 text-sm">Waiting</button>
            <button className="rounded-full bg-slate-50 px-3 py-1 text-sm">Interview</button>
            <button className="rounded-full bg-slate-50 px-3 py-1 text-sm">Offer</button>
            <button className="rounded-full bg-slate-50 px-3 py-1 text-sm">Rejected</button>
          </div>
        </div>

        <div>
          <button
            onClick={() => {
              if (onQuickAdd) onQuickAdd()
              // dispatch global event so pages can listen without prop drilling
              try {
                window.dispatchEvent(new CustomEvent("quickAdd"))
              } catch {
                // Ignore environments where CustomEvent is unavailable.
              }
            }}
            className="rounded-full bg-indigo-600 px-4 py-2 text-white"
          >
            + Quick Add Job
          </button>
        </div>
      </div>
    </div>
  )
}
