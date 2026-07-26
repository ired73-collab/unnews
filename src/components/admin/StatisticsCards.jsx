export default function StatisticsCards({
  stats,
  totalViews,
  isLoading,
}) {
  const cards = [
    { label: "오늘 방문자", value: stats.today_visitors },
    { label: "누적 방문", value: stats.total_visits },
    { label: "고유 방문자", value: stats.unique_visitors },
    { label: "총 게시글 조회수", value: totalViews },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-[20px] bg-white px-4 py-4 shadow-sm"
        >
          <p className="text-xs font-bold text-neutral-400">{card.label}</p>
          <p className="mt-2 text-2xl font-black text-neutral-900">
            {isLoading && card.label !== "총 게시글 조회수"
              ? "..."
              : Number(card.value || 0).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
