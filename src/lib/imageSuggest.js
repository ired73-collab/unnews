export function extractKeywords(text) {
  if (!text) return [];

  const keywords = text
    .replace(/[^\w\s가-힣]/g, "")
    .split(/\s+/)
    .filter((word) => word.length >= 2);

  return [...new Set(keywords)];
}

export function getImageByKeyword(keyword) {
  const map = {
    AI: [
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f",
      "https://images.unsplash.com/photo-1581090700227-1e8a0e47d0a9",
    ],
    대학: [
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b",
    ],
    의료: [
      "https://images.unsplash.com/photo-1580281657527-47a5c7c6c9c7",
    ],
    공부: [
      "https://images.unsplash.com/photo-1513258496099-48168024aec0",
    ],
    취업: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978",
    ],
  };

  return map[keyword] || [];
}

export function suggestImages(title, body) {
  const keywords = extractKeywords(`${title} ${body}`);

  let results = [];

  keywords.forEach((k) => {
    results = results.concat(getImageByKeyword(k));
  });

  if (results.length === 0) {
    return [
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    ];
  }

  return results.slice(0, 4);
}
