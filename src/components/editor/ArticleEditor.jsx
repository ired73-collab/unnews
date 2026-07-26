"use client";

import { Fragment } from "react";
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import BlockToolbar from "./BlockToolbar";
import BlockTypeLabel from "./BlockTypeLabel";
import ImageBlockEditor from "./ImageBlockEditor";
import LinkBlockEditor from "./LinkBlockEditor";
import SortableBlock from "./SortableBlock";
import TextBlockEditor from "./TextBlockEditor";

export default function ArticleEditor({
  activeBlockId,
  activeSlashBlockId,
  addHeadingBlock,
  addHighlightBlock,
  addImageBlock,
  addLinkBlock,
  addQuoteBlock,
  addTextBlock,
  applySlashCommand,
  contentBlocks,
  duplicateBlock,
  handleBlockDragEnd,
  handleBlockEditorKeyDown,
  handleDropImage,
  handlePasteImage,
  insertBlockAt,
  insertTextBlock,
  isDragging,
  moveBlock,
  removeBlock,
  sensors,
  setActiveBlockId,
  setActiveSlashBlockId,
  setIsDragging,
  updateBlock,
  uploadBlockImage,
  uploadingBlockId,
}) {
  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-sm font-bold text-neutral-800">본문 블록 편집</h3>
          <p className="mt-1 text-xs leading-5 text-neutral-400">
            텍스트와 이미지를 원하는 순서로 추가할 수 있습니다.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={addTextBlock}
            className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            + 텍스트
          </button>
          <button
            type="button"
            onClick={addHeadingBlock}
            className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            + 소제목
          </button>
          <button
            type="button"
            onClick={addQuoteBlock}
            className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
          >
            + 인용문
          </button>
          <button
            type="button"
            onClick={addHighlightBlock}
            className="rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100"
          >
            + 강조박스
          </button>
          <button
            type="button"
            onClick={addLinkBlock}
            className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
          >
            + 링크버튼
          </button>
          <button
            type="button"
            onClick={addImageBlock}
            className="rounded-full bg-neutral-950 px-3 py-1.5 text-xs font-semibold text-white"
          >
            + 이미지
          </button>
        </div>
      </div>

      <div
        className={`space-y-3 rounded-[24px] ${
          isDragging ? "ring-2 ring-blue-400 ring-offset-4" : ""
        }`}
        onPaste={handlePasteImage}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDropImage}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleBlockDragEnd}
        >
          <SortableContext
            items={contentBlocks.map((block) => String(block.id))}
            strategy={verticalListSortingStrategy}
          >
            {contentBlocks.map((block, index) => (
              <Fragment key={String(block.id)}>
                <div className="group/inserter relative flex h-5 items-center justify-center">
                  <div className="absolute left-0 right-0 h-px bg-transparent transition group-hover/inserter:bg-blue-200" />
                  <button
                    type="button"
                    onClick={() => insertBlockAt(index)}
                    className="relative z-10 flex h-7 w-7 scale-75 items-center justify-center rounded-full border border-blue-200 bg-white text-lg font-semibold text-blue-600 opacity-0 shadow-sm transition hover:scale-100 hover:border-blue-400 hover:bg-blue-50 group-hover/inserter:scale-100 group-hover/inserter:opacity-100"
                    aria-label="이 위치에 블록 추가"
                    title="블록 추가"
                  >
                    +
                  </button>
                </div>

                <SortableBlock id={String(block.id)}>
                  <div
                    onClick={() => setActiveBlockId(block.id)}
                    className={`group relative rounded-[20px] border p-4 transition ${
                      activeBlockId === block.id
                        ? "border-blue-300 bg-blue-50/40"
                        : "border-black/5 bg-neutral-50 hover:border-blue-200"
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <BlockTypeLabel block={block} index={index} />
                      <div className="opacity-0 transition group-hover:opacity-100">
                        <BlockToolbar
                          block={block}
                          moveBlock={moveBlock}
                          duplicateBlock={duplicateBlock}
                          removeBlock={removeBlock}
                        />
                      </div>
                    </div>

                    {["text", "heading", "quote", "highlight"].includes(
                      block.type
                    ) ? (
                      <div
                        data-editor-block-id={String(block.id)}
                        onKeyDownCapture={(event) =>
                          handleBlockEditorKeyDown(event, block, index)
                        }
                      >
                        <TextBlockEditor
                          block={block}
                          updateBlock={updateBlock}
                          insertTextBlock={insertTextBlock}
                          activeSlashBlockId={activeSlashBlockId}
                          setActiveSlashBlockId={setActiveSlashBlockId}
                          applySlashCommand={applySlashCommand}
                        />
                      </div>
                    ) : block.type === "link" ? (
                      <LinkBlockEditor block={block} updateBlock={updateBlock} />
                    ) : (
                      <ImageBlockEditor
                        block={block}
                        updateBlock={updateBlock}
                        uploadBlockImage={uploadBlockImage}
                        uploadingBlockId={uploadingBlockId}
                      />
                    )}
                  </div>
                </SortableBlock>
              </Fragment>
            ))}

            <div className="group/inserter relative flex h-8 items-center justify-center">
              <div className="absolute left-0 right-0 h-px bg-transparent transition group-hover/inserter:bg-blue-200" />
              <button
                type="button"
                onClick={() => insertBlockAt(contentBlocks.length)}
                className="relative z-10 flex h-7 w-7 scale-75 items-center justify-center rounded-full border border-blue-200 bg-white text-lg font-semibold text-blue-600 opacity-0 shadow-sm transition hover:scale-100 hover:border-blue-400 hover:bg-blue-50 group-hover/inserter:scale-100 group-hover/inserter:opacity-100"
                aria-label="마지막에 블록 추가"
                title="블록 추가"
              >
                +
              </button>
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
