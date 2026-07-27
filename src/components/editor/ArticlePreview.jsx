"use client";

import { useState } from "react";
import {
  getBulletOption,
  getCalloutOption,
  getFontFamily,
} from "./editorOptions";
import { isRenderableContentBlock } from "../../utils/editor";

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

{contentBlocks.filter(isRenderableContentBlock).map((block)=>{
    const fontStyle = { fontFamily: getFontFamily(block.fontFamily) };

    if(block.type==="text"){
        return(
            <p
                key={block.id}
                className="whitespace-pre-line leading-8 text-neutral-700"
                style={fontStyle}
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
            style={fontStyle}
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
            style={fontStyle}
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
            style={fontStyle}
        >
            {block.value || "강조 내용"}
        </div>
    );
}

if (block.type === "bullet") {
  const bullet = getBulletOption(block.bulletStyle);
  const items = (block.value || "").split("\n").filter((item) => item.trim());

  return (
    <ul key={block.id} className="space-y-3" style={fontStyle}>
      {items.map((item, index) => (
        <li key={`${block.id}-${index}`} className="flex gap-3 leading-8 text-neutral-700">
          <span className="shrink-0 font-black text-blue-600">{bullet.icon}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

if (block.type === "callout") {
  const callout = getCalloutOption(block.calloutStyle);

  return (
    <div
      key={block.id}
      className={`rounded-2xl border p-5 ${callout.className}`}
      style={fontStyle}
    >
      <div className="flex gap-3">
        <span className="text-xl">{callout.icon}</span>
        <div>
          <strong className="block text-sm font-black">{callout.label}</strong>
          <p className="mt-1 whitespace-pre-line leading-7">{block.value || "내용을 입력하세요"}</p>
        </div>
      </div>
    </div>
  );
}

if (block.type === "image") {
  const widthClass =
    block.imageWidth === "small"
      ? "mx-auto max-w-sm"
      : block.imageWidth === "medium"
        ? "mx-auto max-w-xl"
        : "w-full";
  const imageClass =
    block.imageFit === "cover"
      ? "h-64 w-full rounded-2xl object-cover"
      : "h-auto max-h-[620px] w-full rounded-2xl object-contain";

  return (
    <figure key={block.id} className={widthClass}>
      <img
        src={block.url}
        alt={block.alt || block.caption || "본문 이미지"}
        className={imageClass}
      />

      {block.caption && (
        <figcaption
          className={`mt-2 text-sm text-neutral-500 ${
            block.captionAlign === "left" ? "text-left" : "text-center"
          }`}
        >
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
