"use strict";

const STORAGE_KEYS = {
  recentSearches: "btlr_recent_searches",
  favorites: "btlr_favorites",
  loans: "btlr_loans",
  reservations: "btlr_reservations",
};

const mockBooks = [
  {
    id: "book-001",
    title: "생각을 모으는 사람",
    author: "모니카 페트",
    publisher: "풀빛",
    publishedDate: "2023-03-15",
    isbn: "9788974744097",
    category: "인문",
    keywords: ["생각", "철학", "마음", "성찰"],
    description: "바쁘게 흘러가는 일상에서 잠시 멈춰 생각을 모으는 일의 의미를 이야기합니다. 나의 생각을 귀하게 바라보고 타인의 관점과 조용히 만나는 시간을 선물하는 책입니다.",
    shortDescription: "흩어진 생각을 모아 나만의 관점을 발견하는 따뜻한 이야기.",
    thumbnail: "image/images/images (4).jpg",
    loanStatus: "대출 가능",
    location: "인문·사회자료실 2층",
    callNumber: "104-페887ㅅ",
    returnDate: null,
    createdAt: "2025-04-12",
  },
  {
    id: "book-002",
    title: "잘 읽히는 보고서 문장의 비밀",
    author: "이윤경",
    publisher: "한빛미디어",
    publishedDate: "2024-02-20",
    isbn: "9791169212103",
    category: "진로/취업",
    keywords: ["보고서", "글쓰기", "취업", "직장"],
    description: "보고서와 자기소개서, 이메일처럼 실무에서 자주 쓰는 문장을 더 명확하고 설득력 있게 다듬는 방법을 알려줍니다. 사례를 통해 바로 적용할 수 있는 글쓰기 원칙을 배울 수 있습니다.",
    shortDescription: "실무 문장을 짧고 정확하게 만드는 보고서 글쓰기 안내서.",
    thumbnail: "image/images/images (9).jpg",
    loanStatus: "대출 중",
    location: "종합자료실 2층",
    callNumber: "802-이667ㅈ",
    returnDate: "2026-06-29",
    createdAt: "2025-06-02",
  },
  {
    id: "book-003",
    title: "개발하는 남자의 핸즈온 플러터",
    author: "김성덕",
    publisher: "한빛미디어",
    publishedDate: "2023-08-01",
    isbn: "9791169211304",
    category: "IT",
    keywords: ["플러터", "앱개발", "모바일", "프로그래밍"],
    description: "플러터의 기본 위젯부터 상태 관리와 실제 앱 배포 흐름까지 하나의 프로젝트로 익히는 실습서입니다. 모바일 앱 개발을 처음 시작하는 독자도 차근차근 따라갈 수 있습니다.",
    shortDescription: "실전 프로젝트로 배우는 플러터 모바일 앱 개발.",
    thumbnail: "image/images/images (10).jpg",
    loanStatus: "대출 가능",
    location: "디지털자료실 3층",
    callNumber: "005.58-김769ㅎ",
    returnDate: null,
    createdAt: "2025-05-28",
  },
  {
    id: "book-004",
    title: "실무로 통하는 클린 코드",
    author: "제이슨 앨럼",
    publisher: "한빛미디어",
    publishedDate: "2024-01-10",
    isbn: "9791169211847",
    category: "IT",
    keywords: ["클린코드", "개발자", "코딩", "설계"],
    description: "읽기 쉽고 유지보수하기 좋은 코드를 만들기 위한 실용적인 원칙을 담았습니다. 이름 짓기, 함수 설계, 오류 처리, 테스트 등 개발 현장에서 반복해서 마주치는 문제를 구체적으로 설명합니다.",
    shortDescription: "현장에서 오래 살아남는 코드를 위한 실전 원칙.",
    thumbnail: "image/images/images (11).jpg",
    loanStatus: "예약 가능",
    location: "디지털자료실 3층",
    callNumber: "005.12-앨756ㅋ",
    returnDate: "2026-07-03",
    createdAt: "2025-06-11",
  },
  {
    id: "book-005",
    title: "네트워크 인프라 자동화",
    author: "맷 오스왈트 외",
    publisher: "한빛미디어",
    publishedDate: "2023-11-24",
    isbn: "9791169211656",
    category: "IT",
    keywords: ["네트워크", "자동화", "인프라", "파이썬"],
    description: "반복적인 네트워크 운영을 코드로 자동화하는 방법과 실무 도구를 소개합니다. 네트워크 엔지니어와 개발자가 함께 이해할 수 있도록 개념부터 운영 사례까지 폭넓게 다룹니다.",
    shortDescription: "코드로 더 빠르고 안전하게 운영하는 네트워크 인프라.",
    thumbnail: "image/images/images (12).jpg",
    loanStatus: "대출 중",
    location: "디지털자료실 3층",
    callNumber: "004.5-오585ㄴ",
    returnDate: "2026-06-25",
    createdAt: "2025-04-08",
  },
  {
    id: "book-006",
    title: "실무로 통하는 ML 문제 해결 with 파이썬",
    author: "카일 갤러틴",
    publisher: "한빛미디어",
    publishedDate: "2024-05-17",
    isbn: "9791169212325",
    category: "IT",
    keywords: ["머신러닝", "파이썬", "데이터", "AI"],
    description: "머신러닝 프로젝트에서 데이터 품질, 모델 선택, 평가와 배포까지 문제를 정의하고 해결하는 과정을 안내합니다. 단순한 알고리즘 암기를 넘어 실무 판단력을 기를 수 있습니다.",
    shortDescription: "현실의 데이터 문제를 해결하는 머신러닝 실전 가이드.",
    thumbnail: "image/images/images (13).jpg",
    loanStatus: "대출 가능",
    location: "디지털자료실 3층",
    callNumber: "004.73-갤244ㅅ",
    returnDate: null,
    createdAt: "2025-06-14",
  },
  {
    id: "book-007",
    title: "자바스크립트 + 리액트 디자인 패턴",
    author: "애디 오스마니",
    publisher: "한빛미디어",
    publishedDate: "2024-04-08",
    isbn: "9791169212219",
    category: "IT",
    keywords: ["자바스크립트", "리액트", "프론트엔드", "디자인패턴"],
    description: "현대 자바스크립트와 리액트 애플리케이션에서 재사용 가능한 구조를 만드는 디자인 패턴을 설명합니다. 성능과 유지보수성을 함께 고려하는 프론트엔드 설계를 배울 수 있습니다.",
    shortDescription: "확장 가능한 프론트엔드를 위한 현대적 디자인 패턴.",
    thumbnail: "image/images/images (14).jpg",
    loanStatus: "예약 가능",
    location: "디지털자료실 3층",
    callNumber: "005.138-오585ㅈ",
    returnDate: "2026-07-01",
    createdAt: "2025-05-21",
  },
  {
    id: "book-008",
    title: "더 나은 프로그래머가 되는 법",
    author: "피트 구들리프",
    publisher: "한빛미디어",
    publishedDate: "2023-09-12",
    isbn: "9791169211434",
    category: "자기계발",
    keywords: ["개발자", "성장", "커리어", "습관"],
    description: "좋은 코드를 넘어 좋은 개발자로 성장하기 위한 태도와 습관을 다룹니다. 협업, 학습, 시간 관리, 커뮤니케이션 등 기술 바깥의 역량까지 현실적인 조언으로 풀어냅니다.",
    shortDescription: "기술과 태도를 함께 키우는 개발자 성장 안내서.",
    thumbnail: "image/images/images (15).jpg",
    loanStatus: "대출 가능",
    location: "종합자료실 2층",
    callNumber: "325.211-구148ㄷ",
    returnDate: null,
    createdAt: "2025-03-19",
  },
  {
    id: "book-009",
    title: "당근 마케팅",
    author: "김용태",
    publisher: "한빛비즈",
    publishedDate: "2023-06-30",
    isbn: "9791157846761",
    category: "경제",
    keywords: ["마케팅", "브랜딩", "비즈니스", "플랫폼"],
    description: "사람과 동네, 신뢰를 연결하는 로컬 플랫폼의 성장 방식을 바탕으로 오늘날의 마케팅 전략을 살펴봅니다. 고객과 오래 관계 맺는 브랜드의 원칙을 쉽게 설명합니다.",
    shortDescription: "사람과 지역을 연결해 성장하는 마케팅의 원리.",
    thumbnail: "image/images/images (16).jpg",
    loanStatus: "대출 중",
    location: "인문·사회자료실 2층",
    callNumber: "325.5-김698ㄷ",
    returnDate: "2026-06-28",
    createdAt: "2025-02-15",
  },
  {
    id: "book-010",
    title: "이것이 취업을 위한 컴퓨터 과학이다",
    author: "최지민",
    publisher: "한빛미디어",
    publishedDate: "2024-07-01",
    isbn: "9791169212516",
    category: "진로/취업",
    keywords: ["취업", "CS", "면접", "개발자"],
    description: "개발자 취업에 필요한 컴퓨터 과학 핵심 개념을 면접 질문과 함께 정리합니다. 운영체제, 네트워크, 자료구조와 데이터베이스를 연결해 이해하도록 돕습니다.",
    shortDescription: "개발자 면접과 실무를 연결하는 컴퓨터 과학 핵심.",
    thumbnail: "image/images/images (17).jpg",
    loanStatus: "대출 가능",
    location: "취업정보코너 2층",
    callNumber: "005.1-최938ㅇ",
    returnDate: null,
    createdAt: "2025-06-18",
  },
  {
    id: "book-011",
    title: "실무로 통하는 타입스크립트",
    author: "조시 골드버그",
    publisher: "한빛미디어",
    publishedDate: "2023-12-05",
    isbn: "9791169211731",
    category: "IT",
    keywords: ["타입스크립트", "웹개발", "프로그래밍", "실무"],
    description: "타입 시스템의 기본부터 제네릭, 선언 파일, 설정과 마이그레이션까지 실무에 필요한 타입스크립트 지식을 다룹니다. 자바스크립트 프로젝트를 더 안전하게 만드는 방법을 익힐 수 있습니다.",
    shortDescription: "자바스크립트 프로젝트를 단단하게 만드는 타입 설계.",
    thumbnail: "image/images/images (18).jpg",
    loanStatus: "대출 중",
    location: "디지털자료실 3층",
    callNumber: "005.138-골691ㅅ",
    returnDate: "2026-07-05",
    createdAt: "2025-05-04",
  },
  {
    id: "book-012",
    title: "매일의 작은 실행",
    author: "윤서진",
    publisher: "마음서재",
    publishedDate: "2024-08-22",
    isbn: "9788990001204",
    category: "자기계발",
    keywords: ["습관", "실행", "성장", "루틴"],
    description: "거창한 목표보다 오늘의 작은 행동을 선택하는 방법을 이야기합니다. 꾸준함을 방해하는 마음을 이해하고 자신에게 맞는 실행 리듬을 설계하도록 돕습니다.",
    shortDescription: "작은 행동을 꾸준한 변화로 바꾸는 현실적인 습관법.",
    thumbnail: "image/images/images (19).jpg",
    loanStatus: "대출 가능",
    location: "종합자료실 2층",
    callNumber: "325.211-윤826ㅁ",
    returnDate: null,
    createdAt: "2025-06-08",
  },
  {
    id: "book-013",
    title: "AI 변호사 with 챗GPT",
    author: "박상흠",
    publisher: "한빛미디어",
    publishedDate: "2024-03-04",
    isbn: "9791169212066",
    category: "인문",
    keywords: ["AI", "법", "챗GPT", "사회"],
    description: "생성형 AI가 법률 업무와 사회의 규칙을 어떻게 바꾸는지 다양한 사례로 살펴봅니다. 기술을 무조건 낙관하거나 두려워하기보다 책임 있게 활용할 관점을 제안합니다.",
    shortDescription: "생성형 AI와 법률의 만남에서 발견하는 새로운 질문.",
    thumbnail: "image/images/images (20).jpg",
    loanStatus: "예약 가능",
    location: "인문·사회자료실 2층",
    callNumber: "360.004-박386ㅇ",
    returnDate: "2026-06-30",
    createdAt: "2025-05-30",
  },
  {
    id: "book-014",
    title: "퇴근 후 시작하는 나의 첫 프로젝트",
    author: "정하린",
    publisher: "러닝앤런",
    publishedDate: "2024-09-10",
    isbn: "9788990001211",
    category: "진로/취업",
    keywords: ["사이드프로젝트", "포트폴리오", "진로", "커리어"],
    description: "하고 싶은 일을 작은 프로젝트로 시작하고 결과물을 포트폴리오로 연결하는 과정을 안내합니다. 아이디어 선정부터 일정 관리, 기록과 회고까지 초보자의 눈높이에서 설명합니다.",
    shortDescription: "작은 사이드 프로젝트를 커리어 자산으로 만드는 법.",
    thumbnail: "image/images/images (21).jpg",
    loanStatus: "대출 가능",
    location: "취업정보코너 2층",
    callNumber: "325.33-정496ㅌ",
    returnDate: null,
    createdAt: "2025-06-19",
  },
  {
    id: "book-015",
    title: "오늘도 무사히, 마음 산책",
    author: "한유진",
    publisher: "포레스트북스",
    publishedDate: "2024-01-29",
    isbn: "9788990001228",
    category: "에세이",
    keywords: ["에세이", "마음", "위로", "일상"],
    description: "완벽하지 않은 하루를 다정하게 통과하는 마음의 문장들을 담았습니다. 지친 날에는 잠시 쉬어도 괜찮다는 위로와 다시 걸을 용기를 건넵니다.",
    shortDescription: "평범한 하루를 다정하게 보듬는 마음의 문장들.",
    thumbnail: "image/images/images (22).jpg",
    loanStatus: "대출 중",
    location: "문학자료실 1층",
    callNumber: "814.7-한757ㅇ",
    returnDate: "2026-06-27",
    createdAt: "2025-03-02",
  },
  {
    id: "book-016",
    title: "우리가 건너온 여름",
    author: "서이안",
    publisher: "문학의숲",
    publishedDate: "2024-06-14",
    isbn: "9788990001235",
    category: "소설",
    keywords: ["소설", "청춘", "우정", "성장"],
    description: "각자의 이유로 고향을 떠났던 세 친구가 오래된 도서관에서 다시 만나며 시작되는 이야기입니다. 지나온 계절과 아직 오지 않은 삶 사이에서 서로의 선택을 이해해 갑니다.",
    shortDescription: "다시 만난 세 친구가 함께 건너는 한여름의 성장 소설.",
    thumbnail: "image/images/images (23).jpg",
    loanStatus: "예약 가능",
    location: "문학자료실 1층",
    callNumber: "813.7-서833ㅇ",
    returnDate: "2026-07-02",
    createdAt: "2025-06-13",
  },
  {
    id: "book-017",
    title: "돈의 흐름을 읽는 첫 수업",
    author: "김도현",
    publisher: "인사이트",
    publishedDate: "2024-04-25",
    isbn: "9788990001242",
    category: "경제",
    keywords: ["경제", "금융", "투자", "청년"],
    description: "금리, 환율, 물가처럼 뉴스에서 자주 만나는 경제 개념을 일상의 언어로 설명합니다. 숫자에 겁먹지 않고 세상의 흐름을 읽는 기본 감각을 기를 수 있습니다.",
    shortDescription: "일상과 뉴스가 연결되는 가장 쉬운 경제 입문.",
    thumbnail: "image/images/images (24).jpg",
    loanStatus: "대출 가능",
    location: "인문·사회자료실 2층",
    callNumber: "320-김398ㄷ",
    returnDate: null,
    createdAt: "2025-05-18",
  },
  {
    id: "book-018",
    title: "문장 사이의 밤",
    author: "이해원",
    publisher: "달과문장",
    publishedDate: "2023-10-18",
    isbn: "9788990001259",
    category: "에세이",
    keywords: ["독서", "문장", "에세이", "기록"],
    description: "책을 읽으며 밑줄 그은 문장과 그 곁에서 피어난 생각을 기록한 독서 에세이입니다. 한 문장이 한 사람의 하루를 어떻게 바꾸는지 잔잔하게 보여줍니다.",
    shortDescription: "읽은 문장과 살아낸 하루가 만나는 독서 에세이.",
    thumbnail: "image/images/images (25).jpg",
    loanStatus: "대출 가능",
    location: "문학자료실 1층",
    callNumber: "814.7-이772ㅁ",
    returnDate: null,
    createdAt: "2025-04-25",
  },
];

