import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useTranslation } from "react-i18next"

export default function MonthlyChart({ data }) {
  const { t } = useTranslation()

  const chartData = data?.map((d) => ({
    month: `M${d.month}`,
    count: d.count,
  })) || []

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      return (
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
          <p className="text-sm font-medium text-slate-900">
            {t("dashboard.monthlyApplications.tooltipMonth", { month: item.month.replace("M", "") })}
          </p>
          <p className="text-sm text-slate-600">
            {item.count} {t("dashboard.monthlyApplications.applications")}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h4 className="text-lg font-semibold">{t("dashboard.monthlyApplications.title")}</h4>
      <p className="text-sm text-slate-400">{t("dashboard.monthlyApplications.subtitle")}</p>

      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }} />
            <Bar 
              dataKey="count" 
              fill="#6366f1" 
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
