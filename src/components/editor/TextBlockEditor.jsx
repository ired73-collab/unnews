import SlashMenu from "./SlashMenu";

export default function TextBlockEditor({
  block,
  updateBlock,
  insertTextBlock,
  activeSlashBlockId,
  setActiveSlashBlockId,
  applySlashCommand,
}) {
  return (
    <>
      <textarea
        value={block.value || ""}
        onChange={(e) => {
          const nextValue = e.target.value;

          updateBlock(block.id, { value: nextValue });

          if (nextValue.trim() === "/") {
            setActiveSlashBlockId(block.id);
          } else {
            setActiveSlashBlockId(null);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            const value = (block.value || "").trim();

            if (value === "/image") {
              e.preventDefault();
              updateBlock(block.id, {
                type: "image",
                url: "",
                caption: "",
                value: "",
              });
              return;
            }

            if (value === "/quote") {
              e.preventDefault();
              updateBlock(block.id, { type: "quote", value: "" });
              return;
            }

            if (value === "/heading") {
              e.preventDefault();
              updateBlock(block.id, { type: "heading", value: "" });
              return;
            }

            if (value === "/highlight") {
              e.preventDefault();
              updateBlock(block.id, { type: "highlight", value: "" });
              return;
            }

            if (value === "/link") {
              e.preventDefault();
              updateBlock(block.id, {
                type: "link",
                text: "",
                url: "",
                value: "",
              });
              return;
            }

            e.preventDefault();
            insertTextBlock(block.id);
          }
        }}
        rows={block.type === "heading" ? 2 : 5}
        className={`w-full rounded-[18px] border px-4 py-3 text-sm leading-7 outline-none ${
          block.type === "heading"
            ? "border-black/10 bg-white text-lg font-bold"
            : block.type === "quote"
              ? "border-blue-100 bg-blue-50 text-blue-900 italic"
              : block.type === "highlight"
                ? "border-amber-100 bg-amber-50 text-amber-900 font-medium"
                : "border-black/10 bg-white"
        }`}
        placeholder={
          block.type === "heading"
            ? "소제목을 입력하세요"
            : block.type === "quote"
              ? "인용문을 입력하세요"
              : block.type === "highlight"
                ? "강조할 내용을 입력하세요"
                : "텍스트를 입력하세요"
        }
      />

      {activeSlashBlockId === block.id && block.type === "text" && (
        <SlashMenu onSelect={(type) => applySlashCommand(block.id, type)} />
      )}

      {block.type === "text" && (
        <div className="mt-2 rounded-2xl bg-slate-50 px-4 py-2 text-xs font-medium text-slate-500">
          명령어: <span className="font-bold text-slate-700">/image</span> 이미지 ·{" "}
          <span className="font-bold text-slate-700">/quote</span> 인용 ·{" "}
          <span className="font-bold text-slate-700">/heading</span> 제목 ·{" "}
          <span className="font-bold text-slate-700">/highlight</span> 강조 ·{" "}
          <span className="font-bold text-slate-700">/link</span> 링크
        </div>
      )}
    </>
  );
}