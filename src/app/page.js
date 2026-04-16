'use client';

import { useEffect, useMemo, useState } from 'react';

const POSTS = [
  {
    id: 1,
    title: 'AI 공부, 이렇게 시작함',
    body: '요즘 대학생들은 AI를 ‘배워야 하는 기술’보다 ‘바로 써보는 도구’로 먼저 받아들이는 경우가 많습니다. 복잡한 강의부터 듣기보다, 과제 정리나 아이디어 확장처럼 당장 필요한 일에 작게 써보면서 감을 익힙니다. 결국 중요한 건 많이 아는 것보다, 내 공부 방식 안에 자연스럽게 넣는 것입니다.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    category: 'AI',
    readTime: '1분 읽기'
  },
  {
    id: 2,
    title: '포폴 감각, 여기서 갈림',
    body: '포트폴리오는 많이 보여주는 것보다 ‘무엇을 남길지’ 정하는 감각이 더 중요합니다. 요즘은 결과물 자체보다 문제를 어떻게 풀었는지, 어떤 흐름으로 생각했는지가 더 잘 읽힙니다. 화려하게 꾸미기보다, 한 장 한 장이 자연스럽게 연결되는 편이 훨씬 설득력 있습니다.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    category: '커리어',
    readTime: '1분 읽기'
  },
  {
    id: 3,
    title: '캠퍼스 루틴, 가볍게',
    body: '빡빡한 계획표보다 오래 가는 작은 루틴이 더 중요해졌습니다. 아침 수업 전 10분 정리, 공강 시간 메모, 자기 전 내일 일정 확인처럼 부담 없는 습관이 하루를 훨씬 덜 흔들리게 만듭니다. 무리해서 잘하는 것보다, 무너지지 않는 흐름을 만드는 쪽이 현실적입니다.',
    image: 'https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?auto=format&fit=crop&w=1200&q=80',
    category: '라이프',
    readTime: '1분 읽기'
  },
  {
    id: 4,
    title: '요즘 소비 트렌드',
    body: '요즘 소비는 단순히 싸고 좋은 것을 찾는 방식에서 조금 달라졌습니다. 가격만 따지기보다, 그 브랜드의 분위기와 경험, 나와 얼마나 잘 맞는지를 함께 봅니다. 결국 소비는 물건을 사는 일이 아니라 내 취향을 보여주는 방식이 되고 있습니다.',
    image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80',
    category: '트렌드',
    readTime: '1분 읽기'
  },
  {
    id: 5,
    title: '과제 스트레스 줄이는 습관',
    body: '과제 스트레스는 분량보다 ‘막막함’에서 시작되는 경우가 많습니다. 그래서 요즘은 한 번에 끝내려 하기보다, 자료 찾기·구조 잡기·문장 정리처럼 단계를 잘게 나누는 방식이 더 효과적입니다. 작게 나누면 부담이 줄고, 시작 속도도 확실히 빨라집니다.',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    category: '라이프',
    readTime: '1분 읽기'
  },
  {
    id: 6,
    title: 'AI 과제 활용 기준',
    body: 'AI를 과제에 활용할 때 가장 중요한 것은 ‘편하게 쓰는 것’이 아니라 ‘어디까지 맡길지 아는 것’입니다. 초안 정리나 아이디어 확장에는 도움이 되지만, 그대로 가져오면 내 생각이 빠지기 쉽습니다. 결국 완성도를 결정하는 건 AI가 아니라 마지막에 손보는 내 기준입니다.',
    image: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1200&q=80',
    category: 'AI',
    readTime: '1분 읽기'
  },
  {
    id: 7,
    title: '취준, 이게 현실',
    body: '취업 준비가 힘든 이유는 정보가 없어서가 아니라, 정보가 너무 많아서입니다. 스펙, 자소서, 인턴, 자격증, 면접 준비까지 다 중요해 보이니 기준이 흐려집니다. 그래서 요즘 취준은 더 열심히 하는 것보다, 무엇을 먼저 할지 정리하는 힘이 더 중요해졌습니다.',
    image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80',
    category: '커리어',
    readTime: '1분 읽기'
  },
  {
    id: 8,
    title: '콘텐츠, 짧아야 봄',
    body: '긴 글을 끝까지 읽는 일은 점점 어려워지고 있습니다. 대신 핵심이 빨리 보이고, 한 장면 안에 분위기와 메시지가 함께 담긴 콘텐츠가 더 잘 읽힙니다. 요즘 콘텐츠는 더 많이 설명하는 것보다, 더 빨리 이해되는 구조가 중요합니다.',
    image: 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1200&q=80',
    category: '트렌드',
    readTime: '1분 읽기'
  },
  {
    id: 9,
    title: '대외활동, 이렇게 고름',
    body: '대외활동은 많이 하는 것이 꼭 좋은 결과로 이어지지 않습니다. 지금 나에게 필요한 경험인지, 끝나고 무엇이 남는지, 내 이야기로 정리할 수 있는지를 함께 봐야 합니다. 이름이 유명한 활동보다, 나와 잘 맞는 활동 하나가 훨씬 오래 갑니다.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    category: '커리어',
    readTime: '1분 읽기'
  },
  {
    id: 10,
    title: '혼자 있는 시간이 중요해짐',
    body: '예전보다 혼자 보내는 시간을 더 소중하게 여기는 학생들이 많아졌습니다. 사람을 피해서라기보다, 혼자 있는 시간이 있어야 생각이 정리되고 감정도 회복되기 때문입니다. 바쁜 일상 속에서도 나만의 속도를 되찾는 시간이 점점 더 중요해지고 있습니다.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    category: '라이프',
    readTime: '1분 읽기'
  },
  {
    id: 11,
    title: '브랜드는 설명보다 분위기',
    body: '요즘 브랜드는 자신을 길게 설명하지 않습니다. 대신 색감, 사진, 문장 톤, 작은 디테일로 ‘어떤 느낌인지’를 먼저 보여줍니다. 결국 기억에 남는 브랜드는 정보를 많이 준 곳보다, 분위기를 자연스럽게 남긴 곳일 때가 많습니다.',
    image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
    category: '트렌드',
    readTime: '1분 읽기'
  },
  {
    id: 12,
    title: '생산성, 덜 하고 잘하기',
    body: '생산성은 더 많은 일을 해내는 능력처럼 보이지만, 실제로는 덜 중요한 일을 줄이는 감각에 더 가깝습니다. 요즘은 AI나 자동화 도구를 활용해 반복 작업을 줄이고, 내가 직접 판단해야 하는 일에 집중하는 방식이 더 현실적입니다. 결국 중요한 건 속도보다 에너지 배분입니다.',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    category: 'AI',
    readTime: '1분 읽기'
  }
];

