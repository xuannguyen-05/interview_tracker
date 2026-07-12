/* eslint-disable no-unused-vars, react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react"
import { getApplications, createApplication } from "@/services/applicationService"
import Column from "@/components/application/Column"
import ApplicationCard from "@/components/application/ApplicationCard"
import AddApplicationModal from "@/components/application/AddApplicationModal"
import { updateApplicationStatus, deleteApplication, updateApplication } from "@/services/applicationService"
import { getErrorMessage } from "@/utils/getErrorMessage"

const STATUS_ORDER = [
  { key: "APPLIED", label: "Applied" },
  { key: "INTERVIEW", label: "Interview" },
  { key: "OFFER", label: "Offer" },
  { key: "REJECTED", label: "Rejected" },
]

function LegacyApplicationPage() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [draggingId, setDraggingId] = useState(null)
  const [overColumn, setOverColumn] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const result = await getApplications()
      setApplications(result.data ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const grouped = useMemo(() => {
    const map = {}
    for (const s of STATUS_ORDER) map[s.key] = []
    for (const app of applications) {
      const key = app.status ?? "APPLIED"
      if (!map[key]) map[key] = []
      map[key].push(app)
    }
    return map
  }, [applications])

  async function handleCreate(payload) {
    await createApplication(payload)
    await load()
  }

  async function handleEdit(payload) {
    if (!editing) return
    await updateApplication(editing.application_id, payload)
    setEditing(null)
    await load()
  }

  async function handleDelete(applicationId) {
    const ok = window.confirm("Bạn chắc chắn muốn xóa application này?")
    if (!ok) return
    await deleteApplication(applicationId)
    await load()
  }

  async function handleDropStatus(applicationId, status) {
    try {
      await updateApplicationStatus(applicationId, status)
      // reload list
      await load()
    } catch (err) {
      console.error(err)
    } finally {
      setDraggingId(null)
      setOverColumn(null)
    }
  }

  function handleDragStart(e, applicationId) {
    e.dataTransfer.setData("application/id", applicationId)
    setDraggingId(applicationId)
  }

  function handleDragEnter(statusKey) {
    setOverColumn(statusKey)
  }

  function handleDragLeave() {
    setOverColumn(null)
  }

  // Listen for global quickAdd event from Topbar
  useEffect(() => {
    function onQuick() {
      setShowModal(true)
    }
    window.addEventListener("quickAdd", onQuick)
    return () => window.removeEventListener("quickAdd", onQuick)
  }, [])

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATUS_ORDER.map((s) => (
            <Column
              key={s.key}
              title={s.label}
              count={grouped[s.key]?.length ?? 0}
              statusKey={s.key}
              onDropStatus={handleDropStatus}
              isOver={overColumn === s.key}
            >
              {(grouped[s.key] ?? []).map((app) => (
                <div
                  key={app.application_id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, app.application_id)}
                  onDragEnter={() => handleDragEnter(s.key)}
                  onDragLeave={handleDragLeave}
                >
                  <ApplicationCard
                    application={app}
                    onEdit={(a) => {
                      setEditing(a)
                      setShowModal(true)
                    }}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </Column>
          ))}
        </div>
      )}

      <AddApplicationModal open={showModal} onClose={() => setShowModal(false)} onCreate={editing ? handleEdit : handleCreate} initial={editing} />
    </>
  )
}

const BOARD_STATUSES = [
  { key: "APPLIED", label: "Applied", color: "#3B82F6", bg: "#EFF6FF" },
  { key: "INTERVIEW", label: "Interview", color: "#8B5CF6", bg: "#F5F3FF" },
  { key: "OFFER", label: "Offer", color: "#10B981", bg: "#ECFDF5" },
  { key: "REJECTED", label: "Rejected", color: "#EF4444", bg: "#FEF2F2" },
]

function PageIcon({ name, className = "h-4 w-4" }) {
  const paths = {
    search: "M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z",
    filter: "M3 5h18M7 12h10M10 19h4",
    plus: "M12 5v14M5 12h14",
  }

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={paths[name]}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function ApplicationPage() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [draggingId, setDraggingId] = useState(null)
  const [overColumn, setOverColumn] = useState(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [monthFilter, setMonthFilter] = useState("ALL")
  const [yearFilter, setYearFilter] = useState(String(new Date().getFullYear()))

  function buildQueryParams() {
    const params = {}
    const trimmedSearch = search.trim()

    if (trimmedSearch) params.search = trimmedSearch
    if (statusFilter !== "ALL") params.status = statusFilter
    if (monthFilter !== "ALL" && yearFilter !== "ALL") {
      params.month = Number(monthFilter)
      params.year = Number(yearFilter)
    }

    return params
  }

  async function load(params = {}) {
    setLoading(true)
    setLoadError("")
    try {
      const result = await getApplications(params)
      setApplications(result.data ?? [])
    } catch (err) {
      console.error(err)
      setLoadError(getErrorMessage(err, "Could not load applications."))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      load(buildQueryParams())
    }, 250)

    return () => clearTimeout(timeout)
  }, [search, statusFilter, monthFilter, yearFilter])

  useEffect(() => {
    function onQuick() {
      setEditing(null)
      setShowModal(true)
    }

    window.addEventListener("quickAdd", onQuick)
    return () => window.removeEventListener("quickAdd", onQuick)
  }, [])

  const grouped = useMemo(() => {
    const map = {}
    for (const status of BOARD_STATUSES) map[status.key] = []
    for (const app of applications) {
      const key = app.status ?? "APPLIED"
      if (!map[key]) map[key] = []
      map[key].push(app)
    }
    return map
  }, [applications])

  async function handleCreate(payload) {
    await createApplication(payload)
    await load(buildQueryParams())
  }

  async function handleEdit(payload) {
    if (!editing) return
    const { status, ...applicationPayload } = payload
    await updateApplication(editing.application_id, applicationPayload)
    if (status && status !== editing.status) {
      await updateApplicationStatus(editing.application_id, status)
    }
    setEditing(null)
    await load(buildQueryParams())
  }

  async function handleDelete(applicationId) {
    const ok = window.confirm("Delete this application?")
    if (!ok) return
    await deleteApplication(applicationId)
    await load(buildQueryParams())
  }

  async function handleDropStatus(applicationId, status) {
    try {
      await updateApplicationStatus(applicationId, status)
      await load(buildQueryParams())
    } catch (err) {
      console.error(err)
    } finally {
      setDraggingId(null)
      setOverColumn(null)
    }
  }

  function handleDragStart(e, applicationId) {
    e.dataTransfer.setData("application/id", applicationId)
    e.dataTransfer.effectAllowed = "move"
    setDraggingId(applicationId)
  }

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden bg-[#f5f6f8]">
      <header className="flex min-h-[68px] items-center justify-between gap-3 border-b border-black/[0.06] bg-white px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="relative w-full max-w-[260px]">
            <PageIcon name="search" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search company or position..."
              className="h-11 w-full rounded-2xl border border-black/[0.08] bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div className="hidden items-center gap-2 xl:flex">
            <PageIcon name="filter" className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-500">Filter:</span>
            {["ALL", ...BOARD_STATUSES.map((status) => status.key)].map((key) => {
              const label = key === "ALL" ? "All" : BOARD_STATUSES.find((status) => status.key === key)?.label

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setStatusFilter(key)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    statusFilter === key
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {label}
                </button>
              )
            })}

            <select
              value={monthFilter}
              onChange={(event) => setMonthFilter(event.target.value)}
              className="h-9 rounded-xl border border-black/[0.08] bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="ALL">All months</option>
              {Array.from({ length: 12 }, (_, index) => (
                <option key={index + 1} value={String(index + 1)}>
                  Month {index + 1}
                </option>
              ))}
            </select>

            <select
              value={yearFilter}
              onChange={(event) => setYearFilter(event.target.value)}
              className="h-9 rounded-xl border border-black/[0.08] bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            >
              {Array.from({ length: 6 }, (_, index) => {
                const year = new Date().getFullYear() - index
                return (
                  <option key={year} value={String(year)}>
                    {year}
                  </option>
                )
              })}
              <option value="ALL">All years</option>
            </select>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {loadError ? (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {loadError}
          </div>
        ) : null}

        {loading ? (
          <div className="grid h-full place-items-center text-sm text-slate-400">Loading applications...</div>
        ) : (
          <div className="grid h-full grid-cols-4 gap-3">
            {BOARD_STATUSES.map((status) => (
              <Column
                key={status.key}
                title={status.label}
                count={grouped[status.key]?.length ?? 0}
                statusKey={status.key}
                color={status.color}
                bg={status.bg}
                onDropStatus={handleDropStatus}
                isOver={overColumn === status.key}
              >
                {(grouped[status.key] ?? []).map((app) => (
                  <div
                    key={app.application_id}
                    draggable
                    onDragStart={(event) => handleDragStart(event, app.application_id)}
                    onDragEnd={() => {
                      setDraggingId(null)
                      setOverColumn(null)
                    }}
                    onDragEnter={() => setOverColumn(status.key)}
                    onDragLeave={() => setOverColumn(null)}
                    className={draggingId === app.application_id ? "opacity-60" : ""}
                  >
                    <ApplicationCard
                      application={app}
                      onEdit={(selected) => {
                        setEditing(selected)
                        setShowModal(true)
                      }}
                      onDelete={handleDelete}
                    />
                  </div>
                ))}
              </Column>
            ))}
          </div>
        )}
      </div>

      <AddApplicationModal
        open={showModal}
        onClose={() => {
          setShowModal(false)
          setEditing(null)
        }}
        onCreate={editing ? handleEdit : handleCreate}
        initial={editing}
        statuses={BOARD_STATUSES}
      />
    </section>
  )
}
