"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableBlock({
  id,
  children,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.55 : 1,
    zIndex: isDragging ? 20 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${
        isDragging
          ? "rounded-[22px] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.14)]"
          : ""
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute left-2 top-5 z-10 flex h-8 w-8 cursor-grab items-center justify-center rounded-full border border-black/10 bg-white text-sm font-black text-neutral-400 shadow-sm transition hover:text-neutral-900 active:cursor-grabbing"
        aria-label="블록 순서 이동"
        title="끌어서 순서 변경"
      >
        ⋮⋮
      </button>

      <div className="pl-10">
        {children}
      </div>
    </div>
  );
}