"use client";

import { supabase } from "../lib/supabase";
import Header from "../components/Header";
import { useEffect, useMemo, useState } from "react";
import { auth } from "../lib/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const CLOUDINARY_CLOUD_NAME = "dciqqfwdb";
const CLOUDINARY_UPLOAD_PRESET = "unnews_upload";

const COLORS = ["#4F46E5", "#14B8A6", "#F59E0B"];


const POSTS = [
  {
    id: 1,
    title: "AI 공부, 이렇게 시작함",
    body: "요즘 대학생들은 AI를 ‘배워야 하는 기술’보다 ‘바로 써보는 도구’로 먼저 받아들이는 경우가 많습니다. 복잡한 강의부터 듣기보다, 과제 정리나 아이디어 확장처럼 당장 필요한 일에 작게 써보면서 감을 익힙니다. 결국 중요한 건 많이 아는 것보다, 내 공부 방식 안에 자연스럽게 넣는 것입니다.",
    summary:
      "대학생들은 AI를 이론보다 실전 도구로 먼저 받아들이고 있습니다.\n과제 정리나 아이디어 확장처럼 필요한 일에 작게 써보며 감을 익힙니다.\n중요한 것은 많이 아는 것보다 내 공부 방식 안에 자연스럽게 넣는 것입니다.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    category: "AI",
    readTime: "1분 읽기",
  },
  {
    id: 2,
    title: "포폴 감각, 여기서 갈림",
    body: "포트폴리오는 많이 보여주는 것보다 ‘무엇을 남길지’ 정하는 감각이 더 중요합니다. 요즘은 결과물 자체보다 문제를 어떻게 풀었는지, 어떤 흐름으로 생각했는지가 더 잘 읽힙니다. 화려하게 꾸미기보다, 한 장 한 장이 자연스럽게 연결되는 편이 훨씬 설득력 있습니다.",
    summary:
      "포트폴리오는 양보다 무엇을 남길지 정하는 감각이 중요합니다.\n결과물보다 문제 해결 과정과 사고 흐름이 더 잘 읽힙니다.\n화려한 구성보다 자연스럽게 연결되는 구조가 더 설득력 있습니다.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    category: "커리어",
    readTime: "1분 읽기",
  },
  {
    id: 3,
    title: "캠퍼스 루틴, 가볍게",
    body: "빡빡한 계획표보다 오래 가는 작은 루틴이 더 중요해졌습니다. 아침 수업 전 10분 정리, 공강 시간 메모, 자기 전 내일 일정 확인처럼 부담 없는 습관이 하루를 훨씬 덜 흔들리게 만듭니다. 무리해서 잘하는 것보다, 무너지지 않는 흐름을 만드는 쪽이 현실적입니다.",
    summary:
      "빡빡한 계획보다 오래 지속되는 작은 루틴이 중요해졌습니다.\n수업 전 정리, 공강 메모, 일정 확인 같은 습관이 하루를 안정적으로 만듭니다.\n무리해서 잘하기보다 무너지지 않는 흐름을 만드는 것이 현실적입니다.",
    image:
      "https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?auto=format&fit=crop&w=1200&q=80",
    category: "라이프",
    readTime: "1분 읽기",
  },
  {
    id: 4,
    title: "요즘 소비 트렌드",
    body: "요즘 소비는 단순히 싸고 좋은 것을 찾는 방식에서 조금 달라졌습니다. 가격만 따지기보다, 그 브랜드의 분위기와 경험, 나와 얼마나 잘 맞는지를 함께 봅니다. 결국 소비는 물건을 사는 일이 아니라 내 취향을 보여주는 방식이 되고 있습니다.",
    summary:
      "요즘 소비는 가격보다 브랜드의 분위기와 경험을 함께 봅니다.\n나와 얼마나 잘 맞는지, 어떤 취향을 보여주는지가 중요해졌습니다.\n소비는 물건을 사는 일을 넘어 나를 표현하는 방식이 되고 있습니다.",
    image:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
    category: "트렌드",
    readTime: "1분 읽기",
  },
  {
    id: 5,
    title: "과제 스트레스 줄이는 습관",
    body: "과제 스트레스는 분량보다 ‘막막함’에서 시작되는 경우가 많습니다. 그래서 요즘은 한 번에 끝내려 하기보다, 자료 찾기·구조 잡기·문장 정리처럼 단계를 잘게 나누는 방식이 더 효과적입니다. 작게 나누면 부담이 줄고, 시작 속도도 확실히 빨라집니다.",
    summary:
      "과제 스트레스는 분량보다 막막함에서 시작되는 경우가 많습니다.\n자료 찾기, 구조 잡기, 문장 정리처럼 단계를 나누면 부담이 줄어듭니다.\n작게 나누는 습관은 시작 속도를 높이고 완성도를 안정적으로 만듭니다.",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
    category: "라이프",
    readTime: "1분 읽기",
  },
  {
    id: 6,
    title: "AI 과제 활용 기준",
    body: "AI를 과제에 활용할 때 가장 중요한 것은 ‘편하게 쓰는 것’이 아니라 ‘어디까지 맡길지 아는 것’입니다. 초안 정리나 아이디어 확장에는 도움이 되지만, 그대로 가져오면 내 생각이 빠지기 쉽습니다. 결국 완성도를 결정하는 건 AI가 아니라 마지막에 손보는 내 기준입니다.",
    summary:
      "AI 과제 활용의 핵심은 어디까지 맡길지 정하는 기준입니다.\n초안 정리와 아이디어 확장에는 도움이 되지만 그대로 쓰면 내 생각이 약해질 수 있습니다.\n완성도를 결정하는 것은 AI가 아니라 마지막에 손보는 나의 판단입니다.",
    image:
      "https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1200&q=80",
    category: "AI",
    readTime: "1분 읽기",
  },
  {
    id: 7,
    title: "취준, 이게 현실",
    body: "취업 준비가 힘든 이유는 정보가 없어서가 아니라, 정보가 너무 많아서입니다. 스펙, 자소서, 인턴, 자격증, 면접 준비까지 다 중요해 보이니 기준이 흐려집니다. 그래서 요즘 취준은 더 열심히 하는 것보다, 무엇을 먼저 할지 정리하는 힘이 더 중요해졌습니다.",
    summary:
      "취업 준비는 정보 부족보다 정보 과잉 때문에 더 어려워지고 있습니다.\n스펙, 자소서, 인턴, 면접 준비가 모두 중요해 보이면 기준이 흐려집니다.\n무엇을 먼저 할지 정리하는 힘이 취준의 핵심이 되고 있습니다.",
    image:
      "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80",
    category: "커리어",
    readTime: "1분 읽기",
  },
  {
    id: 8,
    title: "콘텐츠, 짧아야 봄",
    body: "긴 글을 끝까지 읽는 일은 점점 어려워지고 있습니다. 대신 핵심이 빨리 보이고, 한 장면 안에 분위기와 메시지가 함께 담긴 콘텐츠가 더 잘 읽힙니다. 요즘 콘텐츠는 더 많이 설명하는 것보다, 더 빨리 이해되는 구조가 중요합니다.",
    summary:
      "긴 글보다 핵심이 빨리 보이는 콘텐츠가 더 잘 읽힙니다.\n한 장면 안에 분위기와 메시지가 함께 담길 때 전달력이 높아집니다.\n요즘 콘텐츠는 많이 설명하는 것보다 빨리 이해되는 구조가 중요합니다.",
    image:
      "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1200&q=80",
    category: "트렌드",
    readTime: "1분 읽기",
  },
];

import {
  CATEGORY_MAP,
  PRIMARY_CATEGORIES,
  getCategory1,
  getCategory2,
  getCategoryLabel,
} from "../lib/categories";
import { suggestImages } from "../lib/imageSuggest";

