import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "서버 소개",
  description: "마이리틀밸리 서버의 콘텐츠와 커뮤니티를 소개합니다.",
};

export default function IntroduceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
