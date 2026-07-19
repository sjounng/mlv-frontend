// 사이트 브랜딩/공통 설정. 자리표시 값을 한 곳에서 관리하고, 환경변수로 덮어쓴다.
export type ServerStatus = "open" | "maintenance" | "closed";

export const siteConfig = {
  /** 공개 사이트 주소 (SEO metadataBase/robots/sitemap 에 사용) */
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://mlv.town",
  /** 서비스 명 (짧게) */
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "마리벨",
  /** 정식 명칭 */
  fullName: process.env.NEXT_PUBLIC_SITE_FULL_NAME ?? "마이리틀밸리",
  /** 한 줄 소개 */
  tagline: process.env.NEXT_PUBLIC_SITE_TAGLINE ?? "함께 만드는 우리의 마인크래프트 세상",
  /** 전용 클라이언트(런처) 다운로드 링크 — 준비되면 채워주세요 */
  clientDownloadUrl: process.env.NEXT_PUBLIC_CLIENT_DOWNLOAD_URL ?? "",
  /** 접속(플레이) 가이드 링크 — 모달의 "가이드 보기"가 새 창으로 엽니다. 준비되면 채워주세요 */
  guideUrl: process.env.NEXT_PUBLIC_GUIDE_URL ?? "",
  /** 메인 트레일러 영상 — 유튜브 embed 주소 또는 mp4 경로. 준비되면 채워주세요 */
  trailerUrl: process.env.NEXT_PUBLIC_TRAILER_URL ?? "",
  /**
   * 웹상점 오픈 여부. 기능 준비 전까지 false 로 두면 상점 진입 시 "준비 중" 팝업으로 막는다.
   * 오픈할 때 true 로 바꾸거나 NEXT_PUBLIC_SHOP_ENABLED=true 로 설정.
   */
  shopEnabled: process.env.NEXT_PUBLIC_SHOP_ENABLED === "true",
  /** 검색엔진 소유확인 코드 (Search Console / 네이버 웹마스터). 발급받아 환경변수로 넣으면 <meta> 로 출력됨 */
  googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
  naverSiteVerification: process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION ?? "",
  /** 공식 SNS 링크 */
  sns: {
    discord: "https://discord.gg/25gh7nza5X",
    naver: "https://cafe.naver.com/mylittlevalley",
    x: "https://x.com/mylittlevalley",
    instagram: "https://www.instagram.com/mylittlevalley.official/",
  },
  /** 서버 에디션/버전 표기 (실시간 상태 API 부재 → 운영자가 관리) */
  serverEdition: process.env.NEXT_PUBLIC_SERVER_EDITION ?? "Java Edition · 1.21+",
  /** 서버 운영 상태 (실시간 API 없음 → 환경변수로 운영) */
  serverStatus: (process.env.NEXT_PUBLIC_SERVER_STATUS as ServerStatus | undefined) ?? "open",
  /** 마인크래프트 공식 다운로드 */
  minecraftUrl: "https://www.minecraft.net",
} as const;

// ─────────────────────────────────────────────────────────────
// 메인 스크롤 쇼케이스 콘텐츠 (홈 = 스크롤 스냅 단일 페이지)
//   웹패널(운영자 편집) 기능은 추후 구현 예정 → 그전까지 코드에서 편집한다.
//   - intro: 첫 섹션 헤드라인
//   - sections: 소개 섹션들(좌측 제목+본문 / 우측 이미지·영상)
//   - download: 마지막 "다운로드 권장" 섹션 (titleEmColor 로 강조 색 커스텀)
// ─────────────────────────────────────────────────────────────
export type ShowcaseSection = {
  titleTop: string;
  titleEm: string;
  titleBottom: string;
  body: string;
  /** 우측 미디어: 이미지 경로 또는 mp4/유튜브 embed URL. 비우면 플레이스홀더 */
  media?: string;
  /** NEW 뱃지 표시 */
  isNew?: boolean;
};

// 홈 최하단 3분할 패널의 서버위키 링크 (07-12 피드백). URL 이 비어 있으면 "준비 중" 처리.
//   위키 사이트가 열리면 여기에 주소만 채우면 된다. (운영자 패널 편집은 추후 웹패널 라운드에서)
export const wikiLinks = {
  main: { label: "서버 가이드", desc: "처음 오셨다면 위키를 먼저 확인해보세요", url: "" },
  tutorial: { label: "플레이 튜토리얼", desc: "접속부터 정착까지 차근차근", url: "" },
  system: { label: "게임 시스템", desc: "직업·경제·컨텐츠 시스템 설명", url: "" },
  faq: { label: "자주 묻는 질문", desc: "궁금한 점 빠르게 해결하기", url: "/info/faq" },
} as const;

export const mainShowcase = {
  intro: {
    titleTop: "MLV에서 시작하는",
    titleBottom: "나만의 마인크래프트",
  },
  sections: [
    {
      titleTop: "",
      titleEm: "제목 1",
      titleBottom: "",
      body: "내용 1 — 서버 내 콘텐츠/아트를 소개하는 섹션입니다. (운영자 편집 예정)",
      media: "",
      isNew: true,
    },
    {
      titleTop: "",
      titleEm: "제목 2",
      titleBottom: "",
      body: "내용 2 — 두 번째 소개 섹션입니다. 좌측 제목·본문, 우측 이미지 또는 영상. (운영자 편집 예정)",
      media: "",
    },
  ] as ShowcaseSection[],
  download: {
    titleTop: "지금",
    titleEm: "마이리틀밸리",
    titleBottom: "에서 함께해요",
    /** 강조어 색 (운영자 커스텀 예정) */
    titleEmColor: "#34d399",
    body: "전용 런처를 내려받아 나만의 마인크래프트 여정을 시작하세요.",
  },
} as const;

// 통신판매업 법적 표기 정보. 실제 사업자 정보로 교체하거나 환경변수로 덮어쓴다.
// (실서비스 전 반드시 실제 값으로 채워야 함)
export const businessInfo: { label: string; value: string }[] = [
  { label: "상호", value: process.env.NEXT_PUBLIC_BIZ_NAME ?? "마이리틀밸리" },
  { label: "대표자", value: process.env.NEXT_PUBLIC_BIZ_CEO ?? "김민수" },
  { label: "사업자 등록번호", value: process.env.NEXT_PUBLIC_BIZ_REG_NO ?? "123-45-67890" },
  { label: "통신판매업 신고번호", value: process.env.NEXT_PUBLIC_BIZ_MAILORDER_NO ?? "제 2026-서울강남-0123 호" },
  { label: "주소", value: process.env.NEXT_PUBLIC_BIZ_ADDRESS ?? "서울특별시 강남구 테헤란로 152, 5층" },
  { label: "호스팅 제공", value: process.env.NEXT_PUBLIC_BIZ_HOSTING ?? "Stella IT, Inc." },
  { label: "고객센터", value: process.env.NEXT_PUBLIC_BIZ_SUPPORT ?? "support@maribel.kr · 1577-0000" },
  { label: "운영 시간", value: process.env.NEXT_PUBLIC_BIZ_HOURS ?? "평일 10:00 - 18:00 (점심 12:00 - 13:00)" },
];
