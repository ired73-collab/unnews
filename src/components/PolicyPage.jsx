"use client";

import Link from "next/link";
import { useState } from "react";
import Header from "./Header";
import { POLICY_PAGES } from "../data/policies";

const POLICY_LINKS = [
  { key: "privacy", label: "개인정보처리방침", href: "/privacy" },
  { key: "terms", label: "이용약관", href: "/terms" },
  { key: "copyright", label: "저작권 정책", href: "/copyright" },
  { key: "teen", label: "청소년 보호 정책", href: "/teen" },
];


function PolicyFooter() {
  return (
    <footer className="mt-16 bg-black text-white">
      <div className="mx-auto max-w-[1440px] px-6 py-10 md:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div>
            <div className="text-xl font-bold">대학연합신문</div>

            <div className="mt-4 space-y-1 text-sm leading-6 text-white/60">
              <p>사업자번호 : 504-81-47108</p>
              <p>주소 : 대구 남구 현충로 206 3층 (대명동, 신화빌딩)</p>
              <p>전화 : 053-765-4765</p>
              <p>팩스 : 053-767-4766</p>
              <p>이메일 : unnews@daum.net</p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-5 md:items-end">
            <a
              href="https://www.instagram.com/withcomm_official/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex opacity-80 transition hover:opacity-100"
              aria-label="인스타그램"
            >
              <img
                src="/instagram_w.png"
                alt="인스타그램"
                className="h-7 w-7 object-contain"
              />
            </a>

            <div className="flex flex-wrap gap-3 text-sm text-white/70">
              <Link
                href="/privacy"
                className="text-[#4DBBFF] hover:text-[#73CCFF]"
              >
                개인정보처리방침
              </Link>

              <span>|</span>

              <Link href="/terms" className="hover:text-white">
                이용약관
              </Link>

              <span>|</span>

              <Link href="/copyright" className="hover:text-white">
                저작권 정책
              </Link>

              <span>|</span>

              <Link href="/teen" className="hover:text-white">
                청소년 보호 정책
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-sm text-white/40">
          © 대학연합신문 (UNNEWS). All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default function PolicyPage({ type }) {
  const [activeCategory, setActiveCategory] = useState("전체");
  const [activeSubCategory, setActiveSubCategory] = useState("전체");

  const policy = POLICY_PAGES?.[type] || POLICY_PAGES?.privacy;

  if (!policy) {
    return (
      <>
        <Header
  activeCategory={activeCategory}
  setActiveCategory={() => {
    window.location.href = "/";
  }}
  setActiveSubCategory={() => {}}
  setPage={() => {
    window.location.href = "/";
  }}
/>

        <main className="mx-auto min-h-[500px] max-w-[980px] px-5 py-16 text-center">
          <h1 className="text-2xl font-bold">
            정책 내용을 불러올 수 없습니다.
          </h1>
        </main>

        <PolicyFooter />
      </>
    );
  }

  const sections = Array.isArray(policy.sections)
    ? policy.sections
    : [];

  return (
    <div className="min-h-screen font-pretendard bg-[radial-gradient(circle_at_top,_#ffffff_0%,_#f7f7f5_45%,_#f3f2ef_100%)] text-neutral-900">
      <Header
  activeCategory={activeCategory}
  setActiveCategory={() => {
    window.location.href = "/";
  }}
  setActiveSubCategory={() => {}}
  setPage={() => {
    window.location.href = "/";
  }}
/>

      <main className="mx-auto max-w-[980px] px-5 py-10 md:px-8 md:py-14">
        <div className="mb-8 flex flex-wrap gap-2">
          {POLICY_LINKS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                item.key === type
                  ? "bg-[#0759C8] text-white"
                  : "border border-slate-200 bg-white text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <section className="overflow-hidden rounded-[36px] bg-gradient-to-br from-[#2563eb] to-[#4dbbff] p-6 text-white shadow-[0_20px_60px_rgba(37,99,235,0.18)] md:p-8">
          <p className="text-sm font-bold text-white/75">
            {policy.label || "UNNEWS POLICY"}
          </p>

          <h1 className="mt-3 text-[2.3rem] font-black tracking-[-0.05em] md:text-[3.2rem]">
            {policy.title}
          </h1>

          {policy.desc && (
            <p className="mt-3 max-w-2xl whitespace-pre-line text-[15px] leading-7 text-white/85">
              {policy.desc}
            </p>
          )}
        </section>

        <section className="mt-8 rounded-[32px] border border-black/5 bg-white p-6 shadow-[0_16px_50px_rgba(0,0,0,0.05)] md:p-9">
          {sections.length > 0 ? (
            <div className="space-y-9">
              {sections.map((section, index) => (
                <article
                  key={`${section.title || "section"}-${index}`}
                  className="border-b border-black/5 pb-8 last:border-b-0 last:pb-0"
                >
                  {section.title && (
                    <h2 className="text-xl font-black tracking-[-0.03em] text-neutral-900">
                      {section.title}
                    </h2>
                  )}

                  {section.text && (
                    <div className="mt-4 whitespace-pre-line text-[15px] leading-8 text-neutral-700">
                      {section.text}
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-500">
              등록된 정책 내용이 없습니다.
            </p>
          )}
        </section>
      </main>

      <PolicyFooter />
    </div>
  );
}