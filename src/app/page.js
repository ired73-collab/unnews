"use client";

import { useEffect, useMemo, useState } from "react";
import { initializeApp, getApp, getApps } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

const CLOUDINARY_CLOUD_NAME = "dciqqfwdb";
const CLOUDINARY_UPLOAD_PRESET = "unnews_upload";

const firebaseConfig = {
  apiKey: "AIzaSyAwyJMVfKR1XguC12QuYyfAVycmEX1f5O0",
  authDomain: "unnews-b0818.firebaseapp.com",
  projectId: "unnews-b0818",
  storageBucket: "unnews-b0818.firebasestorage.app",
  messagingSenderId: "843632495033",
  appId: "1:843632495033:web:97bae4ed05b458c76cce68",
  measurementId: "G-CTGB10GEV3",
};

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

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

const CATEGORY_MAP = {
  뉴스: ["대학뉴스", "교육", "사회", "문화", "지역"],
  커뮤니티: ["캠퍼스", "학생생활", "인터뷰", "칼럼", "제보"],
  "취업/공모전": ["취업", "인턴", "공모전", "대외활동", "창업"],
  트렌드: ["AI", "라이프", "커리어", "소비문화", "콘텐츠"],
};

const PRIMARY_CATEGORIES = ["전체", ...Object.keys(CATEGORY_MAP)];

function getCategory1(post) {
  if (post.category1) return post.category1;
  if (["AI", "라이프", "커리어", "트렌드"].includes(post.category)) return "트렌드";
  return post.category || "트렌드";
}

function getCategory2(post) {
  if (post.category2) return post.category2;
  if (["AI", "라이프", "커리어"].includes(post.category)) return post.category;
  if (post.category === "트렌드") return "콘텐츠";
  return post.category || "콘텐츠";
}

