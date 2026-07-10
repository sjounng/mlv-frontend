"use client";

// 네비바 프로필 메뉴 (피드백 2번)
// - 프로필(스킨 아바타 + 닉네임) 클릭 시 패널 활성화
// - 패널: 닉네임(> , 클릭 시 마이페이지>내정보), 이메일, 로그아웃
// - 호버: 닉네임/로그아웃 밑줄

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/lib/auth";
import MinecraftHead from "@/components/minecraft/MinecraftHead";

export default function ProfileMenu() {
  const { profile, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const onLogout = useCallback(() => {
    setOpen(false);
    void logout();
  }, [logout]);

  if (!profile) return null;

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="focus-ring group flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-white/80 hover:text-white transition-colors"
      >
        <MinecraftHead username={profile.minecraftUsername} uuid={profile.minecraftUuid} size="sm" />
        {/* 호버 시 중앙→좌우로 퍼지는 밑줄 (07-08 피드백 6) */}
        <span className="relative max-w-[120px] truncate py-0.5 after:absolute after:-bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-emerald-400 after:origin-center after:scale-x-0 after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100">
          {profile.minecraftUsername}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-surface-3 border border-white/10 rounded-lg shadow-[0_4px_0_rgba(0,0,0,0.4)] z-50 overflow-hidden">
          <div className="p-4 border-b border-white/8">
            {/* 닉네임: 클릭 시 마이페이지 > 내 정보. 호버 시 밑줄 */}
            <Link
              href="/mypage"
              onClick={() => setOpen(false)}
              className="focus-ring group inline-flex items-center gap-1 font-semibold text-white hover:underline underline-offset-4"
            >
              {profile.minecraftUsername}
              <ChevronRight size={15} className="text-white/40 group-hover:text-white/70 transition-colors" />
            </Link>
            <p className="mt-1 text-xs text-white/40 truncate">{profile.email ?? "이메일 정보 없음"}</p>
          </div>
          {/* 어드민(OPERATOR/SUPER_ADMIN)만 대시보드 진입 버튼 노출 */}
          {(profile.role === "OPERATOR" || profile.role === "SUPER_ADMIN") && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="focus-ring flex items-center gap-2 px-4 py-3 text-sm text-emerald-300 hover:bg-white/5 border-b border-white/8 transition-colors"
            >
              <LayoutDashboard size={15} />
              관리자 대시보드
            </Link>
          )}
          <button
            type="button"
            onClick={onLogout}
            className="focus-ring w-full text-left px-4 py-3 text-sm text-[#e23a3a] hover:underline underline-offset-4"
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}
