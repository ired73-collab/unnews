import Link from "next/link";
import { POLICY_PAGES } from "../data/policies";

const POLICY_LINKS = [
  { key: "privacy", label: "개인정보처리방침", href: "/privacy" },
  { key: "terms", label: "이용약관", href: "/terms" },
  { key: "copyright", label: "저작권 정책", href: "/copyright" },
  { key: "teen", label: "청소년 보호 정책", href: "/teen" },
];

export default function PolicyPage({ type }) {
  const policy = POLICY_PAGES?.[type] || POLICY_PAGES?.privacy;

  if (!policy) {
    return (
      <main className="mx-auto max-w-[980px] px-5 py-16 text-center">
        <h1 className="text-2xl font-bold">정책 내용을 불러올 수 없습니다.</h1>

        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white"
        >
          홈으로
        </Link>
      </main>
    );
  }

  const sections = Array.isArray(policy.sections)
    ? policy.sections
    : [];

  return (
    <main className="mx-auto max-w-[980px] px-5 py-10 md:px-8 md:py-14">
      <Link
        href="/"
        className="mb-6 inline-flex rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        ← 홈으로
      </Link>

      <div className="mb-8 flex flex-wrap gap-2">
        {POLICY_LINKS.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`rounded-full px-4 py-2 text-sm font-bold ${
              item.key === type
                ? "bg-[#0759C8] text-white"
                : "border border-slate-200 bg-white text-neutral-700"
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
  );
}