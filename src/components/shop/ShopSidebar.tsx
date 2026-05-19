"use client";

import Link from "next/link";
import { Home, Star, Package, Coins, Sword, Settings, Palette, MoreHorizontal, MessageCircle, Info } from "lucide-react";

const categories = [
  { label: "전체 상품", icon: Home, href: "/shop", id: "all" },
  { label: "추천 상품", icon: Star, href: "/shop?cat=featured", id: "featured" },
  { label: "패키지", icon: Package, href: "/shop?cat=package", id: "package" },
  { label: "재화", icon: Coins, href: "/shop?cat=currency", id: "currency" },
  { label: "게임 아이템", icon: Sword, href: "/shop?cat=item", id: "item" },
  { label: "편의 기능", icon: Settings, href: "/shop?cat=utility", id: "utility" },
  { label: "치장 아이템", icon: Palette, href: "/shop?cat=cosmetic", id: "cosmetic" },
  { label: "기타", icon: MoreHorizontal, href: "/shop?cat=etc", id: "etc" },
];

const notices = [
  "구매한 상품은 서버 내에서 자동으로 지급됩니다.",
  "결제 후 문제가 발생하면 문의 페이지를 이용해주세요.",
  "환불 및 기타 정책은 문의 페이지에서 확인하세요.",
];

interface ShopSidebarProps {
  activeCategory?: string;
}

export default function ShopSidebar({ activeCategory = "all" }: ShopSidebarProps) {
  return (
    <aside className="w-52 shrink-0 flex flex-col gap-6">
      {/* Categories */}
      <div>
        <p className="text-xs text-white/35 font-medium uppercase tracking-wider px-3 mb-2">
          카테고리
        </p>
        <ul className="flex flex-col gap-0.5">
          {categories.map((cat) => {
            const active = cat.id === activeCategory;
            return (
              <li key={cat.id}>
                <Link
                  href={cat.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    active
                      ? "bg-white/10 text-white font-medium"
                      : "text-white/50 hover:text-white/80 hover:bg-white/5"
                  }`}
                >
                  <cat.icon size={15} className={active ? "text-white" : "text-white/40"} />
                  {cat.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Purchase Guide */}
      <div className="bg-white/3 border border-white/8 rounded-xl p-4">
        <p className="text-xs font-semibold text-white/60 mb-3">구매 안내</p>
        <ul className="flex flex-col gap-2.5">
          {notices.map((notice, i) => (
            <li key={i} className="flex gap-2 items-start">
              <Info size={12} className="text-white/25 mt-0.5 shrink-0" />
              <p className="text-xs text-white/40 leading-relaxed">{notice}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Help */}
      <div className="bg-white/3 border border-white/8 rounded-xl p-4">
        <p className="text-sm font-semibold mb-1">도움이 필요하신가요?</p>
        <p className="text-xs text-white/40 mb-4 leading-relaxed">
          상품 구매 관련 문의는 문의 페이지를 이용해주세요.
        </p>
        <Link
          href="/contact"
          className="flex items-center justify-between w-full px-3 py-2 bg-white/8 hover:bg-white/12 border border-white/10 rounded-lg text-sm transition-colors"
        >
          <span>문의하기</span>
          <MessageCircle size={13} className="text-white/50" />
        </Link>
      </div>
    </aside>
  );
}