function clip(text, max = 130) {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

function fallbackSummary(text) {
  if (!text) return "";
  const compact = text.replace(/\s+/g, " ").trim();
  const sentences = compact
    .split(/(?<=다\.|요\.|니다\.|[.!?])\s+/)
    .filter(Boolean)
    .slice(0, 3);

  if (sentences.length >= 2) return sentences.join("\n");
  return clip(compact, 160);
}

function createSlug(text = "") {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

function getAutoImage(category, text = "") {
  const keyword = `${category} ${text}`.toLowerCase();

  // AI / 기술
  if (
    keyword.includes("ai") ||
    keyword.includes("인공지능") ||
    keyword.includes("챗gpt") ||
    keyword.includes("chatgpt") ||
    keyword.includes("디지털") ||
    keyword.includes("기술") ||
    keyword.includes("로봇") ||
    keyword.includes("데이터")
  ) {
    return "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80";
  }

  // 음주 / 술 / 대학 음주문화
  if (
    keyword.includes("음주") ||
    keyword.includes("술") ||
    keyword.includes("주류") ||
    keyword.includes("회식") ||
    keyword.includes("맥주") ||
    keyword.includes("소주") ||
    keyword.includes("음주문화")
  ) {
    return "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80";
  }

  // 연애 / 관계 / 데이트
  if (
    keyword.includes("연애") ||
    keyword.includes("사랑") ||
    keyword.includes("관계") ||
    keyword.includes("데이트") ||
    keyword.includes("커플") ||
    keyword.includes("썸") ||
    keyword.includes("이별")
  ) {
    return "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80";
  }

  // 취업 / 인턴 / 포트폴리오 / 커리어
  if (
    keyword.includes("취업") ||
    keyword.includes("인턴") ||
    keyword.includes("채용") ||
    keyword.includes("면접") ||
    keyword.includes("자소서") ||
    keyword.includes("포트폴리오") ||
    keyword.includes("포폴") ||
    keyword.includes("커리어") ||
    keyword.includes("스펙")
  ) {
    return "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80";
  }

  // 공모전 / 대외활동 / 창업
  if (
    keyword.includes("공모전") ||
    keyword.includes("대외활동") ||
    keyword.includes("서포터즈") ||
    keyword.includes("창업") ||
    keyword.includes("아이디어") ||
    keyword.includes("프로젝트")
  ) {
    return "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80";
  }

  // 대학 / 캠퍼스 / 교육 / 학사
  if (
    keyword.includes("대학") ||
    keyword.includes("캠퍼스") ||
    keyword.includes("교육") ||
    keyword.includes("수업") ||
    keyword.includes("강의") ||
    keyword.includes("학과") ||
    keyword.includes("학생") ||
    keyword.includes("학사") ||
    keyword.includes("의대")
  ) {
    return "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80";
  }

  // 지역 / 사회 / 도시
  if (
    keyword.includes("지역") ||
    keyword.includes("사회") ||
    keyword.includes("도시") ||
    keyword.includes("정책") ||
    keyword.includes("청년") ||
    keyword.includes("지자체")
  ) {
    return "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80";
  }

  // 문화 / 콘텐츠 / 공연 / 전시
  if (
    keyword.includes("문화") ||
    keyword.includes("콘텐츠") ||
    keyword.includes("공연") ||
    keyword.includes("전시") ||
    keyword.includes("영화") ||
    keyword.includes("음악") ||
    keyword.includes("축제")
  ) {
    return "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80";
  }

  // 라이프 / 생활 / 루틴
  if (
    keyword.includes("라이프") ||
    keyword.includes("생활") ||
    keyword.includes("루틴") ||
    keyword.includes("일상") ||
    keyword.includes("습관") ||
    keyword.includes("건강")
  ) {
    return "https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?auto=format&fit=crop&w=1200&q=80";
  }

  // 기본 이미지
  return "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80";
}

const IMAGE_SUGGESTION_POOLS = {
  medical: [
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1200&q=80",
  ],
  ai: [
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?auto=format&fit=crop&w=1200&q=80",
],
  education: [
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
],

student: [
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
],

project: [
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80",
],

research: [
  "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=1200&q=80",
],
  drinking: [
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?auto=format&fit=crop&w=1200&q=80",
  ],
  relationship: [
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80",
  ],
  career: [
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
  ],
  activity: [
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80",
  ],
  campus: [
    "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
  ],
  society: [
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80",
  ],
  culture: [
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
  ],
  lifestyle: [
    "https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
  ],
};

function getSuggestionTopic(category, text = "") {
  const keyword = `${category} ${text}`.toLowerCase();

  const topicRules = [
    {
      key: "medical",
      label: "의료·보건",
      words: [
        "의료",
        "의대",
        "의학",
        "의사",
        "간호",
        "병원",
        "환자",
        "진료",
        "수술",
        "보건",
        "의료현장",
        "응급",
        "임상",
        "교수",
        "칼럼",
        "건강",
      ],
    },
    {
      key: "ai",
      label: "AI·기술",
      words: ["ai", "인공지능", "챗gpt", "chatgpt", "기술", "디지털", "로봇", "데이터"],
    },
    {
      key: "drinking",
      label: "음주문화·모임",
      words: ["음주", "술", "주류", "회식", "맥주", "소주", "음주문화"],
    },
    {
      key: "relationship",
      label: "연애·관계",
      words: ["연애", "사랑", "관계", "데이트", "커플", "썸", "이별"],
    },
    {
      key: "career",
      label: "취업·커리어",
      words: ["취업", "인턴", "채용", "면접", "자소서", "포트폴리오", "포폴", "커리어", "스펙"],
    },
    {
      key: "activity",
      label: "공모전·대외활동",
      words: ["공모전", "대외활동", "서포터즈", "창업", "아이디어", "프로젝트"],
    },
    {
      key: "campus",
      label: "대학·캠퍼스",
      words: ["대학", "캠퍼스", "교육", "수업", "강의", "학과", "학생", "학사"],
    },
    {
      key: "society",
      label: "사회·지역",
      words: ["지역", "사회", "도시", "정책", "청년", "지자체"],
    },
    {
      key: "culture",
      label: "문화·콘텐츠",
      words: ["문화", "콘텐츠", "공연", "전시", "영화", "음악", "축제"],
    },
    {
      key: "lifestyle",
      label: "대학생 라이프",
      words: ["라이프", "생활", "루틴", "일상", "습관"],
    },
  ];

  const scores = topicRules.map((rule) => {
    const score = rule.words.reduce((total, word) => {
      const titleWeight = keyword.indexOf(word) >= 0 ? 1 : 0;
      const strongWeight = text.toLowerCase().slice(0, 80).includes(word) ? 2 : 0;
      const repeatWeight = keyword.split(word).length - 1;
      return total + titleWeight + strongWeight + repeatWeight;
    }, 0);

    return { ...rule, score };
  });

  const best = scores.sort((a, b) => b.score - a.score)[0];

  if (best && best.score > 0) {
    return { key: best.key, label: best.label };
  }

  return { key: "lifestyle", label: "대학생 라이프" };
}

function getSmartImageSuggestions(category, title, body) {
  const fullText = `${category || ""} ${title || ""} ${body || ""}`.toLowerCase();

  const topicRules = [
    {
      key: "ai",
      label: "AI·기술",
      words: ["ai", "인공지능", "챗gpt", "chatgpt", "생성형", "디지털", "기술", "데이터", "자동화"],
    },
    {
      key: "education",
      label: "교육·학습",
      words: ["교육", "학습", "수업", "강의", "교과목", "교육과정", "역량", "학습환경"],
    },
    {
      key: "student",
      label: "학생·대학생",
      words: ["학생", "대학생", "청년", "팀플", "과제", "포트폴리오", "취업"],
    },
    {
      key: "campus",
      label: "대학·캠퍼스",
      words: ["대학", "캠퍼스", "학과", "학사", "교수", "학교"],
    },
    {
      key: "project",
      label: "프로젝트·창업",
      words: ["프로젝트", "창업", "아이디어", "검증", "팀", "협업", "공모전", "대외활동"],
    },
    {
      key: "research",
      label: "연구·데이터",
      words: ["연구", "데이터", "분석", "실험", "논문", "랩", "연구실"],
    },
    {
      key: "career",
      label: "취업·커리어",
      words: ["취업", "채용", "면접", "자소서", "스펙", "커리어", "인턴"],
    },
    {
      key: "medical",
      label: "의료·보건",
      words: ["의료", "의대", "의학", "병원", "보건", "건강", "간호"],
    },
    {
      key: "culture",
      label: "문화·콘텐츠",
      words: ["문화", "콘텐츠", "공연", "전시", "영화", "축제"],
    },
    {
      key: "society",
      label: "사회·지역",
      words: ["지역", "사회", "정책", "도시", "지자체"],
    },
    {
      key: "lifestyle",
      label: "대학생 라이프",
      words: ["생활", "루틴", "일상", "습관", "라이프"],
    },
  ];

  const scoredTopics = topicRules
    .map((topic) => {
      const score = topic.words.reduce((total, word) => {
        const count = fullText.split(word).length - 1;
        const titleBonus = `${title || ""}`.toLowerCase().includes(word) ? 2 : 0;
        const categoryBonus = `${category || ""}`.toLowerCase().includes(word) ? 1 : 0;

        return total + count + titleBonus + categoryBonus;
      }, 0);

      return {
        ...topic,
        score,
      };
    })
    .filter((topic) => topic.score > 0)
    .sort((a, b) => b.score - a.score);

  const primaryTopic = scoredTopics[0] || {
    key: "campus",
    label: "대학·캠퍼스",
    score: 1,
  };

  const blendedTopics = [
    primaryTopic,
    ...scoredTopics.filter((topic) => topic.key !== primaryTopic.key),
  ];

  const fallbackTopics = ["campus", "education", "student", "lifestyle"]
    .map((key) => topicRules.find((topic) => topic.key === key))
    .filter(Boolean)
    .filter((topic) => !blendedTopics.some((item) => item.key === topic.key));

  const finalTopics = [...blendedTopics, ...fallbackTopics].slice(0, 4);

  const picked = [];
  const usedUrls = new Set();

  finalTopics.forEach((topic, topicIndex) => {
    const pool = IMAGE_SUGGESTION_POOLS[topic.key] || IMAGE_SUGGESTION_POOLS.campus || [];
    const url = pool.find((item) => !usedUrls.has(item));

    if (url) {
      usedUrls.add(url);
      picked.push({
        id: `${topic.key}-${topicIndex}`,
        url,
        label: topic.label,
      });
    }
  });

  if (picked.length < 4) {
    Object.entries(IMAGE_SUGGESTION_POOLS).forEach(([key, pool]) => {
      if (picked.length >= 4) return;

      const url = pool.find((item) => !usedUrls.has(item));

      if (url) {
        usedUrls.add(url);
        const topic = topicRules.find((item) => item.key === key);

        picked.push({
          id: `${key}-${picked.length}`,
          url,
          label: topic?.label || "추천 이미지",
        });
      }
    });
  }

  return picked.slice(0, 4);
}

function BrandLogo() {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/unnews_logo.png"
        alt="UNNEWS"
        className="h-12 w-12 object-contain"
      />

      <div className="text-[21px] font-black tracking-[-0.06em] text-neutral-900">
        대학연합신문
      </div>
    </div>
  );
}

function IconTile({ children }) {
  return <div className="flex items-center justify-center text-neutral-950">{children}</div>;
}

function ShortcutGridIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="6" height="6" rx="1.8" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="4" width="6" height="6" rx="1.8" stroke="currentColor" strokeWidth="1.8" />
      <rect x="4" y="14" width="6" height="6" rx="1.8" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="14" width="6" height="6" rx="1.8" fill="#2563EB" />
    </svg>
  );
}

function ShortcutArticleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 3.8h7l3.2 3.2V19a1.2 1.2 0 0 1-1.2 1.2H7A1.2 1.2 0 0 1 5.8 19V5A1.2 1.2 0 0 1 7 3.8Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M14 3.8V7h3.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.6 11.2h6.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8.6 15h4.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="15.8" cy="15.2" r="1.9" fill="#7C3AED" />
    </svg>
  );
}

function ShortcutAdminIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3.8 18 6v4.6c0 4-2.4 7-6 8.4-3.6-1.4-6-4.4-6-8.4V6l6-2.2Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="m9.8 11.8 1.6 1.6 3.1-3.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.5 18.5h2.7" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="18.5" cy="18.5" r="1.8" fill="#F59E0B" />
    </svg>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-16 bg-black text-white">
      <div className="mx-auto max-w-[1440px] px-6 py-10 md:px-8">

        <div className="flex flex-col gap-8 md:flex-row md:justify-between">

          <div>
            <div className="text-xl font-bold">
              대학연합신문
            </div>

            <div className="mt-3 text-sm text-white/60">
              사업자번호 : 504-81-47108
            </div>

            <div className="text-sm text-white/60">
              주소 : 대구 남구 현충로 206 3층 (대명동, 신화빌딩)
            </div>

            <div className="text-sm text-white/60">
  전화 : 053-765-4765 &nbsp;&nbsp;|&nbsp;&nbsp;
  팩스 : 053-767-4766 &nbsp;&nbsp;|&nbsp;&nbsp;
  이메일 : unnews@daum.net
</div>
          </div>

          <div className="flex flex-col items-start gap-4 md:items-end">

            <a
  href="https://www.instagram.com/withcomm_official/"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center justify-center opacity-80 transition hover:opacity-100"
  aria-label="인스타그램"
>
  <img
    src="/instagram_w.png"
    alt="인스타그램"
    className="h-7 w-7 object-contain"
  />
</a>

            <div className="flex flex-wrap gap-3 text-sm text-white/70">

              <span className="cursor-pointer text-[#4DBBFF] hover:text-[#73CCFF]">
                개인정보처리방침
              </span>

              <span>|</span>

              <span className="cursor-pointer hover:text-white">
                이용약관
              </span>

              <span>|</span>

              <span className="cursor-pointer hover:text-white">
                저작권 정책
              </span>

              <span>|</span>

              <span className="cursor-pointer hover:text-white">
                청소년 보호 정책
              </span>

            </div>
          </div>

        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-sm text-white/40">
          © 대학연합신문 (UNNEWS). All rights reserved.
        </div>

      </div>
    </footer>
  );
}

