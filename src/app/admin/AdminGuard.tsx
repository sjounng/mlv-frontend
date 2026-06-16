"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ShieldAlert, Loader2 } from "lucide-react";
import { api, ApiError, refreshAccessToken } from "@/lib/api";

type GuardState = "checking" | "allowed" | "denied";

/**
 * 관리자 페이지 클라이언트 가드.
 * 관리자 계정은 회원(Member)과 분리되어 있어 회원 프로필로는 판별할 수 없으므로,
 * 관리자 전용 엔드포인트(/api/admin/dashboard)를 호출해 권한을 확인한다.
 * 권한이 없으면 관리자 UI 를 노출하지 않는다.
 */
export default function AdminGuard({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GuardState>("checking");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // AuthProvider 부트스트랩과 독립적으로 동작할 수 있도록 토큰을 먼저 확보한다.
      await refreshAccessToken();
      try {
        await api.get("/api/admin/dashboard");
        if (!cancelled) setState("allowed");
      } catch (error) {
        if (cancelled) return;
        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          setState("denied");
        } else {
          // 네트워크 오류 등은 접근 차단으로 처리한다 (안전 측면).
          setState("denied");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-1 text-white/50">
        <Loader2 className="animate-spin" size={22} />
      </div>
    );
  }

  if (state === "denied") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center bg-surface-1">
        <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-300 flex items-center justify-center">
          <ShieldAlert size={22} />
        </div>
        <div>
          <h1 className="text-lg font-semibold">관리자 권한이 필요합니다</h1>
          <p className="mt-1.5 text-sm text-white/50">
            관리자 계정으로 로그인 후 다시 시도해 주세요.
          </p>
        </div>
        <Link
          href="/login"
          className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 border border-white/20 rounded-md transition-colors"
        >
          로그인으로 이동
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
