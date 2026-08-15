import { useTranslation } from "react-i18next"

const FEATURES = [
  {
    title: "Application tracking",
    description: "Create, edit, and organize every job application with company, role, dates, notes, and job links.",
  },
  {
    title: "Kanban board",
    description: "Drag applications across Applied, Interview, Offer, and Rejected columns to reflect your real pipeline.",
  },
  {
    title: "Dashboard analytics",
    description: "See interview rate, offer rate, rejection rate, funnel progress, and monthly application trends.",
  },
  {
    title: "Follow-up reminders",
    description: "Applications that stay in Applied too long are highlighted so you know when to follow up.",
  },
  {
    title: "Real-time notifications",
    description: "Get notified when status changes or when an application needs your attention.",
  },
  {
    title: "Resume / CV management",
    description: "Attach a PDF resume to each application and open it anytime from your board or list view.",
  },
]

export default function FeaturesSection() {
  const { t } = useTranslation()
  return (
    <section id="features" className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">{t('landing.features.label')}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            {t('landing.features.title')}
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            {t('landing.features.description')}
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t('landing.features.items', { returnObjects: true }).map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="text-base font-bold text-slate-950">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
