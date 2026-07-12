import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-16 bg-black text-white">
      <div className="mx-auto max-w-[1440px] px-6 py-10 md:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div>
            <div className="text-xl font-bold">
              대학연합신문
            </div>

            <div className="mt-4 space-y-1 text-sm leading-6 text-white/60">
              <p>사업자번호 : 504-81-47108</p>
              <p>주소 : 대구 남구 현충로 206 3층 (대명동, 신화빌딩)</p>
              <p>전화 : 053-765-4765</p>
              <p>팩스 : 053-767-4766</p>
              <p>이메일 : unnews@daum.net</p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 md:items-end">
            <a
              href="https://www.instagram.com/withcomm_official/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center opacity-80 transition hover:opacity-100"
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