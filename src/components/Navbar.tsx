"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, ShoppingCart } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { siteConfig } from "@/lib/site-config";
import MinecraftHead from "@/components/minecraft/MinecraftHead";

const navLinks = [
  { label: "소개", href: "/introduce" },
  { label: "서버정보", href: "/info" },
  { label: "웹상점", href: "/shop" },
  { label: "이벤트", href: "/event" },
  { label: "문의", href: "/contact" },
];

function BlockLogo() {
  return (
    <div className="w-8 h-8 rounded-md bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center">
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-emerald-300">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { status, profile, logout } = useAuth();
  const { count } = useCart();
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d0d]/85 backdrop-blur-sm border-b border-white/8">
      <nav className="max-w-7xl mx-auto px-6 flex items-center h-16 gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <BlockLogo />
          <div className="leading-none">
            <p className="font-bold text-sm tracking-wide text-white/90">{siteConfig.name}</p>
            <p className="text-[10px] text-white/35 tracking-wider">{siteConfig.fullName}</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-7 flex-1 justify-center">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-sm transition-colors ${
                  isActive(link.href) ? "text-white font-medium" : "text-white/60 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-2 shrink-0 ml-auto">
          <Link
            href="/shop/cart"
            className="relative p-2 text-white/60 hover:text-white transition-colors"
            aria-label="장바구니"
          >
            <ShoppingCart size={18} />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-emerald-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          {status === "loading" ? (
            <div className="w-20 h-8 rounded-md bg-white/5 animate-pulse" />
          ) : status === "authenticated" && profile ? (
            <div className="flex items-center gap-2">
              <Link
                href="/mypage"
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-white/80 hover:text-white border border-white/15 rounded-md transition-colors"
              >
                <MinecraftHead username={profile.minecraftUsername} size="sm" />
                <span className="max-w-[120px] truncate">{profile.minecraftUsername}</span>
              </Link>
              <button
                type="button"
                onClick={() => void logout()}
                className="p-2 text-white/50 hover:text-white transition-colors"
                aria-label="로그아웃"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-1.5 text-sm text-white bg-emerald-500/90 hover:bg-emerald-500 rounded-md transition-colors font-medium"
            >
              로그인
            </Link>
          )}
        </div>

        {/* Mobile right: cart + hamburger */}
        <div className="md:hidden ml-auto flex items-center gap-1">
          <Link href="/shop/cart" className="relative p-2 text-white/70" aria-label="장바구니">
            <ShoppingCart size={19} />
            {count > 0 && (
              <span className="absolute top-0 right-0 min-w-4 h-4 px-1 bg-emerald-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <button className="p-2 text-white/70" onClick={() => setMobileOpen(!mobileOpen)} aria-label="메뉴">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#111111] border-t border-white/8 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${isActive(link.href) ? "text-white font-medium" : "text-white/65 hover:text-white"}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2 border-t border-white/10">
            {status === "authenticated" && profile ? (
              <>
                <Link
                  href="/mypage"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm bg-white/10 border border-white/20 rounded-md"
                >
                  <MinecraftHead username={profile.minecraftUsername} size="sm" />
                  {profile.minecraftUsername}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    void logout();
                  }}
                  className="flex items-center justify-center px-4 py-2 text-sm border border-white/20 rounded-md text-white/70"
                  aria-label="로그아웃"
                >
                  <LogOut size={15} />
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center px-4 py-2 text-sm bg-emerald-500/90 rounded-md font-medium text-white"
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
