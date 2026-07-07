import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ShopComingSoon from "@/components/shop/ShopComingSoon";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "웹상점",
  description: "캐시 충전과 아이템 구매를 지원하는 마이리틀밸리 공식 웹상점입니다.",
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-surface-1">
      <Navbar />
      <div className="pt-16 flex flex-1 flex-col">
        {/* 상점 미오픈 시 준비 중 게이트로 막는다 (프론트 전용 토글) */}
        {siteConfig.shopEnabled ? children : <ShopComingSoon />}
      </div>
    </div>
  );
}
