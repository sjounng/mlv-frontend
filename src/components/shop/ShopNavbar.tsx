"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, ChevronDown } from "lucide-react";

const shopTabs = [
  { label: "홈", href: "/shop" },
  { label: "마공학", href: "/shop?cat=magic" },
  { label: "멤버십", href: "/shop?cat=membership" },
  { label: "스탬업", href: "/shop?cat=stamup" },
  { label: "치장품", href: "/shop?cat=cosmetic" },
];

interface ShopNavbarProps {
  activeTab?: string;
}

export default function ShopNavbar({ activeTab = "홈" }: ShopNavbarProps) {
  const [cartCount] = useState(3);

  return (
    <header className="sticky top-0 z-50 bg-[#111111] border-b border-white/8">
      <div className="flex items-center h-14 px-6 gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 mr-2">
          <div className="w-8 h-8 border-2 border-white/60 rounded flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
          </div>
          <div className="leading-none">
            <p className="text-xs font-bold text-white/90 uppercase tracking-wide">Server Logo</p>
            <p className="text-[10px] text-white/35 uppercase tracking-widest">Official Webshop</p>
          </div>
        </Link>

        {/* Category Tabs */}
        <nav className="flex items-center h-full gap-1 flex-1">
          {shopTabs.map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              className={`relative h-full flex items-center px-4 text-sm transition-colors ${
                activeTab === tab.label
                  ? "text-white font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button className="p-2 text-white/50 hover:text-white transition-colors">
            <Search size={17} />
          </button>

          {/* User */}
          <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 rounded-lg transition-colors">
            <div className="w-6 h-6 rounded bg-yellow-600/80 flex items-center justify-center text-[10px] font-bold">
              S
            </div>
            <span className="text-sm text-white/70">Steve_KR</span>
            <ChevronDown size={13} className="text-white/40" />
          </button>

          {/* Cart */}
          <button className="relative flex items-center gap-1.5 px-3 py-1.5 hover:bg-white/5 rounded-lg transition-colors">
            <ShoppingCart size={17} className="text-white/70" />
            <span className="text-sm text-white/70">장바구니</span>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-white text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
