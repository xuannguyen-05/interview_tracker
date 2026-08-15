import { FunnelChart, Funnel as RechartsFunnel, LabelList, ResponsiveContainer, Tooltip } from "recharts"
import { useTranslation } from "react-i18next"

export default function Funnel({ funnel }) {
  const { t } = useTranslation()
  const chartData = funnel?.map((item) => ({
    name: item.label,
    value: item.count,
    fill: item.label === t("application.applied") ? "#3B82F6" : item.label === t("application.interview") ? "#8B5CF6" : "#10B981",
  })) || []

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const item = funnel?.find((f) => f.label === data.name)
      return (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
          <p className="text-sm font-semibold text-slate-900">{data.name}</p>
          <p className="text-sm text-slate-600">{data.value} {t("dashboard.funnelTooltip.applications")}</p>
          {item && item.percent !== undefined && (
            <p className="mt-1 text-xs text-slate-400">{item.percent.toFixed(1)}% {t("dashboard.funnelTooltip.conversion")}</p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold">{t("dashboard.funnel")}</h4>
          <p className="text-sm text-slate-400">{t("dashboard.funnelSubtitle")}</p>
        </div>
        <div className="flex gap-4 text-sm">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
              <span className="text-slate-600">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart data={chartData}>
            <Tooltip content={<CustomTooltip />} />
            <RechartsFunnel
              dataKey="value"
              data={chartData}
              isAnimationActive
              animationDuration={800}
              label={(entry) => `${entry.value}`}
              labelLine={{ stroke: '#fff', strokeWidth: 2, strokeDasharray: '3 3' }}
            >
              <LabelList
                dataKey="name"
                position="center"
                fill="#fff"
                style={{ fontSize: 14, fontWeight: 600, textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
              />
            </RechartsFunnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
