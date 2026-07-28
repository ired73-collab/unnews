"use client";

import { useState } from "react";
import { PRIMARY_CATEGORIES } from "../lib/categories";

export default function Header({
  activeCategory,
  setActiveCategory,
  setActiveSubCategory,
  setPage,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = (item) => {
    setActiveCategory(item);
    setActiveSubCategory("전체");
    setPage("category");
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-3 md:px-8">
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
  className="h-10 w-10 object-contain md:h-12 md:w-12"
/>

          <span className="text-[18px] font-black tracking-[-0.06em] text-neutral-900 md:text-[21px]">
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

          <button
  type="button"
  onClick={() => setIsMenuOpen((prev) => !prev)}
  className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-neutral-900 shadow-sm md:hidden"
  aria-label={isMenuOpen ? "모바일 메뉴 닫기" : "모바일 메뉴 열기"}
  aria-expanded={isMenuOpen}
  aria-controls="mobile-navigation"
>
  <span className="text-2xl leading-none">
    {isMenuOpen ? "×" : "☰"}
  </span>
</button>

          <div className="hidden items-center gap-2 md:flex">
  <a
    href="https://tv.naver.com/withmagazine"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img
      src="/naver_tv.png"
      alt="네이버TV"
      className="h-9 w-9 rounded-[10px] object-cover"
    />
  </a>

  <a
    href="https://www.instagram.com/withcomm_official/"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img
      src="/instagram.png"
      alt="인스타그램"
      className="h-9 w-9 rounded-[10px] object-cover"
    />
  </a>
</div>
        </div>
      </div>

{isMenuOpen && (
  <div
    id="mobile-navigation"
    className="border-t border-black/5 bg-white px-5 py-4 md:hidden"
  >
    <div className="grid gap-2">
      {PRIMARY_CATEGORIES.slice(1).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => handleMenuClick(item)}
          className={`rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${
            activeCategory === item
              ? "bg-[#2563eb] text-white"
              : "bg-slate-50 text-neutral-800"
          }`}
        >
          {item}
        </button>
      ))}

      <button
        type="button"
        onClick={() => {
          setPage("admin");
          setIsMenuOpen(false);
        }}
        className="rounded-2xl bg-neutral-950 px-4 py-3 text-left text-sm font-bold text-white"
      >
        관리자
      </button>

      <div className="mt-2 border-t border-slate-200 pt-4">
        <p className="mb-3 text-center text-xs font-bold tracking-[-0.02em] text-slate-500">
          대학연합신문 SNS
        </p>
        <div className="flex items-center justify-center gap-3">
          <a
            href="https://tv.naver.com/withmagazine"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMenuOpen(false)}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 transition active:scale-95"
            aria-label="네이버TV 새 창으로 열기"
          >
            <img
              src="/naver_tv.png"
              alt=""
              className="h-9 w-9 rounded-[10px] object-cover"
            />
          </a>

          <a
            href="https://www.instagram.com/withcomm_official/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMenuOpen(false)}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 transition active:scale-95"
            aria-label="인스타그램 새 창으로 열기"
          >
            <img
              src="/instagram.png"
              alt=""
              className="h-9 w-9 rounded-[10px] object-cover"
            />
          </a>
        </div>
      </div>
    </div>
  </div>
)}

</header>
  );
}
