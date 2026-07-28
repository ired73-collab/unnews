export const metadata = {
  metadataBase: new URL("http://unnews.co.kr/"),

  title: {
    default: "대학연합신문 (UNNEWS)",
    template: "%s | 대학연합신문",
  },

  description:
    "대학생을 위한 뉴스, 교육, AI, 취업, 공모전, 창업 정보를 제공하는 대학연합신문",

  keywords: [
    "대학연합신문",
    "UNNEWS",
    "대학생",
    "대학뉴스",
    "AI",
    "취업",
    "공모전",
    "교육",
    "창업",
  ],

  openGraph: {
    title: "대학연합신문 (UNNEWS)",
    description:
      "대학생을 위한 뉴스, 교육, AI, 취업, 공모전, 창업 정보를 제공하는 대학연합신문",
    url: "http://unnews.co.kr/",
    siteName: "UNNEWS",
    locale: "ko_KR",
    type: "website",

    images: [
      {
        url: "/unnews_logo.png",
        width: 1200,
        height: 630,
        alt: "UNNEWS",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "대학연합신문",
    description:
      "대학생을 위한 뉴스, 교육, AI, 취업, 공모전, 창업 정보",
    images: ["/unnews_logo.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
