export default function Column({ title, count, children, onDropStatus, statusKey, isOver, color, bg }) {
  function handleDragOver(e) {
    e.preventDefault()
  }

  function handleDrop(e) {
    e.preventDefault()
    const applicationId = e.dataTransfer.getData("application/id")
    if (applicationId) {
      onDropStatus?.(applicationId, statusKey)
    }
  }

  return (
    <div className="flex min-w-0 flex-col" onDragOver={handleDragOver} onDrop={handleDrop}>
      <div className="mb-2 flex items-center justify-between rounded-xl px-3 py-2.5" style={{ backgroundColor: bg }}>
        <div className="flex items-center gap-2.5">
          <span className="block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
          <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
        </div>

        <div
          className="grid h-6 min-w-6 place-items-center rounded-full px-2 text-xs font-bold text-white"
          style={{ backgroundColor: color }}
        >
          {count}
        </div>
      </div>

      <div
        className={`flex min-h-32 flex-1 flex-col gap-2 rounded-xl p-0.5 transition ${
          isOver ? "bg-indigo-50/70 ring-2 ring-dashed ring-indigo-300" : ""
        }`}
      >
        {children}
        {!count && !isOver ? (
          <div className="grid min-h-28 place-items-center rounded-2xl border border-dashed border-slate-200 text-xs text-slate-300">
            No applications
          </div>
        ) : null}
        {isOver ? (
          <div className="grid h-16 place-items-center rounded-2xl border-2 border-dashed border-indigo-300 text-xs font-semibold text-indigo-400">
            Drop here
          </div>
        ) : null}
      </div>
    </div>
  )
}
