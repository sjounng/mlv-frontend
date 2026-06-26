// 사이트 브랜딩/공통 설정. 자리표시 값을 한 곳에서 관리하고, 환경변수로 덮어쓴다.
export const siteConfig = {
  /** 서비스 명 (짧게) */
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "마리벨",
  /** 정식 명칭 */
  fullName: process.env.NEXT_PUBLIC_SITE_FULL_NAME ?? "마이리틀밸리",
  /** 한 줄 소개 */
  tagline: process.env.NEXT_PUBLIC_SITE_TAGLINE ?? "함께 만드는 우리의 마인크래프트 세상",
  /** 인게임 서버 접속 주소 */
  serverAddress: process.env.NEXT_PUBLIC_SERVER_ADDRESS ?? "play.maribel.kr",
  /** 마인크래프트 공식 다운로드 */
  minecraftUrl: "https://www.minecraft.net",
} as const;
