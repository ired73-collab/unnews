"use client";

import { useState } from "react";

export default function ArticlePreview({
  form,
  summary,
  contentBlocks,
  previewImage,
}) {

  const [previewMode, setPreviewMode] = useState("desktop");

  return (
    <div className="rounded-[28px] bg-white p-8 shadow-[0_10px_28px_rgba(0,0,0,0.04)]">
<div className="mb-6 flex items-center justify-between border-b border-black/5 pb-4">
  <div>
    <p className="text-xs font-bold tracking-[0.14em] text-blue-500">
      ARTICLE PREVIEW
    </p>
    <p className="mt-1 text-sm font-semibold text-neutral-700">
      실시간 기사 화면
    </p>
  </div>



  <div className="flex rounded-full bg-neutral-100 p-1">
    <button
      type="button"
      onClick={() => setPreviewMode("desktop")}
      className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
        previewMode === "desktop"
          ? "bg-white text-neutral-950 shadow-sm"
          : "text-neutral-400"
      }`}
    >
      PC
    </button>

    <button
      type="button"
      onClick={() => setPreviewMode("mobile")}
      className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
        previewMode === "mobile"
          ? "bg-white text-neutral-950 shadow-sm"
          : "text-neutral-400"
      }`}
    >
      모바일
    </button>
  </div>
</div>

<div
  className={`mx-auto overflow-hidden bg-white transition-all duration-300 ${
    previewMode === "mobile"
      ? "max-w-[390px] rounded-[28px] border border-black/10 shadow-[0_18px_50px_rgba(0,0,0,0.10)]"
      : "w-full"
  }`}
>
  {previewImage && (
        <img
          src={previewImage}
          alt=""
          className="mb-6 h-72 w-full rounded-2xl object-cover"
        />
      )}

      <div
  className={
    previewMode === "mobile"
      ? "px-5 py-6"
      : "px-0 py-2"
  }
>

      <div className="mb-3">
  <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
    {form.category2 || form.category || "카테고리"}
  </span>
</div>

      <h1 className="text-[42px] font-black leading-tight">
        {form.title || "기사 제목"}
      </h1>

      <div className="mt-4 flex items-center gap-3 text-sm text-neutral-500">
  <span>대학연합신문</span>

  <span>•</span>

  <span>{new Date().toLocaleDateString()}</span>

  <span>•</span>

  <span>조회 0</span>
</div>

      {summary && (
        <p className="mt-5 whitespace-pre-line text-lg leading-8 text-neutral-600">
          {summary}
        </p>
      )}

      <div className="mt-10 space-y-7">

{contentBlocks.map((block)=>{

    if(block.type==="text"){
        return(
            <p
                key={block.id}
                className="whitespace-pre-line leading-8 text-neutral-700"
            >
                {block.value || ""}
            </p>
        );
    }

    if(block.type==="heading"){
    return(
        <h2
            key={block.id}
            className="text-3xl font-black"
        >
            {block.value || "소제목"}
        </h2>
    );
}

if(block.type==="quote"){
    return(
        <blockquote
            key={block.id}
            className="border-l-4 border-blue-500 pl-5 italic text-xl text-neutral-700"
        >
            {block.value || "인용문"}
        </blockquote>
    );
}

if(block.type==="highlight"){
    return(
        <div
            key={block.id}
            className="rounded-2xl bg-blue-50 p-5 text-blue-900"
        >
            {block.value || "강조 내용"}
        </div>
    );
}

if (block.type === "image") {
  if (!block.url?.trim()) {
    return (
      <div
        key={block.id}
        className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-black/10 bg-neutral-50 text-sm text-neutral-400"
      >
        이미지가 업로드되면 여기에 표시됩니다.
      </div>
    );
  }

  return (
    <figure key={block.id}>
      <img
        src={block.url}
        alt={block.caption || "본문 이미지"}
        className="w-full rounded-2xl"
      />

      {block.caption && (
        <figcaption className="mt-2 text-center text-sm text-neutral-500">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}

if(block.type==="link"){
    return(
        <a
            key={block.id}
            href={block.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full bg-neutral-900 px-5 py-3 text-white"
        >
            {block.text || "바로가기"}
        </a>
    );
}

            return null;
      })}
    </div>

  </div>

</div>

</div>
);
}