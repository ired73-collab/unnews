export const metadata = {
  title: "UNNEWS",
  description: "대학연합신문 · 이미지 중심 콘텐츠 플랫폼",
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
