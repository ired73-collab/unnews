export default function BlockToolbar({
  block,
  moveBlock,
  duplicateBlock,
  removeBlock,
}) {
  return (
    <div className="flex gap-1">
      <button
        type="button"
        onClick={() => moveBlock(block.id, -1)}
        className="rounded-full bg-white px-2.5 py-1 text-xs text-neutral-500 hover:text-neutral-900"
      >
        ↑
      </button>

      <button
        type="button"
        onClick={() => moveBlock(block.id, 1)}
        className="rounded-full bg-white px-2.5 py-1 text-xs text-neutral-500 hover:text-neutral-900"
      >
        ↓
      </button>

      <button
        type="button"
        onClick={() => duplicateBlock(block.id)}
        className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold hover:bg-green-100"
      >
        복제
      </button>

      <button
        type="button"
        onClick={() => removeBlock(block.id)}
        className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-500 hover:bg-red-100"
      >
        삭제
      </button>
    </div>
  );
}