import { supabase } from "../lib/supabase";

const EMPTY_VISIT_STATS = {
  today_visitors: 0,
  total_visits: 0,
  unique_visitors: 0,
  last_7_days: [],
};

export const recordSiteVisit = async () => {
  if (typeof window === "undefined") return;

  const tokenKey = "unnews_visitor_token";
  let browserToken = localStorage.getItem(tokenKey);

  if (!browserToken) {
    browserToken =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random()
            .toString(36)
            .slice(2)}`;
    localStorage.setItem(tokenKey, browserToken);
  }

  const { error } = await supabase.rpc("record_site_visit", {
    browser_token: browserToken,
  });

  if (error) throw error;
};

export const getSiteVisitStats = async () => {
  const { data, error } = await supabase.rpc("get_site_visit_stats");

  if (error) throw error;

  return {
    ...EMPTY_VISIT_STATS,
    today_visitors: Number(data?.today_visitors) || 0,
    total_visits: Number(data?.total_visits) || 0,
    unique_visitors: Number(data?.unique_visitors) || 0,
    last_7_days: Array.isArray(data?.last_7_days)
      ? data.last_7_days.map((item) => ({
          date: item.date,
          visitors: Number(item.visitors) || 0,
        }))
      : [],
  };
};

export const calculateAdminStats = (posts = [], getCategory) => {
  const totalPosts = posts.length;
  const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
  const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);
  const totalComments = posts.reduce(
    (sum, post) => sum + ((post.comments || []).length || 0),
    0
  );

  const topPosts = [...posts]
    .sort((a, b) => {
      const scoreA = (a.views || 0) + (a.likes || 0) * 3;
      const scoreB = (b.views || 0) + (b.likes || 0) * 3;
      return scoreB - scoreA;
    })
    .slice(0, 5);

  const categoryCounts = posts.reduce((acc, post) => {
    const category = getCategory(post) || "기타";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  return {
    totalPosts,
    totalViews,
    totalLikes,
    totalComments,
    topPosts,
    categoryCounts,
  };
};

export const getAdminChartData = (posts = []) => [
  {
    name: "뉴스",
    posts: posts.filter((post) => post.category1 === "뉴스").length,
  },
  {
    name: "커뮤니티",
    posts: posts.filter((post) => post.category1 === "커뮤니티").length,
  },
  {
    name: "취업",
    posts: posts.filter((post) => post.category1 === "취업/공모전").length,
  },
  {
    name: "트렌드",
    posts: posts.filter((post) => post.category1 === "트렌드").length,
  },
];

export const getAdminPieData = (posts = []) => [
  {
    name: "조회수",
    value: posts.reduce((sum, post) => sum + (post.views || 0), 0),
  },
  {
    name: "좋아요",
    value: posts.reduce((sum, post) => sum + (post.likes || 0), 0),
  },
  {
    name: "댓글",
    value: posts.reduce(
      (sum, post) => sum + (post.comments?.length || 0),
      0
    ),
  },
];
