"use client";

import Head from "next/head";
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

const POLICY_PAGES = {
  privacy: {
  label: "PRIVACY POLICY",
  title: "개인정보처리방침",
  desc: "대학연합신문은 이용자의 개인정보를 소중히 보호하며, 관련 법령에 따라 안전하게 관리합니다.",
  sections: [
    {
      title: "0. 총칙",
      text: `대학연합신문은 이용자의 개인정보를 중요시하며, 「개인정보 보호법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 개인정보 보호 관련 법령을 준수하고 있습니다.

대학연합신문은 본 개인정보처리방침을 통하여 이용자가 제공하는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보 보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.

본 개인정보처리방침은 관계 법령 및 내부 운영 방침에 따라 변경될 수 있으며, 변경 시 웹사이트 공지사항 또는 개별 안내를 통해 고지합니다.

개인정보처리방침 시행일자: 2026.03.16`,
    },
    {
      title: "1. 수집하는 개인정보의 항목 및 수집방법",
      text: `(1) 수집하는 개인정보의 항목 및 목적

대학연합신문은 서비스 이용, 문의, 제휴, 댓글 작성, 콘텐츠 제보, 이벤트 참여 등 필요한 경우 아래와 같은 개인정보를 수집할 수 있습니다.

[필수항목]
- 문의/신고하기: 이름, 연락처, 이메일, 문의 내용
- 댓글 작성: 이름, 댓글 내용, 작성일시
- 제휴 및 협업 문의: 이름, 소속, 연락처, 이메일, 문의 내용
- 이벤트 지원 및 운영: 이름, 이메일, 연락처

[선택항목]
- 소속 학교, 학과, 직책, 프로필 이미지, SNS 주소, 기타 이용자가 자발적으로 제공한 정보

대학연합신문은 이용자의 사생활을 현저히 침해할 우려가 있는 민감정보를 원칙적으로 수집하지 않습니다.

(2) 개인정보 수집방법

대학연합신문은 다음과 같은 방법으로 개인정보를 수집할 수 있습니다.

- 웹사이트 문의/신고하기
- 댓글 작성
- 이메일 문의
- 제휴 및 콘텐츠 제보
- 이벤트, 캠페인, 서포터즈 신청
- 서비스 이용 과정에서 자동 생성되는 접속기록, 쿠키, IP 정보`,
    },
    {
      title: "2. 개인정보의 보유 및 이용기간",
      text: `대학연합신문은 원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.

단, 관계 법령의 규정에 따라 보존할 필요가 있는 경우에는 아래와 같이 일정 기간 동안 보관할 수 있습니다.

[보유 항목 / 보유 기간 / 법적 근거]

- 계약 또는 청약철회 등에 관한 기록 / 5년 / 전자상거래 등에서의 소비자보호에 관한 법률
- 대금결제 및 재화 등의 공급에 관한 기록 / 5년 / 전자상거래 등에서의 소비자보호에 관한 법률
- 소비자의 불만 또는 분쟁처리에 관한 기록 / 3년 / 전자상거래 등에서의 소비자보호에 관한 법률
- 신용정보의 수집·처리 및 이용 등에 관한 기록 / 3년 / 신용정보의 이용 및 보호에 관한 법률
- 표시·광고에 관한 기록 / 6개월 / 전자상거래 등에서의 소비자보호에 관한 법률
- 이용자의 인터넷 등 로그기록 및 접속지 추적자료 / 3개월 / 통신비밀보호법
- 그 외 통신사실 확인자료 / 12개월 / 통신비밀보호법`,
    },
    {
      title: "3. 개인정보의 파기 절차 및 파기방법",
      text: `(1) 파기절차

이용자의 개인정보는 목적이 달성된 후 별도의 DB 또는 보관 장소로 옮겨져 내부 방침 및 관계 법령에 따라 일정 기간 저장된 후 파기됩니다. 별도 보관된 개인정보는 법률에 의한 경우가 아니면 보관 목적 이외의 다른 목적으로 이용되지 않습니다.

(2) 파기방법

전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다. 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.`,
    },
    {
      title: "4. 수집한 개인정보의 위탁",
      text: `대학연합신문은 원활한 서비스 운영을 위하여 필요한 경우 개인정보 처리 업무의 일부를 외부 전문업체에 위탁할 수 있습니다.

개인정보 처리 위탁 시 개인정보 보호의 안전을 기하기 위하여 개인정보보호 관련 지시 엄수, 개인정보에 대한 비밀 유지, 제3자 제공 금지, 사고 발생 시 책임 부담, 위탁기간 및 처리 종료 후 개인정보의 반환 또는 파기 등을 명확히 규정하고 있습니다.

[수탁 업체 / 위탁 업무 내용]

- 클라우드 및 서버 운영 업체 / 웹사이트 및 데이터 보관 관리
- 이메일 및 문의 시스템 제공 업체 / 문의 접수 및 답변 관리
- 이미지 및 파일 저장 서비스 제공 업체 / 콘텐츠 이미지 및 첨부파일 저장 관리

위탁업체 또는 위탁업무의 내용이 변경될 경우 웹사이트 공지사항 또는 개인정보처리방침을 통해 고지합니다.`,
    },
    {
      title: "5. 제3자에게의 개인정보 제공",
      text: `대학연합신문은 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.

다만, 아래의 경우에는 예외로 합니다.

- 이용자가 사전에 동의한 경우
- 법령의 규정에 의하거나 수사 목적으로 관계기관의 적법한 절차와 방법에 따라 요청이 있는 경우
- 통계 작성, 학술연구, 시장조사를 위하여 특정 개인을 식별할 수 없는 형태로 제공하는 경우
- 서비스 제공에 따른 요금 정산 또는 분쟁 처리를 위해 필요한 경우

대학연합신문은 개인정보를 제3자에게 제공하는 경우 제공받는 자, 제공 목적, 제공 항목, 보유 및 이용기간 등을 사전에 고지하고 동의를 받습니다.`,
    },
    {
      title: "6. 이용자 및 법정대리인의 권리와 그 행사방법",
      text: `이용자 및 법정대리인은 언제든지 등록되어 있는 본인 또는 만 14세 미만 아동의 개인정보에 대해 열람, 정정, 삭제, 처리정지를 요청할 수 있습니다.

개인정보 열람, 정정, 삭제, 처리정지 요청은 이메일 또는 전화로 접수할 수 있으며, 대학연합신문은 지체 없이 필요한 조치를 취합니다.

이용자가 개인정보의 오류에 대한 정정을 요청한 경우에는 정정을 완료하기 전까지 해당 개인정보를 이용하거나 제3자에게 제공하지 않습니다.

대학연합신문은 이용자 또는 법정대리인의 요청에 의해 삭제 또는 처리정지된 개인정보를 관계 법령 및 본 개인정보처리방침에 명시된 바에 따라 처리하고, 그 외의 용도로 열람 또는 이용할 수 없도록 관리합니다.

이용자는 본인의 개인정보를 최신의 상태로 정확하게 입력하여야 하며, 부정확한 정보 입력으로 발생하는 문제의 책임은 이용자 본인에게 있습니다.`,
    },
    {
      title: "7. 개인정보 자동수집 장치의 설치, 운영 및 거부에 관한 사항",
      text: `대학연합신문은 이용자에게 더 나은 서비스를 제공하기 위해 쿠키(cookie) 등 개인정보 자동수집 장치를 사용할 수 있습니다.

(1) 쿠키 사용 목적

- 이용자의 접속 빈도 및 방문 시간 분석
- 이용자의 관심 분야 파악
- 서비스 개선 및 맞춤형 콘텐츠 제공
- 이벤트 참여 정도 및 방문 회수 파악
- 보안 및 부정 이용 방지

(2) 쿠키 설정 거부 방법

이용자는 웹브라우저 설정을 통해 쿠키 저장을 허용하거나 거부할 수 있습니다. 다만 쿠키 저장을 거부할 경우 일부 서비스 이용에 어려움이 있을 수 있습니다.`,
    },
    {
      title: "8. 기타 개인정보 처리에 관한 방침",
      text: `(1) 개인정보 보호를 위한 기술적·관리적 조치

대학연합신문은 이용자의 개인정보가 분실, 도난, 유출, 변조 또는 훼손되지 않도록 안정성 확보를 위해 다음과 같은 조치를 취하고 있습니다.

- 내부 관리계획의 수립 및 시행
- 개인정보 접근 권한의 제한
- 개인정보 처리 직원의 최소화 및 교육
- 접속 기록의 보관 및 위·변조 방지
- 개인정보의 암호화
- 해킹 및 악성코드 등에 대비한 보안 조치
- 개인정보와 일반 데이터의 분리 보관
- 외부 침입에 대비한 보안 시스템 운영

(2) 링크 사이트

대학연합신문은 이용자에게 다른 웹사이트 또는 자료에 대한 링크를 제공할 수 있습니다. 이 경우 대학연합신문은 외부 사이트 및 자료에 대한 통제권이 없으므로 해당 사이트의 개인정보처리방침과 무관합니다. 링크를 통해 외부 사이트로 이동하는 경우 해당 사이트의 정책을 확인하시기 바랍니다.

(3) 게시물 운영 방침

대학연합신문은 이용자의 게시물을 소중하게 생각하며, 변조·훼손·삭제되지 않도록 최선을 다합니다. 다만 다음에 해당하는 게시물은 사전 통보 없이 삭제 또는 이동될 수 있습니다.

- 스팸성 게시물
- 타인을 비방하거나 명예를 훼손하는 게시물
- 동의 없는 개인정보 공개 게시물
- 저작권 등 권리를 침해하는 게시물
- 기타 서비스 운영 목적과 다른 내용의 게시물

(4) 이메일 무단수집 거부

대학연합신문은 게시된 이메일 주소가 전자우편 수집 프로그램이나 그 밖의 기술적 장치를 이용해 무단 수집되는 것을 거부합니다. 이를 위반할 경우 관련 법령에 따라 처벌될 수 있습니다.

(5) 광고성 정보의 전송

대학연합신문은 이용자의 사전 동의를 받은 경우 광고성 정보를 전송할 수 있으며, 관련 법령에 따라 제목 및 본문에 광고성 정보임을 명확히 표시합니다.`,
    },
    {
      title: "9. 개인정보 보호책임자 및 고객서비스 담당부서 등 안내",
      text: `대학연합신문은 이용자의 개인정보를 보호하고 개인정보와 관련한 불만을 처리하기 위하여 아래와 같이 개인정보 보호책임자 및 담당부서를 지정하고 있습니다.

[개인정보 보호책임자 및 개인정보 보호 업무 담당부서]

- 개인정보 보호책임자: 김영일
- 소속: 대학연합신문 편집국
- 전화: 053-765-4765
- 이메일: unnews@daum.net

[기타 기관]

이용자는 대학연합신문의 서비스를 이용하며 발생하는 모든 개인정보보호 관련 민원을 개인정보 보호책임자 또는 담당부서로 신고할 수 있습니다. 기타 개인정보 침해에 대한 신고나 상담이 필요한 경우 아래 기관에 문의할 수 있습니다.

- 개인정보침해신고센터: privacy.kisa.or.kr / 118
- 대검찰청: www.spo.go.kr / 1301
- 경찰청 사이버수사국: cyberbureau.police.go.kr / 182

개인정보처리방침 버전번호: v1.0
개인정보처리방침 시행일자: 2026.03.16`,
    },
  ],
},

  terms: {
  label: "TERMS OF USE",
  title: "이용약관",
  desc: "본 약관은 대학연합신문이 제공하는 인터넷 관련 서비스 이용에 관한 권리, 의무 및 책임사항을 규정합니다.",
  sections: [
    {
      title: "제1장 총칙",
      text: `제1조(목적)

이 약관은 대학연합신문의 미디어사이트인 대학연합신문(https://unnews.vercel.app)에서 제공하는 인터넷 관련 서비스(이하 “대학연합신문”이라 한다)를 이용함에 있어 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.

※ PC통신, 무선 등을 이용하는 전자상거래에 대해서도 그 성질에 반하지 않는 한 이 약관을 준용합니다.`,
    },
    {
      title: "제2조(용어의 정의)",
      text: `① 회사란 “대학연합신문”을 의미하며, 대학연합신문이 콘텐츠 및 서비스를 이용자에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 운영하는 가상의 서비스 공간을 말하고, 아울러 “대학연합신문”을 운영하는 사업자의 의미로도 사용합니다.

② “이용자”란 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.

③ “회원”이라 함은 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사가 제공하는 정보를 지속적으로 받으며, 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.

④ “비회원”이라 함은 회원에 가입하지 않고 회사가 제공하는 서비스를 이용하는 자를 말합니다.

⑤ “ID”란 회원의 식별과 서비스 이용을 위하여 회원이 신청하고 회사가 승인한 이메일을 말합니다.

⑥ “비밀번호”란 회원의 동일성 확인과 회원의 권익 및 비밀보호를 위하여 회원 스스로가 설정하여 등록한 영문 또는 숫자, 특수문자 등의 조합을 말합니다.

⑦ “콘텐츠”란 회사가 제공하는 디지털 콘텐츠를 말합니다.

⑧ 상기 항에 정의되지 않은 용어는 일반적인 상관례에 따릅니다.`,
    },
    {
      title: "제3조(약관 등의 명시와 설명 및 개정)",
      text: `① 대학연합신문은 이 약관의 내용과 상호, 주소, 전화번호, 전자우편주소, 개인정보처리방침, 저작권 정책, 청소년보호정책 등을 이용자가 쉽게 알 수 있도록 초기 서비스화면 또는 연결화면에 게시합니다.

② 대학연합신문은 전자상거래 등에서의 소비자보호에 관한 법률, 약관의 규제에 관한 법률, 전자문서 및 전자거래 기본법, 전자서명법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.

③ 대학연합신문이 약관을 개정할 경우 적용일자 및 개정사유를 명시하여 현행 약관과 함께 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다. 다만 이용자에게 불리하게 약관 내용을 변경하는 경우에는 최소 30일 이상의 사전 유예기간을 두고 공지합니다.

④ 개정된 약관은 적용일자 이후 체결되는 서비스 이용계약에 적용되며, 그 이전에 이미 체결된 계약에 대해서는 개정 전 약관이 적용됩니다. 다만 이용자가 개정약관의 적용을 원하는 뜻을 공지기간 내 회사에 전달하고 회사가 동의한 경우에는 개정약관이 적용됩니다.

⑤ 이 약관에서 정하지 아니한 사항과 해석에 관하여는 관련 법령 및 상관례에 따릅니다.`,
    },
    {
      title: "제2장 회사의 서비스",
      text: `제4조(서비스의 제공 및 변경)

① 대학연합신문은 다음과 같은 업무를 수행합니다.

1. 디지털 콘텐츠 발행
2. 회원 글쓰기 서비스
3. 커뮤니티 서비스
4. 뉴스, 커리어, 취업·공모전, 트렌드 정보 제공
5. 기타 대학연합신문이 정하는 업무

② 대학연합신문은 서비스 변경 또는 기술적 사양 변경 등의 경우 제공할 서비스 내용을 변경할 수 있습니다. 이 경우 변경된 서비스의 내용 및 제공일자를 명시하여 현재의 서비스 내용을 게시한 곳에 즉시 공지합니다.

③ 대학연합신문이 제공하기로 이용자와 계약을 체결한 서비스의 내용을 변경할 경우에는 그 사유를 이용자에게 통지 가능한 이메일 주소로 즉시 통지합니다.

④ 전항의 경우 대학연합신문은 이로 인하여 이용자가 입은 손해를 배상합니다. 다만 대학연합신문이 고의 또는 과실이 없음을 입증하는 경우에는 그러하지 아니합니다.`,
    },
    {
      title: "제5조(서비스의 중단)",
      text: `① 대학연합신문은 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신 두절 등의 사유가 발생한 경우 서비스 제공을 일시적으로 중단할 수 있습니다.

② 대학연합신문은 제1항의 사유로 서비스 제공이 일시적으로 중단됨으로 인하여 이용자 또는 제3자가 입은 손해에 대하여 배상합니다. 단, 대학연합신문이 고의 또는 과실이 없음을 입증하는 경우에는 그러하지 아니합니다.

③ 사업종목의 전환, 사업의 포기, 업체 간 통합 등의 이유로 서비스를 제공할 수 없게 되는 경우 대학연합신문은 이용자에게 통지하고 관련 법령 및 내부 기준에 따라 처리합니다.`,
    },
    {
      title: "제3장 회원관리",
      text: `제6조(회원가입)

① 이용자는 대학연합신문이 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.

② 대학연합신문은 회원가입을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다.

1. 이전에 회원자격을 상실한 적이 있는 경우
2. 등록 내용에 허위, 기재누락, 오기가 있는 경우
3. 기타 회원으로 등록하는 것이 대학연합신문의 기술상 현저히 지장이 있다고 판단되는 경우

③ 회원가입계약의 성립시기는 대학연합신문의 승낙이 회원에게 도달한 시점으로 합니다.

④ 회원은 등록사항에 변경이 있는 경우 즉시 전자우편 기타 방법으로 대학연합신문에 그 변경사항을 알려야 합니다.`,
    },
    {
      title: "제7조(회원 탈퇴 및 자격 상실 등)",
      text: `① 회원은 대학연합신문에 언제든지 탈퇴를 요청할 수 있으며 대학연합신문은 즉시 회원탈퇴를 처리합니다.

② 회원이 다음 각 호의 사유에 해당하는 경우 대학연합신문은 회원자격을 제한 및 정지시킬 수 있습니다.

1. 가입 신청 시 허위 내용을 등록한 경우
2. 대학연합신문 이용과 관련하여 회원이 부담하는 채무를 기일에 지급하지 않는 경우
3. 다른 사람의 대학연합신문 이용을 방해하거나 그 정보를 도용하는 경우
4. 대학연합신문을 이용하여 법령 또는 이 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우
5. 타인에게 아이디 및 비밀번호 등을 공유하여 사용하는 경우

③ 대학연합신문이 회원자격을 제한 또는 정지시킨 후 동일한 행위가 반복되거나 일정 기간 내 사유가 시정되지 아니하는 경우 회원자격을 상실시킬 수 있습니다.

④ 대학연합신문이 회원자격을 상실시키는 경우에는 회원등록을 말소합니다. 이 경우 회원에게 이를 통지하고 소명할 기회를 부여합니다.`,
    },
    {
      title: "제8조(회원에 대한 통지)",
      text: `① 대학연합신문이 회원에 대한 통지를 하는 경우 회원이 지정한 전자우편 주소 또는 전화번호로 할 수 있습니다.

② 대학연합신문은 불특정다수 회원에 대한 통지의 경우 1주일 이상 게시판에 게시함으로써 개별 통지를 대신할 수 있습니다. 다만 회원 본인의 거래 또는 권리와 관련하여 중대한 영향을 미치는 사항에 대해서는 개별 통지를 합니다.`,
    },
    {
      title: "제4장 회사와 이용자의 의무사항",
      text: `제9조(개인정보보호)

① 대학연합신문은 이용자의 정보 수집 시 서비스 제공에 필요한 최소한의 정보를 수집합니다.

필수사항은 다음과 같습니다.

1. 이메일 아이디
2. 이름
3. 연락처
4. 비밀번호
5. 연락 가능한 전자우편주소

② 대학연합신문이 이용자의 개인식별이 가능한 개인정보를 수집하는 때에는 반드시 해당 이용자의 동의를 받습니다.

③ 제공된 개인정보는 이용자의 동의 없이 목적 외 이용이나 제3자에게 제공할 수 없으며, 이에 대한 모든 책임은 대학연합신문이 집니다. 다만 다음의 경우에는 예외로 합니다.

1. 통계작성, 학술연구 또는 시장조사를 위하여 특정 개인을 식별할 수 없는 형태로 제공하는 경우
2. 본인확인 또는 도용방지를 위하여 필요한 경우
3. 법률의 규정 또는 법률에 의하여 필요한 불가피한 사유가 있는 경우

④ 이용자는 언제든지 대학연합신문이 가지고 있는 자신의 개인정보에 대해 열람 및 오류정정을 요구할 수 있으며 대학연합신문은 이에 대해 지체 없이 필요한 조치를 취합니다.

⑤ 대학연합신문은 개인정보 보호를 위하여 관리자를 한정하고 이용자의 개인정보 분실, 도난, 유출, 변조 등으로 인한 손해를 방지하기 위해 필요한 조치를 취합니다.`,
    },
    {
      title: "제10조(회사의 의무)",
      text: `① 대학연합신문은 법령과 이 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며 지속적이고 안정적으로 서비스를 제공하기 위해 최선을 다합니다.

② 대학연합신문은 이용자가 안전하게 인터넷 서비스를 이용할 수 있도록 개인정보 보호를 위한 보안 시스템을 갖추어야 합니다.

③ 대학연합신문은 이용자가 원하지 않는 영리 목적의 광고성 전자우편을 발송하지 않습니다.`,
    },
    {
      title: "제11조(회원의 ID 및 비밀번호에 대한 의무)",
      text: `① ID와 비밀번호에 관한 관리책임은 회원에게 있습니다.

② 회원은 자신의 ID 및 비밀번호를 제3자에게 이용하게 해서는 안 됩니다.

③ 회원이 자신의 ID 및 비밀번호를 도난당하거나 제3자가 사용하고 있음을 인지한 경우에는 즉시 대학연합신문에 통보하고 대학연합신문의 안내가 있는 경우 그에 따라야 합니다.`,
    },
    {
      title: "제12조(이용자의 의무)",
      text: `이용자는 다음 행위를 하여서는 안 됩니다.

1. 신청 또는 변경 시 허위 내용의 등록
2. 타인의 정보 도용
3. 대학연합신문에 게시된 정보의 변경
4. 대학연합신문이 정한 정보 이외의 정보 송신 또는 게시
5. 대학연합신문 또는 제3자의 저작권 등 지적재산권 침해
6. 대학연합신문 또는 제3자의 명예를 손상시키거나 업무를 방해하는 행위
7. 외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 공개 또는 게시하는 행위`,
    },
    {
      title: "제5장 게시물 저작권과 관리 사항",
      text: `제13조(저작권의 귀속 및 이용제한)

① 대학연합신문이 작성한 저작물에 대한 저작권 및 기타 지적재산권은 대학연합신문에 귀속합니다.

② 이용자가 작성한 게시물에 대한 저작권 및 기타 지적재산권은 작성자에게 귀속합니다.

③ 이용자는 대학연합신문을 이용함으로써 얻은 정보 중 대학연합신문에게 지적재산권이 귀속된 정보를 대학연합신문의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법으로 영리 목적에 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.

④ 이용자가 서비스 내에 게시물을 작성하는 경우 해당 게시물은 서비스에 노출될 수 있으며, 필요한 범위 내에서 사용, 저장, 복사, 수정, 배포, 전시, 공중송신 등의 방식으로 이용될 수 있습니다.

⑤ 회원의 게시물이 타인의 저작권을 침해할 경우 회사는 이에 대한 민·형사상 책임을 지지 않습니다. 회원의 저작권 침해 행위로 인해 회사가 손해를 입은 경우 회원은 그 손해를 부담할 수 있습니다.`,
    },
    {
      title: "제14조(게시물의 관리)",
      text: `① 모든 게시물에 대한 책임은 게시한 자에게 있으며 게시물이 전달하는 정보의 신뢰도, 정확성 등에 대해서 회사는 책임지지 않습니다.

② 회원이 직접 삭제한 게시물은 시스템 상에서 삭제되며 회사는 이를 별도로 보관하거나 복구할 책임을 지지 않습니다.

③ 게시물이 아래 각 호에 해당할 경우 회사가 이를 삭제, 이동하거나 등록을 거부할 수 있습니다.

1. 공공질서와 미풍양속을 저해하는 내용
2. 폭력적이거나 저속하고 음란한 내용
3. 불법 복제, 해킹, 기타 현행법을 위반하거나 저촉할 우려가 있는 내용
4. 특정 개인이나 단체를 모욕하거나 명예를 훼손하는 내용
5. 개인신상에 대한 내용으로 타인의 명예나 프라이버시를 침해할 수 있는 내용
6. 타인의 지적재산권, 초상권 등 권리를 침해하는 내용
7. 광고, 홍보, 판촉 등 영리를 목적으로 한 상업적 내용
8. 사적인 정치적 판단이나 종교적 견해로 이용자 간 위화감을 조장하는 내용
9. 서비스 운영 원칙에 어긋나거나 부합하지 않는 내용
10. 동일한 내용을 반복 게시하는 등 다른 이용자의 서비스 이용에 지장을 초래하는 내용
11. 회사의 원활한 서비스 제공을 방해하는 내용
12. 범죄와 결부된다고 객관적으로 인정되는 내용
13. 기타 관계법령에 위배된다고 판단되는 내용`,
    },
    {
      title: "제15조(자료의 보관)",
      text: `① 회원이 서비스를 이용하며 축적한 데이터에 대한 보관 책임은 회원에게 있으며, 무료 서비스의 장애, 제공 중단, 자료 멸실, 삭제, 변조 등으로 인한 손해에 대해서 회사는 원상 복구에 최선을 다할 의무만을 지닙니다.

② 회원이 서비스 이용계약을 해지하였을 경우 회원의 게시물은 삭제될 수 있으며 삭제된 자료는 복구할 수 없습니다.

③ 회사가 약관에 따라 게시물을 삭제하는 경우 삭제된 자료에 대해서 복구할 책임을 지지 않습니다.`,
    },
    {
      title: "제6장 기타",
      text: `제16조(분쟁해결)

① 대학연합신문은 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 처리하기 위하여 필요한 절차를 운영합니다.

② 대학연합신문은 이용자로부터 제출되는 불만사항 및 의견을 우선적으로 처리합니다. 다만 신속한 처리가 곤란한 경우에는 이용자에게 그 사유와 처리일정을 통보합니다.

③ 대학연합신문과 이용자 간에 발생한 분쟁과 관련하여 이용자의 피해구제신청이 있는 경우에는 관련 분쟁조정기관의 조정에 따를 수 있습니다.`,
    },
    {
      title: "제17조(재판권 및 준거법)",
      text: `① 대학연합신문과 이용자 간에 발생한 분쟁에 관한 소송은 관련 법령에 따른 관할 법원에 제기합니다.

② 대학연합신문과 이용자 간에 제기된 소송에는 대한민국 법을 적용합니다.`,
    },
    {
      title: "제18조(법령 및 준용)",
      text: `이 약관에 명시하지 않은 사항은 관련 법령과 회사의 규정 및 기타 상관례에 따릅니다.`,
    },
    {
      title: "제19조(개별약관)",
      text: `① 이 약관은 대학연합신문과 회원 간에 성립되는 서비스 이용계약의 기본약정입니다. 대학연합신문은 필요한 경우 특정 서비스에 관하여 적용될 사항을 정하여 미리 알릴 수 있으며, 회원이 개별약관에 동의하고 특정 서비스를 이용하면 개별약관이 우선 적용됩니다.

② 대학연합신문은 필요한 경우 서비스 이용과 관련된 세부적인 내용을 사이트 등을 통하여 공지할 수 있습니다.`,
    },
    {
      title: "제20조(이메일 무단 수집 거부)",
      text: `본 웹사이트는 게시된 이메일 주소가 전자우편 수집 프로그램이나 그 밖의 기술적 장치를 이용해 무단으로 수집되는 것을 거부하며, 이를 위반할 경우 정보통신망법에 의해 형사처벌될 수 있습니다.`,
    },
    {
      title: "제21조(저작권 정책)",
      text: `대학연합신문의 저작권 정책을 안내합니다.

대학연합신문에서 발행하는 모든 콘텐츠는 저작권법에 의하여 보호받는 저작물로서 저작권은 대학연합신문에 있습니다.

별도의 규정이 없는 한 대학연합신문에서 발행되는 콘텐츠에 대한 무단 복제 및 배포 등 저작권을 침해하는 행위를 금합니다.

대학연합신문에서 발행하는 콘텐츠를 상업적으로 이용하거나 기타 영리 목적으로 이용하고자 하는 경우 사전에 회사와 별도 협의를 하거나 허락을 얻어야 하며, 협의 또는 허락을 얻어 자료의 내용을 게재하는 경우에도 출처가 대학연합신문임을 반드시 밝혀야 합니다.

본 사이트에서 제공하는 콘텐츠를 타 사이트, 블로그, SNS 등에 인터넷 링크하는 것은 허용되나 이 경우에도 출처를 대학연합신문으로 명시하여야 합니다.

위와 관련된 자세한 사항은 unnews@daum.net 으로 문의해 주십시오.

부칙

제1조(시행일) 이 약관은 2026년 3월 16일부터 시행합니다.`,
    },
  ],
},

  copyright: {
  label: "COPYRIGHT POLICY",
  title: "저작권 정책",
  desc: "대학연합신문의 모든 콘텐츠는 저작권법의 보호를 받으며 무단 이용을 금지합니다.",
  sections: [
    {
      title: "제1조(목적)",
      text: `본 정책은 대학연합신문이 제공하는 기사, 사진, 이미지, 영상, 디자인, 로고, 데이터베이스 및 기타 모든 콘텐츠의 저작권 보호와 이용 기준을 규정함을 목적으로 합니다.

대학연합신문은 저작권자의 권리를 보호하고 건전한 콘텐츠 이용 문화를 조성하기 위해 본 정책을 운영합니다.`,
    },

    {
      title: "제2조(저작권의 귀속)",
      text: `대학연합신문에서 제작·배포하는 모든 콘텐츠의 저작권은 대학연합신문 또는 정당한 권리자에게 귀속됩니다.

별도의 저작권 표시가 없는 경우에도 동일하게 보호되며, 대한민국 저작권법 및 국제 저작권 협약에 의해 보호됩니다.

기사, 사진, 삽화, 그래픽, 영상, 편집 디자인, 로고, 데이터베이스 등의 모든 콘텐츠는 저작권자의 사전 동의 없이 사용할 수 없습니다.`,
    },

    {
      title: "제3조(콘텐츠 이용 기준)",
      text: `이용자는 대학연합신문의 콘텐츠를 개인적·비상업적 목적으로 열람할 수 있습니다.

다음 각 호의 행위는 금지됩니다.

① 기사 전문 무단 복제
② 기사 재배포 및 재판매
③ 이미지 및 사진 무단 사용
④ 기사 내용의 왜곡 및 변형
⑤ 상업적 목적의 재가공 및 배포
⑥ 출처 미표기 전재

위 행위는 저작권법에 따라 민형사상 책임이 발생할 수 있습니다.`,
    },

    {
      title: "제4조(인용 및 링크)",
      text: `보도, 교육, 연구, 비평 등을 위한 제한적 인용은 저작권법이 허용하는 범위 내에서 가능합니다.

인용 시 반드시 아래 사항을 준수하여야 합니다.

① 출처 명시
② 기사 제목 표기
③ 대학연합신문 명칭 표기
④ 원문 링크 제공

단순 링크 연결은 허용되나 기사 전문 복제는 허용되지 않습니다.`,
    },

    {
      title: "제5조(저작권 침해 신고)",
      text: `대학연합신문의 콘텐츠가 무단 이용되었거나 제3자의 저작권을 침해하는 콘텐츠가 게시된 경우 신고할 수 있습니다.

신고 접수 시 권리 확인 절차를 거쳐 필요한 조치를 진행합니다.

- 이메일 : unnews@daum.net`,
    },

    {
      title: "제6조(면책조항)",
      text: `대학연합신문은 이용자가 게시한 게시물로 인하여 발생하는 저작권 분쟁에 대하여 법적 책임을 부담하지 않습니다.

다만 권리 침해가 확인될 경우 해당 콘텐츠를 삭제하거나 이용을 제한할 수 있습니다.`,
    },

    {
      title: "부칙",
      text: `본 저작권 정책은 2026년 3월 16일부터 시행합니다.`,
    },
  ],
},

  teen: {
  label: "YOUTH PROTECTION POLICY",
  title: "청소년보호정책",
  desc: "대학연합신문은 청소년이 안전하게 이용할 수 있는 건강한 정보 환경 조성을 위해 노력합니다.",
  sections: [
    {
      title: "제1조(목적)",
      text: `대학연합신문은 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 청소년보호법 등 관계 법령에 따라 청소년을 유해정보로부터 보호하고 건전한 인터넷 이용 환경을 조성하기 위하여 본 정책을 수립·시행합니다.

대학연합신문은 청소년의 올바른 가치관 형성과 건강한 성장을 지원하는 콘텐츠 제공을 지향합니다.`,
    },

    {
      title: "제2조(청소년 보호 원칙)",
      text: `대학연합신문은 청소년에게 유해한 정보가 노출되지 않도록 관리합니다.

다음 원칙을 준수합니다.

① 청소년 유해정보 차단
② 건전한 정보 제공
③ 이용자 신고 시스템 운영
④ 지속적인 모니터링
⑤ 관련 법령 준수`,
    },

    {
      title: "제3조(유해정보로부터의 보호)",
      text: `대학연합신문은 청소년에게 유해한 정보가 게시되지 않도록 운영 정책을 수립하고 관리합니다.

폭력, 음란, 도박, 마약, 범죄 조장, 혐오 표현 등 청소년의 정서와 가치관 형성에 부정적 영향을 줄 수 있는 정보에 대하여 엄격한 운영 기준을 적용합니다.`,
    },

    {
      title: "제4조(콘텐츠 관리 및 운영)",
      text: `대학연합신문은 게시물 및 댓글을 지속적으로 모니터링할 수 있습니다.

다음 각 호의 게시물은 사전 통보 없이 삭제 또는 이용 제한될 수 있습니다.

① 청소년 유해매체물
② 음란·선정적 게시물
③ 폭력 및 범죄 조장 게시물
④ 혐오 및 차별 표현 게시물
⑤ 불법 정보 게시물
⑥ 기타 관계 법령을 위반하는 게시물`,
    },

    {
      title: "제5조(이용자 신고)",
      text: `이용자는 청소년에게 부적절하거나 유해한 콘텐츠를 발견한 경우 신고할 수 있습니다.

접수된 신고는 운영정책에 따라 검토 후 필요한 조치를 진행합니다.

- 신고 이메일 : unnews@daum.net`,
    },

    {
      title: "제6조(청소년보호 책임자)",
      text: `대학연합신문은 청소년 보호 업무를 수행하기 위하여 청소년보호책임자를 지정·운영합니다.

[청소년보호책임자]

- 성명 : 김영일
- 소속 : 대학연합신문 편집국
- 이메일 : unnews@daum.net`,
    },

    {
      title: "부칙",
      text: `본 청소년보호정책은 2026년 3월 16일부터 시행합니다.`,
    },
  ],
},
};

