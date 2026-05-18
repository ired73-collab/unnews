export const CATEGORY_MAP = {
  뉴스: ["대학뉴스", "교육", "사회", "문화", "지역"],
  커뮤니티: ["캠퍼스", "학생생활", "인터뷰", "칼럼", "제보"],
  "취업/공모전": ["취업", "인턴", "공모전", "대외활동", "창업"],
  트렌드: ["AI", "라이프", "커리어", "소비문화", "콘텐츠"],
};

export const PRIMARY_CATEGORIES = ["전체", ...Object.keys(CATEGORY_MAP)];

export function getCategory1(post) {
  if (post.category1) return post.category1;
  if (["AI", "라이프", "커리어", "트렌드"].includes(post.category)) return "트렌드";
  return post.category || "트렌드";
}

export function getCategory2(post) {
  if (post.category2) return post.category2;
  if (["AI", "라이프", "커리어"].includes(post.category)) return post.category;
  if (post.category === "트렌드") return "콘텐츠";
  return post.category || "콘텐츠";
}

export function getCategoryLabel(post) {
  return `${getCategory1(post)} · ${getCategory2(post)}`;
}
