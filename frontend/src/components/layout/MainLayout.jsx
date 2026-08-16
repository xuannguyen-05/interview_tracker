import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"

import Sidebar from "./Sidebar"
import LanguageSwitcher from "@/components/common/LanguageSwitcher"

import Brand from "@/components/common/Brand"

function TypingTitle({ text }) {
  const [displayText, setDisplayText] = useState("")

  useEffect(() => {
    setDisplayText("")

    if (!text) return

    let index = 0
    const interval = setInterval(() => {
      index += 1
      setDisplayText(text.slice(0, index))

      if (index >= text.length) {
        clearInterval(interval)
      }
    }, 40)

    return () => clearInterval(interval)
  }, [text])

  return (
    <span className="inline-flex items-center truncate text-xl font-bold text-slate-800 md:text-2xl">
      {displayText}
      <span className="ml-1 inline-block h-7 w-[2px] animate-pulse bg-indigo-600" />
    </span>
  )
}

export default function MainLayout({ children }) {
  const location = useLocation()
  const { t } = useTranslation()

  const pageTitle =
    location.pathname.startsWith("/application")
      ? t("application.title")
      : location.pathname.startsWith("/dashboard")
        ? t("dashboard.title")
        : ""

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-slate-900">
      <div className="relative flex min-h-screen flex-col">
        <header className="sticky top-0 z-20 border-b border-black/[0.06] bg-white/90 backdrop-blur-sm">
          <div className="flex h-[68px] items-center justify-between gap-4 px-5 lg:px-6">
            <div className="flex min-w-0 items-center">
              <Brand />

              {pageTitle ? (
                <div className="ml-10 min-w-0 truncate md:ml-12">
                  <TypingTitle text={pageTitle} />
                </div>
              ) : null}
            </div>

            <LanguageSwitcher />
          </div>
        </header>

        <div className="relative flex min-h-0 flex-1">
          <div className="fixed left-0 top-[68px] bottom-0 z-10 h-[calc(100vh-68px)]">
            <Sidebar />
          </div>

          <div className="ml-[262px] min-w-0 flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
