/* eslint-disable no-unused-vars */
import React, { useState } from "react";

function formatDate(input) {
  if (!input) return "";
  const d = new Date(input);
  return d.toLocaleDateString();
}

const STATUS_STYLES = {
  APPLIED: "border-amber-200",
  INTERVIEW: "border-violet-100",
  OFFER: "border-emerald-100",
  REJECTED: "border-rose-100",
};

const AVATAR_BG = {
  APPLIED: "bg-amber-100 text-amber-700",
  INTERVIEW: "bg-violet-100 text-violet-700",
  OFFER: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-rose-100 text-rose-700",
};

function LegacyApplicationCard({
  application,
  onEdit,
  onDelete,
  draggableProps = {},
}) {
  const status = application.status ?? "APPLIED";
  const borderClass = STATUS_STYLES[status] || "border-slate-200";
  const avatarClass = AVATAR_BG[status] || "bg-indigo-100 text-indigo-700";

  return (
    <div
      {...draggableProps}
      className={`rounded-3xl border p-4 bg-white shadow-sm ${borderClass}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 flex-shrink-0 rounded-full ${avatarClass} grid place-items-center font-bold`}
            >
              {application.company_name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div>
              <p className="font-semibold text-slate-900">
                {application.company_name}
              </p>
              <p className="text-sm text-slate-500">{application.position}</p>
            </div>
          </div>
        </div>

        <div className="text-right flex items-start gap-2">
          <div className="text-xs text-slate-400 mr-2">
            {formatDate(application.apply_date)}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit?.(application)}
              className="text-slate-400 hover:text-slate-600"
            >
              ✎
            </button>
            <button
              onClick={() => onDelete?.(application.application_id)}
              className="text-rose-500 hover:text-rose-700"
            >
              🗑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardIcon({ name, className = "h-4 w-4" }) {
  const paths = {
    calendar:
      "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z",
    edit: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z",
    trash: "M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15",
    warning:
      "M12 9v4M12 17h.01M10.3 3.9 1.1 1.9a2 2 0 0 0-1.1 0L1.7 20a2 2 0 0 0 1.7 3h17.2a2 2 0 0 0 1.7-3L13.7 5.8a2 2 0 0 0-3.4 0Z",
    external:
      "M14 3h7v7M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5",
    resume:
      "M14 2H6a2 2 0 0 0-2 2v16l4-3h10a2 2 0 0 0 2-2V8l-6-6Z M14 2v6h6 M10 12h4",
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

function formatDisplayDate(input) {
  if (!input) return "";
  return new Date(input).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function daysSince(input) {
  if (!input) return 0;
  const start = new Date(input);
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((today - start) / 86400000));
}

const INITIAL_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-indigo-100 text-indigo-700",
  "bg-cyan-100 text-cyan-700",
  "bg-pink-100 text-pink-700",
];

function extractDomainFromUrl(url) {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    // Remove www. prefix
    return hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function CompanyLogo({ companyName, jobUrl, initial, colorClass }) {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Try to get domain from job_url first, otherwise use company name
  const domainFromUrl = extractDomainFromUrl(jobUrl);
  const domain = domainFromUrl || companyName?.toLowerCase().trim();

  // Get Logo.dev publishable key from environment
  const logoDevToken = import.meta.env.VITE_LOGO_DEV_PUBLISHABLE_KEY;

  // Build logo URL using Logo.dev
  // If domainFromUrl exists, use it directly
  // Otherwise use the /name endpoint to resolve company name
  const logoUrl =
    domain && logoDevToken
      ? `https://img.logo.dev/${domain}?token=${logoDevToken}&size=64&retina=true&format=webp&fallback=404`
      : null;

  if (!logoUrl || logoError) {
    return (
      <div
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl text-xs font-semibold ${colorClass}`}
      >
        {initial}
      </div>
    );
  }

  return (
    <div className="h-8 w-8 shrink-0 overflow-hidden rounded-xl bg-white">
      <img
        src={logoUrl}
        alt={companyName}
        className="h-full w-full object-contain p-1"
        onLoad={() => setLogoLoaded(true)}
        onError={() => setLogoError(true)}
        style={{ display: logoLoaded ? "block" : "none" }}
      />
      {!logoLoaded && (
        <div
          className={`grid h-full w-full place-items-center rounded-xl text-xs font-semibold ${colorClass}`}
        >
          {initial}
        </div>
      )}
    </div>
  );
}

export default function ApplicationCard({
  application,
  onEdit,
  onDelete,
  draggableProps = {},
  isHighlighted = false,
}) {
  const status = application.status ?? "APPLIED";
  const daysAgo = daysSince(application.apply_date);
  const needsFollowUp = status === "APPLIED" && daysAgo >= 7;
  const isLate = status === "APPLIED" && daysAgo >= 10;
  const initial = application.company_name?.[0]?.toUpperCase() || "?";
  const colorIndex = initial.charCodeAt(0) % INITIAL_COLORS.length;
  const colorClass = INITIAL_COLORS[colorIndex];
  const borderClass = isLate
    ? "border-red-300 bg-red-50/30"
    : needsFollowUp
      ? "border-amber-300 bg-amber-50/30"
      : "border-black/[0.08] bg-white";

  const highlightClass = isHighlighted
    ? "border-indigo-400 ring-2 ring-indigo-200 shadow-lg animate-[cardHighlight_800ms_cubic-bezier(.2,.8,.2,1)]"
    : "";

  return (
    <div
      {...draggableProps}
      className={`group cursor-grab select-none rounded-xl border p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing ${borderClass} ${highlightClass}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex items-start gap-3">
          <CompanyLogo
            companyName={application.company_name}
            jobUrl={application.job_url}
            initial={initial}
            colorClass={colorClass}
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-950">
              {application.company_name}
            </p>
            <p className="truncate text-sm text-slate-500">
              {application.position}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 opacity-0 transition group-hover:opacity-100">
          {isLate ? (
            <CardIcon name="warning" className="mr-1 h-4 w-4 text-red-400" />
          ) : null}
          <button
            type="button"
            onClick={() => onEdit?.(application)}
            className="grid h-7 w-7 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Edit application"
          >
            <CardIcon name="edit" className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(application.application_id)}
            className="grid h-7 w-7 place-items-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
            aria-label="Delete application"
          >
            <CardIcon name="trash" className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {application.notes ? (
        <p className="mt-2 line-clamp-2 pl-11 text-xs leading-5 text-slate-400">
          {application.notes}
        </p>
      ) : null}

      <div className="mt-2 flex items-center justify-between pl-11">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <CardIcon name="calendar" className="h-3.5 w-3.5" />
          <span>{formatDisplayDate(application.apply_date)}</span>
        </div>

        <div className="flex items-center gap-2">
          {application.resume_url ? (
            <a
              href={application.resume_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2 py-1 text-[11px] font-semibold text-indigo-600 transition hover:bg-indigo-100"
              aria-label="View resume"
              onClick={(event) => event.stopPropagation()}
            >
              <CardIcon name="resume" className="h-3 w-3" />
              CV
            </a>
          ) : null}
          {application.job_url ? (
            <a
              href={application.job_url}
              target="_blank"
              rel="noreferrer"
              className="text-slate-300 transition hover:text-indigo-500"
              aria-label="Open job URL"
              onClick={(event) => event.stopPropagation()}
            >
              <CardIcon name="external" className="h-3.5 w-3.5" />
            </a>
          ) : null}
          {needsFollowUp ? (
            <span
              className={`rounded-lg px-2 py-1 text-xs font-semibold ${isLate ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-600"}`}
            >
              {daysAgo}d
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
