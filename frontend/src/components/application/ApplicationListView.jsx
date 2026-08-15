import { useTranslation } from "react-i18next"
const STATUS_BADGE = {
  APPLIED: "bg-blue-50 text-blue-600",
  INTERVIEW: "bg-violet-50 text-violet-600",
  OFFER: "bg-emerald-50 text-emerald-600",
  REJECTED: "bg-rose-50 text-rose-600",
}

function formatDate(input, locale) {
  if (!input) return ""
  return new Date(input).toLocaleDateString(locale, { month: "short", day: "numeric", year: "numeric" })
}

function ListIcon({ name, className = "h-3.5 w-3.5" }) {
  const paths = {
    edit: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z",
    trash: "M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15",
    resume: "M14 2H6a2 2 0 0 0-2 2v16l4-3h10a2 2 0 0 0 2-2V8l-6-6Z M14 2v6h6 M10 12h4",
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

export default function ApplicationListView({ applications, onEdit, onDelete }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "vi" ? "vi-VN" : "en-US";

  const STATUS_LABELS = {
    APPLIED: t("application.applied"),
    INTERVIEW: t("application.interview"),
    OFFER: t("application.offer"),
    REJECTED: t("application.rejected"),
  };

  if (!applications.length) {
    return (
      <div className="grid h-full min-h-48 place-items-center rounded-2xl border border-dashed border-black/[0.08] bg-white text-sm text-slate-400">
        {t("application.table.noApplications")}
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white">
      <div className="grid grid-cols-[1.2fr_1.2fr_0.7fr_0.7fr_0.5fr_0.5fr] gap-3 border-b border-black/[0.06] bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        <span>{t("application.table.company")}</span>
        <span>{t("application.table.position")}</span>
        <span>{t("application.table.status")}</span>
        <span>{t("application.table.applied")}</span>
        <span>{t("application.table.cv")}</span>
        <span />
      </div>

      <div className="divide-y divide-black/[0.04]">
        {applications.map((application) => (
          <div
            key={application.application_id}
            className="grid grid-cols-[1.2fr_1.2fr_0.7fr_0.7fr_0.5fr_0.5fr] items-center gap-3 px-5 py-3 transition hover:bg-slate-50/80"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600">
                {application.company_name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <p className="truncate text-sm font-semibold text-slate-900">{application.company_name}</p>
            </div>

            <p className="truncate text-sm text-slate-500">{application.position}</p>

            <span
              className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${
                STATUS_BADGE[application.status] ?? "bg-slate-100 text-slate-600"
              }`}
            >
              {STATUS_LABELS[application.status] ?? application.status}
            </span>

            <p className="text-sm text-slate-400">{formatDate(application.apply_date, locale)}</p>

            <div>
              {application.resume_url ? (
                <a
                  href={application.resume_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100"
                >
                  <ListIcon name="resume" />
                  {t("application.table.view")}
                </a>
              ) : (
                <span className="text-xs text-slate-300">—</span>
              )}
            </div>

            <div className="flex justify-end gap-1">
              <button
                type="button"
                onClick={() => onEdit?.(application)}
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label={t("application.modal.editTitle")}
              >
                <ListIcon name="edit" />
              </button>
              <button
                type="button"
                onClick={() => onDelete?.(application.application_id)}
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                aria-label={t("application.deleteConfirm")}
              >
                <ListIcon name="trash" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
