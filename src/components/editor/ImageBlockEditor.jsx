export default function ImageBlockEditor({
  block,
  updateBlock,
  uploadBlockImage,
  uploadingBlockId,
}) {
  return (
    <div className="space-y-3">
      {block.url ? (
        <div className="overflow-hidden rounded-[18px] bg-white">
          <img
            src={block.url}
            alt={block.caption || "본문 이미지"}
            className="h-56 w-full object-cover"
          />
        </div>
      ) : (
        <div className="rounded-[18px] border border-dashed border-black/10 bg-white px-4 py-8 text-center text-sm text-neutral-400">
          아직 이미지가 없습니다.
        </div>
      )}

      <label className="flex cursor-pointer items-center justify-between rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm text-neutral-600">
        <span>
          {uploadingBlockId === block.id
            ? "본문 이미지 업로드 중..."
            : block.fileName || "본문 이미지 선택"}
        </span>

        <span className="rounded-full bg-neutral-950 px-3 py-1 text-xs font-semibold text-white">
          파일 선택
        </span>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploadingBlockId === block.id}
          onChange={(e) => uploadBlockImage(block.id, e.target.files?.[0])}
        />
      </label>

      <input
        value={block.caption || ""}
        onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
        className="w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm outline-none"
        placeholder="이미지 설명 또는 캡션을 입력하세요"
      />
    </div>
  );
}