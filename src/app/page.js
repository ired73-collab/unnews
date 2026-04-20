"use client";

import { useEffect, useMemo, useState } from "react";

const POSTS = [
  {
    id: 1,
    title: "AI 공부, 이렇게 시작함",
    body: "요즘 대학생들은 AI를 ‘배워야 하는 기술’보다 ‘바로 써보는 도구’로 먼저 받아들이는 경우가 많습니다. 복잡한 강의부터 듣기보다, 과제 정리나 아이디어 확장처럼 당장 필요한 일에 작게 써보면서 감을 익힙니다. 결국 중요한 건 많이 아는 것보다, 내 공부 방식 안에 자연스럽게 넣는 것입니다.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    category: "AI",
    readTime: "1분 읽기",
  },
  {
    id: 2,
    title: "포폴 감각, 여기서 갈림",
    body: "포트폴리오는 많이 보여주는 것보다 ‘무엇을 남길지’ 정하는 감각이 더 중요합니다. 요즘은 결과물 자체보다 문제를 어떻게 풀었는지, 어떤 흐름으로 생각했는지가 더 잘 읽힙니다. 화려하게 꾸미기보다, 한 장 한 장이 자연스럽게 연결되는 편이 훨씬 설득력 있습니다.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    category: "커리어",
    readTime: "1분 읽기",
  },
  {
    id: 3,
    title: "캠퍼스 루틴, 가볍게",
    body: "빡빡한 계획표보다 오래 가는 작은 루틴이 더 중요해졌습니다. 아침 수업 전 10분 정리, 공강 시간 메모, 자기 전 내일 일정 확인처럼 부담 없는 습관이 하루를 훨씬 덜 흔들리게 만듭니다. 무리해서 잘하는 것보다, 무너지지 않는 흐름을 만드는 쪽이 현실적입니다.",
    image: "https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?auto=format&fit=crop&w=1200&q=80",
    category: "라이프",
    readTime: "1분 읽기",
  },
  {
    id: 4,
    title: "요즘 소비 트렌드",
    body: "요즘 소비는 단순히 싸고 좋은 것을 찾는 방식에서 조금 달라졌습니다. 가격만 따지기보다, 그 브랜드의 분위기와 경험, 나와 얼마나 잘 맞는지를 함께 봅니다. 결국 소비는 물건을 사는 일이 아니라 내 취향을 보여주는 방식이 되고 있습니다.",
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
    category: "트렌드",
    readTime: "1분 읽기",
  },
  {
    id: 5,
    title: "과제 스트레스 줄이는 습관",
    body: "과제 스트레스는 분량보다 ‘막막함’에서 시작되는 경우가 많습니다. 그래서 요즘은 한 번에 끝내려 하기보다, 자료 찾기·구조 잡기·문장 정리처럼 단계를 잘게 나누는 방식이 더 효과적입니다. 작게 나누면 부담이 줄고, 시작 속도도 확실히 빨라집니다.",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
    category: "라이프",
    readTime: "1분 읽기",
  },
  {
    id: 6,
    title: "AI 과제 활용 기준",
    body: "AI를 과제에 활용할 때 가장 중요한 것은 ‘편하게 쓰는 것’이 아니라 ‘어디까지 맡길지 아는 것’입니다. 초안 정리나 아이디어 확장에는 도움이 되지만, 그대로 가져오면 내 생각이 빠지기 쉽습니다. 결국 완성도를 결정하는 건 AI가 아니라 마지막에 손보는 내 기준입니다.",
    image: "https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1200&q=80",
    category: "AI",
    readTime: "1분 읽기",
  },
  {
    id: 7,
    title: "취준, 이게 현실",
    body: "취업 준비가 힘든 이유는 정보가 없어서가 아니라, 정보가 너무 많아서입니다. 스펙, 자소서, 인턴, 자격증, 면접 준비까지 다 중요해 보이니 기준이 흐려집니다. 그래서 요즘 취준은 더 열심히 하는 것보다, 무엇을 먼저 할지 정리하는 힘이 더 중요해졌습니다.",
    image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80",
    category: "커리어",
    readTime: "1분 읽기",
  },
  {
    id: 8,
    title: "콘텐츠, 짧아야 봄",
    body: "긴 글을 끝까지 읽는 일은 점점 어려워지고 있습니다. 대신 핵심이 빨리 보이고, 한 장면 안에 분위기와 메시지가 함께 담긴 콘텐츠가 더 잘 읽힙니다. 요즘 콘텐츠는 더 많이 설명하는 것보다, 더 빨리 이해되는 구조가 중요합니다.",
    image: "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1200&q=80",
    category: "트렌드",
    readTime: "1분 읽기",
  },
  {
    id: 9,
    title: "대외활동, 이렇게 고름",
    body: "대외활동은 많이 하는 것이 꼭 좋은 결과로 이어지지 않습니다. 지금 나에게 필요한 경험인지, 끝나고 무엇이 남는지, 내 이야기로 정리할 수 있는지를 함께 봐야 합니다. 이름이 유명한 활동보다, 나와 잘 맞는 활동 하나가 훨씬 오래 갑니다.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    category: "커리어",
    readTime: "1분 읽기",
  },
  {
    id: 10,
    title: "혼자 있는 시간이 중요해짐",
    body: "예전보다 혼자 보내는 시간을 더 소중하게 여기는 학생들이 많아졌습니다. 사람을 피해서라기보다, 혼자 있는 시간이 있어야 생각이 정리되고 감정도 회복되기 때문입니다. 바쁜 일상 속에서도 나만의 속도를 되찾는 시간이 점점 더 중요해지고 있습니다.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    category: "라이프",
    readTime: "1분 읽기",
  },
  {
    id: 11,
    title: "브랜드는 설명보다 분위기",
    body: "요즘 브랜드는 자신을 길게 설명하지 않습니다. 대신 색감, 사진, 문장 톤, 작은 디테일로 ‘어떤 느낌인지’를 먼저 보여줍니다. 결국 기억에 남는 브랜드는 정보를 많이 준 곳보다, 분위기를 자연스럽게 남긴 곳일 때가 많습니다.",
    image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
    category: "트렌드",
    readTime: "1분 읽기",
  },
  {
    id: 12,
    title: "생산성, 덜 하고 잘하기",
    body: "생산성은 더 많은 일을 해내는 능력처럼 보이지만, 실제로는 덜 중요한 일을 줄이는 감각에 더 가깝습니다. 요즘은 AI나 자동화 도구를 활용해 반복 작업을 줄이고, 내가 직접 판단해야 하는 일에 집중하는 방식이 더 현실적입니다. 결국 중요한 건 속도보다 에너지 배분입니다.",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
    category: "AI",
    readTime: "1분 읽기",
  },
];