function SiteFooter({ openPolicy }) {
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

              <button
  type="button"
  onClick={() => openPolicy("privacy")}
  className="text-[#4DBBFF] hover:text-[#73CCFF]"
>
  개인정보처리방침
</button>

<span>|</span>

<button
  type="button"
  onClick={() => openPolicy("terms")}
  className="hover:text-white"
>
  이용약관
</button>

<span>|</span>

<button
  type="button"
  onClick={() => openPolicy("copyright")}
  className="hover:text-white"
>
  저작권 정책
</button>

<span>|</span>

<button
  type="button"
  onClick={() => openPolicy("teen")}
  className="hover:text-white"
>
  청소년 보호 정책
</button>

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
  const [policyType, setPolicyType] = useState("privacy");
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
  const [seoTitle, setSeoTitle] = useState("UNNEWS");
const [seoDescription, setSeoDescription] = useState(
  "대학생을 위한 뉴스·트렌드 플랫폼"
);
const [seoImage, setSeoImage] = useState(
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
);
  const [drafts, setDrafts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isSavingPost, setIsSavingPost] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
  const handlePopState = () => {
  const path = window.location.pathname;

  if (path === "/" || path === "") {
    setPage("home");
    setSelectedPost(null);
    setActiveCategory("전체");
    setActiveSubCategory("전체");
    return;
  }

  if (path === "/admin") {
    setPage("admin");
    return;
  }

  setPage("home");
  setSelectedPost(null);
};

  window.addEventListener("popstate", handlePopState);

  return () => {
    window.removeEventListener("popstate", handlePopState);
  };
}, []);

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

    const commentText = Array.isArray(post.comments)
  ? post.comments
      .map((comment) => `${comment.name || ""} ${comment.text || ""}`)
      .join(" ")
  : "";

