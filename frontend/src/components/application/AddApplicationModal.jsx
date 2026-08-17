/* eslint-disable no-unused-vars, react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FilePlus2, PencilLine, X, CalendarDays, ExternalLink, StickyNote, FileText, Upload, File, Eye, Check, Trash2 } from "lucide-react";

import { getErrorMessage } from "@/utils/getErrorMessage";
import { validateResumeFile } from "@/utils/buildApplicationFormData";

/* -------------------------------------------------------------------------- */
/* Resume Section                                                             */
/* -------------------------------------------------------------------------- */

function ResumeSection({
  currentResumeUrl,
  resumeFile,
  onResumeChange,
  onDeleteResume,
  onClearResumeSelection,
  fileInputRef,
  isSubmitting,
  resumeError,
}) {
  const { t } = useTranslation();

  const hasCurrentResume = Boolean(currentResumeUrl);
  const hasNewResume = Boolean(resumeFile);

  return (
    <div>
      {/* Label */}
      <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
        <FileText className="h-3.5 w-3.5" />

        {t("application.modal.resume")}

        <span className="text-xs font-normal text-slate-400">
          {t("application.modal.resumeHint")}
        </span>
      </label>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        onChange={onResumeChange}
        className="hidden"
      />

      {/* ------------------------------------------------------------------ */}
      {/* New CV selected                                                    */}
      {/* ------------------------------------------------------------------ */}

      {hasNewResume ? (
        <div className="mt-2 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <File className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-semibold text-slate-800">
                    {resumeFile.name}
                  </p>

                  <span className="shrink-0 rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
                    {t("application.modal.newCv")}
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  {hasCurrentResume
                    ? t("application.modal.readyToReplaceCv")
                    : t("application.modal.readyToUpload")}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClearResumeSelection}
              disabled={isSubmitting}
              className="shrink-0 text-xs font-medium text-slate-400 transition hover:text-rose-500 disabled:opacity-50"
            >
              {t("application.modal.remove")}
            </button>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              {t("application.modal.changeFile")}
            </button>
          </div>
        </div>
      ) : hasCurrentResume ? (
        /* ---------------------------------------------------------------- */
        /* Existing CV                                                       */
        /* ---------------------------------------------------------------- */

        <div className="mt-2 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <File className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="font-semibold text-slate-800">
                  {t("application.modal.currentCv")}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {t("application.modal.pdfResume")}
                </p>
              </div>
            </div>

            <a
              href={currentResumeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <Eye className="h-4 w-4" />
              {t("application.modal.viewCv")}
            </a>
          </div>

          <div className="mt-4 flex gap-3">
            {/* Replace */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              {t("application.modal.replaceCv")}
            </button>

            {/* Delete */}
            <button
              type="button"
              onClick={onDeleteResume}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              {t("application.modal.deleteCv")}
            </button>
          </div>
        </div>
      ) : (
        /* ---------------------------------------------------------------- */
        /* No CV                                                             */
        /* ---------------------------------------------------------------- */

        <div className="mt-2 rounded-2xl border border-dashed border-black/[0.12] bg-slate-50 px-4 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl border border-black/[0.08] bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />

              {t("application.modal.choosePdf")}
            </button>

            <span className="text-sm text-slate-400">
              {t("application.modal.noFileSelected")}
            </span>
          </div>
        </div>
      )}

      {/* Validation error */}
      {resumeError ? (
        <p className="mt-2 text-sm text-rose-600">{resumeError}</p>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Modal                                                                 */
/* -------------------------------------------------------------------------- */

export default function AddApplicationModal({
  open,
  onClose,
  onCreate,
  initial = null,
  statuses = [],
}) {
  const { t } = useTranslation();

  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    company_name: "",
    position: "",
    apply_date: today,
    status: "APPLIED",
    job_url: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [resumeFile, setResumeFile] = useState(null);

  const [resumeError, setResumeError] = useState("");

  const [deleteResume, setDeleteResume] = useState(false);

  const fileInputRef = useRef(null);

  /* ---------------------------------------------------------------------- */
  /* Statuses                                                               */
  /* ---------------------------------------------------------------------- */

  const resolvedStatuses =
    statuses?.length > 0
      ? statuses
      : [
          {
            key: "APPLIED",
            label: t("application.applied"),
          },
          {
            key: "INTERVIEW",
            label: t("application.interview"),
          },
          {
            key: "OFFER",
            label: t("application.offer"),
          },
          {
            key: "REJECTED",
            label: t("application.rejected"),
          },
        ];

  /* ---------------------------------------------------------------------- */
  /* Reset / initialize form                                                */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (initial) {
      setForm({
        company_name: initial.company_name ?? "",
        position: initial.position ?? "",
        apply_date: initial.apply_date
          ? new Date(initial.apply_date).toISOString().slice(0, 10)
          : today,
        status: initial.status ?? "APPLIED",
        job_url: initial.job_url ?? "",
        notes: initial.notes ?? "",
      });
    } else {
      setForm({
        company_name: "",
        position: "",
        apply_date: today,
        status: "APPLIED",
        job_url: "",
        notes: "",
      });
    }

    setResumeFile(null);
    setResumeError("");
    setError("");
    setDeleteResume(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [initial, open, today]);

  if (!open) {
    return null;
  }

  /* ---------------------------------------------------------------------- */
  /* Form handlers                                                           */
  /* ---------------------------------------------------------------------- */

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  }

  /* ---------------------------------------------------------------------- */
  /* Resume handlers                                                         */
  /* ---------------------------------------------------------------------- */

  function handleResumeChange(event) {
    const file = event.target.files?.[0] ?? null;

    setResumeError("");

    if (!file) {
      return;
    }

    const validationError = validateResumeFile(file);

    if (validationError) {
      setResumeError(validationError);
      setResumeFile(null);
      event.target.value = "";
      return;
    }

    setResumeFile(file);
    setDeleteResume(false);
  }

  function clearResumeSelection() {
    setResumeFile(null);
    setResumeError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleDeleteResume() {
    const confirmed = window.confirm(t("application.modal.deleteCvConfirm"));

    if (!confirmed) {
      return;
    }

    setDeleteResume(true);
    setResumeFile(null);
    setResumeError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Submit                                                                  */
  /* ---------------------------------------------------------------------- */

  async function handleSubmit(event) {
    event.preventDefault();

    if (resumeError) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onCreate({
        ...form,

        job_url: form.job_url.trim() || undefined,

        notes: form.notes.trim() || undefined,

        resume: resumeFile || undefined,

        delete_resume: deleteResume,
      });

      onClose();
    } catch (err) {
      setError(getErrorMessage(err, "Could not save application"));
    } finally {
      setIsSubmitting(false);
    }
  }

  const currentResumeUrl = initial?.resume_url ?? null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />

      {/* Modal */}
      <div className="relative mx-auto flex max-h-[calc(100vh-2rem)] w-full max-w-[526px] flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-2xl shadow-slate-900/25">
        {/* ---------------------------------------------------------------- */}
        {/* Header                                                            */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex items-center justify-between border-b border-slate-100 px-7 py-5">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
              {initial ? <PencilLine /> : <FilePlus2 />}
            </div>

            <h3 className="text-base font-bold text-slate-950">
              {initial
                ? t("application.modal.editTitle")
                : t("application.modal.addTitle")}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label={t("application.modal.close")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Form                                                              */}
        {/* ---------------------------------------------------------------- */}

        <form className="min-h-0 space-y-4 overflow-y-auto px-7 pt-4 pb-7" onSubmit={handleSubmit}>
          {/* Error */}
          {error ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          ) : null}

          {/* ---------------------------------------------------------------- */}
          {/* Company + Position                                               */}
          {/* ---------------------------------------------------------------- */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Company */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                {t("application.modal.company")}{" "}
                <span className="text-red-400">*</span>
              </label>

              <input
                name="company_name"
                value={form.company_name}
                onChange={handleChange}
                placeholder="Stripe"
                required
                className="mt-2 h-11 w-full rounded-2xl border border-black/[0.08] bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            {/* Position */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                {t("application.modal.position")}{" "}
                <span className="text-red-400">*</span>
              </label>

              <input
                name="position"
                value={form.position}
                onChange={handleChange}
                placeholder="SWE Intern"
                required
                className="mt-2 h-11 w-full rounded-2xl border border-black/[0.08] bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Date + Status                                                    */}
          {/* ---------------------------------------------------------------- */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Apply date */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                {t("application.modal.applyDate")}
              </label>

              <div className="relative mt-2">
                <CalendarDays
                  className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                />

                <input
                  name="apply_date"
                  type="date"
                  value={form.apply_date}
                  onChange={handleChange}
                  className="h-11 w-full rounded-2xl border border-black/[0.08] bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                {t("application.modal.initialStatus")}
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="mt-2 h-11 w-full rounded-2xl border border-black/[0.08] bg-slate-50 px-4 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
              >
                {resolvedStatuses.map((status) => (
                  <option key={status.key} value={status.key}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Job URL                                                          */}
          {/* ---------------------------------------------------------------- */}

          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <ExternalLink className="h-3.5 w-3.5" />

              {t("application.modal.jobUrl")}
            </label>

            <input
              name="job_url"
              value={form.job_url}
              onChange={handleChange}
              placeholder="https://careers.stripe.com/..."
              className="mt-2 h-11 w-full rounded-2xl border border-black/[0.08] bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Notes                                                             */}
          {/* ---------------------------------------------------------------- */}

          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <StickyNote className="h-3.5 w-3.5" />

              {t("application.modal.notes")}
            </label>

            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Referral from Alex - Deadline Jul 15 - Role requires React"
              className="mt-2 w-full resize-none rounded-2xl border border-black/[0.08] bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
              rows={4}
            />
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Resume                                                            */}
          {/* ---------------------------------------------------------------- */}

          <ResumeSection
            currentResumeUrl={deleteResume ? null : currentResumeUrl}
            resumeFile={resumeFile}
            onResumeChange={handleResumeChange}
            onDeleteResume={handleDeleteResume}
            onClearResumeSelection={clearResumeSelection}
            fileInputRef={fileInputRef}
            isSubmitting={isSubmitting}
            resumeError={resumeError}
          />

          {/* ---------------------------------------------------------------- */}
          {/* Footer                                                            */}
          {/* ---------------------------------------------------------------- */}

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 disabled:opacity-50"
            >
              {t("application.modal.cancel")}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Check className="h-4 w-4" />

              {isSubmitting
                ? t("application.modal.uploading")
                : initial
                  ? t("application.modal.saveChanges")
                  : t("application.modal.saveApplication")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
