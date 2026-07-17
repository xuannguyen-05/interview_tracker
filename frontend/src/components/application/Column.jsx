export default function Column({
  title,
  count,
  children,
  onDropStatus,
  statusKey,
  isOver,
  isDragging,
  color,
  bg,
  columnBg,
  onDragEnterColumn,
  onDragLeaveColumn,
}) {
  function handleDragOver(event) {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
    onDragEnterColumn?.(statusKey)
  }

  function handleDrop(event) {
    event.preventDefault()
    const applicationId = event.dataTransfer.getData("application/id")
    if (applicationId) {
      onDropStatus?.(applicationId, statusKey)
    }
    onDragLeaveColumn?.()
  }

  function handleDragLeave(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      onDragLeaveColumn?.()
    }
  }

  const showDropZone = isDragging && isOver

  return (
    <div
      className={`flex min-h-0 min-w-0 flex-1 flex-col rounded-2xl border p-2 transition-all duration-150 ${
        showDropZone
          ? "border-indigo-400 bg-indigo-50/40 shadow-md shadow-indigo-100 ring-2 ring-indigo-300"
          : "border-black/[0.06]"
      }`}
      style={{ backgroundColor: showDropZone ? undefined : columnBg ?? bg }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnter={() => onDragEnterColumn?.(statusKey)}
      onDragLeave={handleDragLeave}
    >
      <div
        className="mb-2 flex items-center justify-between rounded-xl px-3 py-2"
        style={{ backgroundColor: bg }}
      >
        <div className="flex items-center gap-2">
          <span className="block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <span className="text-xs font-medium text-slate-400">{count}</span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-1">
        {children}

        {showDropZone ? (
          <div className="grid min-h-[72px] flex-shrink-0 place-items-center rounded-xl border-2 border-dashed border-indigo-300 bg-white/70 text-xs font-semibold text-indigo-500">
            Drop here
          </div>
        ) : null}

        {!count && !showDropZone ? (
          <div className="grid min-h-24 flex-1 place-items-center rounded-xl border border-dashed border-black/[0.08] bg-white/50 text-xs text-slate-300">
            No applications
          </div>
        ) : null}
      </div>
    </div>
  )
}
