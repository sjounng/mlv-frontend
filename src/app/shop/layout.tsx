import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "웹상점",
  description: "캐시 충전과 아이템 구매를 지원하는 마이리틀밸리 공식 웹상점입니다.",
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-surface-1">
      <Navbar />
      <div className="pt-16 flex flex-1 flex-col">{children}</div>
    </div>
  );
}
