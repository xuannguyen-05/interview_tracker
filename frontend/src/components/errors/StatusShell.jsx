import { Link } from "react-router-dom"

export default function StatusShell({
  code,
  title,
  description,
  primaryLabel,
  primaryTo,
  secondaryLabel,
  secondaryTo,
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.22),_transparent_40%),linear-gradient(135deg,#020617_0%,#0f172a_45%,#111827_100%)]" />

      <section className="relative z-10 w-full max-w-xl rounded-3xl border border-white/10 bg-white/95 p-8 text-slate-900 shadow-2xl shadow-slate-950/30 backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">{code}</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">{description}</p>

        {primaryLabel && primaryTo ? (
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={primaryTo}
              className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-500"
            >
              {primaryLabel}
            </Link>

            {secondaryLabel && secondaryTo ? (
              <Link
                to={secondaryTo}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
        ) : null}
      </section>
    </main>
  )
}