import { useTranslation } from "react-i18next"

const STEPS = [
  {
    step: "01",
    title: "Add your applications",
    description: "Log company, role, apply date, job link, notes, and optionally upload your CV.",
  },
  {
    step: "02",
    title: "Move them through stages",
    description: "Use the Kanban board to track progress from Applied to Interview, Offer, or Rejected.",
  },
  {
    step: "03",
    title: "Review and act",
    description: "Check the dashboard for trends, respond to notifications, and follow up when needed.",
  },
]

export default function HowItWorksSection() {
  const { t } = useTranslation()
  return (
    <section id="how-it-works" className="border-y border-black/[0.06] bg-white px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">{t('landing.howItWorks.label')}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            {t('landing.howItWorks.title')}
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {t('landing.howItWorks.steps', { returnObjects: true }).map((item) => (
            <article key={item.step} className="rounded-2xl border border-black/[0.06] bg-slate-50 p-6">
              <p className="text-sm font-bold text-indigo-600">{item.step}</p>
              <h3 className="mt-3 text-lg font-bold text-slate-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