const blockText = Array.isArray(post.contentBlocks)
  ? post.contentBlocks
      .map((block) =>
        [
          block.value || "",
          block.text || "",
          block.caption || "",
          block.url || "",
        ].join(" ")
      )
      .join(" ")
  : "";

const text = [
  post.title,
  post.summary,
  post.body,
  blockText,
  commentText,
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

const trendingPosts = useMemo(() => {
  return [...allPosts]
    .map((post) => ({
      ...post,
      score:
        (post.views || 0) +
        (post.likes || 0) * 3 +
        ((post.comments?.length || 0) * 5),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}, [allPosts]);

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
  if (isLoadingPosts) return;

  const params = new URLSearchParams(window.location.search);
  const path = window.location.pathname;

  if (params.get("admin") === "1" || path === "/admin") {
    setPage("admin");
    return;
  }

const policyPathMap = {
  "/privacy": "privacy",
  "/terms": "terms",
  "/copyright": "copyright",
  "/teen": "teen",
};

if (policyPathMap[path]) {
  setPolicyType(policyPathMap[path]);
  setPage("policy");
  return;
}

  if (path.startsWith("/news/")) {
    const slug = decodeURIComponent(path.replace("/news/", ""));

    const matchedPost = allPosts.find(
      (post) =>
        post.slug === slug ||
        String(post.id) === slug ||
        createSlug(post.title || "") === slug
    );

    if (matchedPost) {
      setSelectedPost(matchedPost);
      setPage("post");
    }
  }
}, [allPosts, isLoadingPosts]);

useEffect(() => {
  if (!selectedPost) return;

  setSeoTitle(
    `${selectedPost.title} | UNNEWS`
  );

  setSeoDescription(
    selectedPost.summary ||
      fallbackSummary(selectedPost.body || "")
  );

  setSeoImage(
    selectedPost.image ||
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
  );
}, [selectedPost]);

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
      slug: post.slug || createSlug(post.title || `post-${post.id}`),
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
      slug: data.slug || postData.slug || createSlug(data.title || ""),
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
    slug: data.slug || postData.slug || createSlug(data.title || ""),
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

const openPolicy = (type) => {
  setPolicyType(type);
  setPage("policy");

  const pathMap = {
    privacy: "/privacy",
    terms: "/terms",
    copyright: "/copyright",
    teen: "/teen",
  };

  window.history.pushState({}, "", pathMap[type] || "/privacy");

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

  const viewedKey = "unnews_viewed_posts";
  const viewedPosts = JSON.parse(localStorage.getItem(viewedKey) || "[]");
  const postId = String(post.id);

  if (viewedPosts.includes(postId)) {
    return;
  }

  const nextViews = (post.views || 0) + 1;

  localStorage.setItem(viewedKey, JSON.stringify([...viewedPosts, postId]));

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
    await signInWithEmailAndPassword(
      auth,
      adminEmail.trim(),
      adminPassword
    );

    setIsAdmin(true);
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
  <>
    <Head>
      <title>{seoTitle}</title>

      <meta name="description" content={seoDescription} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:type" content="article" />
    </Head>

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
          <section className="mb-2 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
            <div className="relative h-[520px] overflow-hidden rounded-[32px] border border-white/50 bg-neutral-100 shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
  <img
    src={currentHero.image}
    alt={currentHero.title}
    className="absolute inset-0 h-full w-full object-cover"
    onError={(e) => {
      e.currentTarget.src =
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80";
    }}
  />

  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.62),rgba(0,0,0,0.24),rgba(0,0,0,0.10))]" />

  <div className="absolute inset-x-0 bottom-6 p-7 text-white md:bottom-8 md:p-9">
    <span className="mt-2 inline-flex rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
      {getCategory2(currentHero)}
    </span>

    <h1 className="mt-4 max-w-2xl text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.04em] text-white md:text-[2.8rem] line-clamp-3 break-keep">
  {currentHero.title}
