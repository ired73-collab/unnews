"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const BAR_COLORS = ["#8B5CF6", "#3B82F6", "#34D399", "#FBBF24"];
const PIE_COLORS = ["#4F46E5", "#14B8A6", "#F59E0B"];

const formatVisitData = (items) =>
  items.map((item) => ({
    ...item,
    label: item.date
      ? new Intl.DateTimeFormat("ko-KR", {
          month: "numeric",
          day: "numeric",
        }).format(new Date(`${item.date}T00:00:00+09:00`))
      : "",
  }));

export function VisitTrendChart({ data }) {
  return (
    <div className="mt-5 rounded-[22px] bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-black text-neutral-800">최근 7일 방문 추이</p>
        <p className="text-xs font-semibold text-neutral-400">한국 시간 기준</p>
      </div>
      <div className="h-[230px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formatVisitData(data)}
            margin={{ top: 18, right: 12, left: -18, bottom: 0 }}
          >
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#737373", fontSize: 12 }}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#737373", fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => [
                `${Number(value).toLocaleString()}명`,
                "방문자",
              ]}
              contentStyle={{
                borderRadius: "16px",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
              }}
            />
            <Bar dataKey="visitors" fill="#10B981" radius={[10, 10, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ContentStatisticsCharts({ chartData, pieData }) {
  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-2">
      <div className="min-w-0 overflow-hidden rounded-[28px] border border-violet-100 bg-[linear-gradient(145deg,#ffffff,#f8f7ff)] p-4 shadow-[0_18px_40px_rgba(124,58,237,0.08)] md:p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
            📊
          </div>
          <h3 className="text-sm font-black text-neutral-800">
            카테고리별 게시글
          </h3>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 18, right: 18, left: -10, bottom: 0 }}
            >
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#737373", fontSize: 13 }}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#737373", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: "rgba(124,58,237,0.06)" }}
                contentStyle={{
                  borderRadius: "16px",
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                }}
              />
              <Bar
                dataKey="posts"
                radius={[14, 14, 8, 8]}
                label={{
                  position: "top",
                  fill: "#111827",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`bar-${entry.name}`}
                    fill={BAR_COLORS[index % BAR_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="min-w-0 rounded-[28px] border border-sky-100 bg-[linear-gradient(145deg,#ffffff,#f4fbff)] p-4 shadow-[0_18px_40px_rgba(14,165,233,0.08)] md:p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
            ◔
          </div>
          <h3 className="text-sm font-black text-neutral-800">
            반응 데이터 비율
          </h3>
        </div>
        <div className="grid min-w-0 items-center gap-4 md:grid-cols-[minmax(0,1fr)_150px]">
          <div className="relative z-0 h-[260px] min-w-0 sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="40%"
                  outerRadius="68%"
                  paddingAngle={3}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`pie-${entry.name}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  allowEscapeViewBox={{ x: true, y: true }}
                  wrapperStyle={{ zIndex: 30 }}
                  contentStyle={{
                    borderRadius: "16px",
                    border: "1px solid rgba(0,0,0,0.06)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] sm:h-24 sm:w-24">
              <span className="text-xs font-bold text-neutral-400">총 반응</span>
              <span className="text-2xl font-black text-neutral-900">
                {pieData.reduce((sum, item) => sum + item.value, 0)}
              </span>
            </div>
          </div>
          <div className="space-y-3">
            {pieData.map((item, index) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
                    }}
                  />
                  <span className="text-sm font-bold text-neutral-700">
                    {item.name}
                  </span>
                </div>
                <span className="text-sm font-black text-neutral-900">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