export default function Page() {
  const [page, setPage] = useState("home");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminTab, setAdminTab] = useState("dashboard");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [activeCategory, setActiveCategory] = useState("전체");
  const [activeSubCategory, setActiveSubCategory] = useState("전체");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedPost, setSelectedPost] = useState(POSTS[0]);
  const [drafts, setDrafts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isSavingPost, setIsSavingPost] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [heroIndex, setHeroIndex] = useState(0);

  const adminChartData = [
  {
    name: "뉴스",
    posts: drafts.filter((post) => post.category1 === "뉴스").length,
  },
  {
    name: "커뮤니티",
    posts: drafts.filter((post) => post.category1 === "커뮤니티").length,
  },
  {
    name: "취업",
    posts: drafts.filter((post) => post.category1 === "취업/공모전").length,
  },
  {
    name: "트렌드",
    posts: drafts.filter((post) => post.category1 === "트렌드").length,
  },
];

const adminPieData = [
  {
    name: "조회수",
    value: drafts.reduce((sum, post) => sum + (post.views || 0), 0),
  },
  {
    name: "좋아요",
    value: drafts.reduce((sum, post) => sum + (post.likes || 0), 0),
  },
  {
    name: "댓글",
    value: drafts.reduce(
      (sum, post) => sum + ((post.comments?.length) || 0),
      0
    ),
  },
];

  const [form, setForm] = useState({
    title: "",
    category1: "트렌드",
    category2: "AI",
    category: "AI",
    body: "",
    image: "",
    imageFileName: "",
    uploadedImage: "",
    useAutoImage: true,
  });

  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [contentBlocks, setContentBlocks] = useState([
  { id: "block-1", type: "text", value: "" },
]);
  const [uploadingBlockId, setUploadingBlockId] = useState(null);
  const [suggestedImages, setSuggestedImages] = useState([]);
  const [isSuggestingImages, setIsSuggestingImages] = useState(false);
  const [suggestionLabel, setSuggestionLabel] = useState("");
  const [autoImageReady, setAutoImageReady] = useState(false);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isSavingComment, setIsSavingComment] = useState(false);

  const allPosts = useMemo(() => {
  if (isLoadingPosts) return [];

  return drafts;
}, [drafts, isLoadingPosts]);