const CATEGORIES = ['전체', '트렌드', '커리어', 'AI', '라이프'];

function clip(text, max = 130) {
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

function IconTile({ children }) {
  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111827' }}>{children}</div>;
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
    <footer style={{ marginTop: 64, background: '#000', color: '#fff' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>UNNEWS</div>
            <div style={{ marginTop: 8, fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>대학연합신문 · 이미지 중심 콘텐츠 플랫폼</div>
          </div>
          <div style={{ display: 'flex', gap: 24, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
            <span>About</span>
            <span>Contact</span>
            <span>Privacy</span>
          </div>
        </div>
        <div style={{ marginTop: 32, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
          © 2026 UNNEWS. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function softCardStyle(extra = {}) {
  return {
    background: 'rgba(255,255,255,0.78)',
    border: '1px solid rgba(255,255,255,0.6)',
    borderRadius: 24,
    boxShadow: '0 14px 36px rgba(0,0,0,0.05)',
    backdropFilter: 'blur(10px)',
    ...extra
  };
}

export default function Page() {
  const [page, setPage] = useState('home');
  const [activeCategory, setActiveCategory] = useState('전체');
  const [selectedPost, setSelectedPost] = useState(POSTS[0]);
  const [drafts, setDrafts] = useState([]);
  const [form, setForm] = useState({ title: '', category: '트렌드', body: '' });
  const [heroIndex, setHeroIndex] = useState(0);

  const allPosts = useMemo(() => [...drafts, ...POSTS], [drafts]);
  const visiblePosts = useMemo(() => {
    if (activeCategory === '전체') return allPosts;
    return allPosts.filter((post) => post.category === activeCategory);
  }, [activeCategory, allPosts]);

  const featured = allPosts.slice(0, 4);
  const heroPosts = allPosts.slice(0, 3);
  const latest = allPosts.slice(0, 8);
  const currentHero = heroPosts[heroIndex] || featured[0] || POSTS[0];

  useEffect(() => {
    setHeroIndex(0);
  }, [activeCategory]);

  useEffect(() => {
    if (page !== 'home' || heroPosts.length <= 1) return undefined;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroPosts.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [page, heroPosts.length]);

  const goHome = () => {
    setActiveCategory('전체');
    setPage('home');
  };

  const openPost = (post) => {
    setSelectedPost(post);
    setPage('post');
  };

  const submitDraft = () => {
    if (!form.title.trim() || !form.body.trim()) return;
    const newPost = {
      id: Date.now(),
      title: form.title.trim(),
      body: form.body.trim(),
      category: form.category,
      readTime: '1분 읽기',
      image: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1200&q=80'
    };
    setDrafts((prev) => [newPost, ...prev]);
    setForm({ title: '', category: '트렌드', body: '' });
    setSelectedPost(newPost);
    setPage('post');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at top, #ffffff 0%, #f7f7f5 45%, #f3f2ef 100%)', color: '#111827' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 20, borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(16px)' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={goHome} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'transparent', border: 0, cursor: 'pointer' }}>
            <div style={{ borderRadius: 16, background: '#0a0a0a', padding: '6px 14px', fontSize: 14, fontWeight: 700, color: '#fff', boxShadow: '0 8px 18px rgba(0,0,0,0.18)' }}>UNNEWS</div>
            <span style={{ fontSize: 14, color: '#6b7280' }}>대학연합신문</span>
          </button>
          <nav style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            {CATEGORIES.slice(1).map((item) => (
              <button key={item} onClick={() => { setActiveCategory(item); setPage('category'); }} style={{ background: 'transparent', border: 0, fontSize: 14, color: '#6b7280', cursor: 'pointer' }}>{item}</button>
            ))}
            <button onClick={() => setPage('admin')} style={{ borderRadius: 999, border: '1px solid rgba(0,0,0,0.1)', padding: '8px 16px', background: 'transparent', cursor: 'pointer' }}>Admin</button>
          </nav>
        </div>
      </header>

      {page === 'home' && (
        <main style={{ maxWidth: 1440, margin: '0 auto', padding: '32px 20px 40px' }}>
          <section style={{ display: 'grid', gap: 24, gridTemplateColumns: '1.25fr 0.75fr', marginBottom: 40 }}>
            <div style={{ ...softCardStyle({ overflow: 'hidden', position: 'relative', borderRadius: 32 }) }}>
              <div style={{ position: 'relative' }}>
                <img src={currentHero.image} alt={currentHero.title} style={{ display: 'block', width: '100%', height: 520, objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.62), rgba(0,0,0,0.16), transparent)' }} />
                <div style={{ position: 'absolute', insetInline: 0, bottom: 0, padding: 36, color: '#fff' }}>
                  <span style={{ display: 'inline-block', borderRadius: 999, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.15)', padding: '4px 12px', fontSize: 12 }}>{currentHero.category}</span>
                  <h1 style={{ margin: '16px 0 0', maxWidth: 760, fontSize: 56, lineHeight: 1.05, letterSpacing: '-0.045em' }}>{currentHero.title}</h1>
                  <p style={{ margin: '16px 0 0', maxWidth: 560, fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.9)' }}>{clip(currentHero.body, 130)}</p>
                  <button onClick={() => openPost(currentHero)} style={{ marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 999, background: 'rgba(255,255,255,0.92)', color: '#111827', border: 0, padding: '10px 16px', fontWeight: 700, cursor: 'pointer' }}>지금 읽기 →</button>
                  <div style={{ marginTop: 24, display: 'flex', gap: 12, paddingBottom: 110 }}>
                    {heroPosts.map((post, index) => (
                      <button key={post.id} onClick={() => setHeroIndex(index)} aria-label={`${index + 1}번 히어로 보기`} style={{ width: heroIndex === index ? 40 : 10, height: 10, borderRadius: 999, border: 0, background: heroIndex === index ? '#fff' : 'rgba(255,255,255,0.45)', cursor: 'pointer' }} />
                    ))}
                  </div>
                  <div style={{ position: 'absolute', left: 36, right: 36, bottom: 36, display: 'grid', gap: 12, gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
                    {heroPosts.map((post, index) => (
                      <button key={post.id} onClick={() => openPost(post)} style={{ borderRadius: 16, border: heroIndex === index ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)', background: heroIndex === index ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.1)', color: '#fff', padding: '12px 14px', textAlign: 'left', cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{post.category}</div>
                        <div style={{ marginTop: 6, fontSize: 14, fontWeight: 700, lineHeight: 1.4 }}>{post.title}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gap: 16 }}>
              <div style={softCardStyle({ padding: 20 })}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#6b7280' }}>브랜드</p>
                <h2 style={{ margin: '4px 0 0', fontSize: 28, letterSpacing: '-0.04em' }}>UNNEWS</h2>
                <p style={{ marginTop: 12, fontSize: 14, lineHeight: 1.7, color: '#374151' }}>대학내일처럼 부드럽고 가볍게 읽히지만, 실제 대학생의 트렌드·커리어·AI·라이프를 짧고 현실적인 문장으로 담아내는 매거진형 플랫폼입니다.</p>
                <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['unnews.kr', '부드러운 매거진형', '이미지 우선형'].map((tag) => (
                    <span key={tag} style={{ borderRadius: 999, background: '#f3f4f6', padding: '6px 12px', fontSize: 12, color: '#4b5563' }}>{tag}</span>
                  ))}
                </div>
              </div>

              <div style={softCardStyle({ padding: 20 })}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#6b7280' }}>바로 보기</p>
                <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12, alignItems: 'stretch' }}>
                  <button onClick={() => setPage('category')} style={{ minHeight: 148, borderRadius: 16, border: '1px solid rgba(0,0,0,0.05)', background: 'rgba(249,250,251,0.9)', padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, cursor: 'pointer' }}>
                    <IconTile><ShortcutGridIcon /></IconTile>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>카테고리</div>
                  </button>
                  <button onClick={() => openPost(currentHero)} style={{ minHeight: 148, borderRadius: 16, border: '1px solid rgba(0,0,0,0.05)', background: 'rgba(249,250,251,0.9)', padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, cursor: 'pointer' }}>
                    <IconTile><ShortcutArticleIcon /></IconTile>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>글 상세</div>
                  </button>
                  <button onClick={() => setPage('admin')} style={{ minHeight: 148, borderRadius: 16, border: '1px solid rgba(0,0,0,0.05)', background: 'rgba(249,250,251,0.9)', padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, cursor: 'pointer' }}>
                    <IconTile><ShortcutAdminIcon /></IconTile>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>관리자</div>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: 40 }}>
            <div style={{ marginBottom: 16 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#6b7280' }}>Featured</p>
              <h2 style={{ margin: '4px 0 0', fontSize: 29, letterSpacing: '-0.04em' }}>인기 콘텐츠</h2>
            </div>
            <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
              {featured.map((post) => (
                <button key={post.id} onClick={() => openPost(post)} style={{ position: 'relative', overflow: 'hidden', borderRadius: 28, border: '1px solid rgba(255,255,255,0.5)', padding: 0, background: '#fff', textAlign: 'left', cursor: 'pointer', boxShadow: '0 24px 60px rgba(0,0,0,0.08)' }}>
                  <img src={post.image} alt={post.title} style={{ width: '100%', height: 320, objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0.1), transparent)' }} />
                  <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 20, color: '#fff' }}>
                    <span style={{ fontSize: 12, opacity: 0.8 }}>{post.category}</span>
                    <h3 style={{ margin: '6px 0 0', fontSize: 17, fontWeight: 700, lineHeight: 1.5, letterSpacing: '-0.03em' }}>{post.title}</h3>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section>
            <div style={{ marginBottom: 16, display: 'flex', gap: 8, overflowX: 'auto' }}>
              {CATEGORIES.map((category) => (
                <button key={category} onClick={() => { setActiveCategory(category); setPage('category'); }} style={{ borderRadius: 999, padding: '10px 16px', fontSize: 14, fontWeight: 600, border: activeCategory === category ? '0' : '1px solid rgba(0,0,0,0.05)', background: activeCategory === category ? '#0a0a0a' : 'rgba(255,255,255,0.8)', color: activeCategory === category ? '#fff' : '#4b5563', cursor: 'pointer', boxShadow: activeCategory === category ? '0 10px 24px rgba(0,0,0,0.16)' : 'none' }}>{category}</button>
              ))}
            </div>
            <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
              {latest.map((post) => (
                <button key={post.id} onClick={() => openPost(post)} style={{ display: 'flex', alignItems: 'center', gap: 16, borderRadius: 24, border: '1px solid rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.78)', padding: 14, textAlign: 'left', boxShadow: '0 16px 42px rgba(0,0,0,0.06)', cursor: 'pointer' }}>
                  <img src={post.image} alt={post.title} style={{ width: 112, height: 112, borderRadius: 18, objectFit: 'cover' }} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ borderRadius: 999, background: '#f3f4f6', padding: '4px 10px', fontSize: 12, color: '#6b7280' }}>{post.category}</span>
                      <span style={{ fontSize: 12, color: '#9ca3af' }}>{post.readTime}</span>
                    </div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, lineHeight: 1.5, letterSpacing: '-0.03em' }}>{post.title}</h3>
                    <p style={{ margin: '6px 0 0', fontSize: 14, lineHeight: 1.7, color: '#4b5563' }}>{clip(post.body, 92)}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </main>
      )}

      {page === 'category' && (
        <main style={{ maxWidth: 1440, margin: '0 auto', padding: '32px 20px 40px' }}>
          <div style={{ marginBottom: 24 }}>
            <p style={{ margin: 0, fontSize: 14, color: '#6b7280' }}>Category</p>
            <h1 style={{ margin: '4px 0 0', fontSize: 37, fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.045em' }}>{activeCategory}</h1>
          </div>
          <div style={{ marginBottom: 20, display: 'flex', gap: 8, overflowX: 'auto' }}>
            {CATEGORIES.map((category) => (
              <button key={category} onClick={() => setActiveCategory(category)} style={{ borderRadius: 999, padding: '10px 16px', fontSize: 14, fontWeight: 600, border: activeCategory === category ? '0' : '1px solid rgba(0,0,0,0.05)', background: activeCategory === category ? '#0a0a0a' : 'rgba(255,255,255,0.8)', color: activeCategory === category ? '#fff' : '#4b5563', cursor: 'pointer', boxShadow: activeCategory === category ? '0 10px 24px rgba(0,0,0,0.16)' : 'none' }}>{category}</button>
            ))}
          </div>
          <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
            {visiblePosts.map((post) => (
              <button key={post.id} onClick={() => openPost(post)} style={{ display: 'flex', alignItems: 'center', gap: 16, borderRadius: 24, border: '1px solid rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.78)', padding: 14, textAlign: 'left', boxShadow: '0 16px 42px rgba(0,0,0,0.06)', cursor: 'pointer' }}>
                <img src={post.image} alt={post.title} style={{ width: 112, height: 112, borderRadius: 18, objectFit: 'cover' }} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ borderRadius: 999, background: '#f3f4f6', padding: '4px 10px', fontSize: 12, color: '#6b7280' }}>{post.category}</span>
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>{post.readTime}</span>
                  </div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, lineHeight: 1.5, letterSpacing: '-0.03em' }}>{post.title}</h3>
                  <p style={{ margin: '6px 0 0', fontSize: 14, lineHeight: 1.7, color: '#4b5563' }}>{clip(post.body, 92)}</p>
                </div>
              </button>
            ))}
          </div>
        </main>
      )}

      {page === 'post' && (
        <main style={{ maxWidth: 980, margin: '0 auto', padding: '32px 20px 40px' }}>
          <button onClick={goHome} style={{ marginBottom: 20, borderRadius: 999, border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.9)', padding: '8px 16px', fontSize: 14, color: '#374151', cursor: 'pointer' }}>← 홈으로</button>
          <div style={{ ...softCardStyle({ overflow: 'hidden', borderRadius: 30 }) }}>
            <img src={selectedPost.image} alt={selectedPost.title} style={{ width: '100%', height: 320, objectFit: 'cover', display: 'block' }} />
            <div style={{ padding: 36 }}>
              <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ borderRadius: 999, background: '#f3f4f6', padding: '4px 12px', fontSize: 12, color: '#6b7280' }}>{selectedPost.category}</span>
                <span style={{ fontSize: 12, color: '#9ca3af' }}>{selectedPost.readTime}</span>
              </div>
              <h1 style={{ margin: 0, fontSize: 37, fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.045em' }}>{selectedPost.title}</h1>
              <div style={{ marginTop: 24, borderRadius: 22, border: '1px solid rgba(0,0,0,0.05)', background: 'rgba(249,250,251,0.9)', padding: 20 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#6b7280' }}>3줄 요약</p>
                <p style={{ marginTop: 8, fontSize: 15, lineHeight: 1.8, color: '#374151' }}>{selectedPost.body}</p>
              </div>
              <div style={{ marginTop: 24, fontSize: 15, lineHeight: 1.9, color: '#374151' }}>
                <p>{selectedPost.body}</p>
                <p style={{ marginTop: 16 }}>UNNEWS는 긴 설명보다 짧은 핵심과 강한 이미지로 읽히는 흐름을 만듭니다. 콘텐츠 구조는 단순하지만, 내용은 실제 대학생의 생활과 고민에 더 가깝게 채워서 공감과 정보가 함께 남도록 구성합니다.</p>
              </div>
            </div>
          </div>
        </main>
      )}

      {page === 'admin' && (
        <main style={{ maxWidth: 1180, margin: '0 auto', padding: '32px 20px 40px' }}>
          <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
            <div>
              <p style={{ margin: 0, fontSize: 14, color: '#6b7280' }}>Admin</p>
              <h1 style={{ margin: '4px 0 0', fontSize: 37, fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.045em' }}>콘텐츠 관리</h1>
            </div>
            <button onClick={goHome} style={{ borderRadius: 999, border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.9)', padding: '8px 16px', fontSize: 14, color: '#374151', cursor: 'pointer' }}>사이트로 이동</button>
          </div>
          <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr 0.9fr' }}>
            <div style={{ background: '#fff', borderRadius: 24, padding: 24, boxShadow: '0 10px 28px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'grid', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#4b5563' }}>제목</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="제목을 입력하세요" style={{ width: '100%', borderRadius: 20, border: '1px solid rgba(0,0,0,0.1)', background: '#fff', padding: '14px 16px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#4b5563' }}>카테고리</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ width: '100%', borderRadius: 20, border: '1px solid rgba(0,0,0,0.1)', background: '#fff', padding: '14px 16px', outline: 'none' }}>
                    <option>트렌드</option>
                    <option>커리어</option>
                    <option>AI</option>
                    <option>라이프</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#4b5563' }}>본문</label>
                  <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={7} placeholder="짧고 가볍게 작성합니다" style={{ width: '100%', borderRadius: 20, border: '1px solid rgba(0,0,0,0.1)', background: '#fff', padding: '14px 16px', outline: 'none' }} />
                </div>
                <button onClick={submitDraft} style={{ borderRadius: 999, background: '#0a0a0a', padding: '10px 20px', fontSize: 14, fontWeight: 700, color: '#fff', border: 0, cursor: 'pointer', boxShadow: '0 12px 28px rgba(0,0,0,0.18)' }}>글 등록 미리보기</button>
              </div>
            </div>
            <div style={{ display: 'grid', gap: 24 }}>
              <div style={{ background: '#fff', borderRadius: 24, padding: 24, boxShadow: '0 10px 28px rgba(0,0,0,0.04)' }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#6b7280' }}>운영 원칙</p>
                <ul style={{ margin: '16px 0 0', padding: 0, listStyle: 'none', display: 'grid', gap: 12, fontSize: 14, color: '#374151' }}>
                  <li style={{ borderRadius: 16, background: '#f9fafb', padding: '12px 16px' }}>이미지 우선</li>
                  <li style={{ borderRadius: 16, background: '#f9fafb', padding: '12px 16px' }}>본문은 3~5줄</li>
                  <li style={{ borderRadius: 16, background: '#f9fafb', padding: '12px 16px' }}>카테고리는 4개 고정</li>
                </ul>
              </div>
              <div style={{ background: '#fff', borderRadius: 24, padding: 24, boxShadow: '0 10px 28px rgba(0,0,0,0.04)' }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#6b7280' }}>등록된 글 미리보기</p>
                <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
                  {[...drafts, ...POSTS].slice(0, 5).map((post) => (
                    <button key={post.id} onClick={() => openPost(post)} style={{ width: '100%', borderRadius: 16, background: '#f9fafb', padding: '12px 16px', textAlign: 'left', fontSize: 14, color: '#374151', border: 0, cursor: 'pointer' }}>
                      <strong>{post.title}</strong>
                      <div style={{ marginTop: 4, fontSize: 12, color: '#9ca3af' }}>{post.category}</div>
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
