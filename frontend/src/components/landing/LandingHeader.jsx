import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

import LanguageSwitcher from "@/components/common/LanguageSwitcher"

import Brand from "@/components/common/Brand"

export default function LandingHeader() {
  const { t } = useTranslation()
  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Brand />

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#features" className="transition hover:text-slate-950">{t('landing.header.features')}</a>
          <a href="#how-it-works" className="transition hover:text-slate-950">{t('landing.header.howItWorks')}</a>
          <a href="#problem" className="transition hover:text-slate-950">{t('landing.header.whyNotExcel')}</a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <Link
            to="/login"
            className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
          >
            {t('landing.header.signIn')}
          </Link>
          <Link
            to="/register"
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700"
          >
            {t('landing.header.getStarted')}
          </Link>
        </div>
      </div>
    </header>
  )
}
