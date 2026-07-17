import { FunnelChart, Funnel as RechartsFunnel, LabelList, ResponsiveContainer, Tooltip } from "recharts"

export default function Funnel({ funnel }) {
  const chartData = funnel?.map((item) => ({
    name: item.label,
    value: item.count,
    fill: item.label === "Applied" ? "#3B82F6" : item.label === "Interview" ? "#8B5CF6" : "#10B981",
  })) || []

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
          <p className="text-sm font-medium text-slate-900">{data.name}</p>
          <p className="text-sm text-slate-600">{data.value} applications</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold">Conversion Funnel</h4>
          <p className="text-sm text-slate-400">Applied → Offer pipeline</p>
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
              label={(entry) => `${entry.value}`}
              labelLine={{ stroke: '#fff', strokeWidth: 2 }}
            >
              <LabelList
                dataKey="name"
                position="center"
                fill="#fff"
                style={{ fontSize: 13, fontWeight: 600 }}
              />
            </RechartsFunnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
