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
  /** 인게임 서버 접속 주소 */
  serverAddress: process.env.NEXT_PUBLIC_SERVER_ADDRESS ?? "play.maribel.kr",
  /** 서버 에디션/버전 표기 (실시간 상태 API 부재 → 운영자가 관리) */
  serverEdition: process.env.NEXT_PUBLIC_SERVER_EDITION ?? "Java Edition · 1.21+",
  /** 서버 운영 상태 (실시간 API 없음 → 환경변수로 운영) */
  serverStatus: (process.env.NEXT_PUBLIC_SERVER_STATUS as ServerStatus | undefined) ?? "open",
  /** 마인크래프트 공식 다운로드 */
  minecraftUrl: "https://www.minecraft.net",
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
