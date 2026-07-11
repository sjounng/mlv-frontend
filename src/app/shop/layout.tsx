import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ShopGate from "@/components/shop/ShopGate";

export const metadata: Metadata = {
  title: "웹상점",
  description: "캐시 충전과 아이템 구매를 지원하는 마이리틀밸리 공식 웹상점입니다.",
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-surface-1">
      <Navbar />
      <div className="pt-16 flex flex-1 flex-col">
        {/* 상점 활성/비활성은 웹패널(관리자)에서 제어 — 비활성 시 관리자만 접근 (07-10 피드백) */}
        <ShopGate>{children}</ShopGate>
      </div>
    </div>
  );
}
