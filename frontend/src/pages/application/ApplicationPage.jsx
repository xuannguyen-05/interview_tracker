/* eslint-disable no-unused-vars, react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import {
  getApplications,
  createApplication,
} from "@/services/applicationService";
import Column from "@/components/application/Column";
import ApplicationCard from "@/components/application/ApplicationCard";
import AddApplicationModal from "@/components/application/AddApplicationModal";
import ApplicationListView from "@/components/application/ApplicationListView";
import {
  updateApplicationStatus,
  deleteApplication,
  updateApplication,
} from "@/services/applicationService";
import { getErrorMessage } from "@/utils/getErrorMessage";
import ReactGA from "@/lib/analytics";

const STATUS_ORDER = [
  { key: "APPLIED", label: "Applied" },
  { key: "INTERVIEW", label: "Interview" },
  { key: "OFFER", label: "Offer" },
  { key: "REJECTED", label: "Rejected" },
];

function LegacyApplicationPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [overColumn, setOverColumn] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const result = await getApplications();
      setApplications(result.data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const grouped = useMemo(() => {
    const map = {};
    for (const s of STATUS_ORDER) map[s.key] = [];
    for (const app of applications) {
      const key = app.status ?? "APPLIED";
      if (!map[key]) map[key] = [];
      map[key].push(app);
    }
    return map;
  }, [applications]);

  async function handleCreate(payload) {
    await createApplication(payload);
    await load();
  }

  async function handleEdit(payload) {
    if (!editing) return;
    await updateApplication(editing.application_id, payload);
    setEditing(null);
    await load();
  }

  async function handleDelete(applicationId) {
    const ok = window.confirm("Bạn chắc chắn muốn xóa application này?");
    if (!ok) return;
    await deleteApplication(applicationId);
    await load();
  }

  async function handleDropStatus(applicationId, status) {
    try {
      await updateApplicationStatus(applicationId, status);
      // reload list
      await load();
    } catch (err) {
      console.error(err);
    } finally {
      setDraggingId(null);
      setOverColumn(null);
    }
  }

  function handleDragStart(e, applicationId) {
    e.dataTransfer.setData("application/id", applicationId);
    setDraggingId(applicationId);
  }

  function handleDragEnter(statusKey) {
    setOverColumn(statusKey);
  }

  function handleDragLeave() {
    setOverColumn(null);
  }

  // Listen for global quickAdd event from Topbar
  useEffect(() => {
    function onQuick() {
      setShowModal(true);
    }
    window.addEventListener("quickAdd", onQuick);
    return () => window.removeEventListener("quickAdd", onQuick);
  }, []);

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
                      setEditing(a);
                      setShowModal(true);
                    }}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </Column>
          ))}
        </div>
      )}

      <AddApplicationModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreate={editing ? handleEdit : handleCreate}
        initial={editing}
      />
    </>
  );
}

const BOARD_STATUSES = [
  {
    key: "APPLIED",
    label: "Applied",
    color: "#3B82F6",
    bg: "#EFF6FF",
    columnBg: "#F5F8FF",
  },
  {
    key: "INTERVIEW",
    label: "Interview",
    color: "#8B5CF6",
    bg: "#F5F3FF",
    columnBg: "#FAF8FF",
  },
  {
    key: "OFFER",
    label: "Offer",
    color: "#10B981",
    bg: "#ECFDF5",
    columnBg: "#F4FCF8",
  },
  {
    key: "REJECTED",
    label: "Rejected",
    color: "#EF4444",
    bg: "#FEF2F2",
    columnBg: "#FFF7F7",
  },
];

const MONTH_OPTIONS = [
  { value: "ALL", label: "All months" },
  ...Array.from({ length: 12 }, (_, index) => ({
    value: String(index + 1),
    label: new Date(2000, index, 1).toLocaleString("en-US", { month: "long" }),
  })),
];

function PageIcon({ name, className = "h-4 w-4" }) {
  const paths = {
    search: "M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z",
    chevron: "M6 9l6 6 6-6",
    board: "M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z",
    list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  };

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={paths[name]}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FilterSelect({ value, onChange, options, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={onChange}
        className="h-10 w-full min-w-[148px] appearance-none rounded-xl border border-black/[0.08] bg-white pl-4 pr-9 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <PageIcon
        name="chevron"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}

function ViewToggle({ viewMode, onChange }) {
  return (
    <div className="flex rounded-xl border border-black/[0.08] bg-white p-1">
      <button
        type="button"
        onClick={() => onChange("board")}
        aria-label="Board view"
        className={`grid h-8 w-8 place-items-center rounded-lg transition ${
          viewMode === "board"
            ? "bg-indigo-50 text-indigo-600"
            : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <PageIcon name="board" className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onChange("list")}
        aria-label="List view"
        className={`grid h-8 w-8 place-items-center rounded-lg transition ${
          viewMode === "list"
            ? "bg-indigo-50 text-indigo-600"
            : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <PageIcon name="list" className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function ApplicationPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [overColumn, setOverColumn] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [monthFilter, setMonthFilter] = useState("ALL");
  const [yearFilter, setYearFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState("board");

  function buildQueryParams() {
    const params = {};
    const trimmedSearch = search.trim();

    if (trimmedSearch) params.search = trimmedSearch;
    if (statusFilter !== "ALL") params.status = statusFilter;
    if (monthFilter !== "ALL" && yearFilter !== "ALL") {
      params.month = Number(monthFilter);
      params.year = Number(yearFilter);
    }

    return params;
  }

  async function load(params = {}) {
    setLoading(true);
    setLoadError("");
    try {
      const result = await getApplications(params);
      setApplications(result.data ?? []);
    } catch (err) {
      console.error(err);
      setLoadError(getErrorMessage(err, "Could not load applications."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      load(buildQueryParams());
    }, 250);

    return () => clearTimeout(timeout);
  }, [search, statusFilter, monthFilter, yearFilter]);

  useEffect(() => {
    function onQuick() {
      setEditing(null);
      setShowModal(true);
    }

    window.addEventListener("quickAdd", onQuick);
    return () => window.removeEventListener("quickAdd", onQuick);
  }, []);

  const grouped = useMemo(() => {
    const map = {};
    for (const status of BOARD_STATUSES) map[status.key] = [];
    for (const app of applications) {
      const key = app.status ?? "APPLIED";
      if (!map[key]) map[key] = [];
      map[key].push(app);
    }
    return map;
  }, [applications]);

  async function handleCreate(payload) {
    await createApplication(payload);

    ReactGA.event("create_application");

    await load(buildQueryParams());
  }

  async function handleEdit(payload) {
    if (!editing) return;
    const { status, ...applicationPayload } = payload;
    await updateApplication(editing.application_id, applicationPayload);
    if (status && status !== editing.status) {
      await updateApplicationStatus(editing.application_id, status);
    }
    setEditing(null);
    await load(buildQueryParams());
  }

  async function handleDelete(applicationId) {
    const ok = window.confirm("Delete this application?");
    if (!ok) return;
    await deleteApplication(applicationId);

    ReactGA.event("delete_application");

    await load(buildQueryParams());
  }

  async function handleDropStatus(applicationId, status) {
    try {
      await updateApplicationStatus(applicationId, status);

      ReactGA.event("update_application_status", {
        from_status: application?.status,
        to_status: status,
      });

      await load(buildQueryParams());
    } catch (err) {
      console.error(err);
    } finally {
      setDraggingId(null);
      setOverColumn(null);
    }
  }

  function handleDragStart(e, applicationId) {
    e.dataTransfer.setData("application/id", applicationId);
    e.dataTransfer.effectAllowed = "move";
    setDraggingId(applicationId);
  }

  function handleDragEnd() {
    setDraggingId(null);
    setOverColumn(null);
  }

  const statusOptions = [
    { value: "ALL", label: "All positions" },
    ...BOARD_STATUSES.map((status) => ({
      value: status.key,
      label: status.label,
    })),
  ];

  const yearOptions = [
    { value: "ALL", label: "All years" },
    ...Array.from({ length: 6 }, (_, index) => {
      const year = new Date().getFullYear() - index;
      return { value: String(year), label: String(year) };
    }),
  ];

  const timeLabel =
    monthFilter === "ALL" && yearFilter === "ALL"
      ? "All time"
      : monthFilter === "ALL"
        ? yearFilter
        : yearFilter === "ALL"
          ? MONTH_OPTIONS.find((month) => month.value === monthFilter)?.label
          : `${MONTH_OPTIONS.find((month) => month.value === monthFilter)?.label} ${yearFilter}`;

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden bg-[#f5f6f8]">
      <header className="flex min-h-[64px] flex-wrap items-center gap-3 border-b border-black/[0.06] bg-white px-5 py-3">
        <div className="relative min-w-[220px] flex-1 max-w-[360px]">
          <PageIcon
            name="search"
            className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search companies, positions..."
            className="h-10 w-full rounded-xl border border-black/[0.08] bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <FilterSelect
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          options={statusOptions}
        />

        <FilterSelect
          value={monthFilter}
          onChange={(event) => setMonthFilter(event.target.value)}
          options={MONTH_OPTIONS}
        />

        <FilterSelect
          value={yearFilter}
          onChange={(event) => setYearFilter(event.target.value)}
          options={yearOptions}
        />

        <span className="hidden text-xs text-slate-400 lg:inline">
          {timeLabel}
        </span>

        <div className="ml-auto">
          <ViewToggle viewMode={viewMode} onChange={setViewMode} />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {loadError ? (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {loadError}
          </div>
        ) : null}

        {loading ? (
          <div className="grid h-full place-items-center text-sm text-slate-400">
            Loading applications...
          </div>
        ) : viewMode === "list" ? (
          <ApplicationListView
            applications={applications}
            onEdit={(selected) => {
              setEditing(selected);
              setShowModal(true);
            }}
            onDelete={handleDelete}
          />
        ) : (
          <div className="flex h-full min-h-0 gap-3">
            {BOARD_STATUSES.map((status) => (
              <Column
                key={status.key}
                title={status.label}
                count={grouped[status.key]?.length ?? 0}
                statusKey={status.key}
                color={status.color}
                bg={status.bg}
                columnBg={status.columnBg}
                onDropStatus={handleDropStatus}
                isOver={overColumn === status.key}
                isDragging={Boolean(draggingId)}
                onDragEnterColumn={setOverColumn}
                onDragLeaveColumn={() => setOverColumn(null)}
              >
                {(grouped[status.key] ?? []).map((app) => (
                  <div
                    key={app.application_id}
                    draggable
                    onDragStart={(event) =>
                      handleDragStart(event, app.application_id)
                    }
                    onDragEnd={handleDragEnd}
                    className={
                      draggingId === app.application_id ? "opacity-50" : ""
                    }
                  >
                    <ApplicationCard
                      application={app}
                      onEdit={(selected) => {
                        setEditing(selected);
                        setShowModal(true);
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
          setShowModal(false);
          setEditing(null);
        }}
        onCreate={editing ? handleEdit : handleCreate}
        initial={editing}
        statuses={BOARD_STATUSES}
      />
    </section>
  );
}
