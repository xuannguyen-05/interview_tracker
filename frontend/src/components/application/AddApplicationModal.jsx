/* eslint-disable no-unused-vars, react-hooks/set-state-in-effect */
import { useEffect, useState } from "react"
import { getErrorMessage } from "@/utils/getErrorMessage"

function LegacyAddApplicationModal({ open, onClose, onCreate, initial = null }) {
  const [form, setForm] = useState({
    company_name: "",
    position: "",
    apply_date: new Date().toISOString().slice(0, 10),
    job_url: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (initial) {
      setForm({
        company_name: initial.company_name ?? "",
        position: initial.position ?? "",
        apply_date: initial.apply_date ? new Date(initial.apply_date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        job_url: initial.job_url ?? "",
        notes: initial.notes ?? "",
      })
    } else {
      setForm({
        company_name: "",
        position: "",
        apply_date: new Date().toISOString().slice(0, 10),
        job_url: "",
        notes: "",
      })
    }
  }, [initial, open])

  if (!open) return null

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setError("")
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onCreate({ ...form })
      onClose()
    } catch (err) {
      setError(err?.response?.data?.message || "Lỗi khi tạo application")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
      <div className="mx-auto w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">{initial ? "Edit Application" : "Add New Application"}</h3>
          <button onClick={onClose} className="text-slate-500 text-lg">✕</button>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-700">Company Name *</label>
              <input name="company_name" value={form.company_name} onChange={handleChange} className="mt-2 w-full rounded-full border border-slate-200 px-4 py-3" />
            </div>

            <div>
              <label className="text-sm text-slate-700">Position *</label>
              <input name="position" value={form.position} onChange={handleChange} className="mt-2 w-full rounded-full border border-slate-200 px-4 py-3" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-700">Apply Date</label>
              <input name="apply_date" type="date" value={form.apply_date} onChange={handleChange} className="mt-2 w-full rounded-full border border-slate-200 px-4 py-3" />
            </div>
            <div>
              <label className="text-sm text-slate-700">Job URL</label>
              <input name="job_url" value={form.job_url} onChange={handleChange} className="mt-2 w-full rounded-full border border-slate-200 px-4 py-3" />
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-700">Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3" rows={4} />
          </div>

          <div className="flex items-center justify-between">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-700">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="rounded-full bg-indigo-600 px-6 py-3 text-white shadow-md">
              {isSubmitting ? "Saving..." : initial ? "Save Changes" : "Save Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const DEFAULT_STATUSES = [
  { key: "APPLIED", label: "Applied" },
  { key: "INTERVIEW", label: "Interview" },
  { key: "OFFER", label: "Offer" },
  { key: "REJECTED", label: "Rejected" },
]

function ModalIcon({ name, className = "h-4 w-4" }) {
  const paths = {
    board: "M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z",
    close: "M18 6 6 18M6 6l12 12",
    calendar: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z",
    external: "M14 3h7v7M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5",
    note: "M14 2H6a2 2 0 0 0-2 2v16l4-3h10a2 2 0 0 0 2-2V8l-6-6Z M14 2v6h6",
    check: "M20 6 9 17l-5-5",
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

export default function AddApplicationModal({ open, onClose, onCreate, initial = null, statuses = DEFAULT_STATUSES }) {
  const today = new Date().toISOString().slice(0, 10)
  const [form, setForm] = useState({
    company_name: "",
    position: "",
    apply_date: today,
    status: "APPLIED",
    job_url: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (initial) {
      setForm({
        company_name: initial.company_name ?? "",
        position: initial.position ?? "",
        apply_date: initial.apply_date ? new Date(initial.apply_date).toISOString().slice(0, 10) : today,
        status: initial.status ?? "APPLIED",
        job_url: initial.job_url ?? "",
        notes: initial.notes ?? "",
      })
    } else {
      setForm({
        company_name: "",
        position: "",
        apply_date: today,
        status: "APPLIED",
        job_url: "",
        notes: "",
      })
    }
    setError("")
  }, [initial, open, today])

  if (!open) return null

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setError("")
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      await onCreate({
        ...form,
        job_url: form.job_url.trim() || undefined,
        notes: form.notes.trim() || undefined,
      })
      onClose()
    } catch (err) {
      setError(getErrorMessage(err, "Could not save application"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />

      <div className="relative mx-auto w-full max-w-[526px] overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-2xl shadow-slate-900/25">
        <div className="flex items-center justify-between border-b border-slate-100 px-7 py-5">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
              <ModalIcon name="board" />
            </div>
            <h3 className="text-base font-bold text-slate-950">{initial ? "Edit Application" : "Add New Application"}</h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <ModalIcon name="close" className="h-4 w-4" />
          </button>
        </div>

        <form className="space-y-4 p-7" onSubmit={handleSubmit}>
          {error ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
          ) : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Company Name <span className="text-red-400">*</span>
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

            <div>
              <label className="text-sm font-medium text-slate-700">
                Position <span className="text-red-400">*</span>
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Apply Date</label>
              <div className="relative mt-2">
                <ModalIcon name="calendar" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  name="apply_date"
                  type="date"
                  value={form.apply_date}
                  onChange={handleChange}
                  className="h-11 w-full rounded-2xl border border-black/[0.08] bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Initial Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="mt-2 h-11 w-full rounded-2xl border border-black/[0.08] bg-slate-50 px-4 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
              >
                {statuses.map((status) => (
                  <option key={status.key} value={status.key}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <ModalIcon name="external" className="h-3.5 w-3.5" />
              Job URL
            </label>
            <input
              name="job_url"
              value={form.job_url}
              onChange={handleChange}
              placeholder="https://careers.stripe.com/..."
              className="mt-2 h-11 w-full rounded-2xl border border-black/[0.08] bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <ModalIcon name="note" className="h-3.5 w-3.5" />
              Notes
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

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <ModalIcon name="check" className="h-4 w-4" />
              {isSubmitting ? "Saving..." : initial ? "Save Changes" : "Save Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
