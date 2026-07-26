const BASE_TABS = [
  { key: "dashboard", label: "대시보드" },
  { key: "write", label: "글등록" },
  { key: "posts", label: "글관리" },
  { key: "skins", label: "스킨관리" },
];

export default function AdminDashboard({
  adminTab,
  adminStats,
  enableApplicationSystem,
  onAdminTabChange,
  onLogout,
  onNewPost,
}) {
  const tabs = [
    ...BASE_TABS,
    ...(enableApplicationSystem
      ? [{ key: "applications", label: "신청자관리" }]
      : []),
    { key: "stats", label: "통계" },
  ];

  return (
    <>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold text-[#4dbbff]">Admin Dashboard</p>
          <h1 className="text-[2rem] font-black tracking-[-0.05em]">
            관리자 대시보드
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            등록된 콘텐츠의 조회수, 좋아요, 댓글 현황을 확인할 수 있습니다.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onNewPost}
            className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-semibold text-white"
          >
            새 글 작성
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-neutral-700"
          >
            로그아웃
          </button>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2 border-b border-black/5 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onAdminTabChange(tab.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              adminTab === tab.key
                ? "bg-neutral-950 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {adminTab === "dashboard" && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-[22px] bg-neutral-50 p-5">
              <p className="text-xs font-semibold text-neutral-400">총 게시글</p>
              <div className="mt-2 text-3xl font-black">{adminStats.totalPosts}</div>
            </div>

            <div className="rounded-[22px] bg-neutral-50 p-5">
              <p className="text-xs font-semibold text-neutral-400">총 조회수</p>
              <div className="mt-2 text-3xl font-black">{adminStats.totalViews}</div>
            </div>

            <div className="rounded-[22px] bg-neutral-50 p-5">
              <p className="text-xs font-semibold text-neutral-400">총 좋아요</p>
              <div className="mt-2 text-3xl font-black">{adminStats.totalLikes}</div>
            </div>

            <div className="rounded-[22px] bg-neutral-50 p-5">
              <p className="text-xs font-semibold text-neutral-400">총 댓글</p>
              <div className="mt-2 text-3xl font-black">{adminStats.totalComments}</div>
            </div>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <div className="rounded-[22px] border border-black/5 bg-white p-5">
              <h2 className="mb-4 text-lg font-black tracking-[-0.04em]">
                인기글 TOP 5
              </h2>

              <div className="space-y-3">
                {adminStats.topPosts.length === 0 ? (
                  <p className="text-sm text-neutral-400">아직 등록된 글이 없습니다.</p>
                ) : (
                  adminStats.topPosts.map((post, index) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between gap-3 rounded-[16px] bg-neutral-50 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-neutral-900">
                          {index + 1}. {post.title}
                        </p>
                        <p className="mt-1 text-xs text-neutral-400">
                          조회 {post.views || 0} · 좋아요 {post.likes || 0} · 댓글{" "}
                          {(post.comments || []).length}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[22px] border border-black/5 bg-white p-5">
              <h2 className="mb-4 text-lg font-black tracking-[-0.04em]">
                카테고리별 게시글
              </h2>

              <div className="space-y-3">
                {Object.keys(adminStats.categoryCounts).length === 0 ? (
                  <p className="text-sm text-neutral-400">
                    카테고리 데이터가 없습니다.
                  </p>
                ) : (
                  Object.entries(adminStats.categoryCounts).map(
                    ([category, count]) => (
                      <div
                        key={category}
                        className="flex items-center justify-between rounded-[16px] bg-neutral-50 px-4 py-3"
                      >
                        <span className="text-sm font-semibold text-neutral-700">
                          {category}
                        </span>
                        <span className="text-sm font-black text-neutral-950">
                          {count}
                        </span>
                      </div>
                    )
                  )
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
