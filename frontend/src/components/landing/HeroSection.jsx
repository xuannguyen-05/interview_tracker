import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import ProductPreview from "./ProductPreview"

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.12),transparent_55%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className={`text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {t('landing.hero.title')}
          </h1>

          <p className={`mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg transition-all duration-1000 ease-out delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {t('landing.hero.description')}
          </p>

          <div className={`mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row transition-all duration-1000 ease-out delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Link
              to="/register"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 sm:w-auto"
            >
              {t('landing.hero.startTracking')}
            </Link>
            <a
              href="#features"
              className="inline-flex w-full items-center justify-center rounded-2xl border border-black/[0.08] bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
            >
              {t('landing.hero.exploreFeatures')}
            </a>
          </div>
        </div>

        <div className="mt-12 sm:mt-16">
          <ProductPreview />
        </div>
      </div>
    </section>
  )
}
