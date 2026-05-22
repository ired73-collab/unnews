"use client";

import { PRIMARY_CATEGORIES } from "../lib/categories";

export default function Header({
  activeCategory,
  setActiveCategory,
  setActiveSubCategory,
  setPage,
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 md:px-8">
        <button
          type="button"
          onClick={() => {
            setActiveCategory("전체");
            setActiveSubCategory("전체");
            setPage("home");
            if (typeof window !== "undefined") {
              window.history.replaceState({}, "", "/");
            }
          }}
          className="flex items-center gap-3"
        >
          <img
  src="/unnews_logo.png"
  alt="대학연합신문"
  className="h-12 w-12 object-contain"
/>

          <span className="text-[21px] font-black tracking-[-0.06em] text-neutral-900">
            대학연합신문
          </span>
        </button>

        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-6 md:flex">
            {PRIMARY_CATEGORIES.slice(1).map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => {
                  setActiveCategory(item);
                  setActiveSubCategory("전체");
                  setPage("category");
                }}
                className={`text-[17px] font-semibold transition ${
                  activeCategory === item
                    ? "text-[#4dbbff]"
                    : "text-neutral-700 hover:text-[#4dbbff]"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <img
              src="/talk.png"
              alt="카카오톡"
              className="h-9 w-9 rounded-[10px] object-cover"
            />
            <img
              src="/blog.png"
              alt="네이버 블로그"
              className="h-9 w-9 rounded-[10px] object-cover"
            />
            <img
              src="/instagram.png"
              alt="인스타그램"
              className="h-9 w-9 rounded-[10px] object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
