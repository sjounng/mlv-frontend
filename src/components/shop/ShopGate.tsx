"use client";

// 웹상점 활성/비활성 게이트 (07-10 피드백).
// - 활성: 그대로 노출
// - 비활성 + 일반 유저: 접근 차단 안내
// - 비활성 + 오퍼레이터 이상: 상단 경고 배너와 함께 접근 허용
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Lock, Store } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function ShopGate({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    void api
      .get<{ enabled: boolean }>("/api/public/shop-status")
      .then((r) => setEnabled(r.enabled))
      .catch(() => setEnabled(true)); // 조회 실패 시 막지 않음
  }, []);

  const isAdmin = profile?.role === "OPERATOR" || profile?.role === "SUPER_ADMIN";

  if (enabled === null) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh] text-white/40">
        <Loader2 className="animate-spin" size={22} />
      </div>
    );
  }

  // 비활성 + 관리자 아님 → 차단
  if (!enabled && !isAdmin) {
    return (
      <div className="relative flex-1 min-h-[70vh]">
        <div className="absolute inset-0 bg-surface-1/60 backdrop-blur-sm" aria-hidden />
        <div className="relative z-10 flex items-center justify-center min-h-[70vh] px-6">
          <div className="w-full max-w-md text-center bg-surface-3 border border-white/10 rounded-lg shadow-[0_6px_0_rgba(0,0,0,0.45)] p-8">
            <div className="w-14 h-14 mx-auto rounded-xl bg-emerald-500/12 border border-emerald-400/25 flex items-center justify-center mb-5">
              <Store size={26} className="text-emerald-300" />
            </div>
            <h1 className="text-xl font-bold mb-2">현재 상점이 비활성화 상태입니다</h1>
            <p className="text-sm text-white/50 leading-relaxed break-keep">
              웹상점은 현재 준비 중입니다. 정식 오픈 시 공지와 이벤트로 안내해 드릴게요. 조금만 기다려 주세요!
            </p>
            <Link
              href="/"
              className="focus-ring inline-flex items-center gap-2 mt-7 px-5 py-2.5 rounded-md text-sm font-semibold whitespace-nowrap bg-emerald-600 text-white shadow-[0_3px_0_0_#065f46] hover:bg-emerald-500 active:translate-y-[2px] active:shadow-[0_1px_0_0_#065f46] transition-[background-color,box-shadow,transform] duration-150"
            >
              <ArrowLeft size={15} />
              메인으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 비활성 상태에서 관리자에게만 보이는 경고 배너 */}
      {!enabled && isAdmin && (
        <div className="bg-amber-500/12 border-b border-amber-400/25 text-amber-200 px-6 py-2.5 text-sm flex items-center justify-center gap-2 text-center">
          <Lock size={14} className="shrink-0" />
          현재 상점이 비활성화 상태입니다 <span className="text-amber-200/70">(관리자만 접근 가능)</span>
        </div>
      )}
      {children}
    </>
  );
}
