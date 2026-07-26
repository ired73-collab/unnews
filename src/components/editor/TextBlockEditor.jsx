import SlashMenu from "./SlashMenu";
import {
  BULLET_OPTIONS,
  CALLOUT_OPTIONS,
  FONT_OPTIONS,
  getCalloutOption,
  getFontFamily,
} from "./editorOptions";

export default function TextBlockEditor({
  block,
  updateBlock,
  insertTextBlock,
  activeSlashBlockId,
  setActiveSlashBlockId,
  applySlashCommand,
}) {
  const isTextLike = [
    "text",
    "heading",
    "quote",
    "highlight",
    "bullet",
    "callout",
  ].includes(block.type);
  const callout = getCalloutOption(block.calloutStyle);

  return (
    <>
      {isTextLike && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <label className="text-xs font-bold text-neutral-500" htmlFor={`font-${block.id}`}>
            웹폰트
          </label>
          <select
            id={`font-${block.id}`}
            value={block.fontFamily || "pretendard"}
            onChange={(event) =>
              updateBlock(block.id, { fontFamily: event.target.value })
            }
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 outline-none focus:border-blue-300"
          >
            {FONT_OPTIONS.map((font) => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>

          {block.type === "bullet" && (
            <select
              value={block.bulletStyle || "dot"}
              onChange={(event) =>
                updateBlock(block.id, { bulletStyle: event.target.value })
              }
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 outline-none focus:border-blue-300"
              aria-label="아이콘 목록 모양"
            >
              {BULLET_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          )}

          {block.type === "callout" && (
            <select
              value={block.calloutStyle || "key"}
              onChange={(event) =>
                updateBlock(block.id, { calloutStyle: event.target.value })
              }
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 outline-none focus:border-blue-300"
              aria-label="아이콘 강조 종류"
            >
              {CALLOUT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

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

            if (value === "/bullet") {
              e.preventDefault();
              updateBlock(block.id, {
                type: "bullet",
                value: "",
                bulletStyle: "check",
              });
              return;
            }

            if (value === "/callout") {
              e.preventDefault();
              updateBlock(block.id, {
                type: "callout",
                value: "",
                calloutStyle: "key",
              });
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
        rows={block.type === "heading" ? 2 : block.type === "bullet" ? 4 : 5}
        style={{ fontFamily: getFontFamily(block.fontFamily) }}
        className={`w-full rounded-[18px] border px-4 py-3 text-sm leading-7 outline-none ${
          block.type === "heading"
            ? "border-black/10 bg-white text-lg font-bold"
            : block.type === "quote"
              ? "border-blue-100 bg-blue-50 text-blue-900 italic"
              : block.type === "highlight"
                ? "border-amber-100 bg-amber-50 text-amber-900 font-medium"
                : block.type === "bullet"
                  ? "border-indigo-100 bg-indigo-50/60 text-indigo-950"
                  : block.type === "callout"
                    ? `border ${callout.className} font-medium`
                : "border-black/10 bg-white"
        }`}
        placeholder={
          block.type === "heading"
            ? "소제목을 입력하세요"
            : block.type === "quote"
              ? "인용문을 입력하세요"
              : block.type === "highlight"
                ? "강조할 내용을 입력하세요"
                : block.type === "bullet"
                  ? "목록 내용을 한 줄에 하나씩 입력하세요"
                  : block.type === "callout"
                    ? `${callout.icon} ${callout.label} 내용을 입력하세요`
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
          <span className="font-bold text-slate-700">/bullet</span> 목록 ·{" "}
          <span className="font-bold text-slate-700">/callout</span> 아이콘 강조 ·{" "}
          <span className="font-bold text-slate-700">/link</span> 링크
        </div>
      )}
    </>
  );
}
