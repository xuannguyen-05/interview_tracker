import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

export default function CtaSection() {
  const { t } = useTranslation()
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-4xl rounded-3xl bg-indigo-600 px-6 py-12 text-center shadow-xl shadow-indigo-200 sm:px-10">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {t('landing.cta.title')}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-indigo-100">
          {t('landing.cta.description')}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/register"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 sm:w-auto"
          >
            {t('landing.cta.createAccount')}
          </Link>
          <Link
            to="/login"
            className="inline-flex w-full items-center justify-center rounded-2xl border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
          >
            {t('landing.cta.signIn')}
          </Link>
        </div>
      </div>
    </section>
  )
}
