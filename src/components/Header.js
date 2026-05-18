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
          <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-white shadow-[0_8px_22px_rgba(77,187,255,0.22)] ring-1 ring-[#4dbbff]/25">
            <svg
              width="34"
              height="34"
              viewBox="0 0 64 64"
              fill="none"
              aria-hidden="true"
              className="text-[#4dbbff]"
            >
              <path
                d="M8 14L20 8L32 14L44 8L56 14V47L44 55L32 49L20 55L8 47V14Z"
                fill="currentColor"
              />
              <path
                d="M18 21V39L27 34V20L32 17L37 20V34L46 39V21"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M27 34L32 37L37 34"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

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
