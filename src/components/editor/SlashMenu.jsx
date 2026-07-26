export default function SlashMenu({ onSelect }) {
  const commands = [
    { type: "text", label: "텍스트", icon: "📝", desc: "일반 본문을 작성합니다." },
    { type: "heading", label: "제목", icon: "📰", desc: "기사 중간 제목을 추가합니다." },
    { type: "image", label: "이미지", icon: "🖼", desc: "본문 이미지를 삽입합니다." },
    { type: "quote", label: "인용", icon: "💬", desc: "인용문을 강조합니다." },
    { type: "highlight", label: "강조", icon: "⭐", desc: "핵심 문장을 강조합니다." },
    { type: "bullet", label: "아이콘 목록", icon: "✅", desc: "아이콘이 있는 목록을 만듭니다." },
    { type: "callout", label: "아이콘 강조", icon: "📌", desc: "핵심·체크·팁·주의 박스를 만듭니다." },
    { type: "link", label: "링크", icon: "🔗", desc: "관련 링크를 추가합니다." },
  ];

  return (
    <div className="mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
      {commands.map((item) => (
        <button
          key={item.type}
          type="button"
          onClick={() => onSelect(item.type)}
          className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-lg">
            {item.icon}
          </span>

          <span>
            <span className="block text-sm font-black text-neutral-900">
              {item.label}
            </span>
            <span className="block text-xs text-neutral-400">
              {item.desc}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
