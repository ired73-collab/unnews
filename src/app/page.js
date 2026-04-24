"use client";

import { useState } from "react";

const POSTS = [
  {
    id: 1,
    title: "AI 공부, 이렇게 시작함",
    body:
      "요즘 대학생들은 AI를 ‘배워야 하는 기술’보다 ‘바로 써보는 도구’로 먼저 받아들이는 경우가 많습니다. 복잡한 강의부터 듣기보다, 과제 정리나 아이디어 확장처럼 당장 필요한 일에 작게 써보면서 감을 익힙니다. 결국 중요한 건 많이 아는 것보다, 내 공부 방식 안에 자연스럽게 넣는 것입니다.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    category: "AI",
    readTime: "1분 읽기",
  },
  {
    id: 2,
    title: "포폴 감각, 여기서 갈림",
    body:
      "포트폴리오는 많이 보여주는 것보다 ‘무엇을 남길지’ 정하는 감각이 더 중요합니다. 요즘은 결과물 자체보다 문제를 어떻게 풀었는지, 어떤 흐름으로 생각했는지가 더 잘 읽힙니다.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    category: "커리어",
    readTime: "1분 읽기",
  },
];

export default function Page() {
  const [selectedPost, setSelectedPost] = useState(POSTS[0]);

  return (
    <main className="mx-auto max-w-4xl p-6">
      {/* 대표 이미지 */}
      <img
        src={selectedPost.image}
        className="w-full rounded-2xl"
        alt=""
      />

      {/* 제목 */}
      <h1 className="mt-6 text-3xl font-bold">{selectedPost.title}</h1>

      {/* 카테고리 */}
      <div className="mt-2 text-sm text-neutral-500">
        {selectedPost.category} · {selectedPost.readTime}
      </div>

      {/* ✅ 3줄 요약 */}
      <div className="mt-6 rounded-2xl border bg-neutral-50 p-5">
        <div className="text-sm font-semibold text-neutral-500">
          3줄 요약
        </div>

        <p className="mt-2 whitespace-pre-line text-[15px] leading-7 text-neutral-700">
          {selectedPost.summary
            ? selectedPost.summary
            : selectedPost.body.length > 150
            ? selectedPost.body.substring(0, 150) + "..."
            : selectedPost.body}
        </p>
      </div>

      {/* 본문 */}
      <p className="mt-6 text-[16px] leading-8 text-neutral-800">
        {selectedPost.body}
      </p>

      {/* 목록 */}
      <div className="mt-10 space-y-3">
        {POSTS.map((post) => (
          <div
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="cursor-pointer rounded-xl border p-3 hover:bg-neutral-50"
          >
            {post.title}
          </div>
        ))}
      </div>
    </main>
  );
}
