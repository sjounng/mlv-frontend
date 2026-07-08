"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import MinecraftHead from "@/components/minecraft/MinecraftHead";
import MailDropdown from "@/components/MailDropdown";
import ProfileMenu from "@/components/ProfileMenu";
import DownloadButton from "@/components/DownloadButton";

// 최종 네비 구성 (07-08 피드백): 홈 / 이벤트 / 상점 / 마이페이지 / 고객지원
const navLinks = [
  { label: "홈", href: "/" },
  { label: "이벤트", href: "/event" },
  { label: "상점", href: "/shop" },
  { label: "마이페이지", href: "/mypage" },
  { label: "고객지원", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { status, profile, logout } = useAuth();
  const pathname = usePathname();

  // 홈("/")은 정확 일치로만 활성 (모든 경로가 "/" 로 시작하므로)
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-1/80 backdrop-blur-md border-b border-white/8">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16 gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0" aria-label="마리벨 홈">
          <Image
            src="/assets/brand/maribel-logo.png"
            alt="마리벨"
            width={600}
            height={214}
            priority
            className="h-10 w-auto sm:h-12"
          />
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-7 flex-1 justify-center">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`relative py-1 text-sm transition-colors after:absolute after:-bottom-0.5 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-emerald-400 after:origin-center after:transition-transform after:duration-300 after:ease-out ${
                  isActive(link.href)
                    ? "text-white font-medium after:scale-x-100"
                    : "text-white/60 hover:text-white after:scale-x-0 hover:after:scale-x-100"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Actions (장바구니 버튼은 네비바에서 제외 — 07-08 피드백) */}
        <div className="hidden md:flex items-center gap-2 shrink-0 ml-auto">
          {status === "loading" ? (
            <div className="w-20 h-8 rounded-md bg-white/5 animate-pulse" />
          ) : status === "authenticated" && profile ? (
            <div className="flex items-center gap-2">
              {/* 우편함 (운영진 알림/결제 안내) */}
              <MailDropdown />
              {/* 프로필: 클릭 시 닉네임/이메일/로그아웃 패널 */}
              <ProfileMenu />
              {/* 다운로드 버튼 (프로필 우측) */}
              <DownloadButton />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="focus-ring px-4 py-1.5 text-sm text-white bg-white/10 hover:bg-white/15 border border-white/15 rounded-md transition-colors font-medium"
              >
                로그인
              </Link>
              <DownloadButton />
            </div>
          )}
        </div>

        {/* Mobile right: download + hamburger (장바구니 버튼 제외 — 07-08 피드백) */}
        <div className="md:hidden ml-auto flex items-center gap-1">
          <DownloadButton compact />
          {status === "authenticated" && <MailDropdown />}
          <button className="p-2 text-white/70" onClick={() => setMobileOpen(!mobileOpen)} aria-label="메뉴">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface-2 border-t border-white/8 px-4 sm:px-6 py-4 flex flex-col gap-4">
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
                  <MinecraftHead username={profile.minecraftUsername} uuid={profile.minecraftUuid} size="sm" />
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
                className="flex-1 text-center px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-500 rounded-md font-medium text-white transition-colors"
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
