export const FONT_OPTIONS = [
  {
    value: "pretendard",
    label: "Pretendard",
    family: '"Pretendard", "Noto Sans KR", sans-serif',
  },
  {
    value: "noto-sans-kr",
    label: "Noto Sans KR",
    family: '"Noto Sans KR", sans-serif',
  },
  {
    value: "gmarket-sans",
    label: "Gmarket Sans",
    family: '"Gmarket Sans", "Pretendard", sans-serif',
  },
  {
    value: "nanum-square-neo",
    label: "나눔스퀘어 Neo",
    family: '"NanumSquareNeo", "Pretendard", sans-serif',
  },
  {
    value: "maru-buri",
    label: "마루부리",
    family: '"MaruBuri", serif',
  },
];

export const BULLET_OPTIONS = [
  { value: "dot", label: "기본", icon: "•" },
  { value: "check", label: "체크", icon: "✅" },
  { value: "pin", label: "포인트", icon: "📌" },
  { value: "arrow", label: "화살표", icon: "➜" },
  { value: "star", label: "별", icon: "★" },
];

export const CALLOUT_OPTIONS = [
  {
    value: "key",
    label: "핵심 내용",
    icon: "📌",
    className: "border-blue-100 bg-blue-50 text-blue-950",
  },
  {
    value: "check",
    label: "체크 포인트",
    icon: "✅",
    className: "border-emerald-100 bg-emerald-50 text-emerald-950",
  },
  {
    value: "tip",
    label: "알아두세요",
    icon: "💡",
    className: "border-amber-100 bg-amber-50 text-amber-950",
  },
  {
    value: "warning",
    label: "주의사항",
    icon: "⚠️",
    className: "border-rose-100 bg-rose-50 text-rose-950",
  },
];

export function getFontFamily(fontFamily) {
  return (
    FONT_OPTIONS.find((option) => option.value === fontFamily)?.family ||
    FONT_OPTIONS[0].family
  );
}

export function getBulletOption(bulletStyle) {
  return (
    BULLET_OPTIONS.find((option) => option.value === bulletStyle) ||
    BULLET_OPTIONS[0]
  );
}

export function getCalloutOption(calloutStyle) {
  return (
    CALLOUT_OPTIONS.find((option) => option.value === calloutStyle) ||
    CALLOUT_OPTIONS[0]
  );
}