function getCategoryLabel(post) {
  return `${getCategory1(post)} · ${getCategory2(post)}`;
}

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
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-lg font-semibold">UNNEWS</div>
            <div className="mt-2 text-sm text-white/60">대학연합신문 · 이미지 중심 콘텐츠 플랫폼</div>
          </div>

          <div className="flex gap-6 text-sm text-white/70">
            <span className="cursor-pointer hover:text-white">About</span>
            <span className="cursor-pointer hover:text-white">Contact</span>
            <span className="cursor-pointer hover:text-white">Privacy</span>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-xs text-white/40">
          © 2026 UNNEWS. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default function Page() {
  const [page, setPage] = useState("home");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [activeCategory, setActiveCategory] = useState("전체");
  const [activeSubCategory, setActiveSubCategory] = useState("전체");
  const [selectedPost, setSelectedPost] = useState(POSTS[0]);
  const [drafts, setDrafts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isSavingPost, setIsSavingPost] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [heroIndex, setHeroIndex] = useState(0);

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
    { id: Date.now(), type: "text", value: "" },
  ]);
  const [uploadingBlockId, setUploadingBlockId] = useState(null);

  const allPosts = useMemo(() => {
    // 실제 서비스에서는 Firestore에 저장된 글만 노출합니다.
    // Firestore 글이 하나도 없을 때만 기본 예시 글을 보여줍니다.
    return drafts.length > 0 ? drafts : POSTS;
  }, [drafts]);

  const visiblePosts = useMemo(() => {
    if (activeCategory === "전체") return allPosts;

    return allPosts.filter((post) => {
      const matchPrimary = getCategory1(post) === activeCategory;
      const matchSub = activeSubCategory === "전체" || getCategory2(post) === activeSubCategory;
      return matchPrimary && matchSub;
    });
  }, [activeCategory, activeSubCategory, allPosts]);

  const heroPosts = allPosts.slice(0, 3);
  const featured = allPosts.slice(0, 4);
  const latest = allPosts.slice(0, 8);
  const currentHero = heroPosts[heroIndex] || POSTS[0];

  const previewImage = form.uploadedImage
    ? form.uploadedImage
    : form.useAutoImage || !form.image.trim()
      ? getAutoImage(form.category2, `${form.title} ${form.body}`)
      : form.image.trim();

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
        const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(postsQuery);
        const savedPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDrafts(savedPosts);
      } catch (error) {
        console.error("Firestore load error:", error);
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

  const addImageBlock = () => {
    setContentBlocks((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), type: "image", url: "", caption: "" },
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

  const getPlainBodyFromBlocks = (blocks) => {
    const text = blocks
      .filter((block) => block.type === "text")
      .map((block) => block.value || "")
      .join("\n\n")
      .trim();

    return text || form.body.trim();
  };

  const getCleanContentBlocks = () => {
    return contentBlocks
      .map((block) => {
        if (block.type === "text") {
          return { type: "text", value: (block.value || "").trim() };
        }
        return {
          type: "image",
          url: block.url || "",
          caption: (block.caption || "").trim(),
        };
      })
      .filter((block) => {
        if (block.type === "text") return block.value;
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
    setContentBlocks([{ id: Date.now(), type: "text", value: "" }]);
  };

  const submitDraft = async () => {
    const cleanBlocks = getCleanContentBlocks();
    const plainBody = getPlainBodyFromBlocks(contentBlocks);

    if (!form.title.trim() || !plainBody || isSavingPost) return;

    const resolvedImage = form.uploadedImage
      ? form.uploadedImage
      : form.image.trim()
        ? form.image.trim()
        : getAutoImage(form.category2, `${form.title} ${plainBody}`);

    const resolvedSummary = summary.trim() || fallbackSummary(plainBody);

    const postData = {
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
        const updatedPostData = {
          ...postData,
          updatedAt: serverTimestamp(),
        };

        await updateDoc(doc(db, "posts", editingId), updatedPostData);

        const localUpdatedPost = {
          id: editingId,
          ...postData,
          updatedAt: new Date().toISOString(),
        };

        setDrafts((prev) =>
          prev.map((post) => (post.id === editingId ? localUpdatedPost : post))
        );
        setSelectedPost(localUpdatedPost);
        resetForm();
        setPage("post");
        return;
      }

      const newPostData = {
        ...postData,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "posts"), newPostData);
      const newPost = {
        id: docRef.id,
        ...postData,
        createdAt: new Date().toISOString(),
      };

      setDrafts((prev) => [newPost, ...prev]);
      resetForm();
      setSelectedPost(newPost);
      setPage("post");
    } catch (error) {
      console.error("Firestore save/update error:", error);
      alert("글 저장에 실패했습니다. Firestore 보안 규칙과 Firebase 설정을 확인해주세요.");
    } finally {
      setIsSavingPost(false);
    }
  };

  const handleEditPost = (post) => {
    if (!post || typeof post.id === "number") {
      alert("기본 예시 글은 수정할 수 없습니다. Firestore에 저장된 글만 수정됩니다.");
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
    setSummary(post.summary || fallbackSummary(post.body || ""));
    setContentBlocks(
      Array.isArray(post.contentBlocks) && post.contentBlocks.length > 0
        ? post.contentBlocks.map((block, index) => ({
            id: Date.now() + index,
            type: block.type,
            value: block.value || "",
            url: block.url || "",
            caption: block.caption || "",
          }))
        : [{ id: Date.now(), type: "text", value: post.body || "" }]
    );
    setPage("admin");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeletePost = async (postId) => {
    if (!postId || typeof postId === "number") {
      alert("기본 예시 글은 삭제할 수 없습니다. Firestore에 저장된 글만 삭제됩니다.");
      return;
    }

    if (!confirm("정말 이 글을 삭제할까요?")) return;

    try {
      await deleteDoc(doc(db, "posts", postId));
      setDrafts((prev) => prev.filter((post) => post.id !== postId));
      if (selectedPost?.id === postId) {
        setSelectedPost(POSTS[0]);
        setPage("home");
      }
    } catch (error) {
      console.error("Firestore delete error:", error);
      alert("글 삭제에 실패했습니다. Firestore 보안 규칙을 확인해주세요.");
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
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 md:px-8">
          <button
            onClick={() => {
              setActiveCategory("전체");
              setPage("home");
            }}
            className="flex items-center gap-3"
          >
            <div className="rounded-2xl bg-neutral-950 px-3.5 py-1.5 text-sm font-semibold tracking-[-0.02em] text-white shadow-[0_8px_18px_rgba(0,0,0,0.18)]">
              UNNEWS
            </div>
            <span className="hidden text-sm text-neutral-500 md:block">대학연합신문</span>
          </button>

          <nav className="hidden items-center gap-5 md:flex">
            {PRIMARY_CATEGORIES.slice(1).map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActiveCategory(item);
                  setActiveSubCategory("전체");
                  setPage("category");
                }}
                className="text-sm font-medium text-neutral-500 hover:text-neutral-900"
              >
                {item}
              </button>
            ))}

            <button
              onClick={() => setPage("admin")}
              className="rounded-full border border-black/10 px-4 py-2 text-sm text-neutral-700"
            >
              {isAuthChecking ? "Checking..." : isAdmin ? "Admin" : "Admin Login"}
            </button>
          </nav>
        </div>
      </header>

      {page === "home" && (
        <main className="mx-auto max-w-[1440px] px-5 py-8 md:px-8 md:py-10">
          <section className="mb-10 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
            <div className="relative overflow-hidden rounded-[32px] border border-white/50 bg-white/70 shadow-[0_24px_70px_rgba(0,0,0,0.08)] backdrop-blur">
              <img
                src={currentHero.image}
                alt={currentHero.title}
                className="block h-[520px] w-full object-cover transition duration-700"
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
                  onClick={() => {
                    setSelectedPost(currentHero);
                    setPage("post");
                  }}
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
                        setSelectedPost(post);
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
                  대학내일처럼 부드럽고 가볍게 읽히지만, 실제 대학생의 트렌드·커리어·AI·라이프를 짧고 현실적인 문장으로 담아내는 매거진형 플랫폼입니다.
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
                    onClick={() => {
                      setSelectedPost(currentHero);
                      setPage("post");
                    }}
                    className="flex min-h-[148px] flex-col items-center justify-center gap-3 rounded-2xl border border-black/5 bg-neutral-50/90 px-4 py-4 text-center transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:scale-95"
                  >
                    <IconTile>
                      <ShortcutArticleIcon />
                    </IconTile>
                    <div className="text-sm font-semibold text-neutral-900">글 상세</div>
                  </button>

                  <button
                    onClick={() => setPage("admin")}
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

          <section className="mb-10">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500">Featured</p>
                <h2 className="text-[1.8rem] font-semibold tracking-[-0.04em]">
                  인기 콘텐츠
                </h2>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {featured.map((post) => (
                <button
                  type="button"
                  key={post.id}
                  onClick={() => {
                    setSelectedPost(post);
                    setPage("post");
                  }}
                  className="group relative overflow-hidden rounded-[28px] border border-white/50 text-left shadow-[0_24px_60px_rgba(0,0,0,0.08)]"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-[320px] w-full object-cover transition duration-500 group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <span className="text-xs opacity-80">{getCategory2(post)}</span>
                    <h3 className="mt-1 text-[1.08rem] font-semibold leading-6 tracking-[-0.03em]">
                      {post.title}
                    </h3>
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
                      ? "bg-neutral-950 text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)]"
                      : "border border-black/5 bg-white/80 text-neutral-600 backdrop-blur hover:bg-white"
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
                  onClick={() => {
                    setSelectedPost(post);
                    setPage("post");
                  }}
                  className="flex items-center gap-4 rounded-[24px] border border-white/60 bg-white/78 p-3.5 text-left shadow-[0_16px_42px_rgba(0,0,0,0.06)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(0,0,0,0.08)]"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-24 w-24 rounded-[18px] object-cover md:h-28 md:w-28"
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
                    ? "bg-neutral-950 text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)]"
                    : "border border-black/5 bg-white/80 text-neutral-600 backdrop-blur hover:bg-white"
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
                      : "border border-black/5 bg-white/80 text-neutral-500 hover:bg-white"
                  }`}
                >
                  {subCategory}
                </button>
              ))}
            </div>
          )}

          <div className="grid gap-5 xl:grid-cols-2">
            {visiblePosts.map((post) => (
              <button
                type="button"
                key={post.id}
                onClick={() => {
                  setSelectedPost(post);
                  setPage("post");
                }}
                className="flex items-center gap-4 rounded-[24px] border border-white/60 bg-white/78 p-3.5 text-left shadow-[0_16px_42px_rgba(0,0,0,0.06)] backdrop-blur transition hover:-translate-y-1"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-24 w-24 rounded-[18px] object-cover md:h-28 md:w-28"
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
        </main>
      )}

      {page === "post" && (
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
              className="h-[320px] w-full object-cover"
            />

            <div className="p-7 md:p-9">
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-500">
                  {getCategoryLabel(selectedPost)}
                </span>
                <span className="text-xs text-neutral-400">{selectedPost.readTime}</span>
              </div>

              {isAdmin && typeof selectedPost.id !== "number" && (
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
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">Admin</p>
              <h1 className="text-[2.3rem] font-semibold leading-[1.08] tracking-[-0.045em]">
                {editingId ? "콘텐츠 수정" : "콘텐츠 관리"}
              </h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage("home")}
                className="rounded-full border border-black/10 bg-white/90 px-4 py-2 text-sm text-neutral-700"
              >
                사이트로 이동
              </button>
              <button
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
                      alt="미리보기 이미지"
                      className="h-48 w-full object-cover"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <label className="block text-sm font-medium text-neutral-600">
                        본문 블록 편집
                      </label>
                      <p className="mt-1 text-xs text-neutral-400">
                        텍스트와 이미지를 원하는 순서로 추가할 수 있습니다.
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={addTextBlock}
                        className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                      >
                        + 텍스트
                      </button>
                      <button
                        type="button"
                        onClick={addImageBlock}
                        className="rounded-full bg-neutral-950 px-3 py-1.5 text-xs font-semibold text-white"
                      >
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
                            {index + 1}. {block.type === "text" ? "텍스트" : "이미지"}
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

                        {block.type === "text" ? (
                          <textarea
                            value={block.value || ""}
                            onChange={(e) => {
                              updateBlock(block.id, { value: e.target.value });
                              setForm((prev) => ({ ...prev, body: getPlainBodyFromBlocks(contentBlocks) }));
                            }}
                            rows={5}
                            className="w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm leading-7 outline-none"
                            placeholder="텍스트를 입력하세요"
                          />
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
                        : "Firestore에 저장 중..."
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
        </main>
      )}

      <SiteFooter />
    </div>
  );
}
