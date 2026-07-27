export default function ImageBlockEditor({
  block,
  updateBlock,
  uploadBlockImage,
  uploadingBlockId,
}) {
  const imageWidth = block.imageWidth || "full";
  const imageFit = block.imageFit || "natural";
  const captionAlign = block.captionAlign || "center";

  return (
    <div className="space-y-3">
      {block.url ? (
        <div
          className={`overflow-hidden rounded-[18px] bg-white ${
            imageWidth === "small"
              ? "mx-auto max-w-sm"
              : imageWidth === "medium"
                ? "mx-auto max-w-xl"
                : "w-full"
          }`}
        >
          <img
            src={block.url}
            alt={block.alt || block.caption || "본문 이미지"}
            className={
              imageFit === "cover"
                ? "h-56 w-full object-cover"
                : "h-auto max-h-[420px] w-full object-contain"
            }
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
            : block.fileName || "본문 이미지 선택 (여러 장 가능)"}
        </span>

        <span className="rounded-full bg-neutral-950 px-3 py-1 text-xs font-semibold text-white">
          파일 선택
        </span>

        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={uploadingBlockId === block.id}
          onChange={(e) => {
            uploadBlockImage(block.id, e.target.files);
            e.target.value = "";
          }}
        />
      </label>

      <div className="rounded-[14px] bg-amber-50 px-3.5 py-3 text-xs leading-5 text-amber-800">
        웹사이트의 이미지 크기·용량 제한이 적용됩니다. 여러 장 중 일부가
        실패하면 성공한 이미지는 유지되며, 실패한 파일명과 원인·해결 방법을
        안내합니다.
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <select
          value={imageWidth}
          onChange={(e) => updateBlock(block.id, { imageWidth: e.target.value })}
          className="rounded-[14px] border border-black/10 bg-white px-3 py-2.5 text-sm outline-none"
          aria-label="이미지 너비"
        >
          <option value="full">전체 너비</option>
          <option value="medium">중간 너비</option>
          <option value="small">작은 너비</option>
        </select>

        <select
          value={imageFit}
          onChange={(e) => updateBlock(block.id, { imageFit: e.target.value })}
          className="rounded-[14px] border border-black/10 bg-white px-3 py-2.5 text-sm outline-none"
          aria-label="이미지 표시 방식"
        >
          <option value="natural">원본 비율</option>
          <option value="cover">가로형 자르기</option>
        </select>

        <select
          value={captionAlign}
          onChange={(e) => updateBlock(block.id, { captionAlign: e.target.value })}
          className="rounded-[14px] border border-black/10 bg-white px-3 py-2.5 text-sm outline-none"
          aria-label="캡션 정렬"
        >
          <option value="center">캡션 가운데</option>
          <option value="left">캡션 왼쪽</option>
        </select>
      </div>

      <input
        value={block.caption || ""}
        onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
        className="w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm outline-none"
        placeholder="이미지 설명 또는 캡션을 입력하세요"
      />

      <input
        value={block.alt || ""}
        onChange={(e) => updateBlock(block.id, { alt: e.target.value })}
        className="w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm outline-none"
        placeholder="대체텍스트 (시각장애인 접근성·검색 노출용)"
      />
    </div>
  );
}
