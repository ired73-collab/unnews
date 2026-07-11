"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "unnews_auto_draft";

export default function DraftRecovery({
  onRestore,
  onDiscard,
}) {
  const [savedDraft, setSavedDraft] = useState(null);

  useEffect(() => {
    try {
      const storedDraft = localStorage.getItem(STORAGE_KEY);

      if (!storedDraft) return;

      const parsedDraft = JSON.parse(storedDraft);

      if (!parsedDraft?.form && !parsedDraft?.contentBlocks) return;

      setSavedDraft(parsedDraft);
    } catch (error) {
      console.error("임시저장 데이터 확인 실패:", error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  if (!savedDraft) return null;

  const savedDate = savedDraft.savedAt
    ? new Date(savedDraft.savedAt).toLocaleString("ko-KR")
    : "저장 시간 확인 불가";

  const handleRestore = () => {
    onRestore(savedDraft);
    setSavedDraft(null);
  };

  const handleDiscard = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSavedDraft(null);
    onDiscard?.();
  };

  return (
    <div className="mb-6 rounded-[22px] border border-blue-100 bg-blue-50/70 p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold text-blue-900">
            임시 저장된 글이 있습니다.
          </p>

          <p className="mt-1 text-xs text-blue-700/70">
            마지막 저장: {savedDate}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleRestore}
            className="rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
          >
            복구
          </button>

          <button
            type="button"
            onClick={handleDiscard}
            className="rounded-full border border-blue-200 bg-white px-4 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}