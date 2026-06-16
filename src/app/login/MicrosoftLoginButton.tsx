"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/components/ui";

interface AuthorizeUrlResponse {
  authorizationUrl: string | null;
  configured: boolean;
}

export default function MicrosoftLoginButton() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    setLoading(true);
    try {
      const res = await api.get<AuthorizeUrlResponse>(
        "/api/auth/microsoft/authorize-url",
      );
      if (!res.configured || !res.authorizationUrl) {
        toast({
          title: "Microsoft 로그인이 아직 설정되지 않았습니다",
          description: "Azure 앱 등록 후 이용할 수 있어요. (관리자에게 문의)",
          variant: "warning",
        });
        return;
      }
      window.location.href = res.authorizationUrl;
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "로그인을 시작하지 못했습니다.";
      toast({ title: "로그인 오류", description: message, variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="mt-7 w-full flex items-center justify-center gap-3 bg-white text-black hover:bg-white/90 disabled:opacity-60 transition-colors rounded-xl py-3.5 font-medium"
    >
      {loading ? (
        <Loader2 className="animate-spin" size={18} />
      ) : (
        <MicrosoftLogo />
      )}
      <span>Microsoft 계정으로 계속하기</span>
    </button>
  );
}

function MicrosoftLogo() {
  return (
    <svg viewBox="0 0 23 23" className="w-5 h-5" aria-hidden="true">
      <rect x="1" y="1" width="10" height="10" fill="#F25022" />
      <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
      <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
      <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
    </svg>
  );
}