let toastTimer = null;
let currentUserCache = null;

async function initApp() {
  await loadCurrentUser();
  handleHeaderSearch();
  renderAuthArea();
  handleGlobalActions();

  const page = getCurrentPage();
  const pageInitializers = {
    home: initHomePage,
    search: initSearchPage,
    detail: initDetailPage,
    reserve: initReservePage,
    signup: initSignupPage,
    login: initLoginPage,
    mypage: initMyPage,
  };

  if (pageInitializers[page]) {
    pageInitializers[page]();
  }
}

function getCurrentPage() {
  return document.body?.dataset.page || "";
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function generateId(prefix) {
  const randomPart =
    window.crypto && typeof window.crypto.randomUUID === "function"
      ? window.crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now()}-${randomPart}`;
}

function formatDate(date) {
  if (!date) return "-";
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
}

function addDays(date, days) {
  const value = new Date(date);
  value.setDate(value.getDate() + days);
  return value.toISOString();
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getStoredArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch (error) {
    console.warn(`${key} 데이터를 읽지 못했습니다.`, error);
    return [];
  }
}

function setStoredArray(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getCurrentRelativeUrl() {
  const fileName = window.location.pathname.split("/").pop() || "index.html";
  return `${fileName}${window.location.search}${window.location.hash}`;
}

function getSafeNextUrl() {
  const next = getQueryParam("next");
  if (!next) return "mypage.html";
  return /^(index|search|detail|reserve|mypage)\.html(?:[?#].*)?$/.test(next)
    ? next
    : "mypage.html";
}

function getStatusClass(status) {
  const map = {
    "대출 가능": "status-available",
    "대출 중": "status-loaned",
    "예약 가능": "status-reservable",
    "예약 완료": "status-reserved",
    "대여 중": "status-my-loan",
  };
  return map[status] || "status-reservable";
}

function getBooks() {
  return mockBooks.map((book) => ({
    ...book,
    keywords: [...book.keywords],
  }));
}

function getBookById(bookId) {
  return mockBooks.find((book) => book.id === bookId) || null;
}

function searchBooks(query, books) {
  const normalizedQuery = String(query || "").trim().toLocaleLowerCase("ko-KR");
  if (!normalizedQuery) return [...books];

  return books.filter((book) => {
    const searchableText = [
      book.title,
      book.author,
      book.publisher,
      book.category,
      book.description,
      book.shortDescription,
      ...book.keywords,
    ]
      .join(" ")
      .toLocaleLowerCase("ko-KR");
    return searchableText.includes(normalizedQuery);
  });
}

function filterBooks(books, filters = {}) {
  return books.filter((book) => {
    const categoryMatches =
      !filters.category ||
      filters.category === "전체" ||
      book.category === filters.category;
    const statusMatches =
      !filters.loanStatus ||
      filters.loanStatus === "전체" ||
      book.loanStatus === filters.loanStatus;
    return categoryMatches && statusMatches;
  });
}

function sortBooks(books, sortOption = "default") {
  const sortedBooks = [...books];
  if (sortOption === "title") {
    return sortedBooks.sort((a, b) => a.title.localeCompare(b.title, "ko"));
  }
  if (sortOption === "latest") {
    return sortedBooks.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  }
  if (sortOption === "available") {
    const order = { "대출 가능": 0, "예약 가능": 1, "대출 중": 2 };
    return sortedBooks.sort(
      (a, b) => (order[a.loanStatus] ?? 9) - (order[b.loanStatus] ?? 9),
    );
  }
  return sortedBooks;
}

function renderBookCards(books, target = null) {
  const container =
    target ||
    document.getElementById("search-results") ||
    document.getElementById("featured-books");
  if (!container) return;
  container.innerHTML = books.map(createBookCardMarkup).join("");
}

function createBookCardMarkup(book) {
  const favorite = isFavorite(book.id);
  const loanedByUser = isLoaned(book.id);
  const isAvailable = book.loanStatus === "대출 가능";
  const mainAction = isAvailable
    ? `<button class="card-main-action" type="button" data-action="borrow" data-book-id="${book.id}" ${loanedByUser ? "disabled" : ""}>${loanedByUser ? "대여 중" : "대출하기"}</button>`
    : `<a class="card-main-action reserve-action" href="reserve.html?id=${encodeURIComponent(book.id)}">예약 신청</a>`;

  return `
    <article class="book-card" data-book-card="${book.id}">
      <a class="book-cover-link" href="detail.html?id=${encodeURIComponent(book.id)}" aria-label="${escapeHTML(book.title)} 상세 보기">
        <img class="book-cover" src="${escapeHTML(book.thumbnail)}" alt="${escapeHTML(book.title)} 표지" loading="lazy" onerror="this.outerHTML='<span class=&quot;cover-fallback&quot; aria-label=&quot;표지 이미지 없음&quot;>B</span>'" />
        <span class="book-status status-badge ${getStatusClass(book.loanStatus)}">${escapeHTML(book.loanStatus)}</span>
      </a>
      <div class="book-card-content">
        <span class="book-category">${escapeHTML(book.category.toUpperCase())}</span>
        <h3><a href="detail.html?id=${encodeURIComponent(book.id)}">${escapeHTML(book.title)}</a></h3>
        <p class="book-author">${escapeHTML(book.author)} · ${escapeHTML(book.publisher)}</p>
        <p class="book-description">${escapeHTML(book.shortDescription)}</p>
        <div class="book-actions">
          <button class="favorite-button ${favorite ? "active" : ""}" type="button" data-action="favorite" data-book-id="${book.id}" aria-label="${favorite ? "찜 취소" : "찜하기"}" aria-pressed="${favorite}">${favorite ? "♥" : "♡"}</button>
          ${mainAction}
        </div>
      </div>
    </article>
  `;
}

function handleHeaderSearch() {
  document.querySelectorAll(".header-search").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = form.querySelector('input[name="q"]');
      const query = input?.value.trim() || "";
      if (query) saveRecentSearch(query);
      window.location.href = query
        ? `search.html?q=${encodeURIComponent(query)}`
        : "search.html";
    });
  });
}

function saveRecentSearch(query) {
  const normalized = String(query || "").trim();
  if (!normalized) return;
  const searches = getRecentSearches().filter(
    (item) => item.toLocaleLowerCase("ko-KR") !== normalized.toLocaleLowerCase("ko-KR"),
  );
  searches.unshift(normalized);
  setStoredArray(STORAGE_KEYS.recentSearches, searches.slice(0, 5));
}

function getRecentSearches() {
  return getStoredArray(STORAGE_KEYS.recentSearches);
}

async function signupUser(formData) {
  const name = String(formData.name || "").trim();
  const email = String(formData.email || "").trim().toLocaleLowerCase();
  const password = String(formData.password || "");
  const confirmPassword = String(formData.confirmPassword || "");

  if (!name || !email || !password || !confirmPassword) {
    return { success: false, message: "모든 입력 항목을 작성해 주세요." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: "올바른 이메일 형식을 입력해 주세요." };
  }
  if (password.length < 8) {
    return { success: false, message: "비밀번호는 8자 이상 입력해 주세요." };
  }
  if (password !== confirmPassword) {
    return { success: false, message: "비밀번호와 비밀번호 확인이 일치하지 않습니다." };
  }

  if (!window.btlrSupabase) {
    return { success: false, message: "회원 서비스에 연결할 수 없습니다." };
  }

  const { data, error } = await window.btlrSupabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return {
    success: true,
    message: data.session
      ? "회원가입이 완료되었습니다."
      : "회원가입이 완료되었습니다. 이메일 인증 후 로그인해 주세요.",
    user: data.user,
  };
}

async function loginUser(email, password) {
  const normalizedEmail = String(email || "").trim().toLocaleLowerCase();
  if (!normalizedEmail || !password) {
    return {
      success: false,
      message: "이메일과 비밀번호를 입력해 주세요.",
    };
  }

  if (!window.btlrSupabase) {
    return { success: false, message: "회원 서비스에 연결할 수 없습니다." };
  }

  const { data, error } = await window.btlrSupabase.auth.signInWithPassword({
    email: normalizedEmail,
    password: String(password),
  });

  if (error) {
    const normalizedError = error.message.toLocaleLowerCase();
    const message = normalizedError.includes("email not confirmed")
      ? "이메일 인증을 완료한 후 로그인해 주세요."
      : normalizedError.includes("invalid login credentials")
        ? "이메일 또는 비밀번호가 올바르지 않습니다."
        : "로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.";
    return {
      success: false,
      message,
    };
  }

  await loadCurrentUser(data.user);
  return { success: true, message: "로그인되었습니다.", user: currentUserCache };
}

async function logoutUser() {
  if (window.btlrSupabase) {
    await window.btlrSupabase.auth.signOut();
  }
  currentUserCache = null;
}

function getCurrentUser() {
  return currentUserCache;
}

async function loadCurrentUser(knownUser = null) {
  if (!window.btlrSupabase) {
    currentUserCache = null;
    return null;
  }

  let authUser = knownUser;
  if (!authUser) {
    const { data, error } = await window.btlrSupabase.auth.getSession();
    if (error || !data.session?.user) {
      currentUserCache = null;
      return null;
    }
    authUser = data.session.user;
  }

  const { data: profile } = await window.btlrSupabase
    .from("profiles")
    .select("id, name, username, role, created_at")
    .eq("id", authUser.id)
    .maybeSingle();

  currentUserCache = {
    id: authUser.id,
    email: authUser.email || "",
    name:
      profile?.name ||
      authUser.user_metadata?.name ||
      authUser.email?.split("@")[0] ||
      "회원",
    username: profile?.username || null,
    role: profile?.role || "member",
    createdAt: profile?.created_at || authUser.created_at,
  };
  return currentUserCache;
}

function requireLogin() {
  const user = getCurrentUser();
  if (user) return user;

  sessionStorage.setItem(
    "btlr_login_notice",
    "로그인 후 이용할 수 있는 기능입니다.",
  );
  const next = encodeURIComponent(getCurrentRelativeUrl());
  window.location.href = `login.html?next=${next}`;
  return null;
}

function getFavorites() {
  return getStoredArray(STORAGE_KEYS.favorites);
}

function saveFavorites(favorites) {
  setStoredArray(STORAGE_KEYS.favorites, favorites);
}

function addFavorite(bookId) {
  const user = requireLogin();
  if (!user) return { success: false, redirected: true };
  const favorites = getFavorites();
  if (
    favorites.some(
      (favorite) => favorite.userId === user.id && favorite.bookId === bookId,
    )
  ) {
    return { success: false, message: "이미 찜한 도서입니다." };
  }
  favorites.push({
    id: generateId("fav"),
    userId: user.id,
    bookId,
    createdAt: new Date().toISOString(),
  });
  saveFavorites(favorites);
  return { success: true, message: "찜한 도서에 추가했습니다." };
}

function removeFavorite(bookId) {
  const user = getCurrentUser();
  if (!user) return { success: false, message: "로그인이 필요합니다." };
  const nextFavorites = getFavorites().filter(
    (favorite) =>
      !(favorite.userId === user.id && favorite.bookId === bookId),
  );
  saveFavorites(nextFavorites);
  return { success: true, message: "찜을 취소했습니다." };
}

function isFavorite(bookId) {
  const user = getCurrentUser();
  if (!user) return false;
  return getFavorites().some(
    (favorite) => favorite.userId === user.id && favorite.bookId === bookId,
  );
}

function getLoans() {
  return getStoredArray(STORAGE_KEYS.loans);
}

function saveLoans(loans) {
  setStoredArray(STORAGE_KEYS.loans, loans);
}

function borrowBook(bookId) {
  const user = requireLogin();
  if (!user) return { success: false, redirected: true };
  const book = getBookById(bookId);
  if (!book) return { success: false, message: "도서 정보를 찾을 수 없습니다." };
  if (book.loanStatus !== "대출 가능") {
    return { success: false, message: "현재 바로 대출할 수 없는 도서입니다." };
  }
  if (isLoaned(bookId)) {
    return { success: false, message: "이미 대여 목록에 있는 도서입니다." };
  }

  const loans = getLoans();
  const borrowedAt = new Date().toISOString();
  loans.push({
    id: generateId("loan"),
    userId: user.id,
    bookId,
    loanStatus: "대여 중",
    borrowedAt,
    dueDate: addDays(borrowedAt, 14),
  });
  saveLoans(loans);
  return {
    success: true,
    message: `대출이 완료되었습니다. 반납 예정일은 ${formatDate(addDays(borrowedAt, 14))}입니다.`,
  };
}

function removeLoan(loanId) {
  const user = getCurrentUser();
  if (!user) return { success: false, message: "로그인이 필요합니다." };
  const loans = getLoans();
  const exists = loans.some(
    (loan) => loan.id === loanId && loan.userId === user.id,
  );
  if (!exists) return { success: false, message: "대여 정보를 찾을 수 없습니다." };
  saveLoans(
    loans.filter((loan) => !(loan.id === loanId && loan.userId === user.id)),
  );
  return { success: true, message: "대여 목록에서 삭제했습니다." };
}

function isLoaned(bookId) {
  const user = getCurrentUser();
  if (!user) return false;
  return getLoans().some(
    (loan) => loan.userId === user.id && loan.bookId === bookId,
  );
}

function getReservations() {
  return getStoredArray(STORAGE_KEYS.reservations);
}

function saveReservations(reservations) {
  setStoredArray(STORAGE_KEYS.reservations, reservations);
}

function reserveBook(bookId) {
  const user = requireLogin();
  if (!user) return { success: false, redirected: true };
  const book = getBookById(bookId);
  if (!book) return { success: false, message: "도서 정보를 찾을 수 없습니다." };
  if (book.loanStatus === "대출 가능") {
    return { success: false, message: "현재 대출 가능한 도서입니다." };
  }
  if (isReserved(bookId)) {
    return { success: false, message: "이미 예약 신청한 도서입니다." };
  }

  const reservations = getReservations();
  reservations.push({
    id: generateId("res"),
    userId: user.id,
    bookId,
    reservationStatus: "예약 완료",
    createdAt: new Date().toISOString(),
  });
  saveReservations(reservations);
  return {
    success: true,
    message:
      "예약 신청이 완료되었습니다. 마이페이지에서 예약 현황을 확인할 수 있습니다.",
  };
}

function cancelReservation(reservationId) {
  const user = getCurrentUser();
  if (!user) return { success: false, message: "로그인이 필요합니다." };
  const reservations = getReservations();
  const exists = reservations.some(
    (reservation) =>
      reservation.id === reservationId && reservation.userId === user.id,
  );
  if (!exists) {
    return { success: false, message: "예약 정보를 찾을 수 없습니다." };
  }
  saveReservations(
    reservations.filter(
      (reservation) =>
        !(
          reservation.id === reservationId &&
          reservation.userId === user.id
        ),
    ),
  );
  return { success: true, message: "예약을 취소했습니다." };
}

function isReserved(bookId) {
  const user = getCurrentUser();
  if (!user) return false;
  return getReservations().some(
    (reservation) =>
      reservation.userId === user.id && reservation.bookId === bookId,
  );
}

function renderAuthArea() {
  const user = getCurrentUser();
  document.querySelectorAll("[data-auth-area]").forEach((container) => {
    if (user) {
      container.innerHTML = `
        <a class="user-link" href="mypage.html" title="${escapeHTML(user.email)}">${escapeHTML(user.name)}님</a>
        <button class="logout-button" type="button" data-action="logout">로그아웃</button>
      `;
    } else {
      container.innerHTML = `
        <a href="login.html">로그인</a>
        <a class="signup-link" href="signup.html">회원가입</a>
      `;
    }
  });
}

function handleGlobalActions() {
  document.addEventListener("click", async (event) => {
    const trigger = event.target.closest("[data-action]");
    if (!trigger) return;

    const action = trigger.dataset.action;
    const bookId = trigger.dataset.bookId;
    let result = null;

    if (action === "logout") {
      await logoutUser();
      window.location.href = "index.html";
      return;
    }

    if (action === "favorite") {
      result = isFavorite(bookId)
        ? removeFavorite(bookId)
        : addFavorite(bookId);
    }

    if (action === "borrow") {
      result = borrowBook(bookId);
    }

    if (action === "remove-favorite") {
      result = removeFavorite(bookId);
    }

    if (action === "remove-loan") {
      result = removeLoan(trigger.dataset.recordId);
    }

    if (action === "cancel-reservation") {
      result = cancelReservation(trigger.dataset.recordId);
    }

    if (!result || result.redirected) return;
    showToast(result.message);

    const page = getCurrentPage();
    if (page === "mypage") {
      initMyPage();
    } else if (page === "detail") {
      initDetailPage();
    } else {
      refreshRenderedCards();
    }
  });
}

function refreshRenderedCards() {
  document.querySelectorAll("[data-book-card]").forEach((card) => {
    const book = getBookById(card.dataset.bookCard);
    if (book) card.outerHTML = createBookCardMarkup(book);
  });
}

function initHomePage() {
  const featuredBooks = [
    getBookById("book-001"),
    getBookById("book-008"),
    getBookById("book-010"),
    getBookById("book-016"),
  ].filter(Boolean);
  renderBookCards(featuredBooks, document.getElementById("featured-books"));

  const availableCount = document.getElementById("available-count");
  if (availableCount) {
    availableCount.textContent = String(
      mockBooks.filter((book) => book.loanStatus === "대출 가능").length,
    );
  }

  const heroSearch = document.querySelector(".hero-search");
  heroSearch?.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = heroSearch.querySelector('input[name="q"]')?.value.trim() || "";
    if (!query) {
      showToast("검색어를 입력해 주세요.");
      return;
    }
    saveRecentSearch(query);
    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
  });

  document.querySelectorAll("[data-keyword]").forEach((button) => {
    button.addEventListener("click", () => {
      const keyword = button.dataset.keyword;
      saveRecentSearch(keyword);
      window.location.href = `search.html?q=${encodeURIComponent(keyword)}`;
    });
  });

  const recentSearches = getRecentSearches();
  const recentContainer = document.getElementById("recent-searches");
  if (recentContainer && recentSearches.length) {
    recentContainer.hidden = false;
    recentContainer.innerHTML = `최근 검색 ${recentSearches
      .map(
        (query) =>
          `<a href="search.html?q=${encodeURIComponent(query)}">${escapeHTML(query)}</a>`,
      )
      .join("")}`;
  }
}

function initSearchPage() {
  const query = (getQueryParam("q") || "").trim();
  const categoryParam = getQueryParam("category") || "전체";
  const statusParam = getQueryParam("status") || "전체";
  const categoryFilter = document.getElementById("category-filter");
  const sortFilter = document.getElementById("sort-filter");
  const resetButton = document.getElementById("reset-filters");
  const emptyResetButton = document.getElementById("empty-reset");
  const headerInput = document.querySelector(".header-search input");

  if (headerInput) headerInput.value = query;
  if (
    categoryFilter &&
    [...categoryFilter.options].some((option) => option.value === categoryParam)
  ) {
    categoryFilter.value = categoryParam;
  }

  const statusRadio = document.querySelector(
    `input[name="loan-status"][value="${CSS.escape(statusParam)}"]`,
  );
  if (statusRadio) statusRadio.checked = true;

  if (query) saveRecentSearch(query);

  const updateResults = () => {
    const category = categoryFilter?.value || "전체";
    const loanStatus =
      document.querySelector('input[name="loan-status"]:checked')?.value ||
      "전체";
    const sortOption = sortFilter?.value || "default";

    let books = searchBooks(query, getBooks());
    books = filterBooks(books, { category, loanStatus });
    books = sortBooks(books, sortOption);

    const title = document.getElementById("search-title");
    const count = document.getElementById("result-count");
    const activeQuery = document.getElementById("active-query");
    const results = document.getElementById("search-results");
    const empty = document.getElementById("search-empty");

    if (title) {
      title.textContent = query ? `“${query}” 검색 결과` : "전체 도서";
    }
    if (count) count.textContent = String(books.length);
    if (activeQuery) {
      activeQuery.hidden = !query;
      activeQuery.textContent = query
        ? `검색어 “${query}”와 선택한 조건을 함께 적용한 결과입니다.`
        : "";
    }
    if (results) results.hidden = books.length === 0;
    if (empty) empty.hidden = books.length !== 0;
    renderBookCards(books, results);
  };

  categoryFilter?.addEventListener("change", updateResults);
  sortFilter?.addEventListener("change", updateResults);
  document
    .querySelectorAll('input[name="loan-status"]')
    .forEach((radio) => radio.addEventListener("change", updateResults));

  const resetFilters = () => {
    if (categoryFilter) categoryFilter.value = "전체";
    const allStatus = document.querySelector(
      'input[name="loan-status"][value="전체"]',
    );
    if (allStatus) allStatus.checked = true;
    if (sortFilter) sortFilter.value = "default";
    updateResults();
  };

  resetButton?.addEventListener("click", resetFilters);
  emptyResetButton?.addEventListener("click", resetFilters);
  updateResults();
}

function initDetailPage() {
  const container = document.getElementById("book-detail");
  if (!container) return;
  const book = getBookById(getQueryParam("id"));

  if (!book) {
    container.innerHTML = `
      <div class="not-found">
        <span>?</span>
        <h1>도서 정보를 찾을 수 없어요</h1>
        <p>주소가 올바른지 확인하거나 전체 도서에서 다시 찾아보세요.</p>
        <a class="button button-primary" href="search.html">전체 도서 보기</a>
      </div>
    `;
    return;
  }

  document.title = `${book.title} | BOOK TO LEARN & RUN`;
  const favorite = isFavorite(book.id);
  const loaned = isLoaned(book.id);
  const actionButton =
    book.loanStatus === "대출 가능"
      ? `<button class="button button-primary" type="button" data-action="borrow" data-book-id="${book.id}" ${loaned ? "disabled" : ""}>${loaned ? "대여 중인 도서" : "대출하기"}</button>`
      : `<a class="button button-primary" href="reserve.html?id=${encodeURIComponent(book.id)}">예약 신청</a>`;

  container.innerHTML = `
    <article class="detail-panel">
      <div class="detail-cover-area">
        <img src="${escapeHTML(book.thumbnail)}" alt="${escapeHTML(book.title)} 표지" onerror="this.outerHTML='<span class=&quot;cover-fallback&quot; aria-label=&quot;표지 이미지 없음&quot;>B</span>'" />
      </div>
      <div class="detail-content">
        <div class="detail-topline">
          <span class="detail-category">${escapeHTML(book.category.toUpperCase())}</span>
          <span class="status-badge ${getStatusClass(book.loanStatus)}">${escapeHTML(book.loanStatus)}</span>
        </div>
        <h1>${escapeHTML(book.title)}</h1>
        <p class="detail-author">${escapeHTML(book.author)} 지음 · ${escapeHTML(book.publisher)}</p>
        <p class="detail-description">${escapeHTML(book.description)}</p>
        <div class="keyword-list">${book.keywords.map((keyword) => `<span>#${escapeHTML(keyword)}</span>`).join("")}</div>
        <dl class="detail-meta">
          <div><dt>출판사</dt><dd>${escapeHTML(book.publisher)}</dd></div>
          <div><dt>출판일</dt><dd>${formatDate(book.publishedDate)}</dd></div>
          <div><dt>ISBN</dt><dd>${escapeHTML(book.isbn)}</dd></div>
          <div><dt>카테고리</dt><dd>${escapeHTML(book.category)}</dd></div>
          <div><dt>자료실 위치</dt><dd>${escapeHTML(book.location)}</dd></div>
          <div><dt>청구기호</dt><dd>${escapeHTML(book.callNumber)}</dd></div>
        </dl>
        ${book.returnDate ? `<p class="return-notice">예상 반납일 ${formatDate(book.returnDate)} · 반납 후 순차적으로 이용할 수 있습니다.</p>` : ""}
        <div class="detail-actions">
          <button class="button button-secondary favorite-detail ${favorite ? "active" : ""}" type="button" data-action="favorite" data-book-id="${book.id}" aria-pressed="${favorite}">${favorite ? "♥ 찜 취소" : "♡ 찜하기"}</button>
          ${actionButton}
        </div>
        <a class="back-link" href="search.html">← 검색 결과로 돌아가기</a>
      </div>
    </article>
  `;

  const related = getBooks()
    .filter((item) => item.id !== book.id && item.category === book.category)
    .slice(0, 4);
  const relatedSection = document.getElementById("related-section");
  if (related.length && relatedSection) {
    relatedSection.hidden = false;
    renderBookCards(related, document.getElementById("related-books"));
  } else if (relatedSection) {
    relatedSection.hidden = true;
  }
}

function initReservePage() {
  const user = requireLogin();
  if (!user) return;

  const container = document.getElementById("reserve-content");
  if (!container) return;
  const book = getBookById(getQueryParam("id"));

  if (!book) {
    container.innerHTML = `
      <div class="not-found">
        <span>?</span><h1>예약할 도서를 찾을 수 없어요</h1>
        <p>전체 도서 목록에서 다시 선택해 주세요.</p>
        <a class="button button-primary" href="search.html">전체 도서 보기</a>
      </div>
    `;
    return;
  }

  const alreadyReserved = isReserved(book.id);
  const canReserve = book.loanStatus !== "대출 가능";

  container.innerHTML = `
    <div class="reserve-grid">
      <article class="reserve-book-card">
        <div class="reserve-book-summary">
          <img src="${escapeHTML(book.thumbnail)}" alt="${escapeHTML(book.title)} 표지" />
          <div>
            <span class="status-badge ${getStatusClass(book.loanStatus)}">${escapeHTML(book.loanStatus)}</span>
            <h2>${escapeHTML(book.title)}</h2>
            <p>${escapeHTML(book.author)} · ${escapeHTML(book.publisher)}</p>
          </div>
        </div>
        <dl class="reserve-info-list">
          <div><dt>자료실</dt><dd>${escapeHTML(book.location)}</dd></div>
          <div><dt>청구기호</dt><dd>${escapeHTML(book.callNumber)}</dd></div>
          <div><dt>예상 반납일</dt><dd>${book.returnDate ? formatDate(book.returnDate) : "현재 대출 가능"}</dd></div>
        </dl>
      </article>
      <aside class="reserve-guide">
        <p class="eyebrow">BEFORE RESERVATION</p>
        <h2>예약 전 확인해 주세요</h2>
        <ul>
          <li>같은 도서는 한 번만 예약할 수 있습니다.</li>
          <li>대출 가능한 도서는 예약할 수 없습니다.</li>
          <li>예약 도서는 반납 순서와 예약 순번에 따라 이용할 수 있습니다.</li>
          <li>예약 현황과 취소는 마이페이지에서 관리할 수 있습니다.</li>
        </ul>
        ${
          canReserve
            ? `
              <p class="reserve-message" id="reserve-message">${alreadyReserved ? "이미 예약 신청한 도서입니다." : ""}</p>
              <button class="button button-primary button-full" id="reserve-submit" type="button" ${alreadyReserved ? "disabled" : ""}>${alreadyReserved ? "예약 완료" : "예약 신청하기"}</button>
              ${alreadyReserved ? '<a class="button button-secondary button-full" href="mypage.html#reservations-section" style="margin-top:8px">마이페이지에서 확인</a>' : ""}
            `
            : `
              <div class="available-guide">현재 대출 가능한 도서입니다. 예약 대신 바로 대출할 수 있어요.</div>
              <button class="button button-primary button-full" type="button" data-action="borrow" data-book-id="${book.id}" style="margin-top:14px">대출하기</button>
            `
        }
      </aside>
    </div>
  `;

  document.getElementById("reserve-submit")?.addEventListener("click", () => {
    const result = reserveBook(book.id);
    if (!result.success) {
      const message = document.getElementById("reserve-message");
      if (message) message.textContent = result.message;
      return;
    }
    container.innerHTML = `
      <div class="reserve-complete">
        <div class="complete-icon">✓</div>
        <h2>예약 신청이 완료되었습니다.</h2>
        <p>마이페이지에서 예약 현황을 확인할 수 있습니다.</p>
        <a class="button button-primary" href="mypage.html#reservations-section">마이페이지로 이동</a>
        <a class="button button-secondary" href="detail.html?id=${encodeURIComponent(book.id)}">도서 상세 보기</a>
      </div>
    `;
  });
}

function initSignupPage() {
  if (getCurrentUser()) {
    window.location.href = "mypage.html";
    return;
  }

  const form = document.getElementById("signup-form");
  const message = document.getElementById("signup-message");
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    const formData = Object.fromEntries(new FormData(form).entries());
    const result = await signupUser(formData);
    if (submitButton) submitButton.disabled = false;
    if (message) {
      message.textContent = result.message;
      message.classList.toggle("success", result.success);
    }
    if (result.success) {
      form.reset();
      sessionStorage.setItem("btlr_signup_notice", result.message);
      window.setTimeout(() => {
        window.location.href = "login.html?joined=1";
      }, 900);
    }
  });
}

function initLoginPage() {
  if (getCurrentUser()) {
    window.location.href = getSafeNextUrl();
    return;
  }

  const form = document.getElementById("login-form");
  const message = document.getElementById("login-message");
  const notice = sessionStorage.getItem("btlr_login_notice");
  const signupNotice = sessionStorage.getItem("btlr_signup_notice");

  if (getQueryParam("joined") === "1" && message) {
    message.textContent = signupNotice || "회원가입이 완료되었습니다. 로그인해 주세요.";
    message.classList.add("success");
    sessionStorage.removeItem("btlr_signup_notice");
  } else if (notice && message) {
    message.textContent = notice;
    sessionStorage.removeItem("btlr_login_notice");
  }

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    const formData = new FormData(form);
    const result = await loginUser(
      formData.get("email"),
      formData.get("password"),
    );
    if (submitButton) submitButton.disabled = false;
    if (message) {
      message.textContent = result.message;
      message.classList.toggle("success", result.success);
    }
    if (result.success) {
      window.setTimeout(() => {
        window.location.href = getSafeNextUrl();
      }, 450);
    }
  });
}

function initMyPage() {
  const user = requireLogin();
  if (!user) return;

  renderAuthArea();
  const userSummary = document.getElementById("user-summary");
  if (userSummary) {
    userSummary.innerHTML = `
      <div class="welcome-copy">
        <p>MY READING DASHBOARD</p>
        <h1><em>${escapeHTML(user.name)}</em>님의<br />오늘의 서재</h1>
        <span>읽고 싶은 책과 이용 중인 도서를 한곳에서 관리하세요.</span>
      </div>
      <div class="user-card">
        <div class="user-avatar">${escapeHTML(user.name.slice(0, 1).toUpperCase())}</div>
        <div><strong>${escapeHTML(user.name)}</strong><span>${escapeHTML(user.email)}</span></div>
        <small>가입일 ${formatDate(user.createdAt || new Date())} · ${user.role === "admin" ? "관리자" : "도서관 회원"}</small>
      </div>
    `;
  }

  const favorites = getFavorites()
    .filter((record) => record.userId === user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const loans = getLoans()
    .filter((record) => record.userId === user.id)
    .sort((a, b) => new Date(b.borrowedAt) - new Date(a.borrowedAt));
  const reservations = getReservations()
    .filter((record) => record.userId === user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  setText("favorite-count", favorites.length);
  setText("loan-count", loans.length);
  setText("reservation-count", reservations.length);

  renderMyList(
    "favorite-list",
    favorites,
    "favorite",
    "아직 찜한 도서가 없어요",
    "관심 있는 책을 찜하면 이곳에서 빠르게 찾을 수 있어요.",
  );
  renderMyList(
    "loan-list",
    loans,
    "loan",
    "현재 대여한 도서가 없어요",
    "대출 가능한 책을 찾아 나만의 독서 여정을 시작해 보세요.",
  );
  renderMyList(
    "reservation-list",
    reservations,
    "reservation",
    "예약한 도서가 없어요",
    "대출 중인 책을 예약하면 이곳에서 현황을 확인할 수 있어요.",
  );
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = String(value);
}

function renderMyList(containerId, records, type, emptyTitle, emptyText) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!records.length) {
    container.innerHTML = `
      <div class="my-empty">
        <span>${type === "favorite" ? "♡" : type === "loan" ? "↗" : "⌚"}</span>
        <h3>${escapeHTML(emptyTitle)}</h3>
        <p>${escapeHTML(emptyText)}</p>
        <a class="button button-secondary" href="search.html">도서 검색하기</a>
      </div>
    `;
    return;
  }

  container.innerHTML = records
    .map((record) => {
      const book = getBookById(record.bookId);
      if (!book) return "";

      const config = {
        favorite: {
          status: "찜한 도서",
          statusClass: "status-reservable",
          dateLabel: "찜한 날",
          date: record.createdAt,
          action: "remove-favorite",
          actionText: "찜 취소",
        },
        loan: {
          status: record.loanStatus,
          statusClass: "status-my-loan",
          dateLabel: "반납 예정",
          date: record.dueDate,
          action: "remove-loan",
          actionText: "목록 삭제",
        },
        reservation: {
          status: record.reservationStatus,
          statusClass: "status-reserved",
          dateLabel: "신청일",
          date: record.createdAt,
          action: "cancel-reservation",
          actionText: "예약 취소",
        },
      }[type];

      return `
        <article class="my-book-item">
          <a href="detail.html?id=${encodeURIComponent(book.id)}"><img src="${escapeHTML(book.thumbnail)}" alt="${escapeHTML(book.title)} 표지" loading="lazy" /></a>
          <div class="my-book-info">
            <span class="status-badge ${config.statusClass}">${escapeHTML(config.status)}</span>
            <h3>${escapeHTML(book.title)}</h3>
            <p>${escapeHTML(book.author)} · ${escapeHTML(book.publisher)}</p>
            <div class="my-book-meta"><span>${escapeHTML(book.location)}</span><span>${config.dateLabel} ${formatDate(config.date)}</span></div>
          </div>
          <div class="my-book-actions">
            <a href="detail.html?id=${encodeURIComponent(book.id)}">상세 보기</a>
            <button type="button" data-action="${config.action}" data-book-id="${book.id}" data-record-id="${record.id}">${config.actionText}</button>
          </div>
        </article>
      `;
    })
    .join("");
}

document.addEventListener("DOMContentLoaded", initApp);
