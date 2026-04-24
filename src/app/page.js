"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [body, setBody] = useState("");
  const [summary, setSummary] = useState("");

  // ✅ 자동 3줄 요약
  useEffect(() => {
    if (!body || body.length < 30) return;

    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/summary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: body }),
        });

        const data = await res.json();
        setSummary(data.summary);
      } catch (e) {
        console.error(e);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [body]);

  return (
    <div style={{ padding: 40 }}>
      <h1>콘텐츠 관리</h1>

      <textarea
        placeholder="본문 입력"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        style={{
          width: "100%",
          height: 150,
          marginTop: 20,
          padding: 10,
        }}
      />

      {/* ✅ 빨간 박스 위치 */}
      <div
        style={{
          marginTop: 20,
          padding: 20,
          background: "#f5f5f5",
          borderRadius: 10,
        }}
      >
        <b>3줄 요약</b>
        <p style={{ whiteSpace: "pre-line" }}>
          {summary || "본문을 입력하면 자동 요약됩니다"}
        </p>
      </div>
    </div>
  );
}