</h1>

    <p className="mt-3 max-w-lg text-[13px] leading-5 text-white/90 md:text-[15px] md:leading-6 line-clamp-2">
  {clip(currentHero.body, 80)}
</p>

    <button
  onClick={() => handleOpenPost(currentHero)}
  className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-neutral-900 backdrop-blur transition hover:bg-white"
>
  지금 읽기 →
</button>

    <div className="mt-5 flex gap-2 overflow-x-auto pb-1 md:grid md:grid-cols-3 md:gap-3 md:overflow-visible md:pb-0">
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

    <div className="mt-5 flex gap-3 overflow-x-auto pb-1 md:mt-7 md:grid md:grid-cols-3">
      {heroPosts.map((post, index) => (
        <button
          key={post.id}
          onClick={() => {
            setHeroIndex(index);
            handleOpenPost(post);
          }}
          className={`shrink-0 w-[78%] md:w-auto group rounded-[22px] border px-5 py-3 text-left text-white shadow-[0_10px_24px_rgba(0,0,0,0.10)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 ${
            heroIndex === index
              ? "border-white/45 bg-white/18"
              : "border-white/25 bg-white/10 hover:border-white/35 hover:bg-white/16"
          }`}
        >
          <div className="flex items-center justify-between">
  <span className="text-xs font-semibold text-white/75">
    {getCategory2(post)}
  </span>

  {heroIndex === index && (
    <span className="h-1.5 w-1.5 rounded-full bg-white" />
  )}
</div>


          <div className="mt-2 line-clamp-1 text-[15px] font-semibold leading-6 tracking-[-0.03em]">
            {post.title}
          </div>
        </button>
      ))}
    </div>
  </div>