const CATEGORIES = ["전체", "트렌드", "커리어", "AI", "라이프"];

function clip(text, max = 130) {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

function validatePosts(posts) {
  return posts.every(
    (post) =>
      typeof post.id === "number" &&
      typeof post.title === "string" &&
      typeof post.body === "string" &&
      typeof post.image === "string" &&
      typeof post.category === "string"
  );
}

function IconTile({ children }) {
  return <div className="flex items-center justify-center text-neutral-950">{children}</div>;
}

function ShortcutGridIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="6" height="6" rx="1.8" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="4" width="6" height="6" rx="1.8" stroke="currentColor" strokeWidth="1.8" />
      <rect x="4" y="14" width="6" height="6" rx="1.8" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="14" width="6" height="6" rx="1.8" fill="#2563EB" />
    </svg>
  );
}

function ShortcutArticleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 3.8h7l3.2 3.2V19a1.2 1.2 0 0 1-1.2 1.2H7A1.2 1.2 0 0 1 5.8 19V5A1.2 1.2 0 0 1 7 3.8Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M14 3.8V7h3.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.6 11.2h6.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8.6 15h4.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="15.8" cy="15.2" r="1.9" fill="#7C3AED" />
    </svg>
  );
}

function ShortcutAdminIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3.8 18 6v4.6c0 4-2.4 7-6 8.4-3.6-1.4-6-4.4-6-8.4V6l6-2.2Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="m9.8 11.8 1.6 1.6 3.1-3.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.5 18.5h2.7" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="18.5" cy="18.5" r="1.8" fill="#F59E0B" />
    </svg>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-16 bg-black text-white">
      <div className="mx-auto max-w-[1440px] px-6 py-10 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-lg font-semibold">UNNEWS</div>
            <div className="mt-2 text-sm text-white/60">대학연합신문 · 이미지 중심 콘텐츠 플랫폼</div>
          </div>

          <div className="flex gap-6 text-sm text-white/70">
            <span className="cursor-pointer hover:text-white">About</span>
            <span className="cursor-pointer hover:text-white">Contact</span>
            <span className="cursor-pointer hover:text-white">Privacy</span>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-xs text-white/40">
          © 2026 UNNEWS. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

