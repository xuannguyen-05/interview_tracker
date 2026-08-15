import { useTranslation } from "react-i18next"

import LandingHeader from "@/components/landing/LandingHeader"
import HeroSection from "@/components/landing/HeroSection"
import ProblemSection from "@/components/landing/ProblemSection"
import FeaturesSection from "@/components/landing/FeaturesSection"
import HowItWorksSection from "@/components/landing/HowItWorksSection"
import CtaSection from "@/components/landing/CtaSection"

export default function LandingPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <LandingHeader />
      <main>
        <HeroSection />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CtaSection />
      </main>

      <footer className="border-t border-black/[0.06] bg-white px-4 py-7 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-sm text-slate-500 sm:flex-row">
          <p className="font-medium text-slate-600">© 2026 Interview Tracker - quản lý hồ sơ ứng tuyển</p>
          <div className="flex flex-wrap items-center justify-center gap-5 sm:justify-end">
            <div className="flex items-center gap-4">
              <span className="text-slate-400">Explore</span>
              <a href="#features" className="transition hover:text-slate-800">{t("landing.footer.features")}</a>
              <a href="#how-it-works" className="transition hover:text-slate-800">{t("landing.footer.howItWorks")}</a>
            </div>
            <span className="hidden h-4 w-px bg-slate-200 sm:block" aria-hidden="true" />
            <div className="flex items-center gap-4">
              <span className="text-slate-400">Contact</span>
            <a
              href="https://www.facebook.com/pham.xuan.nguyenn?locale=vi_VN"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-slate-800"
            >
              Facebook
            </a>
            <a href="mailto:xuannguyen2152005@gmail.com" className="transition hover:text-slate-800">Email</a>
            <a href="https://github.com/xuannguyen-05" target="_blank" rel="noreferrer" className="transition hover:text-slate-800">GitHub</a>
            <a href="https://www.linkedin.com/in/nguyenpham05/" target="_blank" rel="noreferrer" className="transition hover:text-slate-800">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
