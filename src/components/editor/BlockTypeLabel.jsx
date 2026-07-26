const LABELS = {
  text: "텍스트",
  heading: "소제목",
  quote: "인용문",
  highlight: "강조박스",
  bullet: "아이콘 목록",
  callout: "아이콘 강조",
  link: "링크버튼",
  image: "이미지",
};

export default function BlockTypeLabel({ block, index }) {
  return (
    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-neutral-500">
      {index + 1}. {LABELS[block.type] || block.type}
    </span>
  );
}