</div>

            <div className="grid gap-3">
              <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#6D5DFB] via-[#6EA8FF] to-[#7EE7F2] p-6 text-white shadow-[0_14px_34px_rgba(80,120,255,0.16)]">
  <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
  <div className="absolute -bottom-16 left-8 h-44 w-44 rounded-full bg-sky-200/30 blur-3xl" />

  <div className="relative">
    <p className="text-sm font-semibold text-white/90">대학연합신문</p>

    <h2 className="mt-1 text-[2rem] font-black leading-none tracking-[-0.05em]">
      UNNEWS
    </h2>

    <p className="mt-4 text-[15px] leading-6 text-white/92">
      대학연합신문은 대학생에게 필요한 정보를 빠르게 선별하고 정리하는
      큐레이션 기반 디지털 미디어입니다. 실제 대학생의 트렌드·커리어·AI·라이프를
      짧고 현실적인 문장으로 담아내는 매거진형 플랫폼입니다.
    </p>

    <button
      type="button"
      onClick={() => setPage("about")}
      className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[15px] font-bold text-[#3150D4] shadow-[0_12px_30px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:bg-white/95"
    >
      바로가기 →
    </button>
  </div>
</div>

              <div className="rounded-[24px] border border-white/60 bg-white/78 p-5 shadow-[0_14px_36px_rgba(0,0,0,0.05)] backdrop-blur">
                <p className="text-xs font-medium text-neutral-500">바로 보기</p>
                <div className="mt-4 grid grid-cols-3 items-stretch gap-3">
                  <button
                    onClick={() => setPage("category")}
                    className="flex min-h-[132px] flex-col items-center justify-center gap-3 rounded-2xl border border-black/5 bg-neutral-50/90 px-4 py-4 text-center transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:scale-95"
                  >
                    <IconTile>
                      <ShortcutGridIcon />
                    </IconTile>
                    <div className="text-sm font-semibold text-neutral-900">카테고리</div>
                  </button>

                  <button
                    onClick={() => handleOpenPost(currentHero)}
                    className="flex min-h-[132px] flex-col items-center justify-center gap-3 rounded-2xl border border-black/5 bg-neutral-50/90 px-4 py-4 text-center transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:scale-95"
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
                    className="flex min-h-[132px] flex-col items-center justify-center gap-3 rounded-2xl border border-black/5 bg-neutral-50/90 px-4 py-4 text-center transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:scale-95"
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

         <section className="mb-12 mt-8">
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

  <div className="grid gap-5 md:grid-cols-3">
    {featured.slice(0, 3).map((post, index) => (
      <button
        type="button"
        key={post.id}
        onClick={() => handleOpenPost(post)}
        className="group flex h-full flex-col text-left"
      >
        <div className="relative overflow-hidden rounded-[26px] bg-neutral-100 shadow-[0_18px_44px_rgba(0,0,0,0.08)]">
          <img
            src={post.image}
            alt={post.title}
            className="h-[220px] w-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80";
            }}
          />

          <div className="absolute left-4 top-4 rounded-full bg-neutral-950 px-3.5 py-1.5 text-xs font-extrabold text-white shadow-[0_8px_20px_rgba(0,0,0,0.18)]">
            TOP {index + 1}
          </div>

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-4">
            <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
              {getCategory2(post)}
            </span>
          </div>
        </div>

        <div className="mt-3">
          <h3 className="min-h-[56px] line-clamp-2 text-[1.15rem] font-black leading-7 tracking-[-0.04em] text-neutral-900">
            {post.title}
          </h3>

          <p className="mt-2 min-h-[48px] line-clamp-2 text-[14px] leading-6 text-neutral-500">
            {post.summary || post.body}
          </p>

          <div className="mt-auto flex items-center justify-between pt-3 text-xs font-medium text-neutral-400">
            <span>조회 {post.views || 0}</span>
            <span
              onClick={(event) => handleLikePost(post, event)}
              className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-neutral-600 shadow-sm transition hover:bg-neutral-950 hover:text-white"
            >
              ♡ {post.likes || 0}
            </span>
          </div>
        </div>
      </button>
    ))}
  </div>
