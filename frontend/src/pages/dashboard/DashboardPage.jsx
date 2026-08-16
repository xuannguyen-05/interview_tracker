import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"

import { useAuthStore } from "@/stores/useAuthStore"
import { getErrorMessage } from "@/utils/getErrorMessage"

import StatCard from "@/components/dashboard/StatCard"
import Funnel from "@/components/dashboard/Funnel"
import MonthlyChart from "@/components/dashboard/MonthlyChart"
import AddApplicationModal from "@/components/application/AddApplicationModal"

import {
  getDashboard,
  getMonthlyStats,
} from "@/services/dashboardService"

// Icons
const BriefcaseIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const ChatIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
)

const StarIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
)

const XIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
  </svg>
)

export default function DashboardPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  const clearAccessToken = useAuthStore(
    (state) => state.clearAccessToken
  )

  const [data, setData] = useState(null)
  const [monthly, setMonthly] = useState([])
  const [error, setError] = useState("")
  const [showQuickAdd, setShowQuickAdd] = useState(false)

  useEffect(() => {
    function onQuick() {
      setShowQuickAdd(true)
    }

    window.addEventListener("quickAdd", onQuick)
    return () => window.removeEventListener("quickAdd", onQuick)
  }, [])

  useEffect(() => {
    async function load() {
      try {
        const res = await getDashboard()
        setData(res.data)

        const m = await getMonthlyStats(new Date().getFullYear())
        setMonthly(m.data || [])
      } catch (err) {
        console.error(err)
        setError(getErrorMessage(err, "Could not load dashboard data."))
      }
    }

    load()
  }, [])

  const summary = data?.summary ?? {}
  const statusLabels = {
    applied: t('application.applied'),
    interview: t('application.interview'),
    offer: t('application.offer'),
  }

  // Chuyển object funnel từ backend thành array cho Funnel component
  const funnel = data?.funnel
  ? [
      {
        label: statusLabels.applied,
        count: data.funnel.applied,
        percent: 100,
      },
      {
        label: statusLabels.interview,
        count: data.funnel.interview,
        percent: data.funnel.interview_rate,
      },
      {
        label: statusLabels.offer,
        count: data.funnel.offer,
        percent: data.funnel.offer_rate,
      },
    ]
  : []

  function handleApplicationClick(application) {
    navigate('/application', { state: { highlightApplicationId: application.application_id } })
  }

  async function handleQuickAddSubmit(payload) {
    try {
      const { createApplication } = await import("@/services/applicationService")
      await createApplication(payload)
      setShowQuickAdd(false)
      const res = await getDashboard()
      setData(res.data)
      const m = await getMonthlyStats(new Date().getFullYear())
      setMonthly(m.data || [])
    } catch (err) {
      console.error(err)
      setError(getErrorMessage(err, "Could not create application."))
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-8 pb-20">
        {error ? (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label={t('dashboard.totalApplications')}
            value={summary.total_applications ?? 0}
            sub={t('dashboard.allTime')}
            icon={<BriefcaseIcon />}
          />

          <StatCard
            label={t('dashboard.interviewRate')}
            value={`${(summary.interview_rate ?? 0).toFixed(1)}%`}
            sub={`${summary.interview ?? 0} ${t('dashboard.interviews')}`}
            icon={<ChatIcon />}
          />

          <StatCard
            label={t('dashboard.offerRate')}
            value={`${(summary.offer_rate ?? 0).toFixed(1)}%`}
            sub={`${summary.offer ?? 0} ${t('dashboard.offers')}`}
            icon={<StarIcon />}
          />

          <StatCard
            label={t('dashboard.rejectionRate')}
            value={`${(summary.rejection_rate ?? 0).toFixed(1)}%`}
            sub={`${summary.rejected ?? 0} ${t('dashboard.rejections')}`}
            icon={<XIcon />}
          />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Funnel funnel={funnel} />
          </div>

          <div>
            <MonthlyChart data={monthly} />
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold">{t('dashboard.urgentActions')}</h4>
                <p className="text-sm text-slate-400">
                  {data?.urgentApplications?.length || 0} {t('dashboard.urgentDescription')}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                <svg className="h-4 w-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <ul className="space-y-3">
              {data?.urgentApplications?.map((a) => {
                const daysAgo = Math.floor((Date.now() - new Date(a.last_status_changed_at)) / (1000 * 60 * 60 * 24))
                return (
                  <li
                    key={a.application_id}
                    onClick={() => handleApplicationClick(a)}
                    className="group flex items-center justify-between rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white px-4 py-3 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-sm">
                        {a.company_name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-slate-900">{a.company_name}</div>
                        <div className="text-xs text-slate-500">{a.position}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        daysAgo >= 10 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {daysAgo}d
                      </span>
                    </div>
                  </li>
                )
              })}
              {(!data?.urgentApplications || data.urgentApplications.length === 0) && (
                <li className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                    <svg className="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-400">{t('dashboard.noUrgent')}</p>
                </li>
              )}
            </ul>
          </div>
          </div>

          <div className="md:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold">{t('dashboard.recentApplications')}</h4>
                  <p className="text-sm text-slate-400">{t('dashboard.recentDescription')}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <svg className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              <ul className="space-y-3">
                {data?.recentApplications?.map((a) => (
                  <li
                    key={a.application_id}
                    onClick={() => handleApplicationClick(a)}
                    className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 hover:bg-slate-100 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm">
                        {a.company_name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-slate-900">{a.company_name}</div>
                        <div className="text-xs text-slate-500">{a.position}</div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400">
                      {new Date(a.apply_date).toLocaleDateString()}
                    </div>
                  </li>
                ))}
                {(!data?.recentApplications || data.recentApplications.length === 0) && (
                  <li className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                      <svg className="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-400">{t('dashboard.noRecent')}</p>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <AddApplicationModal
        open={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        onCreate={handleQuickAddSubmit}
      />
    </div>
  )
}