import { Link } from "react-router-dom"

export default function AuthShell({
  eyebrow,
  title,
  description,
  footerText,
  footerLinkLabel,
  footerLinkTo,
  children,
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          {eyebrow ? (
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-indigo-600">
              {eyebrow}
            </p>
          ) : null}

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm">
          {children}

          <div className="mt-6 border-t border-slate-200 pt-5 text-center text-sm text-slate-500">
            {footerText}{" "}
            <Link to={footerLinkTo} className="font-semibold text-indigo-600 hover:text-indigo-500">
              {footerLinkLabel}
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}