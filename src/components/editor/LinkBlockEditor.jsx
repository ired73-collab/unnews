export default function LinkBlockEditor({ block, updateBlock }) {
  return (
    <div className="space-y-3">
      <input
        value={block.text || ""}
        onChange={(e) => updateBlock(block.id, { text: e.target.value })}
        className="w-full rounded-[18px] border border-emerald-100 bg-white px-4 py-3 text-sm outline-none"
        placeholder="버튼 문구를 입력하세요. 예: 자세히 보기"
      />

      <input
        value={block.url || ""}
        onChange={(e) => updateBlock(block.id, { url: e.target.value })}
        className="w-full rounded-[18px] border border-emerald-100 bg-white px-4 py-3 text-sm outline-none"
        placeholder="링크 주소를 입력하세요. 예: https://..."
      />
    </div>
  );
}