console.assert(validatePosts(POSTS), "POSTS 데이터 구조가 올바르지 않습니다.");
console.assert(CATEGORIES.includes("전체"), "카테고리 목록에 '전체'가 필요합니다.");
console.assert(POSTS.length >= 3, "히어로 롤링을 위해 최소 3개 게시글이 필요합니다.");
console.assert(typeof clip("테스트", 2) === "string", "clip 함수는 문자열을 반환해야 합니다.");
console.assert(clip("abcdef", 3) === "abc...", "clip 함수가 길이 제한을 올바르게 적용해야 합니다.");
console.assert(Array.isArray(CATEGORIES) && CATEGORIES.length === 5, "카테고리 수가 예상과 다릅니다.");

function getAutoImage(category, title = "") {
  const keyword = `${category} ${title}`;

  if (keyword.includes("AI")) {
    return "https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1200&q=80";
  }
  if (keyword.includes("커리어") || keyword.includes("포폴") || keyword.includes("취준")) {
    return "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80";
  }
  if (keyword.includes("라이프") || keyword.includes("루틴") || keyword.includes("캠퍼스")) {
    return "https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?auto=format&fit=crop&w=1200&q=80";
  }
  return "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80";
}

export default function UnnewsCompletePreview() {
  const [page, setPage] = useState("home");
  const [activeCategory, setActiveCategory] = useState("전체");
  const [selectedPost, setSelectedPost] = useState(POSTS[0]);
  const [drafts, setDrafts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    category: "트렌드",
    body: "",
    image: "",
    imageFileName: "",
    uploadedImage: "",
    useAutoImage: true,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);

  const allPosts = useMemo(() => [...drafts, ...POSTS], [drafts]);

  const visiblePosts = useMemo(() => {
    if (activeCategory === "전체") return allPosts;
    return allPosts.filter((post) => post.category === activeCategory);
  }, [activeCategory, allPosts]);

  const featured = allPosts.slice(0, 4);
  const heroPosts = allPosts.slice(0, 3);
  const latest = allPosts.slice(0, 8);

  useEffect(() => {
    setHeroIndex(0);
  }, [activeCategory]);

  useEffect(() => {
    if (page !== "home" || heroPosts.length <= 1) return undefined;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroPosts.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [page, heroPosts.length]);

  const currentHero = heroPosts[heroIndex] || featured[0] || POSTS[0];
  const previewImage = form.uploadedImage
    ? form.uploadedImage
    : form.useAutoImage || !form.image.trim()
      ? getAutoImage(form.category, form.title)
      : form.image.trim();

  const submitDraft = () => {
    if (!form.title.trim() || !form.body.trim()) return;

    const resolvedImage = form.uploadedImage
      ? form.uploadedImage
      : form.useAutoImage || !form.image.trim()
        ? getAutoImage(form.category, form.title)
        : form.image.trim();

    const newPost = {
      id: Date.now(),
      title: form.title.trim(),
      body: form.body.trim(),
      category: form.category,
      readTime: "1분 읽기",
      image: resolvedImage,
    };

    setDrafts((prev) => [newPost, ...prev]);
    setForm({
      title: "",
      category: "트렌드",
      body: "",
      image: "",
      imageFileName: "",
      uploadedImage: "",
      useAutoImage: true,
    });
    setSelectedPost(newPost);
    setPage("post");
  };

  return (
    <div
      className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffffff_0%,_#f7f7f5_45%,_#f3f2ef_100%)] text-neutral-900"
      style={{ fontFamily: "Pretendard, Inter, system-ui, sans-serif" }}
    >
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 md:px-8">
          <button
            onClick={() => {
              setActiveCategory("전체");
              setPage("home");
            }}
            className="flex items-center gap-3"
          >
            <div className="rounded-2xl bg-neutral-950 px-3.5 py-1.5 text-sm font-semibold tracking-[-0.02em] text-white shadow-[0_8px_18px_rgba(0,0,0,0.18)]">
              UNNEWS
            </div>
            <span className="hidden text-sm text-neutral-500 md:block">대학연합신문</span>
          </button>

          <nav className="hidden items-center gap-5 md:flex">
            {CATEGORIES.slice(1).map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActiveCategory(item);
                  setPage("category");
                }}
                className="text-sm font-medium text-neutral-500 hover:text-neutral-900"
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => setPage("admin")}
              className="rounded-full border border-black/10 px-4 py-2 text-sm text-neutral-700"
            >
              Admin
            </button>
          </nav>
        </div>
      </header>

      {page === "home" && (
        <main className="mx-auto max-w-[1440px] px-5 py-8 md:px-8 md:py-10">
          <section className="mb-10 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
            <div className="relative overflow-hidden rounded-[32px] border border-white/50 bg-white/70 shadow-[0_24px_70px_rgba(0,0,0,0.08)] backdrop-blur">
              <div className="relative">
                <img
                  src={currentHero.image}
                  alt={currentHero.title}
                  className="block h-[520px] w-full object-cover transition duration-700"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.62),rgba(0,0,0,0.16),transparent)]" />

                <div className="absolute inset-x-0 bottom-0 p-7 text-white md:p-9">
                  <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-md">
                    {currentHero.category || "트렌드"}
                  </span>
                  <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.045em] md:text-[3.7rem]">
                    {currentHero.title || "요즘 대학생들이 읽는 이야기"}
                  </h1>
                  <p className="mt-4 max-w-xl text-sm leading-6 text-white/90 md:text-[15px] md:leading-7">
                    {clip(currentHero.body, 130)}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedPost(currentHero);
                      setPage("post");
                    }}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-neutral-900 backdrop-blur hover:bg-white"
                  >
                    지금 읽기 →
                  </button>

                  <div className="mt-6 flex items-center gap-3 pb-28 md:pb-32">
                    {heroPosts.map((post, index) => (
                      <button
                        key={post.id}
                        onClick={() => setHeroIndex(index)}
                        className={`h-2.5 rounded-full transition-all ${
                          heroIndex === index ? "w-10 bg-white" : "w-2.5 bg-white/45 hover:bg-white/70"
                        }`}
                        aria-label={`${index + 1}번 히어로 보기`}
                      />
                    ))}
                  </div>

                  <div className="absolute inset-x-7 bottom-7 grid gap-3 md:inset-x-9 md:bottom-9 md:grid-cols-3">
                    {heroPosts.map((post, index) => (
                      <button
                        key={post.id}
                        onClick={() => {
                          setHeroIndex(index);
                          setSelectedPost(post);
                          setActiveCategory("전체");
                          setPage("post");
                        }}
                        className={`rounded-2xl border px-3 py-3 text-left backdrop-blur-md transition ${
                          heroIndex === index
                            ? "border-white/30 bg-white/18"
                            : "border-white/10 bg-black/10 hover:bg-white/10"
                        }`}
                      >
                        <div className="text-[11px] text-white/70">{post.category}</div>
                        <div className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-white">{post.title}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 xl:pl-2">
              <div className="rounded-[24px] border border-white/60 bg-white/78 p-5 shadow-[0_14px_36px_rgba(0,0,0,0.05)] backdrop-blur">
                <p className="text-xs font-medium text-neutral-500">브랜드</p>
                <h2 className="mt-1 text-[1.65rem] font-semibold tracking-[-0.04em]">UNNEWS</h2>
                <p className="mt-3 text-[14px] leading-6 text-neutral-700">
                  대학내일처럼 부드럽고 가볍게 읽히지만, 실제 대학생의 트렌드·커리어·AI·라이프를 짧고 현실적인 문장으로 담아내는 매거진형 플랫폼입니다.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["unnews.kr", "부드러운 매거진형", "이미지 우선형"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/60 bg-white/78 p-5 shadow-[0_14px_36px_rgba(0,0,0,0.05)] backdrop-blur">
                <p className="text-xs font-medium text-neutral-500">바로 보기</p>
                <div className="mt-4 grid grid-cols-3 items-stretch gap-3">
                  <button
                    onClick={() => setPage("category")}
                    className="flex min-h-[148px] flex-col items-center justify-center gap-3 rounded-2xl border border-black/5 bg-neutral-50/90 px-4 py-4 text-center transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:scale-95"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <IconTile>
                        <ShortcutGridIcon />
                      </IconTile>
                      <div className="text-sm font-semibold text-neutral-900">카테고리</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedPost(currentHero);
                      setPage("post");
                    }}
                    className="flex min-h-[148px] flex-col items-center justify-center gap-3 rounded-2xl border border-black/5 bg-neutral-50/90 px-4 py-4 text-center transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:scale-95"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <IconTile>
                        <ShortcutArticleIcon />
                      </IconTile>
                      <div className="text-sm font-semibold text-neutral-900">글 상세</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setPage("admin")}
                    className="flex min-h-[148px] flex-col items-center justify-center gap-3 rounded-2xl border border-black/5 bg-neutral-50/90 px-4 py-4 text-center transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:scale-95"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <IconTile>
                        <ShortcutAdminIcon />
                      </IconTile>
                      <div className="text-sm font-semibold text-neutral-900">관리자</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500">Featured</p>
                <h2 className="text-[1.8rem] font-semibold tracking-[-0.04em]">인기 콘텐츠</h2>
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {featured.map((post) => (
                <button
                  type="button"
                  key={post.id}
                  onClick={() => {
                    setSelectedPost(post);
                    setPage("post");
                  }}
                  className="group relative overflow-hidden rounded-[28px] border border-white/50 text-left shadow-[0_24px_60px_rgba(0,0,0,0.08)]"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-[320px] w-full object-cover transition duration-500 group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <span className="text-xs opacity-80">{post.category}</span>
                    <h3 className="mt-1 text-[1.08rem] font-semibold leading-6 tracking-[-0.03em]">{post.title}</h3>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-4 flex gap-2 overflow-auto pb-1">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setPage("category");
                  }}
                  className={`rounded-full px-4 py-2.5 text-sm font-medium transition ${
                    activeCategory === category
                      ? "bg-neutral-950 text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)]"
                      : "border border-black/5 bg-white/80 text-neutral-600 backdrop-blur hover:bg-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              {latest.map((post) => (
                <button
                  type="button"
                  key={post.id}
                  onClick={() => {
                    setSelectedPost(post);
                    setPage("post");
                  }}
                  className="flex items-center gap-4 rounded-[24px] border border-white/60 bg-white/78 p-3.5 text-left shadow-[0_16px_42px_rgba(0,0,0,0.06)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(0,0,0,0.08)]"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-24 w-24 rounded-[18px] object-cover md:h-28 md:w-28"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500">
                        {post.category}
                      </span>
                      <span className="text-xs text-neutral-400">{post.readTime}</span>
                    </div>
                    <h3 className="line-clamp-2 text-[1rem] font-semibold leading-6 tracking-[-0.03em]">
                      {post.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-[14px] leading-6 text-neutral-600">{post.body}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </main>
      )}

      {page === "category" && (
        <main className="mx-auto max-w-[1440px] px-5 py-8 md:px-8 md:py-10">
          <div className="mb-6">
            <p className="text-sm text-neutral-500">Category</p>
            <h1 className="text-[2.3rem] font-semibold leading-[1.08] tracking-[-0.045em]">{activeCategory}</h1>
          </div>
          <div className="mb-5 flex gap-2 overflow-auto pb-1">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2.5 text-sm font-medium transition ${
                  activeCategory === category
                    ? "bg-neutral-950 text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)]"
                    : "border border-black/5 bg-white/80 text-neutral-600 backdrop-blur hover:bg-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="grid gap-5 xl:grid-cols-2">
            {visiblePosts.map((post) => (
              <button
                type="button"
                key={post.id}
                onClick={() => {
                  setSelectedPost(post);
                  setPage("post");
                }}
                className="flex items-center gap-4 rounded-[24px] border border-white/60 bg-white/78 p-3.5 text-left shadow-[0_16px_42px_rgba(0,0,0,0.06)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(0,0,0,0.08)]"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-24 w-24 rounded-[18px] object-cover md:h-28 md:w-28"
                />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500">
                      {post.category}
                    </span>
                    <span className="text-xs text-neutral-400">{post.readTime}</span>
                  </div>
                  <h3 className="line-clamp-2 text-[1rem] font-semibold leading-6 tracking-[-0.03em]">
                    {post.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-[14px] leading-6 text-neutral-600">{post.body}</p>
                </div>
              </button>
            ))}
          </div>
        </main>
      )}

      {page === "post" && (
        <main className="mx-auto max-w-[980px] px-5 py-8 md:px-8 md:py-10">
          <button
            onClick={() => {
              setActiveCategory("전체");
              setPage("home");
            }}
            className="mb-5 rounded-full border border-black/10 bg-white/90 px-4 py-2 text-sm text-neutral-700 backdrop-blur transition hover:bg-white"
          >
            ← 홈으로
          </button>
          <div className="overflow-hidden rounded-[30px] border border-white/60 bg-white/80 shadow-[0_24px_70px_rgba(0,0,0,0.08)] backdrop-blur">
            <img src={selectedPost.image} alt={selectedPost.title} className="h-[320px] w-full object-cover" />
            <div className="p-7 md:p-9">
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-500">
                  {selectedPost.category}
                </span>
                <span className="text-xs text-neutral-400">{selectedPost.readTime}</span>
              </div>
              <h1 className="text-[2.3rem] font-semibold leading-[1.08] tracking-[-0.045em]">{selectedPost.title}</h1>
              <div className="mt-6 rounded-[22px] border border-black/5 bg-neutral-50/90 p-5">
                <p className="text-sm font-semibold text-neutral-500">3줄 요약</p>
                <p className="mt-2 text-[15px] leading-7 text-neutral-700">{selectedPost.body}</p>
              </div>
              <div className="mt-6 text-[15px] leading-8 text-neutral-700">
                <p>{selectedPost.body}</p>
                <p className="mt-4">
                  UNNEWS는 긴 설명보다 짧은 핵심과 강한 이미지로 읽히는 흐름을 만듭니다. 콘텐츠 구조는 단순하지만, 내용은 실제 대학생의 생활과 고민에 더 가깝게 채워서 공감과 정보가 함께 남도록 구성합니다.
                </p>
              </div>
            </div>
          </div>
        </main>
      )}

      {page === "admin" && (
        <main className="mx-auto max-w-[1180px] px-5 py-8 md:px-8 md:py-10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">Admin</p>
              <h1 className="text-[2.3rem] font-semibold leading-[1.08] tracking-[-0.045em]">콘텐츠 관리</h1>
            </div>
            <button
              onClick={() => {
                setActiveCategory("전체");
                setPage("home");
              }}
              className="rounded-full border border-black/10 bg-white/90 px-4 py-2 text-sm text-neutral-700 backdrop-blur transition hover:bg-white"
            >
              사이트로 이동
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-[1fr_0.9fr]">
            <div className="rounded-[24px] bg-white p-6 shadow-[0_10px_28px_rgba(0,0,0,0.04)]">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-600">제목</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full rounded-[20px] border border-black/10 bg-white px-4 py-3.5 outline-none transition focus:border-black/20 focus:shadow-[0_0_0_4px_rgba(0,0,0,0.04)]"
                    placeholder="제목을 입력하세요"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-600">카테고리</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-[20px] border border-black/10 bg-white px-4 py-3.5 outline-none transition focus:border-black/20 focus:shadow-[0_0_0_4px_rgba(0,0,0,0.04)]"
                  >
                    <option>트렌드</option>
                    <option>커리어</option>
                    <option>AI</option>
                    <option>라이프</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-600">대표 이미지 URL</label>
                  <input
                    value={form.image}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        image: e.target.value,
                        uploadedImage: "",
                        imageFileName: "",
                        useAutoImage: false,
                      })
                    }
                    className="w-full rounded-[20px] border border-black/10 bg-white px-4 py-3.5 outline-none transition focus:border-black/20 focus:shadow-[0_0_0_4px_rgba(0,0,0,0.04)]"
                    placeholder="이미지 URL을 입력하거나 자동 추천을 사용하세요"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-600">이미지 파일 업로드</label>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (!file || !file.type.startsWith("image/")) return;
                      const objectUrl = URL.createObjectURL(file);
                      setForm({
                        ...form,
                        uploadedImage: objectUrl,
                        imageFileName: file.name,
                        image: "",
                        useAutoImage: false,
                      });
                    }}
                    className={`rounded-[20px] border border-dashed px-4 py-4 transition ${
                      isDragging
                        ? "border-neutral-900 bg-neutral-100"
                        : "border-black/10 bg-white hover:border-black/20 hover:bg-neutral-50"
                    }`}
                  >
                    <label className="flex cursor-pointer items-center justify-between gap-4 text-sm text-neutral-600">
                      <div>
                        <div className="font-medium text-neutral-800">
                          {form.imageFileName ? form.imageFileName : "내 컴퓨터에서 이미지 선택"}
                        </div>
                        <div className="mt-1 text-xs text-neutral-400">
                          이미지를 드래그해서 놓거나 파일 선택 버튼을 눌러주세요
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold text-white">
                        파일 선택
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const objectUrl = URL.createObjectURL(file);
                          setForm({
                            ...form,
                            uploadedImage: objectUrl,
                            imageFileName: file.name,
                            image: "",
                            useAutoImage: false,
                          });
                        }}
                      />
                    </label>
                  </div>
                </div>

                <label className="flex items-center gap-3 rounded-[18px] border border-black/5 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
                  <input
                    type="checkbox"
                    checked={form.useAutoImage}
                    onChange={(e) => setForm({ ...form, useAutoImage: e.target.checked })}
                  />
                  적절한 이미지가 없으면 자동 추천 이미지 사용
                </label>

                <div className="rounded-[22px] border border-black/5 bg-neutral-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-medium text-neutral-700">이미지 미리보기</p>
                    <span className="text-xs text-neutral-400">
                      {form.uploadedImage ? "업로드 이미지" : form.useAutoImage || !form.image.trim() ? "자동 추천 이미지" : "직접 입력 이미지"}
                    </span>
                  </div>
                  <div className="overflow-hidden rounded-[18px] bg-white">
                    <img
                      src={previewImage}
                      alt="미리보기 이미지"
                      className="h-48 w-full object-cover"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-600">본문</label>
                  <textarea
                    value={form.body}
                    onChange={(e) => setForm({ ...form, body: e.target.value })}
                    rows={7}
                    className="w-full rounded-[20px] border border-black/10 bg-white px-4 py-3.5 outline-none transition focus:border-black/20 focus:shadow-[0_0_0_4px_rgba(0,0,0,0.04)]"
                    placeholder="짧고 가볍게 작성합니다"
                  />
                </div>
                <button
                  onClick={submitDraft}
                  className="rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 active:scale-95"
                >
                  글 등록 미리보기
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[24px] bg-white p-6 shadow-[0_10px_28px_rgba(0,0,0,0.04)]">
                <p className="text-sm font-medium text-neutral-500">이미지 정책</p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-neutral-700">
                  <li className="rounded-2xl bg-neutral-50 px-4 py-3">업로드한 이미지 파일 우선 사용</li>
                  <li className="rounded-2xl bg-neutral-50 px-4 py-3">직접 입력한 이미지 URL 우선 사용</li>
                  <li className="rounded-2xl bg-neutral-50 px-4 py-3">이미지가 없으면 카테고리 기반 자동 추천</li>
                  <li className="rounded-2xl bg-neutral-50 px-4 py-3">등록 즉시 카드와 상세에 대표 이미지 반영</li>
                </ul>
              </div>

              <div className="rounded-[24px] bg-white p-6 shadow-[0_10px_28px_rgba(0,0,0,0.04)]">
                <p className="text-sm font-medium text-neutral-500">운영 원칙</p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-neutral-700">
                  <li className="rounded-2xl bg-neutral-50 px-4 py-3">이미지 우선</li>
                  <li className="rounded-2xl bg-neutral-50 px-4 py-3">본문은 3~5줄</li>
                  <li className="rounded-2xl bg-neutral-50 px-4 py-3">카테고리는 4개 고정</li>
                </ul>
              </div>

              <div className="rounded-[24px] bg-white p-6 shadow-[0_10px_28px_rgba(0,0,0,0.04)]">
                <p className="text-sm font-medium text-neutral-500">등록된 글 미리보기</p>
                <div className="mt-4 space-y-3">
                  {[...drafts, ...POSTS].slice(0, 5).map((post) => (
                    <button
                      key={post.id}
                      onClick={() => {
                        setSelectedPost(post);
                        setPage("post");
                      }}
                      className="block w-full rounded-2xl bg-neutral-50 px-4 py-3 text-left text-sm text-neutral-700"
                    >
                      <div className="mb-2 overflow-hidden rounded-xl">
                        <img src={post.image} alt={post.title} className="h-24 w-full object-cover" />
                      </div>
                      <strong>{post.title}</strong>
                      <div className="mt-1 text-xs text-neutral-400">{post.category}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      <SiteFooter />
    </div>
  );
}
