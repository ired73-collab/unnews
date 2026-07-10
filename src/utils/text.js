export function clip(text, max = 130) {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

export function fallbackSummary(text) {
  if (!text) return "";
  const compact = text.replace(/\s+/g, " ").trim();
  const sentences = compact
    .split(/(?<=다\.|요\.|니다\.|[.!?])\s+/)
    .filter(Boolean)
    .slice(0, 3);

  if (sentences.length >= 2) return sentences.join("\n");
  return clip(compact, 160);
}

export function createSlug(text = "") {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}