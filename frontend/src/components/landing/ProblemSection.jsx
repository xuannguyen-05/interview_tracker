import { useTranslation } from "react-i18next"

const OLD_WAY = [
  "Hard to see your full pipeline at a glance",
  "Follow-ups get buried in spreadsheet rows",
  "No analytics on interview or offer conversion",
  "Difficult to keep CVs organized per application",
]

const NEW_WAY = [
  "Kanban board shows every stage in one view",
  "Follow-up alerts highlight applications that need action",
  "Dashboard tracks interview and offer rates over time",
  "Upload and manage a CV for each application",
]

export default function ProblemSection() {
  const { t } = useTranslation()
  return (
    <section id="problem" className="border-y border-black/[0.06] bg-white px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">{t('landing.problem.label')}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            {t('landing.problem.title')}
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            {t('landing.problem.description')}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <article className="rounded-3xl border border-rose-200 bg-gradient-to-br from-rose-50/80 to-rose-100/40 p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-rose-500 text-sm font-bold text-white shadow-sm">✕</span>
              <h3 className="text-lg font-bold text-slate-900">{t('landing.problem.oldWay.title')}</h3>
            </div>

            <div className="overflow-hidden rounded-2xl border border-rose-200 bg-white shadow-sm">
              <div className="grid grid-cols-4 gap-px bg-rose-100 p-px text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                <div className="bg-white px-3 py-2.5">{t('landing.problem.oldWay.company')}</div>
                <div className="bg-white px-3 py-2.5">{t('landing.problem.oldWay.status')}</div>
                <div className="bg-white px-3 py-2.5">{t('landing.problem.oldWay.followUp')}</div>
                <div className="bg-white px-3 py-2.5">{t('landing.problem.oldWay.cv')}</div>
              </div>
              <div className="divide-y divide-rose-100 text-xs text-slate-600">
                <div className="grid grid-cols-4 gap-2 px-3 py-2.5"><span>Stripe</span><span className="bg-yellow-100 px-1.5 py-0.5 rounded text-[10px]">???</span><span className="text-rose-500 font-medium">NO</span><span className="text-slate-400">link?</span></div>
                <div className="grid grid-cols-4 gap-2 px-3 py-2.5"><span>Google</span><span className="text-slate-700">interview</span><span className="text-rose-500 font-medium">forgot</span><span className="text-slate-500">v2_final(3)</span></div>
                <div className="grid grid-cols-4 gap-2 px-3 py-2.5"><span>Meta</span><span className="bg-green-100 px-1.5 py-0.5 rounded text-[10px]">applied</span><span className="text-slate-500">maybe</span><span className="text-slate-400">—</span></div>
                <div className="grid grid-cols-4 gap-2 px-3 py-2.5"><span>Amazon</span><span className="text-slate-700">applied</span><span className="text-rose-500 font-medium">???</span><span className="text-slate-500">resume.pdf</span></div>
              </div>
            </div>

            <ul className="mt-6 space-y-3">
              {t('landing.problem.oldWay.points', { returnObjects: true }).map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="mt-0.5 text-rose-500 font-bold">✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-emerald-100/40 p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-500 text-sm font-bold text-white shadow-sm">✓</span>
              <h3 className="text-lg font-bold text-slate-900">{t('landing.problem.newWay.title')}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { stage: "Applied", company: "FPT", detail: "7d follow-up", color: "blue" },
                { stage: "Interview", company: "Google", detail: "Round 1", color: "violet" },
                { stage: "Offer", company: "Grab", detail: "Offer", color: "emerald" },
                { stage: "Rejected", company: "Amazon", detail: "Closed", color: "rose" },
              ].map((item) => {
                const colorClasses = {
                  blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
                  violet: { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700" },
                  emerald: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
                  rose: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700" },
                }
                const colors = colorClasses[item.color]
                return (
                  <div key={item.stage} className={`rounded-xl border ${colors.border} ${colors.bg} p-4 shadow-sm`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">{item.stage}</p>
                      <div className={`h-2 w-2 rounded-full ${colors.bg.replace('bg-', 'bg-').replace('50', '500')}`} />
                    </div>
                    <div className="rounded-lg border border-black/[0.06] bg-white px-3 py-2 shadow-sm">
                      <p className="text-xs font-semibold text-slate-800">{item.company}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.detail}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <ul className="mt-6 space-y-3">
              {t('landing.problem.newWay.points', { returnObjects: true }).map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="mt-0.5 text-emerald-600 font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  )
}
