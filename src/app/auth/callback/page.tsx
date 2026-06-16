"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/ui";

function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { status } = useAuth();
  const { toast } = useToast();

  const error = params.get("error");

  useEffect(() => {
    if (error) {
      toast({
        title: "로그인에 실패했습니다",
        description: errorMessage(error),
        variant: "error",
      });
      router.replace("/login");
      return;
    }
    // 백엔드가 refresh 쿠키를 설정한 뒤 리다이렉트했으므로,
    // AuthProvider 부트스트랩이 세션을 확보하면 마이페이지로 이동한다.
    if (status === "authenticated") {
      router.replace("/mypage");
    } else if (status === "anonymous") {
      toast({ title: "세션을 확인하지 못했습니다", variant: "warning" });
      router.replace("/login");
    }
  }, [error, status, router, toast]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-white/60">
      <Loader2 className="animate-spin" size={26} />
      <p className="text-sm">로그인 처리 중…</p>
    </div>
  );
}

function errorMessage(code: string): string {
  switch (code) {
    case "MC_PROFILE_NOT_FOUND":
      return "마인크래프트 자바 에디션 정품 계정이 아닙니다.";
    case "MICROSOFT_NOT_CONFIGURED":
      return "Microsoft 로그인이 아직 설정되지 않았습니다.";
    case "access_denied":
      return "로그인이 취소되었습니다.";
    default:
      return "잠시 후 다시 시도해 주세요.";
  }
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-white/50">
          <Loader2 className="animate-spin" size={26} />
        </div>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
