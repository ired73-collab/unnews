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

import { clip, fallbackSummary, createSlug } from "../utils/text";

import {
  getAutoImage,
  getSuggestionTopic,
  getSmartImageSuggestions,
} from "../utils/image";

import { POLICY_PAGES } from "../data/policies";

import {
  updateBlockById,
  removeBlockById,
  moveBlockById,
  getPlainBodyFromBlocks,
  getCleanContentBlocks,
  insertTextBlockAfter,
  duplicateBlockById,
} from "../utils/editor";

import Link from "next/link";

import { normalizePost } from "../services/postService";

import { uploadImageToCloudinary } from "../services/uploadService";

import SlashMenu from "../components/editor/SlashMenu";

import TextBlockEditor from "../components/editor/TextBlockEditor";

import ImageBlockEditor from "../components/editor/ImageBlockEditor";

import BlockToolbar from "../components/editor/BlockToolbar";

import LinkBlockEditor from "../components/editor/LinkBlockEditor";

import BlockTypeLabel from "../components/editor/BlockTypeLabel";

import DraftRecovery from "../components/editor/DraftRecovery";

const CLOUDINARY_CLOUD_NAME = "dciqqfwdb";
const CLOUDINARY_UPLOAD_PRESET = "unnews_upload";

const COLORS = ["#4F46E5", "#14B8A6", "#F59E0B"];

const ENABLE_APPLICATION_SYSTEM = false;

const CATEGORY_LAYOUTS = {
  "전체": "list",
  "뉴스": "card",
  "커뮤니티": "board",
  "취업/공모전": "gallery",
  "트렌드": "list",
};

const getCategoryLayout = (category, layouts = CATEGORY_LAYOUTS) => {
  return layouts?.[category] || "list";
};

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

            <div className="space-y-1 text-neutral-400">
  <p>사업자번호 : 504-81-47108</p>
  <p>주소 : 대구 남구 현충로 206 3층 (대명동, 신화빌딩)</p>
  <p>전화 : 053-765-4765</p>
  <p>팩스 : 053-767-4766</p>
  <p>이메일 : unnews@daum.net</p>
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
  <Link
    href="/privacy"
    className="text-[#4DBBFF] hover:text-[#73CCFF]"
  >
    개인정보처리방침
  </Link>

  <span>|</span>

  <Link href="/terms" className="hover:text-white">
    이용약관
  </Link>

  <span>|</span>

  <Link href="/copyright" className="hover:text-white">
    저작권 정책
  </Link>

  <span>|</span>

  <Link href="/teen" className="hover:text-white">
    청소년 보호 정책
  </Link>
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
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
const [applyForm, setApplyForm] = useState({
  name: "",
  school: "",
  phone: "",
  email: "",
  type: "기자단",
  message: "",
});
const [applications, setApplications] = useState([]);
const [loadingApplications, setLoadingApplications] = useState(false);
  const [policyType, setPolicyType] = useState("privacy");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminTab, setAdminTab] = useState("dashboard");
  const [categoryLayouts, setCategoryLayouts] = useState({
  "뉴스": "card",
  "커뮤니티": "board",
  "취업/공모전": "gallery",
  "트렌드": "list",
});
const [isSavingLayouts, setIsSavingLayouts] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [activeCategory, setActiveCategory] = useState("전체");
  const [activeSubCategory, setActiveSubCategory] = useState("전체");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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
const [lastSavedAt, setLastSavedAt] = useState(null);
const [autoSaveStatus, setAutoSaveStatus] = useState("");
const [activeSlashBlockId, setActiveSlashBlockId] = useState(null);
const [activeBlockId, setActiveBlockId] = useState(null);
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

const filteredPosts = useMemo(() => {
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


useEffect(() => {
  setCurrentPage(1);
}, [activeCategory, activeSubCategory, searchKeyword]);

const currentLayout = categoryLayouts[activeCategory] || "list";

const postsPerPage =
  currentLayout === "board" ? 10 :
  currentLayout === "gallery" ? 12 :
  currentLayout === "card" ? 9 :
  currentLayout === "magazine" ? 6 :
  currentLayout === "ranking" ? 10 :
  currentLayout === "timeline" ? 8 :
  currentLayout === "masonry" ? 12 :
  8;

const totalPages = Math.max(
  1,
  Math.ceil(filteredPosts.length / postsPerPage)
);

const visiblePosts = useMemo(() => {
  const startIndex = (currentPage - 1) * postsPerPage;

  return filteredPosts.slice(
    startIndex,
    startIndex + postsPerPage
  );
}, [filteredPosts, currentPage, postsPerPage]);

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
  
const currentPolicy =
  POLICY_PAGES?.[policyType] ||
  POLICY_PAGES?.privacy ||
  null;

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
  if (isAdmin) {
    loadApplications();
  }
}, [isAdmin]);

const loadSiteSettings = async () => {
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "category_layouts")
    .single();

  if (error) {
    console.error("Load site settings error:", error);
    return;
  }

  if (data?.value) {
    setCategoryLayouts(data.value);
  }
};

