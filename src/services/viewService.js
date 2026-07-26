import { supabase } from "../lib/supabase";

export const incrementPostViews = async (postId) => {
  const { data, error } = await supabase.rpc("increment_post_views", {
    post_id: postId,
  });

  if (error) throw error;

  const savedViews = Number(data);
  return Number.isFinite(savedViews) ? savedViews : null;
};
