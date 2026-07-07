import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { siteConfig } from "@/lib/site-config";
import ServerShowcase from "./ServerShowcase";

export const metadata: Metadata = {
  title: "서버정보",
  description: `${siteConfig.fullName} 마인크래프트 서버 소개 페이지입니다.`,
};

export default function ServerInfoPage() {
  return (
    <>
      <Navbar />
      {/* 쇼케이스가 자체 스크롤 컨테이너(페이지 스냅)이며 푸터까지 포함한다 */}
      <main>
        <ServerShowcase />
      </main>
    </>
  );
}