</section>

          <section>
            <div className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {PRIMARY_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setActiveSubCategory("전체");
                    setPage("category");
                  }}
                  className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition ${
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

      {page === "about" && (
  <main className="mx-auto max-w-[1440px] px-5 py-10 md:px-8">
    <section className="relative overflow-hidden rounded-[36px] text-white shadow-[0_24px_70px_rgba(0,0,0,0.14)]">
      <img
        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80"
        alt="대학생 미디어 플랫폼"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/30 to-black/10" />

      <div className="relative p-10 md:p-14">
        <p className="text-sm font-bold text-white/85">ABOUT UNNEWS</p>

        <h1 className="mt-2 max-w-3xl text-[2.8rem] font-black leading-[1.05] tracking-[-0.06em] text-white md:text-[4rem]">
          대학생의 오늘을 읽고,
          <br />
          내일의 선택을 연결합니다.
        </h1>

        <p className="mt-6 max-w-2xl text-[16px] leading-7 text-white/90">
          대학연합신문은 대학생에게 필요한 뉴스, 커리어, AI, 라이프, 지역 정보를
          빠르게 선별하고 쉽게 전달하는 디지털 미디어 플랫폼입니다.
        </p>

        <p className="mt-3 text-sm font-semibold tracking-[0.2em] text-white/70">
  NEWS · CAREER · AI · LIFE · TREND
</p>

        <button
          type="button"
          onClick={() => setPage("category")}
          className="mt-6 rounded-full bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-neutral-800"
        >
          콘텐츠 둘러보기 →
        </button>
      </div>
    </section>

    <div className="mt-8 flex flex-wrap gap-3">
  {["NEWS", "CAREER", "AI", "LIFE", "TREND"].map((item) => (
    <span
      key={item}
      className="rounded-full bg-[#eef6ff] px-4 py-2 text-sm font-bold text-[#2563eb]"
    >
      {item}
    </span>
  ))}
</div>

    <section className="mt-12 rounded-[32px] bg-white p-8 shadow-[0_18px_44px_rgba(0,0,0,0.04)] md:p-10">
  <p className="text-sm font-bold text-[#4dbbff]">ABOUT UNNEWS</p>

  <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-neutral-900">
    대학연합신문 소개
  </h2>

  <div className="mt-8 grid gap-10 md:grid-cols-[0.85fr_1.15fr]">
    <div>
      <p className="text-[1.65rem] font-black leading-10 tracking-[-0.05em] text-neutral-900">
        대학생의 오늘을 읽고,
        <br />
        내일의 선택을 연결합니다.
      </p>

      <div className="mt-7 grid grid-cols-3 gap-3">
        {[
          { num: "4+", label: "주요 카테고리" },
          { num: "300+", label: "콘텐츠" },
          { num: "10+", label: "대학 네트워크" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white px-4 py-5 text-center shadow-sm"
          >
            <div className="text-2xl font-black text-[#2563eb]">
              {item.num}
            </div>
            <div className="mt-1 text-xs font-bold text-neutral-500">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="space-y-5 text-[17px] leading-8 text-neutral-600">
      <p>
  대학연합신문은 대학생의 관심사와 현실적인 필요를 중심으로 콘텐츠를
  선별하고 정리하는 정보 큐레이션 미디어입니다.
</p>

<p>
  뉴스 전달을 넘어 커리어, AI, 트렌드, 라이프, 지역 정보를 실질적인
  선택에 도움이 되는 콘텐츠로 재구성합니다.
</p>

<p>
  빠르게 소비되고 잊히는 정보가 아니라, 대학생의 행동과 성장으로 이어지는
  콘텐츠를 지향합니다.
</p>
    </div>
  </div>
</section>

    <section className="relative mt-8 overflow-hidden rounded-[32px] bg-gradient-to-br from-[#0F172A] via-[#15345C] to-[#2563EB] p-8 text-white shadow-[0_20px_60px_rgba(37,99,235,0.18)] md:p-10">
      <div className="pointer-events-none absolute -left-24 -top-24 h-[360px] w-[360px] rounded-full bg-[#72E3F1]/20 blur-[110px]" />
<div className="pointer-events-none absolute -right-24 -bottom-24 h-[360px] w-[360px] rounded-full bg-[#5B5CF6]/25 blur-[110px]" />

<div className="relative">
      <p className="text-sm font-bold text-[#72E3F1]">VISION</p>
      <h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">비전</h2>
      <p className="mt-4 max-w-3xl text-[15px] leading-7 text-white/70">
        대학생이 더 나은 선택을 할 수 있도록 교육, 커리어, 지역, 트렌드 정보를
        연결하는 신뢰도 높은 플랫폼으로 성장합니다.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-white/10 bg-white/8 p-6 backdrop-blur transition hover:-translate-y-1 hover:bg-white/12">
          <div className="text-4xl font-black text-[#72E3F1]">01</div>
          <h3 className="mt-5 text-xl font-black">정보를 선별합니다</h3>
          <p className="mt-3 text-sm leading-6 text-white/65">
            대학생에게 필요한 뉴스와 기회를 빠르게 골라냅니다.
          </p>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/8 p-6 backdrop-blur transition hover:-translate-y-1 hover:bg-white/12">
          <div className="text-4xl font-black text-[#72E3F1]">02</div>
          <h3 className="mt-5 text-xl font-black">쉽게 전달합니다</h3>
          <p className="mt-3 text-sm leading-6 text-white/65">
            복잡한 이슈도 짧고 현실적인 문장으로 정리합니다.
          </p>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/8 p-6 backdrop-blur transition hover:-translate-y-1 hover:bg-white/12">
          <div className="text-4xl font-black text-[#72E3F1]">03</div>
          <h3 className="mt-5 text-xl font-black">선택을 연결합니다</h3>
          <p className="mt-3 text-sm leading-6 text-white/65">
            진로, 커리어, 라이프, 지역 정보를 다음 행동으로 연결합니다.
          </p>
        </div>
      </div>
      </div>
    </section>

    <section className="mt-8 rounded-[32px] bg-white p-8 shadow-[0_18px_44px_rgba(0,0,0,0.05)] md:p-10">
      <p className="text-sm font-bold text-[#4dbbff]">CORE VALUE</p>
      <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-neutral-900">
        핵심가치
      </h2>
      <p className="mt-4 max-w-3xl text-[15px] leading-7 text-neutral-600">
        빠른 정보, 쉬운 문장, 실용적 관점, 이미지 중심 전달을 바탕으로 대학생에게
        읽히는 콘텐츠를 만듭니다.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <div className="group rounded-[24px] border border-neutral-200 bg-white p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#4dbbff] hover:shadow-[0_20px_40px_rgba(77,187,255,0.15)]">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#eef6ff] to-white text-[2rem] shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_10px_30px_rgba(77,187,255,0.25)]">
  <span className="text-[#2563eb]">↯</span>
</div>
          <h3 className="mt-4 text-lg font-black transition-colors duration-300 group-hover:text-[#2563eb]">신속한 큐레이션</h3>
          <p className="mt-3 text-[15px] leading-7 text-neutral-600">대학생에게 필요한 정보를 빠르게 선별합니다.</p>
        </div>

        <div className="group rounded-[24px] border border-neutral-200 bg-white p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#4dbbff] hover:shadow-[0_20px_40px_rgba(77,187,255,0.15)]">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#eef6ff] to-white text-[2rem] shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_10px_30px_rgba(77,187,255,0.25)]">
  <span className="text-[#2563eb]">✎</span>
</div>
          <h3 className="mt-4 text-lg font-black transition-colors duration-300 group-hover:text-[#2563eb]">읽기 쉬운 콘텐츠</h3>
          <p className="mt-3 text-[15px] leading-7 text-neutral-600">복잡한 이슈도 쉽게 이해할 수 있도록 전달합니다.</p>
        </div>

        <div className="group rounded-[24px] border border-neutral-200 bg-white p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#4dbbff] hover:shadow-[0_20px_40px_rgba(77,187,255,0.15)]">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#eef6ff] to-white text-[2rem] shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_10px_30px_rgba(77,187,255,0.25)]">
  <span className="text-[#2563eb]">◎</span>
</div>
          <h3 className="mt-4 text-lg font-black transition-colors duration-300 group-hover:text-[#2563eb]">실질적 도움</h3>
          <p className="mt-3 text-[15px] leading-7 text-neutral-600">진로와 성장에 도움이 되는 정보를 제공합니다.</p>
        </div>

        <div className="group rounded-[24px] border border-neutral-200 bg-white p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#4dbbff] hover:shadow-[0_20px_40px_rgba(77,187,255,0.15)]">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#eef6ff] to-white text-[2rem] shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_10px_30px_rgba(77,187,255,0.25)]">
  <span className="text-[#2563eb]">▧</span>
</div>
          <h3 className="mt-4 text-lg font-black transition-colors duration-300 group-hover:text-[#2563eb]">직관적 경험</h3>
          <p className="mt-3 text-[15px] leading-7 text-neutral-600">이미지와 시각 요소로 이해를 돕습니다.</p>
        </div>
      </div>
    </section>

    <section className="mt-8 grid gap-5 md:grid-cols-2">
  <div className="relative min-h-[280px] overflow-hidden rounded-[32px] text-white">
    <img
      src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
      alt=""
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-black/60" />

    <div className="relative z-10 p-8">
      <p className="text-sm font-bold text-[#72E3F1]">PARTICIPATION</p>
      <h2 className="mt-3 text-[2rem] font-black text-white">
        참여안내
      </h2>
      <p className="mt-4 text-[15px] leading-7 text-white/85">
        대학생 기자단, 서포터즈, 캠퍼스 리포터, 콘텐츠 제보 등 다양한 방식으로
        대학연합신문과 함께할 수 있습니다. 실제 대학생의 시선으로 캠퍼스와 사회를
        연결하는 콘텐츠를 만들어갑니다.
      </p>
      <button
        type="button"
        className="mt-6 rounded-full bg-white px-5 py-3 text-sm font-bold text-black transition hover:scale-105"
      >
        참여하기 →
      </button>
    </div>
  </div>

  <div className="relative min-h-[280px] overflow-hidden rounded-[32px] text-white">
    <img
      src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
      alt=""
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-black/60" />

    <div className="relative z-10 p-8">
      <p className="text-sm font-bold text-white/80">CONTACT</p>
      <h2 className="mt-3 text-[2rem] font-black text-white">
        제휴문의
      </h2>
      <p className="mt-4 text-[15px] leading-7 text-white/90">
        대학, 기관, 기업, 브랜드와의 콘텐츠 제휴 및 홍보 협업을 진행합니다.
        대학생 대상 캠페인, 서포터즈 모집, 공모전 홍보, 지역 청년 프로젝트를
        함께 기획할 수 있습니다.
      </p>

      <div className="mt-5 rounded-2xl bg-white/20 p-4 text-sm font-semibold text-white backdrop-blur">
        이메일: unnews@daum.net
        <br />
        전화: 053-765-4765
      </div>
    </div>
  </div>
</section>

<section className="mt-10 overflow-hidden rounded-[32px] bg-gradient-to-br from-[#5B5CF6] via-[#5DA8FF] to-[#72E3F1] p-8 text-white shadow-[0_20px_60px_rgba(80,120,255,0.18)] md:p-10">
  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
    <div>
      <p className="text-sm font-bold text-white/80">UNNEWS</p>
      <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] md:text-4xl">
        대학생의 오늘을 읽고,
        <br />
        내일의 선택을 연결합니다.
      </h2>
      <p className="mt-4 text-[15px] leading-7 text-white/85">
        뉴스, 커리어, AI, 라이프, 트렌드를 대학생의 언어로 전합니다.
      </p>
    </div>

    <div className="flex flex-wrap gap-4">
      <button
        type="button"
        onClick={() => setPage("category")}
        className="rounded-full bg-white px-5 py-3 text-sm font-bold text-[#2563eb] shadow-[0_10px_24px_rgba(255,255,255,0.25)] transition hover:scale-105"
      >
        뉴스 보러가기 →
      </button>
      <button
        type="button"
        className="rounded-full border border-white/40 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
      >
        참여 신청하기 →
      </button>
    </div>
  </div>
</section>

  </main>
)}

{page === "policy" && (
  <main className="mx-auto max-w-[980px] px-5 py-10 md:px-8 md:py-14">
    <button
      type="button"
      onClick={() => {
        setPage("home");
        window.history.pushState({}, "", "/");
      }}
      className="mb-6 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      ← 홈으로
    </button>

    <div className="mb-8 flex flex-wrap gap-2">
  <button
    onClick={() => setPolicyType("privacy")}
    className={`rounded-full px-4 py-2 text-sm font-bold ${
      policyType === "privacy"
        ? "bg-[#0759C8] text-white"
        : "bg-white border border-slate-200"
    }`}
  >
    개인정보처리방침
  </button>

  <button
    onClick={() => setPolicyType("terms")}
    className={`rounded-full px-4 py-2 text-sm font-bold ${
      policyType === "terms"
        ? "bg-[#0759C8] text-white"
        : "bg-white border border-slate-200"
    }`}
  >
    이용약관
  </button>

  <button
    onClick={() => setPolicyType("copyright")}
    className={`rounded-full px-4 py-2 text-sm font-bold ${
      policyType === "copyright"
        ? "bg-[#0759C8] text-white"
        : "bg-white border border-slate-200"
    }`}
  >
    저작권정책
  </button>

  <button
    onClick={() => setPolicyType("teen")}
    className={`rounded-full px-4 py-2 text-sm font-bold ${
      policyType === "teen"
        ? "bg-[#0759C8] text-white"
        : "bg-white border border-slate-200"
    }`}
  >
    청소년보호정책
  </button>
</div>

    <section className="overflow-hidden rounded-[36px] bg-gradient-to-br from-[#2563eb] to-[#4dbbff] p-6 text-white shadow-[0_20px_60px_rgba(37,99,235,0.18)] md:p-8">
      <p className="text-sm font-bold text-white/75">
        {POLICY_PAGES[policyType].label}
      </p>
      <h1 className="mt-3 text-[2.3rem] font-black tracking-[-0.05em] md:text-[3.2rem]">
        {POLICY_PAGES[policyType].title}
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-7 text-white/85">
        {POLICY_PAGES[policyType].desc}
      </p>
    </section>

{policyType === "privacy" && (
  <div className="mb-8 rounded-3xl bg-slate-50 p-6">
    <h3 className="mb-4 font-black">
      목차
    </h3>

    <ul className="space-y-2 text-sm">
      <li>0. 총칙</li>
      <li>1. 수집하는 개인정보 항목 및 수집방법</li>
      <li>2. 개인정보 보유 및 이용기간</li>
      <li>3. 개인정보 파기 절차 및 방법</li>
      <li>4. 수집한 개인정보의 위탁</li>
      <li>5. 제3자에게 개인정보 제공</li>
      <li>6. 이용자 및 법정대리인의 권리</li>
      <li>7. 개인정보 자동수집 장치</li>
      <li>8. 기타 개인정보 처리방침</li>
      <li>9. 개인정보 보호책임자</li>
    </ul>
  </div>
)}

    <section className="mt-8 rounded-[32px] bg-white p-8 shadow-[0_18px_44px_rgba(0,0,0,0.04)] md:p-10">
      <div className="space-y-8">
        {POLICY_PAGES[policyType].sections.map((section) => (
  <div
    key={section.title}
    className="border-b border-black/5 pb-7 last:border-b-0 last:pb-0"
  >
    <h2 className="text-xl font-black tracking-[-0.04em] text-neutral-950">
      {section.title}
    </h2>

    <div className="mt-3 whitespace-pre-line text-[16px] leading-8 text-neutral-600">
      {section.text}
    </div>

    {policyType === "privacy" &&
 section.title === "2. 개인정보의 보유 및 이용기간" && (

<div className="overflow-hidden rounded-xl border border-slate-200 mt-6">
  <table className="w-full text-sm">

    <thead className="bg-slate-100">
      <tr>
        <th className="p-3 text-left">보유항목</th>
        <th className="p-3 text-left">보유기간</th>
        <th className="p-3 text-left">법적근거</th>
      </tr>
    </thead>

    <tbody>
      <tr className="border-t">
        <td className="p-3">계약 및 청약철회</td>
        <td className="p-3">5년</td>
        <td className="p-3">전자상거래법</td>
      </tr>

      <tr className="border-t">
        <td className="p-3">대금결제 기록</td>
        <td className="p-3">5년</td>
        <td className="p-3">전자상거래법</td>
      </tr>

      <tr className="border-t">
        <td className="p-3">접속 로그</td>
        <td className="p-3">3개월</td>
        <td className="p-3">통신비밀보호법</td>
      </tr>
    </tbody>

  </table>
</div>

)}

  </div>
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

    <section className="mb-6">
      <div className="mb-3 flex items-end justify-between">
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
                className="h-[220px] w-full object-cover"
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
  className="group flex items-center gap-5 rounded-[28px] border border-slate-200 bg-white p-4 text-left shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition duration-300 hover:border-slate-300 hover:shadow-lg"
>
  <div className="overflow-hidden rounded-[22px] bg-slate-100">
    <img
      src={post.image}
      alt={post.title}
      className="h-28 w-28 object-cover"
      onError={(e) => {
        e.currentTarget.src =
          "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80";
      }}
    />
  </div>

  <div className="min-w-0 flex-1">
    <span className="rounded-full bg-[#eef6ff] px-2.5 py-1 text-xs font-bold text-[#2563eb]">
      {getCategoryLabel(post)}
    </span>

    <h3 className="mt-3 line-clamp-2 text-[1.12rem] font-black leading-6 tracking-[-0.03em] text-neutral-950">
      {post.title}
    </h3>

    <p className="mt-2 line-clamp-2 text-[14px] leading-6 text-neutral-500">
      {post.summary || post.body}
    </p>
  </div>
</button>
        ))}
      </div>
    </section>
  </main>
)}

      {page === "post" && selectedPost && (
        <main className="mx-auto max-w-[860px] px-5 py-8 md:px-8 md:py-12">
          <button
  type="button"
  onClick={() => {
    setActiveCategory("전체");
    setPage("home");
  }}
  className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
>
  ← 목록으로
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
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
  <div className="flex flex-wrap items-center gap-2">
    <span className="rounded-full bg-[#eef6ff] px-3 py-1.5 text-xs font-bold text-[#2563eb]">
      {getCategoryLabel(selectedPost)}
    </span>

    <span className="text-xs font-medium text-neutral-400">
  {new Date(
    selectedPost.createdAt?.toDate?.()
      ? selectedPost.createdAt.toDate()
      : selectedPost.createdAt
  ).toLocaleDateString("ko-KR")}
</span>

    <span className="text-xs font-medium text-neutral-400">
      ⏱ {selectedPost.readTime}
    </span>

    <span className="text-xs font-medium text-neutral-400">
      👁 조회 {selectedPost.views || 0}
    </span>
  </div>

  <div className="flex items-center gap-2">
  <button
    type="button"
    onClick={(event) => handleLikePost(selectedPost, event)}
    className="rounded-full bg-neutral-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#2563eb]"
  >
    ♡ 좋아요 {selectedPost.likes || 0}
  </button>

  <button
    type="button"
    onClick={() => {
      navigator.clipboard.writeText(window.location.href);
      alert("기사 링크가 복사되었습니다.");
    }}
    className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
  >
    🔗
    <span>공유하기</span>
  </button>
</div>

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

              <h1 className="mt-2 text-[2.4rem] font-black leading-[1.18] tracking-[-0.05em] text-neutral-950 md:text-[3.2rem]">
  {selectedPost.title}
</h1>

<div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-neutral-500">
  <span className="font-bold text-neutral-800">
    대학연합신문 편집부
  </span>

  <span>•</span>

  <span>unnews@daum.net</span>

</div>

              <div className="mt-8 rounded-[24px] border border-[#dbeafe] bg-[#f8fbff] p-6 shadow-[0_12px_30px_rgba(37,99,235,0.06)]">
                <p className="text-xs font-black tracking-[0.16em] text-[#2563eb]">
  ARTICLE SUMMARY
</p>
                <p className="mt-3 whitespace-pre-line text-[16px] leading-8 text-neutral-700">
                  {selectedPost.summary || fallbackSummary(selectedPost.body)}
                </p>
              </div>

              <div className="mt-12 text-[19px] leading-[2.1] tracking-[-0.01em] text-neutral-700">
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
        className="
mt-16
border-l-[6px]
border-[#2563eb]
pl-5
text-[2rem]
font-black
tracking-[-0.04em]
text-neutral-950
"
      >
        {block.value}
      </h2>
    );
  }

  if (block.type === "quote") {
    return (
      <blockquote
        key={index}
        className="my-8 rounded-[24px] border-l-4 border-[#4DBBFF] bg-[#f8fbff] px-6 py-5 text-[18px] font-semibold leading-9 text-blue-900 shadow-[0_12px_30px_rgba(37,99,235,0.06)]"
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

              <div className="mt-14 grid gap-4 border-y border-black/5 py-6 md:grid-cols-2">
  {(() => {
    const posts = visiblePosts.length > 0 ? visiblePosts : drafts;
    const currentIndex = posts.findIndex(
      (post) => String(post.id) === String(selectedPost.id)
    );

    const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
    const nextPost =
      currentIndex >= 0 && currentIndex < posts.length - 1
        ? posts[currentIndex + 1]
        : null;

    return (
      <>
        <button
          type="button"
          disabled={!prevPost}
          onClick={() => prevPost && handleOpenPost(prevPost)}
          className="rounded-[24px] border border-black/5 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(0,0,0,0.06)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <p className="text-xs font-bold text-neutral-400">이전 기사</p>
          <h3 className="mt-2 line-clamp-2 text-[17px] font-black leading-6 text-neutral-950">
            {prevPost ? prevPost.title : "이전 기사가 없습니다"}
          </h3>
        </button>

        <button
          type="button"
          disabled={!nextPost}
          onClick={() => nextPost && handleOpenPost(nextPost)}
          className="rounded-[24px] border border-black/5 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(0,0,0,0.06)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <p className="text-xs font-bold text-[#2563eb]">다음 기사</p>
          <h3 className="mt-2 line-clamp-2 text-[17px] font-black leading-6 text-neutral-950">
            {nextPost ? nextPost.title : "다음 기사가 없습니다"}
          </h3>
        </button>
      </>
    );
  })()}
</div>

              <div className="mt-14 rounded-[32px] border border-slate-200 bg-white p-8">

  <p className="text-xs font-black tracking-[0.2em] text-[#2563eb]">
    EDITOR
  </p>

  <div className="mt-5 flex items-center gap-5">

    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2563eb] text-xl font-black text-white">
      U
    </div>

    <div>
      <h3 className="text-xl font-black text-neutral-950">
        대학연합신문 편집부
      </h3>

      <p className="mt-1 text-sm text-neutral-500">
        뉴스 · 커리어 · AI · 창업 · 라이프
      </p>
    </div>

  </div>

  <div className="mt-6 grid gap-3 border-t border-slate-100 pt-6 md:grid-cols-2">

    <div>
      <p className="text-xs text-neutral-400">
        작성 기사
      </p>

      <p className="font-bold">
        248건
      </p>
    </div>

    <div>
      <p className="text-xs text-neutral-400">
        Contact
      </p>

      <p className="font-bold">
        unnews@daum.net
      </p>
    </div>

  </div>

</div>

<div className="mt-12">
  <div className="mb-5 flex items-end justify-between">
    <div>
      <p className="text-xs font-black tracking-[0.2em] text-[#2563eb]">
        RELATED ARTICLES
      </p>
      <h2 className="mt-2 text-2xl font-black tracking-[-0.05em] text-neutral-950">
        함께 읽으면 좋은 기사
      </h2>
    </div>

    <button
      type="button"
      onClick={() => {
        setActiveCategory("전체");
        setPage("home");
      }}
      className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold text-neutral-700 transition hover:bg-neutral-50"
    >
      전체보기 →
    </button>
  </div>

  <div className="grid gap-4 md:grid-cols-3">
    {(() => {
  const posts = visiblePosts.length > 0 ? visiblePosts : drafts;

  const relatedPosts = posts
    .filter((post) => String(post.id) !== String(selectedPost.id))
    .filter(
      (post) => getCategoryLabel(post) === getCategoryLabel(selectedPost)
    );

  const fallbackPosts = posts
    .filter((post) => String(post.id) !== String(selectedPost.id))
    .filter(
      (post) =>
        !relatedPosts.some(
          (related) => String(related.id) === String(post.id)
        )
    );

  return [...relatedPosts, ...fallbackPosts].slice(0, 3).map((post) => (
    <button
      key={post.id}
      type="button"
      onClick={() => handleOpenPost(post)}
      className="group overflow-hidden rounded-[24px] border border-black/5 bg-white text-left transition hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(0,0,0,0.08)]"
    >
      <img
        src={post.image}
        alt={post.title}
        className="h-[140px] w-full object-cover transition duration-500 group-hover:scale-105"
        onError={(e) => {
          e.currentTarget.src =
            "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80";
        }}
      />

      <div className="p-4">
        <p className="text-xs font-bold text-[#2563eb]">
          {getCategoryLabel(post)}
        </p>
        <h3 className="mt-2 line-clamp-2 text-[16px] font-black leading-6 text-neutral-950">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-500">
          {post.summary || post.body}
        </p>
      </div>
    </button>
  ));
})()}
  </div>
</div>

              <div className="mt-10 border-t border-black/5 pt-7">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
  <div>
    <h2 className="text-[1.4rem] font-black tracking-[-0.04em]">
      댓글 {getCommentsArray(selectedPost).length}
    </h2>

    <p className="mt-1 text-sm text-neutral-400">
      대학생들의 다양한 의견을 나눠보세요.
    </p>
  </div>
</div>

                <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_32px_rgba(0,0,0,0.03)]">
  <div className="grid gap-3 md:grid-cols-[160px_1fr_auto]">
    <input
      value={commentName}
      onChange={(e) => setCommentName(e.target.value)}
      className="rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm outline-none transition focus:border-[#2563eb] focus:bg-white"
      placeholder="이름"
    />

    <input
      value={commentText}
      onChange={(e) => setCommentText(e.target.value)}
      className="rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm outline-none transition focus:border-[#2563eb] focus:bg-white"
      placeholder="댓글을 입력하세요"
    />

    <button
      type="button"
      onClick={handleAddComment}
      disabled={isSavingComment}
      className="rounded-full bg-neutral-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-[#2563eb] disabled:opacity-50"
    >
      {isSavingComment ? "저장 중..." : "등록"}
    </button>
  </div>

  <p className="mt-3 text-xs text-neutral-400">
    건전한 댓글 문화를 위해 비방, 광고성 댓글은 삭제될 수 있습니다.
  </p>
</div>

                <div className="mt-6 space-y-3">
  {getCommentsArray(selectedPost).length === 0 ? (
    <div className="rounded-[22px] border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center text-sm text-neutral-400">
      아직 댓글이 없습니다. 첫 댓글을 남겨보세요.
    </div>
  ) : (
    [...getCommentsArray(selectedPost)].reverse().map((comment) => (
      <div
        key={comment.id}
        className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)]"
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef6ff] font-black text-[#2563eb]"
>
              {comment.name?.slice(0, 1) || "U"}
            </div>

            <div>
              <strong className="block text-sm font-black text-neutral-900">
                {comment.name}
              </strong>
              <span className="text-xs text-neutral-400">
                {new Date(comment.createdAt).toLocaleDateString("ko-KR")}
              </span>
            </div>
          </div>
        </div>

        <p className="text-sm leading-7 text-neutral-600">
          {comment.text}
        </p>
        
        <div className="mt-4 flex items-center gap-4 text-xs text-neutral-400">
  <button
    type="button"
    className="transition hover:text-[#2563eb]"
  >
    👍 공감
  </button>

  <button
    type="button"
    className="transition hover:text-red-500"
  >
    🚨 신고
  </button>
</div>
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

      <SiteFooter openPolicy={openPolicy} />
</div>
</>
);
}
