import { createSlug } from "../utils/text";

export function normalizePost(post, fallbackSlug = "") {
  return {
    id: post.id,
    slug: post.slug || fallbackSlug || createSlug(post.title || ""),
    title: post.title,
    body: post.body || "",
    contentBlocks: post.content_blocks || post.contentBlocks || [],
    summary: post.summary || "",
    category1: post.category1 || "뉴스",
    category2: post.category2 || "교육",
    category: post.category || post.category2 || "교육",
    readTime: post.read_time || post.readTime || "1분 읽기",
    image: post.image || "",
    views: post.views || 0,
    likes: post.likes || 0,
    comments: Array.isArray(post.comments) ? post.comments : [],
    createdAt: post.created_at || post.createdAt,
    updatedAt: post.updated_at || post.updatedAt,
  };
}