const saveCategoryLayouts = async () => {
  try {
    setIsSavingLayouts(true);

    const { error } = await supabase
      .from("site_settings")
      .upsert({
        key: "category_layouts",
        value: categoryLayouts,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;

    await loadSiteSettings();
alert("스킨 설정이 저장되었습니다.");

  } catch (err) {

    console.error(err);
    alert("저장 실패");

  } finally {

    setIsSavingLayouts(false);

  }
};

  useEffect(() => {
    const loadPosts = async () => {
  try {
    setIsLoadingPosts(true);

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const savedPosts = (data || []).map((post) =>
  normalizePost(post, createSlug(post.title || `post-${post.id}`))
);

    setDrafts(savedPosts);

    console.log("SUPABASE POSTS", savedPosts);

  } catch (error) {
    console.error("Supabase load error:", error);
  } finally {
    setIsLoadingPosts(false);
  }
};

    loadPosts();
    loadSiteSettings();
  }, []);

  useEffect(() => {
    if (page !== "home" || heroPosts.length <= 1) return undefined;

    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroPosts.length);
    }, 4200);

    return () => clearInterval(timer);
  }, [page, heroPosts.length]);

  useEffect(() => {
  if (!page || page !== "admin") return;
  if (!form.title.trim() && !getPlainBodyFromBlocks(contentBlocks)) return;

  setAutoSaveStatus("자동저장 대기 중...");

  const timer = setTimeout(() => {
    const draft = {
      form,
      summary,
      contentBlocks,
      editingId,
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem("unnews_auto_draft", JSON.stringify(draft));
    setLastSavedAt(new Date());
    setAutoSaveStatus("자동저장 완료");
  }, 1200);

  return () => clearTimeout(timer);
}, [page, form, summary, contentBlocks, editingId]);

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

  const handleImageFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;

    try {
      setIsUploading(true);
      const imageUrl = await uploadImageToCloudinary(
  file,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET
);

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
  setContentBlocks((prev) => updateBlockById(prev, blockId, patch));
};

  const removeBlock = (blockId) => {
  setContentBlocks((prev) => removeBlockById(prev, blockId));
};

  const moveBlock = (blockId, direction) => {
  setContentBlocks((prev) => moveBlockById(prev, blockId, direction));
};

const insertTextBlock = (blockId) => {
  setContentBlocks((prev) => insertTextBlockAfter(prev, blockId));
};

const insertImageBlockAfter = (targetBlockId, imageUrl, fileName = "이미지") => {
  const newBlock = {
    id: Date.now() + Math.random(),
    type: "image",
    url: imageUrl,
    caption: "",
    fileName,
  };

  setContentBlocks((prev) => {
    if (!targetBlockId) return [...prev, newBlock];

    const index = prev.findIndex((block) => block.id === targetBlockId);
    if (index < 0) return [...prev, newBlock];

    return [
      ...prev.slice(0, index + 1),
      newBlock,
      ...prev.slice(index + 1),
    ];
  });
};

const applySlashCommand = (blockId, type) => {
  const base =
    type === "image"
      ? { type: "image", url: "", caption: "", value: "" }
      : type === "link"
        ? { type: "link", text: "", url: "", value: "" }
        : { type, value: "" };

  updateBlock(blockId, base);
  setActiveSlashBlockId(null);
};

const duplicateBlock = (blockId) => {
  setContentBlocks((prev) =>
    duplicateBlockById(prev, blockId)
  );
};

  const uploadBlockImage = async (blockId, file) => {
    if (!file || !file.type.startsWith("image/")) return;

    try {
      setUploadingBlockId(blockId);
      const imageUrl = await uploadImageToCloudinary(
  file,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET
);
      updateBlock(blockId, { url: imageUrl, fileName: file.name });
    } catch (error) {
      console.error(error);
      alert("본문 이미지 업로드에 실패했습니다.");
    } finally {
      setUploadingBlockId(null);
    }
  };

  const handlePasteImage = async (e) => {
    
  const items = Array.from(e.clipboardData?.items || []);
  const imageItem = items.find((item) => item.type.startsWith("image/"));

  if (!imageItem) return;

  e.preventDefault();

  const file = imageItem.getAsFile();
  if (!file) return;

  try {
    const imageUrl = await uploadImageToCloudinary(
      file,
      CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_UPLOAD_PRESET
    );

    insertImageBlockAfter(activeBlockId, imageUrl, "붙여넣은 이미지");
  } catch (error) {
    console.error(error);
    alert("붙여넣은 이미지 업로드에 실패했습니다.");
  }
};

const handleDropImage = async (e) => {
  e.preventDefault();
  setIsDragging(false);

  const file = Array.from(e.dataTransfer?.files || []).find((item) =>
    item.type.startsWith("image/")
  );

  if (!file) return;

  try {
    const imageUrl = await uploadImageToCloudinary(
      file,
      CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_UPLOAD_PRESET
    );

    insertImageBlockAfter(activeBlockId, imageUrl, file.name || "드래그 이미지");
  } catch (error) {
    console.error(error);
    alert("드래그한 이미지 업로드에 실패했습니다.");
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

  const restoreAutoDraft = (draft) => {
  if (draft?.form) {
    setForm(draft.form);
  }

  if (typeof draft?.summary === "string") {
    setSummary(draft.summary);
  }

  if (Array.isArray(draft?.contentBlocks) && draft.contentBlocks.length > 0) {
    setContentBlocks(draft.contentBlocks);
  }

  setEditingId(draft?.editingId || null);

  if (draft?.savedAt) {
    setLastSavedAt(new Date(draft.savedAt));
  }

  setAutoSaveStatus("임시저장 글 복구 완료");
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

    const localUpdatedPost = normalizePost(
  data,
  postData.slug || createSlug(data.title || "")
);

    setDrafts((prev) =>
      prev.map((post) => (post.id === editingId ? localUpdatedPost : post))
    );

    setSelectedPost(localUpdatedPost);
localStorage.removeItem("unnews_auto_draft");
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

  const newPost = normalizePost(
  data,
  postData.slug || createSlug(data.title || "")
);

  setDrafts((prev) => [newPost, ...prev]);
localStorage.removeItem("unnews_auto_draft");
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

const handleSubmitApplication = async (e) => {
  e.preventDefault();

  if (!applyForm.name.trim() || !applyForm.email.trim()) {
    alert("이름과 이메일을 입력해주세요.");
    return;
  }

  try {
    setIsSubmittingApplication(true);

    const { error } = await supabase
      .from("applications")
      .insert([
        {
          name: applyForm.name.trim(),
          school: applyForm.school.trim(),
          phone: applyForm.phone.trim(),
          email: applyForm.email.trim(),
          type: applyForm.type,
          message: applyForm.message.trim(),
        },
      ]);

    if (error) throw error;

    alert("참여 신청이 접수되었습니다.");

    setApplyForm({
      name: "",
      school: "",
      phone: "",
      email: "",
      type: "기자단",
      message: "",
    });

    setPage("about");
  } catch (err) {
    console.error(err);
    alert("신청 저장 실패");
  } finally {
    setIsSubmittingApplication(false);
  }
};

const loadApplications = async () => {
  try {
    setLoadingApplications(true);

    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    setApplications(data || []);
  } catch (err) {
    console.error(err);
  } finally {
    setLoadingApplications(false);
  }
};

const updateApplicationStatus = async (id, status) => {
  try {
    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", id);

    if (error) throw error;

    setApplications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  } catch (err) {
    console.error("Update application status error:", err);
    alert("상태 변경에 실패했습니다.");
  }
};

const deleteApplication = async (id) => {
  if (!confirm("이 신청 내역을 삭제하시겠습니까?")) return;

  try {
    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("id", id);

    if (error) throw error;

    setApplications((prev) => prev.filter((item) => item.id !== id));
  } catch (err) {
    console.error("Delete application error:", err);
    alert("삭제에 실패했습니다.");
  }
};

useEffect(() => {
  const handlePopState = () => {
    setPage("home");
    setActiveCategory("전체");
    setActiveSubCategory("전체");
  };

  window.addEventListener("popstate", handlePopState);

  return () => {
    window.removeEventListener("popstate", handlePopState);
  };
}, []);

const handleLikeComment = async (commentId) => {
  if (!selectedPost?.id) return;

  const currentComments = getCommentsArray(selectedPost);

  const nextComments = currentComments.map((comment) =>
    comment.id === commentId
      ? { ...comment, likes: (comment.likes || 0) + 1 }
      : comment
  );

  setSelectedPost((prev) =>
    prev ? { ...prev, comments: nextComments } : prev
  );

  setDrafts((prev) =>
    prev.map((post) =>
      post.id === selectedPost.id ? { ...post, comments: nextComments } : post
    )
  );

  const { error } = await supabase
    .from("posts")
    .update({ comments: nextComments })
    .eq("id", selectedPost.id);

  if (error) {
    console.error("Comment like error:", error);
    alert("공감 저장에 실패했습니다.");
  }
};

const handleReportComment = async (commentId) => {
  if (!selectedPost?.id) return;

  const currentComments = getCommentsArray(selectedPost);

  const nextComments = currentComments.map((comment) =>
    comment.id === commentId
      ? { ...comment, reports: (comment.reports || 0) + 1 }
      : comment
  );

  setSelectedPost((prev) =>
    prev ? { ...prev, comments: nextComments } : prev
  );

  setDrafts((prev) =>
    prev.map((post) =>
      post.id === selectedPost.id ? { ...post, comments: nextComments } : post
    )
  );

  const { error } = await supabase
    .from("posts")
    .update({ comments: nextComments })
    .eq("id", selectedPost.id);

  if (error) {
    console.error("Comment report error:", error);
    alert("신고 저장에 실패했습니다.");
    return;
  }

  alert("신고가 접수되었습니다.");
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

    <div className="mt-5 flex gap-2 overflow-x-auto pb-1 md:hidden">
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

    <div className="mt-4 flex gap-3 overflow-x-auto px-1 pt-3 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mt-7 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pt-0 md:pb-0">
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
            <div className="mb-5 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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

    <section className="mt-12 rounded-[32px] bg-white p-6 md:p-8 shadow-[0_18px_44px_rgba(0,0,0,0.04)] md:p-10">
  <p className="text-sm font-bold text-[#4dbbff]">ABOUT UNNEWS</p>

  <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-neutral-900">
    대학연합신문 소개
  </h2>

  <div className="mt-8 grid gap-10 md:grid-cols-[0.85fr_1.15fr]">
    <div>
      <p className="
  text-[1.2rem]
  font-black
  leading-[1.2]
  tracking-[-0.05em]
  text-neutral-900
  md:text-[1.65rem]
  md:leading-10
">
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
      <p className="text-sm font-bold text-[#4dbbff]">
ACTIVITY
</p>

<h2 className="mt-3 text-[2rem] font-black text-white">
공모전·대외활동
</h2>

<p className="mt-4 text-[15px] leading-7 text-white/85">
  대학생에게 필요한 공모전, 대외활동, 서포터즈 정보를 빠르게 제공합니다.
  <br />
  캠퍼스 밖에서 경험을 쌓고 성장할 수 있는 기회를 소개합니다.
  <br />
  관심 분야별 활동 정보를 한눈에 확인해보세요.
</p>
      <button
  type="button"
  onClick={() => {
  setActiveCategory("취업/공모전");
  setActiveSubCategory("전체");
  setPage("category");
  window.history.pushState({}, "", "/category/career");
}}
  className="mt-6 rounded-full bg-white px-5 py-3 text-sm font-bold text-black"
>
  대외활동 보기 →
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
      {false && (
  <button
    type="button"
    onClick={() => setPage("apply")}
    className="rounded-full border border-white/40 px-5 py-3 text-sm font-bold text-white"
  >
    참여 신청하기 →
  </button>
)}
    </div>
  </div>
</section>

  </main>
)}

{page === "apply" && (
  <main className="mx-auto max-w-[920px] px-5 py-10 md:px-8 md:py-14">
    <button
      type="button"
      onClick={() => setPage("about")}
      className="mb-8 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-neutral-700"
    >
      ← 회사소개로
    </button>

    <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-[0_18px_44px_rgba(0,0,0,0.06)] md:p-8">
      <p className="text-sm font-bold text-[#4dbbff]">APPLICATION</p>
      <h1 className="mt-3 text-[2rem] font-black leading-tight tracking-[-0.06em] text-neutral-950 md:text-[3rem]">
        대학연합신문 참여 신청
      </h1>
      <p className="mt-4 text-[15px] leading-7 text-neutral-500 md:text-base">
        기자단, 서포터즈, 캠퍼스 리포터, 콘텐츠 제보 등 대학연합신문과 함께할 분들의 신청을 받습니다.
      </p>

      <form onSubmit={handleSubmitApplication} className="mt-8 grid gap-4">
        <input
          value={applyForm.name}
          onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
          placeholder="이름"
          className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm outline-none focus:border-[#4dbbff]"
        />

        <input
          value={applyForm.school}
          onChange={(e) => setApplyForm({ ...applyForm, school: e.target.value })}
          placeholder="학교 / 소속"
          className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm outline-none focus:border-[#4dbbff]"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <input
            value={applyForm.phone}
            onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
            placeholder="연락처"
            className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm outline-none focus:border-[#4dbbff]"
          />

          <input
            value={applyForm.email}
            onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
            placeholder="이메일"
            className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm outline-none focus:border-[#4dbbff]"
          />
        </div>

        <select
          value={applyForm.type}
          onChange={(e) => setApplyForm({ ...applyForm, type: e.target.value })}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm outline-none focus:border-[#4dbbff]"
        >
          <option>기자단</option>
          <option>서포터즈</option>
          <option>캠퍼스 리포터</option>
          <option>콘텐츠 제보</option>
          <option>제휴문의</option>
        </select>

        <textarea
          value={applyForm.message}
          onChange={(e) => setApplyForm({ ...applyForm, message: e.target.value })}
          placeholder="지원동기 또는 문의내용을 입력해주세요."
          rows={6}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-7 outline-none focus:border-[#4dbbff]"
        />

        {block.type === "text" && (
  <div className="mt-2 rounded-2xl bg-slate-50 px-4 py-2 text-xs font-medium text-slate-500">
    명령어: <span className="font-bold text-slate-700">/image</span> 이미지 ·{" "}
    <span className="font-bold text-slate-700">/quote</span> 인용 ·{" "}
    <span className="font-bold text-slate-700">/heading</span> 제목 ·{" "}
    <span className="font-bold text-slate-700">/highlight</span> 강조 ·{" "}
    <span className="font-bold text-slate-700">/link</span> 링크
  </div>
)}

        <button
          type="submit"
          disabled={isSubmittingApplication}
          className="mt-2 rounded-full bg-neutral-950 px-6 py-4 text-sm font-bold text-white disabled:opacity-50"
        >
          {isSubmittingApplication ? "접수 중..." : "참여 신청하기"}
        </button>
      </form>
    </section>
  </main>
)}

{page === "policy" && currentPolicy && (
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
    onClick={() => {
  setPolicyType("privacy");
  window.history.pushState({}, "", "/privacy");
}}
    className={`rounded-full px-4 py-2 text-sm font-bold ${
      policyType === "privacy"
        ? "bg-[#0759C8] text-white"
        : "bg-white border border-slate-200"
    }`}
  >
    개인정보처리방침
  </button>

  <button
    onClick={() => {
  setPolicyType("terms");
  window.history.pushState({}, "", "/terms");
}}
    className={`rounded-full px-4 py-2 text-sm font-bold ${
      policyType === "terms"
        ? "bg-[#0759C8] text-white"
        : "bg-white border border-slate-200"
    }`}
  >
    이용약관
  </button>

  <button
    onClick={() => {
  setPolicyType("copyright");
  window.history.pushState({}, "", "/copyright");
}}
    className={`rounded-full px-4 py-2 text-sm font-bold ${
      policyType === "copyright"
        ? "bg-[#0759C8] text-white"
        : "bg-white border border-slate-200"
    }`}
  >
    저작권정책
  </button>

  <button
    onClick={() => {
  setPolicyType("teen");
  window.history.pushState({}, "", "/teen");
}}
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
  {currentPolicy.label}
</p>

<h1 className="mt-3 text-[2.3rem] font-black tracking-[-0.05em] md:text-[3.2rem]">
  {currentPolicy.title}
</h1>

<p className="mt-3 max-w-2xl text-[15px] leading-7 text-white/85">
  {currentPolicy.desc}
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
        {(Array.isArray(currentPolicy.sections)
  ? currentPolicy.sections
  : []
).map((section) => (
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
<div className="mt-4 mb-3 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
  {PRIMARY_CATEGORIES.map((category) => (
    <button
      key={category}
      onClick={() => {
        setActiveCategory(category);
        setActiveSubCategory("전체");
      }}
      className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition ${
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
  <div className="mb-5 flex gap-2 overflow-x-auto pr-4 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
    {["전체", ...(CATEGORY_MAP[activeCategory] || [])].map((subCategory) => (
      <button
        key={subCategory}
        onClick={() => setActiveSubCategory(subCategory)}
        className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition ${
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
{currentLayout === "list" && (
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
      )}

{currentLayout === "card" && (
  <div className="grid gap-6 md:grid-cols-3">
    {visiblePosts.map((post) => (
      <button
        type="button"
        key={post.id}
        onClick={() => handleOpenPost(post)}
        className="group text-left"
      >
        <div className="overflow-hidden rounded-[28px] bg-slate-100">
          <img
            src={post.image}
            alt={post.title}
            className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80";
            }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs font-bold text-[#4dbbff]">
            {getCategoryLabel(post)}
          </span>
          <span className="text-neutral-300">♡</span>
        </div>

        <h3 className="mt-2 line-clamp-2 text-[1.1rem] font-black leading-6 tracking-[-0.04em] text-neutral-950">
          {post.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-500">
          {post.summary || post.body}
        </p>

        <p className="mt-3 text-xs text-neutral-400">
          조회 {post.views || 0}
        </p>
      </button>
    ))}
  </div>
)}

{currentLayout === "board" && (
  <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">
    <div className="hidden grid-cols-[90px_1fr_110px_110px] bg-slate-50 px-5 py-4 text-sm font-bold text-neutral-500 md:grid">
      <div>번호</div>
      <div>제목</div>
      <div className="text-center">조회수</div>
      <div className="text-center">등록일</div>
    </div>

    <div className="divide-y divide-slate-100">
      {visiblePosts.map((post, index) => (
        <button
          type="button"
          key={post.id}
          onClick={() => handleOpenPost(post)}
          className="grid w-full gap-2 px-5 py-4 text-left transition hover:bg-slate-50 md:grid-cols-[90px_1fr_110px_110px] md:items-center"
        >
          <div className="hidden text-sm text-neutral-400 md:block">
            {visiblePosts.length - index}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-[#2563eb]">
                {getCategoryLabel(post)}
              </span>
              <h3 className="line-clamp-1 text-[15px] font-bold text-neutral-950">
                {post.title}
              </h3>
            </div>

            <p className="mt-1 line-clamp-1 text-sm text-neutral-500 md:hidden">
              {post.summary || post.body}
            </p>

            <div className="mt-2 flex gap-3 text-xs text-neutral-400 md:hidden">
              <span>조회 {post.views || 0}</span>
              <span>
                {post.created_at
                  ? new Date(post.created_at).toLocaleDateString()
                  : ""}
              </span>
            </div>
          </div>

          <div className="hidden text-center text-sm text-neutral-500 md:block">
            {post.views || 0}
          </div>

          <div className="hidden text-center text-sm text-neutral-400 md:block">
            {post.created_at
              ? new Date(post.created_at).toLocaleDateString()
              : ""}
          </div>
        </button>
      ))}
    </div>
  </div>
)}

{currentLayout === "magazine" && (
  <div className="grid gap-5 md:grid-cols-2">
    {visiblePosts.map((post, index) => (
      <button
        type="button"
        key={post.id}
        onClick={() => handleOpenPost(post)}
        className={`group overflow-hidden rounded-[28px] border border-slate-200 bg-white text-left transition hover:-translate-y-1 hover:shadow-xl ${
          index === 0 ? "md:col-span-2" : ""
        }`}
      >
        <div className="grid gap-0 md:grid-cols-2">
          <div className="overflow-hidden bg-slate-100">
            <img
              src={post.image}
              alt={post.title}
              className={`w-full object-cover transition duration-500 group-hover:scale-105 ${
                index === 0 ? "h-80" : "h-56"
              }`}
              onError={(e) => {
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80";
              }}
            />
          </div>

          <div className="flex flex-col justify-center p-6">
            <span className="w-fit rounded-full bg-[#eef6ff] px-3 py-1 text-xs font-bold text-[#2563eb]">
              {getCategoryLabel(post)}
            </span>

            <h3 className="mt-4 line-clamp-2 text-[1.35rem] font-black leading-tight tracking-[-0.04em]">
              {post.title}
            </h3>

            <p className="mt-3 line-clamp-3 text-sm leading-7 text-neutral-500">
              {post.summary || post.body}
            </p>

            <p className="mt-5 text-xs font-medium text-neutral-400">
              조회 {post.views || 0}
            </p>
          </div>
        </div>
      </button>
    ))}
  </div>
)}

{currentLayout === "ranking" && (
  <div className="space-y-3">
    {visiblePosts.map((post, index) => (
      <button
        type="button"
        key={post.id}
        onClick={() => handleOpenPost(post)}
        className="group flex w-full items-center gap-4 rounded-[24px] border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-lg font-black text-white">
          {String((currentPage - 1) * postsPerPage + index + 1).padStart(2, "0")}
        </div>

        <div className="h-20 w-28 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80";
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#eef6ff] px-2.5 py-1 text-xs font-bold text-[#2563eb]">
              {getCategoryLabel(post)}
            </span>
            <span className="text-xs text-neutral-400">
              조회 {post.views || 0}
            </span>
          </div>

          <h3 className="mt-2 line-clamp-1 text-[1.05rem] font-black tracking-[-0.04em]">
            {post.title}
          </h3>

          <p className="mt-1 line-clamp-1 text-sm text-neutral-500">
            {post.summary || post.body}
          </p>
        </div>
      </button>
    ))}
  </div>
)}

{currentLayout === "timeline" && (
  <div className="relative space-y-5 pl-5 before:absolute before:left-2 before:top-0 before:h-full before:w-px before:bg-slate-200">
    {visiblePosts.map((post) => (
      <button
        type="button"
        key={post.id}
        onClick={() => handleOpenPost(post)}
        className="group relative w-full rounded-[24px] border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
      >
        <span className="absolute -left-[22px] top-7 h-4 w-4 rounded-full border-4 border-white bg-[#4dbbff] shadow" />

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="h-32 w-full overflow-hidden rounded-2xl bg-slate-100 md:w-48 md:shrink-0">
            <img
              src={post.image}
              alt={post.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80";
              }}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#eef6ff] px-2.5 py-1 text-xs font-bold text-[#2563eb]">
                {getCategoryLabel(post)}
              </span>

              <span className="text-xs text-neutral-400">
                {post.created_at
                  ? new Date(post.created_at).toLocaleDateString()
                  : "UNNEWS"}
              </span>
            </div>

            <h3 className="mt-3 line-clamp-2 text-[1.15rem] font-black leading-6 tracking-[-0.04em]">
              {post.title}
            </h3>

            <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-500">
              {post.summary || post.body}
            </p>
          </div>
        </div>
      </button>
    ))}
  </div>
)}

{currentLayout === "masonry" && (
  <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
    {visiblePosts.map((post, index) => (
      <button
        type="button"
        key={post.id}
        onClick={() => handleOpenPost(post)}
        className="group mb-6 inline-block w-full break-inside-avoid overflow-hidden rounded-[28px] border border-slate-200 bg-white text-left transition hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="overflow-hidden bg-slate-100">
          <img
            src={post.image}
            alt={post.title}
            className={`w-full object-cover transition duration-500 group-hover:scale-105 ${
              index % 3 === 0
                ? "h-72"
                : index % 3 === 1
                ? "h-52"
                : "h-64"
            }`}
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80";
            }}
          />
        </div>

        <div className="p-5">
          <span className="rounded-full bg-[#eef6ff] px-3 py-1 text-xs font-bold text-[#2563eb]">
            {getCategoryLabel(post)}
          </span>

          <h3 className="mt-3 line-clamp-2 text-[1.1rem] font-black leading-6 tracking-[-0.04em] text-neutral-950">
            {post.title}
          </h3>

          <p className="mt-2 line-clamp-3 text-sm leading-6 text-neutral-500">
            {post.summary || post.body}
          </p>

          <p className="mt-4 text-xs text-neutral-400">
            조회 {post.views || 0}
          </p>
        </div>
      </button>
    ))}
  </div>
)}

{currentLayout === "gallery" && (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {visiblePosts.map((post) => (
      <button
        type="button"
        key={post.id}
        onClick={() => handleOpenPost(post)}
        className="group text-left"
      >
        <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-100">
          <img
            src={post.image}
            alt={post.title}
            className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80";
            }}
          />
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold text-white">
            D-{post.dday || "7"}
          </span>
          <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-bold text-white">
            {getCategoryLabel(post)}
          </span>
        </div>

        <h3 className="mt-3 line-clamp-2 text-[1.08rem] font-black leading-6 tracking-[-0.04em] text-neutral-950">
          {post.title}
        </h3>

        <p className="mt-2 line-clamp-1 text-sm text-neutral-500">
          {post.school || post.author || post.category2 || "UNNEWS"}
        </p>
      </button>
    ))}
  </div>
)}

{totalPages > 1 && (
  <div className="mt-10 flex items-center justify-center gap-2">
    <button
      type="button"
      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
      disabled={currentPage === 1}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-bold text-neutral-700 disabled:opacity-30"
    >
      ‹
    </button>

    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        type="button"
        onClick={() => setCurrentPage(page)}
        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition ${
          currentPage === page
            ? "bg-neutral-950 text-white"
            : "bg-white text-neutral-500 hover:bg-neutral-100"
        }`}
      >
        {page}
      </button>
    ))}

    <button
      type="button"
      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
      disabled={currentPage === totalPages}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-bold text-neutral-700 disabled:opacity-30"
    >
      ›
    </button>
  </div>
)}



    </section>
    </div>
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
        mt-10
        border-l-[5px]
        border-[#2563eb]
        pl-4
        text-[1.55rem]
        leading-[1.3]
        font-black
        tracking-[-0.04em]
        text-neutral-950
        md:mt-16
        md:pl-5
        md:text-[2rem]
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

              <div className="mt-14 rounded-[32px] border border-slate-200 bg-white p-5 md:p-8">

  <p className="text-xs font-black tracking-[0.2em] text-[#2563eb]">
    EDITOR
  </p>

  <div className="mt-5 flex items-center gap-4 md:gap-5">

    <div className="flex h-14 w-14 shrink-0 aspect-square items-center justify-center rounded-full bg-[#2563eb] text-lg font-black text-white md:h-16 md:w-16 md:text-xl">
  U
</div>

    <div>
      <h3 className="text-[1.25rem] font-black leading-tight text-neutral-950 md:text-xl">
  대학연합신문
  <br className="md:hidden" />
  <span className="md:ml-1">편집부</span>
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
        {allPosts.length}건
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
  onClick={() => handleLikeComment(comment.id)}
  className="transition hover:text-[#2563eb]"
>
  👍 공감 {comment.likes || 0}
</button>

  <button
  type="button"
  onClick={() => handleReportComment(comment.id)}
  className="transition hover:text-red-500"
>
  🚨 신고 {comment.reports || 0}
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
  { key: "skins", label: "스킨관리" },

  ...(ENABLE_APPLICATION_SYSTEM
    ? [{ key: "applications", label: "신청자관리" }]
    : []),

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

{ENABLE_APPLICATION_SYSTEM && adminTab === "applications" && (
  <section className="mt-8 rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_18px_44px_rgba(0,0,0,0.06)]">
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <p className="text-sm font-bold text-[#4dbbff]">Applications</p>
        <h2 className="mt-2 text-[2rem] font-black tracking-[-0.05em]">
          신청자 관리
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
          참여신청 접수 내역을 확인할 수 있습니다.
        </p>
      </div>

      <button
        type="button"
        onClick={loadApplications}
        className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold"
      >
        새로고침
      </button>
    </div>

    {loadingApplications ? (
      <p className="text-sm text-neutral-500">불러오는 중...</p>
    ) : applications.length === 0 ? (
      <p className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-neutral-500">
        아직 접수된 신청이 없습니다.
      </p>
    ) : (
      <div className="space-y-4">
        {applications.map((item) => (
          <div
            key={item.id}
            className="rounded-[24px] border border-slate-200 bg-white p-5"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <strong className="text-lg text-neutral-950">
                    {item.name}
                  </strong>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#2563eb]">
                    {item.type}
                  </span>
                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-600">
                    {item.status || "접수"}
                  </span>
                </div>

                <p className="mt-2 text-sm text-neutral-500">
                  {item.school || "학교 미입력"}
                </p>
              </div>

              <p className="text-xs text-neutral-400">
                {item.created_at
                  ? new Date(item.created_at).toLocaleString()
                  : ""}
              </p>
            </div>

            <div className="mt-4 grid gap-2 text-sm text-neutral-600 md:grid-cols-2">
              <p>이메일: {item.email}</p>
              <p>연락처: {item.phone || "-"}</p>
            </div>

            {item.message && (
  <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-neutral-600">
    {item.message}
  </p>
)}

<div className="mt-4 flex flex-wrap gap-2">
  {["접수", "검토중", "연락완료", "선정", "보류", "종료"].map((status) => (
    <button
      key={status}
      type="button"
      onClick={() => updateApplicationStatus(item.id, status)}
      className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
        (item.status || "접수") === status
          ? "bg-neutral-950 text-white"
          : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
      }`}
    >
      {status}
    </button>
  ))}

  <button
    type="button"
    onClick={() => deleteApplication(item.id)}
    className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-100"
  >
    삭제
  </button>
</div>
</div>
        ))}
      </div>
    )}
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

{adminTab === "skins" && (
<section className="mt-8 rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-xl">

  <div className="mb-8">
    <p className="text-sm font-semibold text-[#4dbbff]">
      Category Layout
    </p>

    <h2 className="mt-2 text-[2rem] font-black">
      게시판 스킨관리
    </h2>

    <p className="mt-2 text-sm text-neutral-500">
      카테고리별 게시판 레이아웃을 선택할 수 있습니다.
    </p>
  </div>

  <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 md:block">
  <table className="min-w-[720px] w-full">

      <thead className="bg-slate-50">

        <tr>

          <th className="px-5 py-4 text-left">
            카테고리
          </th>

          <th className="px-5 py-4 text-left">
            현재 스킨
          </th>

          <th className="px-5 py-4 text-left">
            변경
          </th>

        </tr>

      </thead>

      <tbody>

        {Object.entries(categoryLayouts).map(
          ([category, layout]) => (

          <tr
            key={category}
            className="border-t"
          >

            <td className="px-5 py-4 font-bold">
              {category}
            </td>

            <td className="px-5 py-4">
  <div className="flex items-center gap-3">
    <div className="h-12 w-16 rounded-xl border border-slate-200 bg-slate-50 p-1">
      {layout === "list" && (
        <div className="space-y-1">
          <div className="h-2 rounded bg-slate-300" />
          <div className="h-2 rounded bg-slate-200" />
          <div className="h-2 rounded bg-slate-200" />
        </div>
      )}

      {layout === "card" && (
        <div className="grid grid-cols-2 gap-1">
          <div className="h-4 rounded bg-slate-300" />
          <div className="h-4 rounded bg-slate-200" />
          <div className="h-4 rounded bg-slate-200" />
          <div className="h-4 rounded bg-slate-300" />
        </div>
      )}

      {layout === "board" && (
        <div className="space-y-1">
          <div className="grid grid-cols-3 gap-1">
            <div className="h-1.5 rounded bg-slate-300" />
            <div className="h-1.5 rounded bg-slate-300" />
            <div className="h-1.5 rounded bg-slate-300" />
          </div>
          <div className="h-1.5 rounded bg-slate-200" />
          <div className="h-1.5 rounded bg-slate-200" />
          <div className="h-1.5 rounded bg-slate-200" />
        </div>
      )}

      {layout === "gallery" && (
        <div className="grid grid-cols-3 gap-1">
          <div className="h-5 rounded bg-slate-300" />
          <div className="h-5 rounded bg-slate-200" />
          <div className="h-5 rounded bg-slate-300" />
        </div>
      )}

      {layout === "magazine" && (
        <div className="grid grid-cols-2 gap-1">
          <div className="h-9 rounded bg-slate-300" />
          <div className="space-y-1">
            <div className="h-2 rounded bg-slate-300" />
            <div className="h-2 rounded bg-slate-200" />
            <div className="h-2 rounded bg-slate-200" />
          </div>
        </div>
      )}

      {layout === "ranking" && (
        <div className="space-y-1">
          <div className="flex gap-1">
            <div className="h-2 w-2 rounded-full bg-slate-400" />
            <div className="h-2 flex-1 rounded bg-slate-300" />
          </div>
          <div className="flex gap-1">
            <div className="h-2 w-2 rounded-full bg-slate-300" />
            <div className="h-2 flex-1 rounded bg-slate-200" />
          </div>
          <div className="flex gap-1">
            <div className="h-2 w-2 rounded-full bg-slate-300" />
            <div className="h-2 flex-1 rounded bg-slate-200" />
          </div>
        </div>
      )}

      {layout === "timeline" && (
        <div className="relative ml-2 space-y-1 border-l border-slate-300 pl-2">
          <div className="h-2 rounded bg-slate-300" />
          <div className="h-2 rounded bg-slate-200" />
          <div className="h-2 rounded bg-slate-200" />
        </div>
      )}

      {layout === "masonry" && (
        <div className="grid grid-cols-3 gap-1">
          <div className="h-7 rounded bg-slate-300" />
          <div className="h-4 rounded bg-slate-200" />
          <div className="h-6 rounded bg-slate-300" />
        </div>
      )}
    </div>

    <span className="font-bold">
      {layout === "list" && "리스트형"}
      {layout === "card" && "카드형"}
      {layout === "board" && "게시판형"}
      {layout === "gallery" && "갤러리형"}
      {layout === "magazine" && "매거진형"}
      {layout === "ranking" && "랭킹형"}
      {layout === "timeline" && "타임라인형"}
      {layout === "masonry" && "메이슨리형"}
    </span>
  </div>
</td>

            <td className="px-5 py-4">

              <select
                value={layout}
                onChange={(e)=>
                  setCategoryLayouts(prev=>({
                    ...prev,
                    [category]:e.target.value
                  }))
                }
                className="rounded-xl border px-4 py-2"
              >

                <option value="list">리스트형</option>

                <option value="card">카드형</option>

                <option value="board">게시판형</option>

                <option value="gallery">갤러리형</option>

                <option value="magazine">매거진형</option>
<option value="ranking">랭킹형</option>
<option value="timeline">타임라인형</option>
<option value="masonry">메이슨리형</option>

              </select>

            </td>

          </tr>

        ))}

            </tbody>

    </table>

  </div>

<div className="space-y-4 md:hidden">
  {Object.entries(categoryLayouts).map(([category, layout]) => (
    <div
      key={category}
      className="rounded-2xl border border-slate-200 bg-white p-4"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-[#4dbbff]">CATEGORY</p>
          <h3 className="mt-1 text-lg font-black">{category}</h3>
        </div>

        <div className="h-12 w-16 rounded-xl border border-slate-200 bg-slate-50 p-1">
          {layout === "list" && (
            <div className="space-y-1">
              <div className="h-2 rounded bg-slate-300" />
              <div className="h-2 rounded bg-slate-200" />
              <div className="h-2 rounded bg-slate-200" />
            </div>
          )}

          {layout === "card" && (
            <div className="grid grid-cols-2 gap-1">
              <div className="h-4 rounded bg-slate-300" />
              <div className="h-4 rounded bg-slate-200" />
              <div className="h-4 rounded bg-slate-200" />
              <div className="h-4 rounded bg-slate-300" />
            </div>
          )}

          {layout === "board" && (
            <div className="space-y-1">
              <div className="grid grid-cols-3 gap-1">
                <div className="h-1.5 rounded bg-slate-300" />
                <div className="h-1.5 rounded bg-slate-300" />
                <div className="h-1.5 rounded bg-slate-300" />
              </div>
              <div className="h-1.5 rounded bg-slate-200" />
              <div className="h-1.5 rounded bg-slate-200" />
              <div className="h-1.5 rounded bg-slate-200" />
            </div>
          )}

          {layout === "gallery" && (
            <div className="grid grid-cols-3 gap-1">
              <div className="h-5 rounded bg-slate-300" />
              <div className="h-5 rounded bg-slate-200" />
              <div className="h-5 rounded bg-slate-300" />
            </div>
          )}

          {layout === "magazine" && (
            <div className="grid grid-cols-2 gap-1">
              <div className="h-9 rounded bg-slate-300" />
              <div className="space-y-1">
                <div className="h-2 rounded bg-slate-300" />
                <div className="h-2 rounded bg-slate-200" />
                <div className="h-2 rounded bg-slate-200" />
              </div>
            </div>
          )}

          {layout === "ranking" && (
            <div className="space-y-1">
              <div className="flex gap-1">
                <div className="h-2 w-2 rounded-full bg-slate-400" />
                <div className="h-2 flex-1 rounded bg-slate-300" />
              </div>
              <div className="flex gap-1">
                <div className="h-2 w-2 rounded-full bg-slate-300" />
                <div className="h-2 flex-1 rounded bg-slate-200" />
              </div>
              <div className="flex gap-1">
                <div className="h-2 w-2 rounded-full bg-slate-300" />
                <div className="h-2 flex-1 rounded bg-slate-200" />
              </div>
            </div>
          )}

          {layout === "timeline" && (
            <div className="relative ml-2 space-y-1 border-l border-slate-300 pl-2">
              <div className="h-2 rounded bg-slate-300" />
              <div className="h-2 rounded bg-slate-200" />
              <div className="h-2 rounded bg-slate-200" />
            </div>
          )}

          {layout === "masonry" && (
            <div className="grid grid-cols-3 gap-1">
              <div className="h-7 rounded bg-slate-300" />
              <div className="h-4 rounded bg-slate-200" />
              <div className="h-6 rounded bg-slate-300" />
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-xs font-bold text-neutral-400">
          게시판 스킨 선택
        </label>

        <select
          value={layout}
          onChange={(e) =>
            setCategoryLayouts((prev) => ({
              ...prev,
              [category]: e.target.value,
            }))
          }
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold"
        >
          <option value="list">리스트형</option>
          <option value="card">카드형</option>
          <option value="board">게시판형</option>
          <option value="gallery">갤러리형</option>
          <option value="magazine">매거진형</option>
          <option value="ranking">랭킹형</option>
          <option value="timeline">타임라인형</option>
          <option value="masonry">메이슨리형</option>
        </select>
      </div>
    </div>
  ))}
</div>

  <div className="mt-6 flex justify-end">
    <button
      type="button"
      onClick={saveCategoryLayouts}
      disabled={isSavingLayouts}
      className="w-full rounded-full bg-neutral-950 px-6 py-3 text-sm font-bold text-white disabled:opacity-50 md:w-auto"
    >
      {isSavingLayouts ? "저장 중..." : "스킨 설정 저장"}
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

    <DraftRecovery
      onRestore={restoreAutoDraft}
      onDiscard={() => {
        setAutoSaveStatus("임시저장 글 삭제");
        setLastSavedAt(null);
      }}
    />

    <div className="space-y-4">
                <div>

                  <div className="flex justify-end">
  <span className="text-xs text-neutral-400">
    {autoSaveStatus}
    {lastSavedAt && (
      <> · {lastSavedAt.toLocaleTimeString()} 저장</>
    )}
  </span>
</div>

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

<div
  className={`space-y-3 rounded-[24px] ${
    isDragging ? "ring-2 ring-blue-400 ring-offset-4" : ""
  }`}
  onPaste={handlePasteImage}
  onDragOver={(e) => {
    e.preventDefault();
    setIsDragging(true);
  }}
  onDragLeave={() => setIsDragging(false)}
  onDrop={handleDropImage}
>
  {contentBlocks.map((block, index) => (
                      <div
  key={block.id}
  onClick={() => setActiveBlockId(block.id)}
  className={`rounded-[20px] border p-4 ${
    activeBlockId === block.id
      ? "border-blue-300 bg-blue-50/40"
      : "border-black/5 bg-neutral-50"
  }`}
>
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <BlockTypeLabel
  block={block}
  index={index}
/>
                          <BlockToolbar
  block={block}
  moveBlock={moveBlock}
  duplicateBlock={duplicateBlock}
  removeBlock={removeBlock}
/>
                        </div>

                        {["text", "heading", "quote", "highlight"].includes(block.type)
  ? (
    <TextBlockEditor
  block={block}
  updateBlock={updateBlock}
  insertTextBlock={insertTextBlock}
  activeSlashBlockId={activeSlashBlockId}
  setActiveSlashBlockId={setActiveSlashBlockId}
  applySlashCommand={applySlashCommand}
/>
) 
: block.type === "link" ? (
  <LinkBlockEditor
    block={block}
    updateBlock={updateBlock}
  />
) : (
  <ImageBlockEditor
    block={block}
    updateBlock={updateBlock}
    uploadBlockImage={uploadBlockImage}
    uploadingBlockId={uploadingBlockId}
  />
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
</>
);
}