const visiblePosts = useMemo(() => {
  const keyword = searchKeyword.trim().toLowerCase();

  return allPosts.filter((post) => {
    const matchPrimary =
      activeCategory === "전체" || getCategory1(post) === activeCategory;

    const matchSub =
      activeSubCategory === "전체" || getCategory2(post) === activeSubCategory;

    const text = [
      post.title,
      post.summary,
      post.body,
      getCategory1(post),
      getCategory2(post),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchSearch = !keyword || text.includes(keyword);

    return matchPrimary && matchSub && matchSearch;
  });
}, [activeCategory, activeSubCategory, allPosts, searchKeyword]);

  const heroPosts = allPosts.slice(0, 3);

  const popularPosts = useMemo(() => {
  const now = Date.now();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;

  return [...allPosts]
    .map((post) => {
      const createdTime =
        post.createdAt?.toDate?.()?.getTime?.() ||
        new Date(post.createdAt || 0).getTime();

      const isRecent = now - createdTime <= sevenDays;

      return {
        ...post,
        popularityScore:
          (post.views || 0) * 1 +
          (post.likes || 0) * 3 +
          (isRecent ? 20 : 0),
      };
    })
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, 4);
}, [allPosts]);

  const categoryPopularPosts = useMemo(() => {
  const now = Date.now();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;

  return [...visiblePosts]
    .map((post) => {
      const createdTime =
        post.createdAt?.toDate?.()?.getTime?.() ||
        new Date(post.createdAt || 0).getTime();

      const isRecent = now - createdTime <= sevenDays;

      return {
        ...post,
        popularityScore:
          (post.views || 0) * 1 +
          (post.likes || 0) * 3 +
          (isRecent ? 20 : 0),
      };
    })
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, 3);
}, [visiblePosts]);

  const featured = popularPosts;
  const latest = allPosts.slice(0, 8);
  const currentHero =
  heroPosts[heroIndex] ||
  allPosts[0] ||
  POSTS[0];

  const adminStats = useMemo(() => {
  const posts = drafts || [];

  const totalPosts = posts.length;
  const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
  const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);
  const totalComments = posts.reduce(
    (sum, post) => sum + ((post.comments || []).length || 0),
    0
  );

  const topPosts = [...posts]
    .sort((a, b) => {
      const scoreA = (a.views || 0) + (a.likes || 0) * 3;
      const scoreB = (b.views || 0) + (b.likes || 0) * 3;
      return scoreB - scoreA;
    })
    .slice(0, 5);

  const categoryCounts = posts.reduce((acc, post) => {
    const category = getCategory1(post) || "기타";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  return {
    totalPosts,
    totalViews,
    totalLikes,
    totalComments,
    topPosts,
    categoryCounts,
  };
}, [drafts]);
  
  const previewImage = form.uploadedImage
    ? form.uploadedImage
    : form.image.trim()
      ? form.image.trim()
      : suggestedImages?.[0]?.url || getAutoImage(form.category2, `${form.title} ${form.body}`);

      useEffect(() => {
  if (typeof document === "undefined") return;

  const title = selectedPost?.title
    ? `${selectedPost.title} | 대학연합신문`
    : "대학연합신문";

  const description =
    selectedPost?.summary ||
    "대학생을 위한 뉴스, 교육, AI, 취업, 공모전, 창업 정보를 제공하는 대학연합신문";

  const image =
    selectedPost?.image ||
    "https://unnews.vercel.app/unnews_logo.png";

  document.title = title;

  const setMeta = (selector, attr, value) => {
    let tag = document.querySelector(selector);

    if (!tag) {
      tag = document.createElement("meta");

      if (selector.includes("property=")) {
        tag.setAttribute(
          "property",
          selector.match(/property="(.+?)"/)?.[1]
        );
      } else {
        tag.setAttribute(
          "name",
          selector.match(/name="(.+?)"/)?.[1]
        );
      }

      document.head.appendChild(tag);
    }

    tag.setAttribute(attr, value);
  };

  setMeta(
    'meta[name="description"]',
    "content",
    description
  );

  setMeta(
    'meta[property="og:title"]',
    "content",
    title
  );

  setMeta(
    'meta[property="og:description"]',
    "content",
    description
  );

  setMeta(
    'meta[property="og:image"]',
    "content",
    image
  );

  setMeta(
    'meta[property="og:url"]',
    "content",
    window.location.href
  );
}, [selectedPost]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const path = window.location.pathname;

    if (path.startsWith("/news/")) {
  const slug = path.replace("/news/", "");

  const matchedPost = allPosts.find(
    (post) => post.slug === slug || String(post.id) === slug
  );

  if (matchedPost) {
    setSelectedPost(matchedPost);
    setPage("article");
  }
}

    if (params.get("admin") === "1" || path === "/admin") {
      setPage("admin");
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(Boolean(user));
      setIsAuthChecking(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
  try {
    setIsLoadingPosts(true);

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const savedPosts = (data || []).map((post) => ({
      id: post.id,
      slug: post.slug || "",
      title: post.title,
      body: post.body || "",
      contentBlocks: post.content_blocks || [],
      summary: post.summary || "",
      category1: post.category1 || "뉴스",
      category2: post.category2 || "교육",
      category: post.category || post.category2 || "교육",
      readTime: post.read_time || "1분 읽기",
      image: post.image || "",
      views: post.views || 0,
      likes: post.likes || 0,
      comments: Array.isArray(post.comments)
  ? post.comments
  : [],
      createdAt: post.created_at,
      updatedAt: post.updated_at,
    }));

    setDrafts(savedPosts);

    console.log("SUPABASE POSTS", savedPosts);

  } catch (error) {
    console.error("Supabase load error:", error);
  } finally {
    setIsLoadingPosts(false);
  }
};

    loadPosts();
  }, []);

  useEffect(() => {
    if (page !== "home" || heroPosts.length <= 1) return undefined;

    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroPosts.length);
    }, 4200);

    return () => clearInterval(timer);
  }, [page, heroPosts.length]);

  useEffect(() => {
    const text = getPlainBodyFromBlocks(contentBlocks);

    if (form.title.trim() || text.length >= 20) {
      const timer = setTimeout(() => {
        buildImageSuggestions();
      }, 500);

      return () => clearTimeout(timer);
    }

    setSuggestedImages([]);
    setSuggestionLabel("");
    setAutoImageReady(false);
    return undefined;
  }, [form.title, form.category2, contentBlocks]);

  useEffect(() => {
    const text = getPlainBodyFromBlocks(contentBlocks);

    if (text.length < 60) {
      setSummary("");
      return undefined;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSummarizing(true);

        const response = await fetch("/api/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        if (!response.ok) throw new Error("summary api error");

        const data = await response.json();
        setSummary(data.summary || fallbackSummary(text));
      } catch (error) {
        console.error(error);
        setSummary(fallbackSummary(text));
      } finally {
        setIsSummarizing(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [form.body, contentBlocks]);

  const uploadImageToCloudinary = async (file) => {
    if (!file || !file.type.startsWith("image/")) return "";

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: uploadData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cloudinary upload error:", errorText);
      throw new Error("이미지 업로드 실패");
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleImageFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;

    try {
      setIsUploading(true);
      const imageUrl = await uploadImageToCloudinary(file);

      setForm((prev) => ({
        ...prev,
        uploadedImage: imageUrl,
        imageFileName: file.name,
        image: imageUrl,
        useAutoImage: false,
      }));
    } catch (error) {
      console.error(error);
      alert("이미지 업로드에 실패했습니다. Cloudinary preset과 cloud name을 확인해주세요.");
    } finally {
      setIsUploading(false);
    }
  };

  const addTextBlock = () => {
  setContentBlocks((prev) => [
    ...prev,
    { id: Date.now() + Math.random(), type: "text", value: "" },
  ]);
};

const addHeadingBlock = () => {
  setContentBlocks((prev) => [
    ...prev,
    { id: Date.now() + Math.random(), type: "heading", value: "" },
  ]);
};

const addImageBlock = () => {
  setContentBlocks((prev) => [
    ...prev,
    { id: Date.now() + Math.random(), type: "image", url: "", caption: "" },
  ]);
};

const addQuoteBlock = () => {
  setContentBlocks((prev) => [
    ...prev,
    { id: Date.now() + Math.random(), type: "quote", value: "" },
  ]);
};

const addHighlightBlock = () => {
  setContentBlocks((prev) => [
    ...prev,
    { id: Date.now() + Math.random(), type: "highlight", value: "" },
  ]);
};

const addLinkBlock = () => {
  setContentBlocks((prev) => [
    ...prev,
    { id: Date.now() + Math.random(), type: "link", text: "", url: "" },
  ]);
};

  const updateBlock = (blockId, patch) => {
    setContentBlocks((prev) =>
      prev.map((block) => (block.id === blockId ? { ...block, ...patch } : block))
    );
  };

  const removeBlock = (blockId) => {
    setContentBlocks((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((block) => block.id !== blockId);
    });
  };

  const moveBlock = (blockId, direction) => {
    setContentBlocks((prev) => {
      const index = prev.findIndex((block) => block.id === blockId);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= prev.length) return prev;
      const next = [...prev];
      const [target] = next.splice(index, 1);
      next.splice(nextIndex, 0, target);
      return next;
    });
  };

  const uploadBlockImage = async (blockId, file) => {
    if (!file || !file.type.startsWith("image/")) return;

    try {
      setUploadingBlockId(blockId);
      const imageUrl = await uploadImageToCloudinary(file);
      updateBlock(blockId, { url: imageUrl, fileName: file.name });
    } catch (error) {
      console.error(error);
      alert("본문 이미지 업로드에 실패했습니다.");
    } finally {
      setUploadingBlockId(null);
    }
  };

  const buildImageSuggestions = () => {
    const plainBody = getPlainBodyFromBlocks(contentBlocks);
    const topic = getSuggestionTopic(form.category2, `${form.title} ${plainBody}`);
    const suggestions = getSmartImageSuggestions(form.category2, form.title, plainBody);

    setSuggestionLabel(topic.label);
    setSuggestedImages(suggestions);
    setAutoImageReady(true);

    return suggestions;
  };

  const handleSuggestImages = () => {
    const plainBody = getPlainBodyFromBlocks(contentBlocks);

    if (!form.title.trim() && !plainBody) {
      alert("제목이나 본문을 먼저 입력하면 더 정확하게 추천됩니다.");
      return;
    }

    setIsSuggestingImages(true);

    window.setTimeout(() => {
      buildImageSuggestions();
      setIsSuggestingImages(false);
    }, 350);
  };

  const getAutoRecommendedImage = () => {
  const plainBody = getPlainBodyFromBlocks(contentBlocks);
  const suggestions = getSmartImageSuggestions(form.category2, form.title, plainBody);

  const validSuggestion = suggestions.find(
    (item) =>
      item?.url &&
      item.url.startsWith("https://images.unsplash.com/")
  );

  return (
    validSuggestion?.url ||
    getAutoImage(form.category2, `${form.title} ${plainBody}`)
  );
};

  const applySuggestedImage = (url) => {
    setForm((prev) => ({
      ...prev,
      image: url,
      uploadedImage: "",
      imageFileName: "AI 추천 이미지",
      useAutoImage: false,
    }));
  };

  const getPlainBodyFromBlocks = (blocks) => {
  const text = blocks
    .filter((block) =>
      ["text", "heading", "quote", "highlight"].includes(block.type)
    )
    .map((block) => block.value || "")
    .join("\n\n")
    .trim();

  return text || form.body.trim();
};

  const getCleanContentBlocks = () => {
  return contentBlocks
    .map((block) => {
      if (["text", "heading", "quote", "highlight"].includes(block.type)) {
        return {
          type: block.type,
          value: (block.value || "").trim(),
        };
      }

      if (block.type === "link") {
        return {
          type: "link",
          text: (block.text || "").trim(),
          url: (block.url || "").trim(),
        };
      }

      return {
        type: "image",
        url: block.url || "",
        caption: (block.caption || "").trim(),
      };
    })
    .filter((block) => {
      if (["text", "heading", "quote", "highlight"].includes(block.type)) {
        return block.value;
      }

      if (block.type === "link") {
        return block.text && block.url;
      }

      return block.url;
    });
};

  const resetForm = () => {
    setForm({
      title: "",
      category1: "트렌드",
      category2: "AI",
      category: "AI",
      body: "",
      image: "",
      imageFileName: "",
      uploadedImage: "",
      useAutoImage: true,
    });
    setSummary("");
    setEditingId(null);
    setContentBlocks([{ id: "block-1", type: "text", value: "" }]);
    setSuggestedImages([]);
    setSuggestionLabel("");
    setAutoImageReady(false);
  };

  const submitDraft = async () => {
    const cleanBlocks = getCleanContentBlocks();
    const plainBody = getPlainBodyFromBlocks(contentBlocks);

    if (!form.title.trim() || !plainBody || isSavingPost) return;

    const resolvedImage =
  form.uploadedImage ||
  form.image.trim() ||
  getAutoRecommendedImage() ||
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80";

    const resolvedSummary = summary.trim() || fallbackSummary(plainBody);

    const postData = {
  slug: createSlug(form.title),
  title: form.title.trim(),
      body: plainBody,
      contentBlocks: cleanBlocks.length > 0 ? cleanBlocks : [{ type: "text", value: plainBody }],
      summary: resolvedSummary,
      category1: form.category1,
      category2: form.category2,
      category: form.category2,
      readTime: "1분 읽기",
      image: resolvedImage,
    };

    try {
  setIsSavingPost(true);

  if (editingId) {
    const { data, error } = await supabase
      .from("posts")
      .update({
        slug: postData.slug,
        title: postData.title,
        body: postData.body,
        content_blocks: postData.contentBlocks,
        summary: postData.summary,
        category1: postData.category1,
        category2: postData.category2,
        category: postData.category,
        read_time: postData.readTime,
        image: postData.image,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editingId)
      .select()
      .single();

    if (error) throw error;

    const localUpdatedPost = {
      id: data.id,
      slug: data.slug || "",
      title: data.title,
      body: data.body,
      contentBlocks: data.content_blocks || [],
      summary: data.summary,
      category1: data.category1,
      category2: data.category2,
      category: data.category,
      readTime: data.read_time || "1분 읽기",
      image: data.image,
      views: data.views || 0,
      likes: data.likes || 0,
      comments: Array.isArray(data.comments)
  ? data.comments
  : [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    setDrafts((prev) =>
      prev.map((post) => (post.id === editingId ? localUpdatedPost : post))
    );

    setSelectedPost(localUpdatedPost);
    resetForm();
    setPage("post");
    return;
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({
      slug: postData.slug,
      title: postData.title,
      body: postData.body,
      content_blocks: postData.contentBlocks,
      summary: postData.summary,
      category1: postData.category1,
      category2: postData.category2,
      category: postData.category,
      read_time: postData.readTime,
      image: postData.image,
      views: 0,
      likes: 0,
      comments: [],
    })
    .select()
    .single();

  if (error) throw error;

  const newPost = {
    id: data.id,
    slug: data.slug || "",
    title: data.title,
    body: data.body,
    contentBlocks: data.content_blocks || [],
    summary: data.summary,
    category1: data.category1,
    category2: data.category2,
    category: data.category,
    readTime: data.read_time || "1분 읽기",
    image: data.image,
    views: data.views || 0,
    likes: data.likes || 0,
    comments: Array.isArray(data.comments)
  ? data.comments
  : [],
createdAt: data.created_at,
    updatedAt: data.updated_at,
  };

  setDrafts((prev) => [newPost, ...prev]);
  resetForm();
  setSelectedPost(newPost);
  setPage("post");
} catch (error) {
  console.error("Supabase save/update error:", error);
  alert("글 저장에 실패했습니다. Supabase 테이블 컬럼과 API Key를 확인해주세요.");
} finally {
  setIsSavingPost(false);
}
};

  const handleEditPost = (post) => {
  if (!post?.id) {
    alert("수정할 글 정보를 찾을 수 없습니다.");
    return;
  }

  setEditingId(post.id);

  setForm({
    title: post.title || "",
    category1: getCategory1(post),
    category2: getCategory2(post),
    category: getCategory2(post),
    body: post.body || "",
    image: post.image || "",
    imageFileName: "",
    uploadedImage: post.image || "",
    useAutoImage: false,
  });

  setSummary(
    post.summary || fallbackSummary(post.body || "")
  );

  setContentBlocks(
    Array.isArray(post.contentBlocks) &&
    post.contentBlocks.length > 0
      ? post.contentBlocks.map((block, index) => ({
          id: `edit-${Date.now()}-${index}`,
          type: block.type || "text",
          value: block.value || "",
          url: block.url || "",
          caption: block.caption || "",
          text: block.text || "",
        }))
      : [
          {
            id: "edit-block-1",
            type: "text",
            value: post.body || "",
          },
        ]
  );

  setPage("admin");

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

  const handleOpenPost = async (post) => {
  setSelectedPost(post);

window.history.pushState(
  {},
  "",
  `/news/${post.slug || post.id}`
);

setPage("post");

  if (!post?.id) return;

  const nextViews = (post.views || 0) + 1;

  setDrafts((prev) =>
    prev.map((item) =>
      item.id === post.id ? { ...item, views: nextViews } : item
    )
  );

  setSelectedPost((prev) =>
    prev?.id === post.id ? { ...prev, views: nextViews } : prev
  );

  try {
    const { error } = await supabase
      .from("posts")
      .update({ views: nextViews })
      .eq("id", post.id);

    if (error) throw error;
  } catch (error) {
    console.error("Supabase view count error:", error);
  }
};

const getCommentsArray = (post) => {
  return Array.isArray(post?.comments)
    ? post.comments
    : [];
};

const handleLikePost = async (post, event) => {
  event.stopPropagation();

  if (!post?.id) return;

  const storageKey = "unnews_liked_posts";
  const likedPosts = JSON.parse(localStorage.getItem(storageKey) || "[]");
  const postId = String(post.id);

  if (likedPosts.includes(postId)) {
    alert("이미 좋아요를 누른 글입니다.");
    return;
  }

  const nextLikes = (post.likes || 0) + 1;

  localStorage.setItem(storageKey, JSON.stringify([...likedPosts, postId]));

  setDrafts((prev) =>
    prev.map((item) =>
      item.id === post.id ? { ...item, likes: nextLikes } : item
    )
  );

  setSelectedPost((prev) =>
    prev?.id === post.id ? { ...prev, likes: nextLikes } : prev
  );

  try {
    const { error } = await supabase
      .from("posts")
      .update({ likes: nextLikes })
      .eq("id", post.id);

    if (error) throw error;
  } catch (error) {
    console.error("Supabase like error:", error);
    alert("좋아요 저장에 실패했습니다.");
  }
};
  
const handleAddComment = async () => {
  if (!selectedPost?.id) {
    alert("글 정보를 찾을 수 없습니다.");
    return;
  }

  if (!commentName.trim() || !commentText.trim()) {
    alert("이름과 댓글 내용을 입력해주세요.");
    return;
  }

  const newComment = {
    id: Date.now(),
    name: commentName.trim(),
    text: commentText.trim(),
    createdAt: new Date().toISOString(),
  };

  const currentComments = getCommentsArray(selectedPost);
  const nextComments = [...currentComments, newComment];

  try {
    setIsSavingComment(true);

    const { error } = await supabase
  .from("posts")
  .update({
    comments: nextComments,
  })
  .eq("id", selectedPost.id);

    if (error) throw error;

    setSelectedPost((prev) =>
      prev ? { ...prev, comments: nextComments } : prev
    );

    setDrafts((prev) =>
      prev.map((post) =>
        post.id === selectedPost.id
          ? { ...post, comments: nextComments }
          : post
      )
    );

    setCommentName("");
    setCommentText("");
  } catch (error) {
    console.error("Supabase comment save error:", error);
    alert("댓글 저장에 실패했습니다.");
  } finally {
    setIsSavingComment(false);
  }
};

  const handleDeletePost = async (postId) => {
  if (!postId) {
    alert("삭제할 글 정보를 찾을 수 없습니다.");
    return;
  }

  if (!confirm("정말 이 글을 삭제할까요?")) return;

  try {
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);

    if (error) throw error;

    setDrafts((prev) =>
      prev.filter((post) => post.id !== postId)
    );

    if (selectedPost?.id === postId) {
      setSelectedPost(null);
      setPage("home");
    }
  } catch (error) {
    console.error("Supabase delete error:", error);
    alert("글 삭제에 실패했습니다.");
  }
};

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminError("");

    if (!adminEmail.trim() || !adminPassword.trim()) {
      setAdminError("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, adminEmail.trim(), adminPassword);
      setAdminEmail("");
      setAdminPassword("");
      setAdminError("");
      setPage("admin");
    } catch (error) {
      console.error("Firebase Auth login error:", error);
      setAdminError("로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요.");
    }
  };

  const handleAdminLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Firebase Auth logout error:", error);
    }
    setIsAdmin(false);
    setEditingId(null);
    setAdminEmail("");
    setAdminPassword("");
    setAdminError("");
    setPage("home");
  };

  return (
    <div
      className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffffff_0%,_#f7f7f5_45%,_#f3f2ef_100%)] text-neutral-900"
      style={{ fontFamily: "Pretendard, Inter, system-ui, sans-serif" }}
    >
      <Header
  activeCategory={activeCategory}
  setActiveCategory={setActiveCategory}
  setActiveSubCategory={setActiveSubCategory}
  setPage={setPage}
/>

      {page === "home" && (
        <main className="mx-auto max-w-[1440px] px-5 py-8 md:px-8 md:py-10">
          <section className="mb-10 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
            <div className="relative overflow-hidden rounded-[32px] border border-white/50 bg-white/70 shadow-[0_24px_70px_rgba(0,0,0,0.08)] backdrop-blur">
              <img
                src={currentHero.image}
                alt={currentHero.title}
                className="block h-[520px] w-full object-cover transition duration-700"
                onError={(e) => {
    e.currentTarget.src =
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80";
  }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.56),rgba(0,0,0,0.18),transparent)]" />

              <div className="absolute inset-x-0 bottom-0 p-7 text-white md:p-9">
                <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-md">
                  {getCategory2(currentHero)}
                </span>

                <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.045em] md:text-[3.7rem] line-clamp-2 break-keep">
                  {currentHero.title}
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-6 text-white/90 md:text-[15px] md:leading-7">
                  {clip(currentHero.body, 130)}
                </p>

                <button
                  onClick={() => handleOpenPost(currentHero)}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-neutral-900 backdrop-blur transition hover:bg-white"
                >
                  지금 읽기 →
                </button>

                <div className="mt-6 flex items-center gap-3">
                  {heroPosts.map((post, index) => (
                    <button
                      key={post.id}
                      onClick={() => setHeroIndex(index)}
                      className={`h-2.5 rounded-full transition-all ${
                        heroIndex === index ? "w-10 bg-white" : "w-2.5 bg-white/45"
                      }`}
                      aria-label={`${index + 1}번 히어로 보기`}
                    />
                  ))}
                </div>

                <div className="mt-7 hidden grid-cols-3 gap-3 md:grid">
                  {heroPosts.map((post, index) => (
                    <button
                      key={post.id}
                      onClick={() => {
                        setHeroIndex(index);
                        handleOpenPost(post);
                      }}
                      className={`group rounded-[22px] border px-5 py-4 text-left text-white shadow-[0_10px_24px_rgba(0,0,0,0.10)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 ${
                        heroIndex === index
                          ? "border-white/45 bg-white/18"
                          : "border-white/25 bg-white/10 hover:border-white/35 hover:bg-white/16"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold text-white/75">
                          {getCategory2(post)}
                        </span>
                        <span className="h-1.5 w-1.5 rounded-full bg-white/60 opacity-0 transition group-hover:opacity-100" />
                      </div>

                      <div className="mt-2 line-clamp-1 text-[15px] font-semibold leading-6 tracking-[-0.03em]">
                        {post.title}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[24px] border border-white/60 bg-white/78 p-5 shadow-[0_14px_36px_rgba(0,0,0,0.05)] backdrop-blur">
                <p className="text-xs font-medium text-neutral-500">브랜드</p>
                <h2 className="mt-1 text-[1.65rem] font-semibold tracking-[-0.04em]">
                  UNNEWS
                </h2>
                <p className="mt-3 text-[14px] leading-6 text-neutral-700">
                  대학연합신문은 대학생에게 필요한 정보를 빠르게 선별하고 정리하는 큐레이션 기반 디지털 미디어입니다. 실제 대학생의 트렌드·커리어·AI·라이프를 짧고 현실적인 문장으로 담아내는 매거진형 플랫폼입니다.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["unnews.kr", "부드러운 매거진형", "이미지 우선형"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/60 bg-white/78 p-5 shadow-[0_14px_36px_rgba(0,0,0,0.05)] backdrop-blur">
                <p className="text-xs font-medium text-neutral-500">바로 보기</p>
                <div className="mt-4 grid grid-cols-3 items-stretch gap-3">
                  <button
                    onClick={() => setPage("category")}
                    className="flex min-h-[148px] flex-col items-center justify-center gap-3 rounded-2xl border border-black/5 bg-neutral-50/90 px-4 py-4 text-center transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:scale-95"
                  >
                    <IconTile>
                      <ShortcutGridIcon />
                    </IconTile>
                    <div className="text-sm font-semibold text-neutral-900">카테고리</div>
                  </button>

                  <button
                    onClick={() => handleOpenPost(currentHero)}
                    className="flex min-h-[148px] flex-col items-center justify-center gap-3 rounded-2xl border border-black/5 bg-neutral-50/90 px-4 py-4 text-center transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:scale-95"
                  >
                    <IconTile>
                      <ShortcutArticleIcon />
                    </IconTile>
                    <div className="text-sm font-semibold text-neutral-900">글 상세</div>
                  </button>

                  <button
                    onClick={() => {
  if (!isAdmin) {
    setPage("admin");
    return;
  }

  setPage("admin");
}}
                    className="flex min-h-[148px] flex-col items-center justify-center gap-3 rounded-2xl border border-black/5 bg-neutral-50/90 px-4 py-4 text-center transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:scale-95"
                  >
                    <IconTile>
                      <ShortcutAdminIcon />
                    </IconTile>
                    <div className="text-sm font-semibold text-neutral-900">관리자</div>
                  </button>
                </div>
              </div>
            </div>
          </section>

         <section className="mb-12">
  <div className="mb-5 flex items-end justify-between">
    <div>
      <p className="text-sm font-semibold text-[#4dbbff]">Popular</p>
      <h2 className="text-[2rem] font-black tracking-[-0.05em]">
        인기 콘텐츠
      </h2>
    </div>
    <button
      type="button"
      onClick={() => {
        setActiveCategory("전체");
        setActiveSubCategory("전체");
        setPage("category");
      }}
      className="hidden rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 md:block"
    >
      전체 보기 →
    </button>
  </div>

  <div className="grid gap-6 md:grid-cols-3">
    {featured.slice(0, 3).map((post, index) => (
      <button
        type="button"
        key={post.id}
        onClick={() => handleOpenPost(post)}
        className="group text-left"
      >
        <div className="relative overflow-hidden rounded-[26px] bg-neutral-100 shadow-[0_18px_44px_rgba(0,0,0,0.08)]">
          <img
            src={post.image}
            alt={post.title}
            className="h-[260px] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
            onError={(e) => {
  e.currentTarget.src =
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80";
}}
          />

          <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-neutral-900 backdrop-blur">
            TOP {index + 1}
          </div>

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-4">
            <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
              {getCategory2(post)}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="line-clamp-2 text-[1.15rem] font-black leading-7 tracking-[-0.04em] text-neutral-900">
            {post.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-[14px] leading-6 text-neutral-500">
            {post.summary || post.body}
          </p>

          <div className="mt-3 flex items-center justify-between text-xs font-medium text-neutral-400">
            <span>조회 {post.views || 0}</span>
            <button
  type="button"
  onClick={(event) => handleLikePost(post, event)}
  className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-neutral-600 shadow-sm transition hover:bg-neutral-950 hover:text-white"
>
  ♡ {post.likes || 0}
</button>
          </div>
        </div>
      </button>
    ))}
  </div>
</section>

          <section>
            <div className="mb-4 flex gap-2 overflow-auto pb-1">
              {PRIMARY_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setActiveSubCategory("전체");
                    setPage("category");
                  }}
                  className={`rounded-full px-4 py-2.5 text-sm font-medium transition ${
                    activeCategory === category
                      ? "bg-[#4dbbff] text-white shadow-[0_10px_24px_rgba(77,187,255,0.28)]"
                      : "border border-black/5 bg-white/80 text-neutral-700 backdrop-blur hover:border-[#4dbbff]/40 hover:text-[#4dbbff] hover:bg-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              {latest.map((post) => (
                <button
                  type="button"
                  key={post.id}
                  onClick={() => handleOpenPost(post)}
                  className="flex items-center gap-4 rounded-[24px] border border-white/60 bg-white/78 p-3.5 text-left shadow-[0_16px_42px_rgba(0,0,0,0.06)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(0,0,0,0.08)]"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-24 w-24 rounded-[18px] object-cover md:h-28 md:w-28"
                    onError={(e) => {
  e.currentTarget.src =
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80";
}}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500">
                        {getCategory2(post)}
                      </span>
                      <span className="text-xs text-neutral-400">{post.readTime}</span>
                    </div>
                    <h3 className="line-clamp-2 text-[1rem] font-semibold leading-6 tracking-[-0.03em]">
                      {post.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-[14px] leading-6 text-neutral-600">
                      {post.body}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </main>
      )}

{page === "category" && (
  <main className="mx-auto max-w-[1440px] px-5 py-8 md:px-8 md:py-10">
    <div className="mb-6">
      <p className="text-sm text-neutral-500">Category</p>
      <h1 className="text-[2.3rem] font-semibold tracking-[-0.045em]">
        {activeCategory === "전체" ? "전체 글" : activeCategory}
      </h1>
    </div>

<div className="mb-6">
  <div className="relative">
    <input
      type="text"
      value={searchKeyword}
      onChange={(e) => setSearchKeyword(e.target.value)}
      placeholder="기사 제목, 본문, 카테고리 검색"
      className="h-12 w-full rounded-full border border-black/10 bg-white px-5 pr-24 text-sm outline-none transition focus:border-[#4dbbff]"
    />

    <button
      type="button"
      className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
    >
      검색
    </button>
  </div>

  {searchKeyword && (
    <button
      type="button"
      onClick={() => setSearchKeyword("")}
      className="mt-2 rounded-full bg-neutral-100 px-4 py-2 text-xs font-semibold text-neutral-600"
    >
      초기화
    </button>
  )}
</div>

    <div className="mb-3 flex gap-2 overflow-auto pb-1">
      {PRIMARY_CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => {
            setActiveCategory(category);
            setActiveSubCategory("전체");
          }}
          className={`rounded-full px-4 py-2.5 text-sm font-medium transition ${
            activeCategory === category
              ? "bg-[#4dbbff] text-white shadow-[0_10px_24px_rgba(77,187,255,0.28)]"
              : "border border-black/5 bg-white/80 text-neutral-700 backdrop-blur hover:border-[#4dbbff]/40 hover:text-[#4dbbff] hover:bg-white"
          }`}
        >
          {category}
        </button>
      ))}
    </div>

    {activeCategory !== "전체" && (
      <div className="mb-5 flex gap-2 overflow-auto pb-1">
        {["전체", ...(CATEGORY_MAP[activeCategory] || [])].map((subCategory) => (
          <button
            key={subCategory}
            onClick={() => setActiveSubCategory(subCategory)}
            className={`rounded-full px-4 py-2 text-xs font-medium transition ${
              activeSubCategory === subCategory
                ? "bg-neutral-900 text-white"
                : "border border-black/5 bg-white/80 text-neutral-600 hover:text-neutral-900 hover:bg-white"
            }`}
          >
            {subCategory}
          </button>
        ))}
      </div>
    )}

    <section className="mb-10 mt-8">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-sm font-medium text-[#4dbbff]">Popular</p>
          <h2 className="text-[1.8rem] font-semibold tracking-[-0.04em]">
            {activeCategory === "전체" ? "인기 콘텐츠" : `${activeCategory} 인기 콘텐츠`}
          </h2>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {categoryPopularPosts.map((post) => (
          <button
            type="button"
            key={post.id}
            onClick={() => handleOpenPost(post)}
            className="group text-left"
          >
            <div className="overflow-hidden rounded-[22px] bg-neutral-100 shadow-[0_16px_42px_rgba(0,0,0,0.06)]">
              <img
                src={post.image}
                alt={post.title}
                className="h-[220px] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                onError={(e) => {
  e.currentTarget.src =
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80";
}}
              />
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-[#4dbbff]">
                {getCategory2(post)}
              </span>
              <span className="text-xl text-neutral-300 transition group-hover:text-[#4dbbff]">
                ♡
              </span>
            </div>
            <h3 className="mt-2 line-clamp-2 text-[1.08rem] font-bold leading-6 tracking-[-0.03em] text-neutral-900">
              {post.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-500">
              {post.body}
            </p>
            <div className="mt-3 text-xs font-medium text-neutral-400">
              조회 {post.views || 0}
            </div>
          </button>
        ))}
      </div>
    </section>

    <section>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">List</p>
          <h2 className="text-[1.55rem] font-semibold tracking-[-0.04em]">
            전체 리스트
          </h2>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {visiblePosts.map((post) => (
          <button
            type="button"
            key={post.id}
            onClick={() => handleOpenPost(post)}
            className="flex items-center gap-4 rounded-[24px] border border-white/60 bg-white/78 p-3.5 text-left shadow-[0_16px_42px_rgba(0,0,0,0.06)] backdrop-blur transition hover:-translate-y-1"
          >
            <img
              src={post.image}
              alt={post.title}
              className="h-24 w-24 rounded-[18px] object-cover md:h-28 md:w-28"
              onError={(e) => {
  e.currentTarget.src =
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80";
}}
            />
            <div className="min-w-0 flex-1">
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500">
                {getCategory2(post)}
              </span>
              <h3 className="mt-2 line-clamp-2 text-[1rem] font-semibold leading-6 tracking-[-0.03em]">
                {post.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-[14px] leading-6 text-neutral-600">
                {post.body}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  </main>
)}

      {page === "post" && selectedPost && (
        <main className="mx-auto max-w-[980px] px-5 py-8 md:px-8 md:py-10">
          <button
            onClick={() => {
              setActiveCategory("전체");
              setPage("home");
            }}
            className="mb-5 rounded-full border border-black/10 bg-white/90 px-4 py-2 text-sm text-neutral-700"
          >
            ← 홈으로
          </button>

          <div className="overflow-hidden rounded-[30px] border border-white/60 bg-white/80 shadow-[0_24px_70px_rgba(0,0,0,0.08)] backdrop-blur">
            <img
  src={selectedPost.image}
  alt={selectedPost.title}
  className="h-[420px] w-full object-cover"
  onError={(e) => {
    e.currentTarget.src =
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80";
  }}
/>

            <div className="p-7 md:p-9">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
  <div className="flex items-center gap-2">
    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-500">
      {getCategoryLabel(selectedPost)}
    </span>

    <span className="text-xs text-neutral-400">
      {selectedPost.readTime}
    </span>

    <span className="text-xs text-neutral-400">
      조회 {selectedPost.views || 0}
    </span>
  </div>

  <button
    type="button"
    onClick={(event) => handleLikePost(selectedPost, event)}
    className="rounded-full bg-neutral-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#4dbbff]"
  >
    ♡ 좋아요 {selectedPost.likes || 0}
  </button>
</div>

              {isAdmin && selectedPost?.id && (
                <div className="mb-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEditPost(selectedPost)}
                    className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePost(selectedPost.id)}
                    className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
                  >
                    삭제
                  </button>
                </div>
              )}

              <h1 className="text-[2.3rem] font-semibold leading-[1.08] tracking-[-0.045em]">
                {selectedPost.title}
              </h1>

              <div className="mt-6 rounded-[22px] border border-black/5 bg-neutral-50/90 p-5">
                <p className="text-sm font-semibold text-neutral-500">3줄 요약</p>
                <p className="mt-2 whitespace-pre-line text-[15px] leading-7 text-neutral-700">
                  {selectedPost.summary || fallbackSummary(selectedPost.body)}
                </p>
              </div>

              <div className="mt-6 text-[15px] leading-8 text-neutral-700">
                {Array.isArray(selectedPost.contentBlocks) && selectedPost.contentBlocks.length > 0 ? (
                  <div className="space-y-6">
                    {selectedPost.contentBlocks.map((block, index) => {
  if (block.type === "image") {
    return (
      <figure key={index} className="overflow-hidden rounded-[24px] bg-neutral-50">
        <img
          src={block.url}
          alt={block.caption || selectedPost.title}
          className="max-h-[520px] w-full object-cover"
        />
        {block.caption && (
          <figcaption className="px-4 py-3 text-xs text-neutral-500">
            {block.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  if (block.type === "heading") {
    return (
      <h2
        key={index}
        className="mt-10 text-2xl font-black leading-tight tracking-[-0.04em] text-neutral-950"
      >
        {block.value}
      </h2>
    );
  }

  if (block.type === "quote") {
    return (
      <blockquote
        key={index}
        className="rounded-[22px] border-l-4 border-[#4DBBFF] bg-blue-50 px-5 py-4 text-[17px] font-medium leading-8 text-blue-900"
      >
        “{block.value}”
      </blockquote>
    );
  }

  if (block.type === "highlight") {
    return (
      <div
        key={index}
        className="rounded-[22px] border border-amber-100 bg-amber-50 px-5 py-4 text-[16px] font-semibold leading-8 text-amber-900"
      >
        {block.value}
      </div>
    );
  }

  if (block.type === "link") {
    return (
      <a
        key={index}
        href={block.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-fit items-center rounded-full bg-neutral-950 px-5 py-3 text-sm font-bold text-white shadow-[0_12px_28px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-neutral-800"
      >
        {block.text || "링크 바로가기"} →
      </a>
    );
  }

  return (
    <p key={index} className="whitespace-pre-line">
      {block.value}
    </p>
  );
})}
                  </div>
                ) : (
                  <p className="whitespace-pre-line">{selectedPost.body}</p>
                )}
              </div>

              <div className="mt-10 border-t border-black/5 pt-7">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-[1.35rem] font-black tracking-[-0.04em]">
                    댓글 {getCommentsArray(selectedPost).length}
                  </h2>
                </div>

                <div className="rounded-[22px] bg-neutral-50 p-4">
                  <div className="grid gap-3 md:grid-cols-[160px_1fr_auto]">
                    <input
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      className="rounded-[16px] border border-black/10 bg-white px-4 py-3 text-sm outline-none"
                      placeholder="이름"
                    />

                    <input
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="rounded-[16px] border border-black/10 bg-white px-4 py-3 text-sm outline-none"
                      placeholder="댓글을 입력하세요"
                    />

                    <button
                      type="button"
                      onClick={handleAddComment}
                      disabled={isSavingComment}
                      className="rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      {isSavingComment ? "저장 중..." : "등록"}
                    </button>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {getCommentsArray(selectedPost).length === 0 ? (
                    <div className="rounded-[18px] bg-neutral-50 px-4 py-5 text-sm text-neutral-400">
                      아직 댓글이 없습니다.
                    </div>
                  ) : (
                    [...getCommentsArray(selectedPost)].reverse().map((comment) => (
                      <div
                        key={comment.id}
                        className="rounded-[18px] border border-black/5 bg-white px-4 py-4"
                      >
                        <div className="mb-1 flex items-center justify-between gap-3">
                          <strong className="text-sm text-neutral-900">
                            {comment.name}
                          </strong>
                          <span className="text-xs text-neutral-400">
                            {new Date(comment.createdAt).toLocaleDateString("ko-KR")}
                          </span>
                        </div>
                        <p className="text-sm leading-6 text-neutral-600">
                          {comment.text}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        </main>
      )}


      {page === "admin" && !isAdmin && (
        <main className="mx-auto max-w-[520px] px-5 py-16 md:px-8">
          <div className="rounded-[28px] border border-white/70 bg-white/85 p-7 shadow-[0_18px_48px_rgba(0,0,0,0.07)] backdrop-blur">
            <p className="text-sm text-neutral-500">Admin Login</p>
            <h1 className="mt-1 text-[2rem] font-semibold tracking-[-0.045em]">
              관리자 로그인
            </h1>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Firebase Auth에 등록된 관리자 이메일과 비밀번호로 로그인합니다.
            </p>

            <form onSubmit={handleAdminLogin} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-600">
                  관리자 이메일
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full rounded-[18px] border border-black/10 bg-white px-4 py-3.5 outline-none"
                  placeholder="admin@unnews.co.kr"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-600">
                  관리자 비밀번호
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full rounded-[18px] border border-black/10 bg-white px-4 py-3.5 outline-none"
                  placeholder="비밀번호를 입력하세요"
                />
                {adminError && <p className="mt-2 text-xs text-red-500">{adminError}</p>}
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(0,0,0,0.18)]"
              >
                로그인
              </button>
            </form>
          </div>
        </main>
      )}

      {page === "admin" && isAdmin && (
        <main className="mx-auto max-w-[1180px] px-5 py-8 md:px-8 md:py-10">
        <section className="mb-8 rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_18px_48px_rgba(0,0,0,0.06)] backdrop-blur">
        <section className="mb-8 rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_18px_48px_rgba(0,0,0,0.06)] backdrop-blur">
  <div className="mb-6">
    <p className="text-sm font-semibold text-[#4dbbff]">Admin Dashboard</p>
    <h1 className="text-[2rem] font-black tracking-[-0.05em]">
      관리자 대시보드
    </h1>
  </div>

  <div className="grid gap-4 md:grid-cols-4">
    <div className="rounded-[22px] bg-neutral-50 p-5">
      <p className="text-xs font-semibold text-neutral-400">총 게시글</p>
      <div className="mt-2 text-3xl font-black">{adminStats.totalPosts}</div>
    </div>

    <div className="rounded-[22px] bg-neutral-50 p-5">
      <p className="text-xs font-semibold text-neutral-400">총 조회수</p>
      <div className="mt-2 text-3xl font-black">{adminStats.totalViews}</div>
    </div>

    <div className="rounded-[22px] bg-neutral-50 p-5">
      <p className="text-xs font-semibold text-neutral-400">총 좋아요</p>
      <div className="mt-2 text-3xl font-black">{adminStats.totalLikes}</div>
    </div>

    <div className="rounded-[22px] bg-neutral-50 p-5">
      <p className="text-xs font-semibold text-neutral-400">총 댓글</p>
      <div className="mt-2 text-3xl font-black">{adminStats.totalComments}</div>
    </div>
  </div>
</section>
  <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
    <div>
      <p className="text-sm font-semibold text-[#4dbbff]">Admin Dashboard</p>
      <h1 className="text-[2rem] font-black tracking-[-0.05em]">
        관리자 대시보드
      </h1>
      <p className="mt-2 text-sm text-neutral-500">
        등록된 콘텐츠의 조회수, 좋아요, 댓글 현황을 확인할 수 있습니다.
      </p>
    </div>

    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => {
          resetForm();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-semibold text-white"
      >
        새 글 작성
      </button>

      <button
        type="button"
        onClick={handleAdminLogout}
        className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-neutral-700"
      >
        로그아웃
      </button>
    </div>
  </div>
          <div className="mb-8 flex flex-wrap gap-2 border-b border-black/5 pb-4">
  {[
    { key: "dashboard", label: "대시보드" },
    { key: "write", label: "글등록" },
    { key: "posts", label: "글관리" },
    { key: "stats", label: "통계" },
  ].map((tab) => (
    <button
      key={tab.key}
      type="button"
      onClick={() => setAdminTab(tab.key)}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        adminTab === tab.key
          ? "bg-neutral-950 text-white"
          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
      }`}
    >
      {tab.label}
    </button>
  ))}
</div>

  {adminTab === "dashboard" && (
  <>
    
  <div className="grid gap-4 md:grid-cols-4">
    <div className="rounded-[22px] bg-neutral-50 p-5">
      <p className="text-xs font-semibold text-neutral-400">총 게시글</p>
      <div className="mt-2 text-3xl font-black">{adminStats.totalPosts}</div>
    </div>

    <div className="rounded-[22px] bg-neutral-50 p-5">
      <p className="text-xs font-semibold text-neutral-400">총 조회수</p>
      <div className="mt-2 text-3xl font-black">{adminStats.totalViews}</div>
    </div>

    <div className="rounded-[22px] bg-neutral-50 p-5">
      <p className="text-xs font-semibold text-neutral-400">총 좋아요</p>
      <div className="mt-2 text-3xl font-black">{adminStats.totalLikes}</div>
    </div>

    <div className="rounded-[22px] bg-neutral-50 p-5">
      <p className="text-xs font-semibold text-neutral-400">총 댓글</p>
      <div className="mt-2 text-3xl font-black">{adminStats.totalComments}</div>
    </div>
  </div>

  <div className="mt-6 grid gap-5 lg:grid-cols-2">
    <div className="rounded-[22px] border border-black/5 bg-white p-5">
      <h2 className="mb-4 text-lg font-black tracking-[-0.04em]">
        인기글 TOP 5
      </h2>

      <div className="space-y-3">
        {adminStats.topPosts.length === 0 ? (
          <p className="text-sm text-neutral-400">아직 등록된 글이 없습니다.</p>
        ) : (
          adminStats.topPosts.map((post, index) => (
            <div
              key={post.id}
              className="flex items-center justify-between gap-3 rounded-[16px] bg-neutral-50 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-neutral-900">
                  {index + 1}. {post.title}
                </p>
                <p className="mt-1 text-xs text-neutral-400">
                  조회 {post.views || 0} · 좋아요 {post.likes || 0} · 댓글 {(post.comments || []).length}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>

    <div className="rounded-[22px] border border-black/5 bg-white p-5">
      <h2 className="mb-4 text-lg font-black tracking-[-0.04em]">
        카테고리별 게시글
      </h2>

      <div className="space-y-3">
        {Object.keys(adminStats.categoryCounts).length === 0 ? (
          <p className="text-sm text-neutral-400">카테고리 데이터가 없습니다.</p>
        ) : (
          Object.entries(adminStats.categoryCounts).map(([category, count]) => (
            <div
              key={category}
              className="flex items-center justify-between rounded-[16px] bg-neutral-50 px-4 py-3"
            >
              <span className="text-sm font-semibold text-neutral-700">
                {category}
              </span>
              <span className="text-sm font-black text-neutral-950">
                {count}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
          </>
        )}
        {adminTab === "posts" && (
  <section className="mt-8 rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_18px_48px_rgba(0,0,0,0.06)] backdrop-blur">
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-[#4dbbff]">Post Management</p>
        <h2 className="text-[2rem] font-black tracking-[-0.05em]">
          글관리
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
          등록된 콘텐츠를 확인하고 수정하거나 삭제할 수 있습니다.
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          resetForm();
          setAdminTab("write");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-semibold text-white"
      >
        새 글 작성
      </button>
    </div>

    <div className="overflow-hidden rounded-[22px] border border-black/5 bg-white">
      <div className="grid grid-cols-[80px_1fr_120px_90px_90px_140px] gap-3 border-b border-black/5 bg-neutral-50 px-4 py-3 text-xs font-bold text-neutral-500">
        <div>이미지</div>
        <div>제목</div>
        <div>카테고리</div>
        <div>조회</div>
        <div>좋아요</div>
        <div>관리</div>
      </div>

      {drafts.length === 0 ? (
        <div className="px-4 py-10 text-center text-sm text-neutral-400">
          등록된 글이 없습니다.
        </div>
      ) : (
        drafts.map((post) => (
          <div
            key={post.id}
            className="grid grid-cols-[80px_1fr_120px_90px_90px_140px] items-center gap-3 border-b border-black/5 px-4 py-3 last:border-b-0"
          >
            <img
              src={post.image}
              alt={post.title}
              className="h-12 w-16 rounded-[12px] object-cover"
              onError={(e) => {
  e.currentTarget.src =
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80";
}}
            />

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-neutral-900">
                {post.title}
              </p>
              <p className="mt-1 truncate text-xs text-neutral-400">
                {post.summary || post.body}
              </p>
            </div>

            <div className="text-xs font-semibold text-neutral-500">
              {getCategory1(post)} · {getCategory2(post)}
            </div>

            <div className="text-sm font-bold text-neutral-700">
              {post.views || 0}
            </div>

            <div className="text-sm font-bold text-neutral-700">
              {post.likes || 0}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  handleEditPost(post);
                  setAdminTab("write");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100"
              >
                수정
              </button>

              <button
                type="button"
                onClick={() => handleDeletePost(post.id)}
                className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
              >
                삭제
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  </section>
)}  
{adminTab === "stats" && (
  <section className="mt-8 rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_24px_70px_rgba(79,70,229,0.10)] backdrop-blur">
    <div className="mb-8">
      <p className="text-sm font-bold text-[#4dbbff]">Statistics</p>
      <h2 className="mt-2 text-[2rem] font-black tracking-[-0.05em]">
        통계 시각화
      </h2>
      <p className="mt-3 text-sm leading-6 text-neutral-500">
        카테고리별 게시글과 반응 데이터를 한눈에 확인할 수 있습니다.
      </p>
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-[28px] border border-violet-100 bg-[linear-gradient(145deg,#ffffff,#f8f7ff)] p-5 shadow-[0_18px_40px_rgba(124,58,237,0.08)]">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
            📊
          </div>
          <h3 className="text-sm font-black text-neutral-800">
            카테고리별 게시글
          </h3>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={adminChartData} margin={{ top: 18, right: 18, left: -10, bottom: 0 }}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#737373", fontSize: 13 }}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#737373", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: "rgba(124,58,237,0.06)" }}
                contentStyle={{
                  borderRadius: "16px",
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                }}
              />
              <Bar
                dataKey="posts"
                radius={[14, 14, 8, 8]}
                label={{ position: "top", fill: "#111827", fontSize: 13, fontWeight: 700 }}
              >
                {adminChartData.map((entry, index) => (
                  <Cell
                    key={`bar-${entry.name}`}
                    fill={["#8B5CF6", "#3B82F6", "#34D399", "#FBBF24"][index % 4]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-[28px] border border-sky-100 bg-[linear-gradient(145deg,#ffffff,#f4fbff)] p-5 shadow-[0_18px_40px_rgba(14,165,233,0.08)]">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
            ◔
          </div>
          <h3 className="text-sm font-black text-neutral-800">
            반응 데이터 비율
          </h3>
        </div>

        <div className="grid items-center gap-4 md:grid-cols-[1fr_150px]">
          <div className="relative h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={adminPieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={68}
                  outerRadius={112}
                  paddingAngle={3}
                >
                  {adminPieData.map((entry, index) => (
                    <Cell
                      key={`pie-${entry.name}`}
                      fill={["#4F46E5", "#14B8A6", "#F59E0B"][index % 3]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "1px solid rgba(0,0,0,0.06)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
              <span className="text-xs font-bold text-neutral-400">총 반응</span>
              <span className="text-2xl font-black text-neutral-900">
                {adminPieData.reduce((sum, item) => sum + item.value, 0)}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {adminPieData.map((item, index) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: ["#4F46E5", "#14B8A6", "#F59E0B"][index % 3],
                    }}
                  />
                  <span className="text-sm font-bold text-neutral-700">{item.name}</span>
                </div>
                <span className="text-sm font-black text-neutral-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    <div className="mt-6 flex items-center justify-between rounded-[24px] bg-[linear-gradient(90deg,#f5f7ff,#f8fbff)] px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm">
          ✨
        </div>
        <div>
          <p className="text-sm font-black text-neutral-800">데이터 업데이트 안내</p>
          <p className="mt-1 text-xs text-neutral-500">
            통계 데이터는 등록된 콘텐츠 기준으로 자동 집계됩니다.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => window.location.reload()}
        className="rounded-full bg-white px-4 py-2 text-xs font-bold text-neutral-600 shadow-sm transition hover:bg-neutral-950 hover:text-white"
      >
        새로고침
      </button>
    </div>
  </section>
)}

          {adminTab === "write" && (
  <>
    <div className="mb-6 flex items-center justify-between">
      <div>
        <p className="text-sm text-neutral-500">Admin</p>
        <h1 className="text-[2.3rem] font-semibold leading-[1.08] tracking-[-0.045em]">
          {editingId ? "콘텐츠 수정" : "콘텐츠 관리"}
        </h1>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setPage("home")}
          className="rounded-full border border-black/10 bg-white/90 px-4 py-2 text-sm text-neutral-700"
        >
          사이트로 이동
        </button>

        <button
          type="button"
          onClick={handleAdminLogout}
          className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-semibold text-white"
        >
          로그아웃
        </button>
      </div>
    </div>

    <div className="grid gap-6 md:grid-cols-[1fr_0.9fr]">
            <div className="rounded-[24px] bg-white p-6 shadow-[0_10px_28px_rgba(0,0,0,0.04)]">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-600">
                    제목
                  </label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full rounded-[20px] border border-black/10 bg-white px-4 py-3.5 outline-none"
                    placeholder="제목을 입력하세요"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-600">
                    1차 카테고리
                  </label>
                  <select
                    value={form.category1}
                    onChange={(e) => {
                      const nextPrimary = e.target.value;
                      const nextSub = CATEGORY_MAP[nextPrimary]?.[0] || "콘텐츠";
                      setForm({
                        ...form,
                        category1: nextPrimary,
                        category2: nextSub,
                        category: nextSub,
                      });
                    }}
                    className="w-full rounded-[20px] border border-black/10 bg-white px-4 py-3.5 outline-none"
                  >
                    {Object.keys(CATEGORY_MAP).map((primary) => (
                      <option key={primary}>{primary}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-600">
                    2차 카테고리
                  </label>
                  <select
                    value={form.category2}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category2: e.target.value,
                        category: e.target.value,
                      })
                    }
                    className="w-full rounded-[20px] border border-black/10 bg-white px-4 py-3.5 outline-none"
                  >
                    {(CATEGORY_MAP[form.category1] || []).map((sub) => (
                      <option key={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-600">
                    대표 이미지 URL
                  </label>
                  <input
                    value={form.image}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        image: e.target.value,
                        uploadedImage: "",
                        imageFileName: "",
                        useAutoImage: false,
                      })
                    }
                    className="w-full rounded-[20px] border border-black/10 bg-white px-4 py-3.5 outline-none"
                    placeholder="이미지 URL을 입력하거나 자동 추천을 사용하세요"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-600">
                    이미지 파일 업로드
                  </label>

                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      handleImageFile(e.dataTransfer.files?.[0]);
                    }}
                    className={`rounded-[20px] border border-dashed px-4 py-4 transition ${
                      isDragging
                        ? "border-neutral-900 bg-neutral-100"
                        : "border-black/10 bg-white hover:border-black/20 hover:bg-neutral-50"
                    }`}
                  >
                    <label className="flex cursor-pointer items-center justify-between gap-4 text-sm text-neutral-600">
                      <div>
                        <div className="font-medium text-neutral-800">
                          {isUploading
                            ? "Cloudinary에 이미지 업로드 중..."
                            : form.imageFileName
                              ? form.imageFileName
                              : "내 컴퓨터에서 이미지 선택"}
                        </div>
                        <div className="mt-1 text-xs text-neutral-400">
                          이미지를 드래그해서 놓거나 파일 선택 버튼을 눌러주세요
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold text-white">
                        {isUploading ? "업로드 중" : "파일 선택"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={isUploading}
                        onChange={(e) => handleImageFile(e.target.files?.[0])}
                      />
                    </label>
                  </div>
                </div>

                <label className="flex items-center gap-3 rounded-[18px] border border-black/5 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
                  <input
                    type="checkbox"
                    checked={form.useAutoImage}
                    onChange={(e) => setForm({ ...form, useAutoImage: e.target.checked })}
                  />
                  적절한 이미지가 없으면 자동 추천 이미지 사용
                </label>

                <div className="rounded-[22px] border border-black/5 bg-neutral-50 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-neutral-700">AI 이미지 추천</p>
                      <p className="mt-1 text-xs text-neutral-400">
                        제목·본문·카테고리를 분석해 어울리는 무료 이미지를 추천합니다.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSuggestImages}
                      disabled={isSuggestingImages}
                      className="shrink-0 rounded-full bg-neutral-950 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
                    >
                      {isSuggestingImages ? "추천 중..." : "AI 이미지 추천"}
                    </button>
                  </div>

                  {suggestedImages.length > 0 && (
                    <div>
                      <div className="mb-3 text-xs text-neutral-500">
                        추천 주제: <strong>{suggestionLabel}</strong>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {suggestedImages.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => applySuggestedImage(item.url)}
                            className={`overflow-hidden rounded-[18px] border bg-white text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                              form.image === item.url
                                ? "border-neutral-950"
                                : "border-black/5"
                            }`}
                          >
                            <img
  src={item.url}
  alt={item.label}
  className="h-28 w-full object-cover"
  onError={(e) => {
    e.currentTarget.src =
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80";
  }}
/>
                            <div className="px-3 py-2 text-xs font-medium text-neutral-600">
                              이 이미지 사용
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-[22px] border border-black/5 bg-neutral-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-medium text-neutral-700">이미지 미리보기</p>
                    <span className="text-xs text-neutral-400">
                      {form.uploadedImage
                        ? "Cloudinary 업로드 이미지"
                        : form.useAutoImage || !form.image.trim()
                          ? "자동 추천 이미지"
                          : "직접 입력 이미지"}
                    </span>
                  </div>
                  <div className="overflow-hidden rounded-[18px] bg-white">
                    <img
  src={previewImage}
  alt="미리보기"
  onError={(e) => {
    e.currentTarget.src =
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80";
  }}
/>
                  </div>
                </div>

                <div>
                  <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
  <div>
    <h3 className="text-sm font-bold text-neutral-800">
      본문 블록 편집
    </h3>
    <p className="mt-1 text-xs leading-5 text-neutral-400">
      텍스트와 이미지를 원하는 순서로 추가할 수 있습니다.
    </p>
  </div>

  <div className="flex flex-wrap gap-2">
    <button type="button" onClick={addTextBlock} className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50">
      + 텍스트
    </button>
    <button type="button" onClick={addHeadingBlock} className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50">
      + 소제목
    </button>
    <button type="button" onClick={addQuoteBlock} className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100">
      + 인용문
    </button>
    <button type="button" onClick={addHighlightBlock} className="rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100">
      + 강조박스
    </button>
    <button type="button" onClick={addLinkBlock} className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100">
      + 링크버튼
    </button>
    <button type="button" onClick={addImageBlock} className="rounded-full bg-neutral-950 px-3 py-1.5 text-xs font-semibold text-white">
      + 이미지
    </button>
  </div>
</div>

<div className="space-y-3">
                    {contentBlocks.map((block, index) => (
                      <div
                        key={block.id}
                        className="rounded-[20px] border border-black/5 bg-neutral-50 p-4"
                      >
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-neutral-500">
  {`${index + 1}. ${
    block.type === "text"
      ? "텍스트"
      : block.type === "heading"
        ? "소제목"
        : block.type === "quote"
          ? "인용문"
          : block.type === "highlight"
            ? "강조박스"
            : block.type === "link"
              ? "링크버튼"
              : "이미지"
  }`}
</span>
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
                              onClick={() => removeBlock(block.id)}
                              className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-500 hover:bg-red-100"
                            >
                              삭제
                            </button>
                          </div>
                        </div>

                        {["text", "heading", "quote", "highlight"].includes(block.type) ? (
  <textarea
    value={block.value || ""}
    onChange={(e) => {
      updateBlock(block.id, { value: e.target.value });
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
) : block.type === "link" ? (
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
      placeholder="링크 주소를 입력하세요. 예: https://example.com"
    />
  </div>
) : (
  <div className="space-y-3">
    {block.url ? (
      <div className="overflow-hidden rounded-[18px] bg-white">
        <img
          src={block.url}
          alt="본문 이미지"
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
)}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[22px] border border-black/5 bg-neutral-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-medium text-neutral-700">자동 3줄 요약</p>
                    <span className="text-xs text-neutral-400">
                      {isSummarizing
                        ? "AI가 요약 중"
                        : summary
                          ? "자동 생성 완료"
                          : "본문 입력 대기"}
                    </span>
                  </div>
                  <div className="rounded-[18px] bg-white px-4 py-3 whitespace-pre-line text-[14px] leading-7 text-neutral-700">
                    {summary || "본문을 입력하면 AI가 자동으로 3줄 요약을 생성합니다."}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={submitDraft}
                    disabled={isUploading || isSavingPost}
                    className="rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSavingPost
                      ? editingId
                        ? "수정 저장 중..."
                        : "Supabase에 저장 중..."
                      : editingId
                        ? "수정 저장하기"
                        : "글 등록 미리보기"}
                  </button>

                  {editingId && (
                    <button
                      onClick={resetForm}
                      type="button"
                      className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
                    >
                      수정 취소
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[24px] bg-white p-6 shadow-[0_10px_28px_rgba(0,0,0,0.04)]">
                <p className="text-sm font-medium text-neutral-500">이미지 정책</p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-neutral-700">
                  <li className="rounded-2xl bg-neutral-50 px-4 py-3">
                    Cloudinary에 업로드한 이미지 파일 우선 사용
                  </li>
                  <li className="rounded-2xl bg-neutral-50 px-4 py-3">
                    업로드 완료 후 이미지 URL 자동 적용
                  </li>
                  <li className="rounded-2xl bg-neutral-50 px-4 py-3">
                    이미지가 없으면 2차 카테고리 기반 자동 추천
                  </li>
                  <li className="rounded-2xl bg-neutral-50 px-4 py-3">
                    본문 입력 시 3줄 요약 자동 생성
                  </li>
                </ul>
              </div>

              <div className="rounded-[24px] bg-white p-6 shadow-[0_10px_28px_rgba(0,0,0,0.04)]">
                <p className="text-sm font-medium text-neutral-500">
                  등록된 글 미리보기 {isLoadingPosts ? "· 불러오는 중" : ""}
                </p>
                <div className="mt-4 space-y-3">
                  {allPosts.slice(0, 5).map((post) => (
                    <button
                      key={post.id}
                      onClick={() => {
                        setSelectedPost(post);
                        setPage("post");
                      }}
                      className="block w-full rounded-2xl bg-neutral-50 px-4 py-3 text-left text-sm text-neutral-700"
                    >
                      <div className="mb-2 overflow-hidden rounded-xl">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-24 w-full object-cover"
                          onError={(e) => {
  e.currentTarget.src =
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80";
}}
                        />
                      </div>
                      <strong>{post.title}</strong>
                      <div className="mt-1 text-xs text-neutral-400">{getCategoryLabel(post)}</div>

                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditPost(post);
                          }}
                          className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePost(post.id);
                          }}
                          className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
                        >
                          삭제
                        </button>
                      </div>
                                        </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  </main>
)}

      <SiteFooter />
    </div>
  );
}
