import { supabase } from "../lib/supabase";

function createSlug(text = "") {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export default async function sitemap() {
  const baseUrl = "https://unnews.vercel.app";

  const { data } = await supabase
    .from("posts")
    .select("id, title, slug, updated_at, created_at")
    .order("created_at", { ascending: false });

  const posts = data || [];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...posts.map((post) => ({
      url: `${baseUrl}/news/${post.slug || createSlug(post.title) || post.id}`,
      lastModified: post.updated_at || post.created_at || new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    })),
  ];
}