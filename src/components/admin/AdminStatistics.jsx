"use client";

import StatisticsCards from "./StatisticsCards";
import {
  ContentStatisticsCharts,
  VisitTrendChart,
} from "./StatisticsCharts";

export default function AdminStatistics({
  adminStats,
  chartData,
  pieData,
  siteVisitStats,
  isLoadingVisitStats,
  visitStatsError,
}) {
  return (
    <section className="mt-8 rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_24px_70px_rgba(79,70,229,0.10)] backdrop-blur">
      <div className="mb-8">
        <p className="text-sm font-bold text-[#4dbbff]">Statistics</p>
        <h2 className="mt-2 text-[2rem] font-black tracking-[-0.05em]">
          통계 시각화
        </h2>
        <p className="mt-3 text-sm leading-6 text-neutral-500">
          카테고리별 게시글과 반응 데이터를 한눈에 확인할 수 있습니다.
        </p>
      </div>

      <div className="mb-6 rounded-[28px] border border-emerald-100 bg-[linear-gradient(145deg,#ffffff,#f4fffb)] p-5 shadow-[0_18px_40px_rgba(16,185,129,0.08)]">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              👥
            </div>
            <div>
              <h3 className="text-sm font-black text-neutral-800">
                접속·조회 통계
              </h3>
              <p className="mt-1 text-xs text-neutral-500">
                같은 브라우저는 하루에 한 번 방문자로 집계됩니다.
              </p>
            </div>
          </div>
        </div>

        <StatisticsCards
          stats={siteVisitStats}
          totalViews={adminStats.totalViews}
          isLoading={isLoadingVisitStats}
        />

        {visitStatsError && (
          <p className="mt-3 text-xs font-bold text-red-500">
            {visitStatsError}
          </p>
        )}

        <VisitTrendChart data={siteVisitStats.last_7_days} />
      </div>

      <ContentStatisticsCharts chartData={chartData} pieData={pieData} />

      <div className="mt-6 flex items-center justify-between rounded-[24px] bg-[linear-gradient(90deg,#f5f7ff,#f8fbff)] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm">
            ✨
          </div>
          <div>
            <p className="text-sm font-black text-neutral-800">
              데이터 업데이트 안내
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              방문자와 게시글 조회 데이터는 자동으로 집계됩니다.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-full bg-white px-4 py-2 text-xs font-bold text-neutral-600 shadow-sm transition hover:bg-neutral-950 hover:text-white"
        >
          새로고침
        </button>
      </div>
    </section>
  );
}
