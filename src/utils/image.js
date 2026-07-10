export function getAutoImage(category, text = "") {
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

export function getSuggestionTopic(category, text = "") {
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

export function getSmartImageSuggestions(category, title, body) {
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