"use client";

import { useEffect } from "react";

export default function UploadResultDialog({ result, onClose }) {
  useEffect(() => {
    if (!result) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [result, onClose]);

  if (!result) return null;

  const successCount = result.successCount || 0;
  const failureCount = result.errors?.length || result.failureCount || 0;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-result-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[min(680px,88vh)] w-full max-w-xl flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
        <div className="border-b border-black/5 px-5 py-5 sm:px-7">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-black tracking-[0.14em] text-blue-600">
                IMAGE UPLOAD
              </p>
              <h2
                id="upload-result-title"
                className="mt-1 text-xl font-bold tracking-[-0.02em] text-neutral-900"
              >
                {result.title || "이미지 업로드 결과"}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-full bg-neutral-100 px-3 py-1.5 text-sm font-bold text-neutral-500 hover:bg-neutral-200"
              aria-label="닫기"
            >
              닫기
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-emerald-50 px-4 py-3">
              <p className="text-xs font-semibold text-emerald-700">업로드 성공</p>
              <p className="mt-1 text-2xl font-black text-emerald-700">
                {successCount}장
              </p>
            </div>
            <div className="rounded-2xl bg-red-50 px-4 py-3">
              <p className="text-xs font-semibold text-red-700">업로드 실패</p>
              <p className="mt-1 text-2xl font-black text-red-700">
                {failureCount}장
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto px-5 py-5 sm:px-7">
          {successCount > 0 && failureCount > 0 && (
            <p className="mb-4 rounded-2xl bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-800">
              성공한 이미지는 그대로 유지했습니다. 아래 실패 파일만 확인해 다시
              업로드해주세요.
            </p>
          )}

          <div className="space-y-3">
            {(result.errors || []).map((message, index) => (
              <div
                key={`${index}-${message}`}
                className="rounded-2xl border border-red-100 bg-red-50/60 p-4"
              >
                <p className="break-words [overflow-wrap:anywhere] text-sm leading-6 text-neutral-700">
                  {message}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-black/5 px-5 py-4 sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-bold text-white hover:bg-neutral-800"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
