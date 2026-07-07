"use client";

// 회원가입 약관 동의 (피드백 7번)
// 신규 가입자는 agreedTermsAt 이 비어 있고, AuthProvider 가 이 페이지로 보낸다.
// 필수 2건(이용약관·개인정보) 동의 후 POST /api/me/agree-terms 로 기록한다.

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/ui";

interface TermsDoc {
  id: number;
  type: "TERMS" | "PRIVACY";
  version: string;
  content: string;
}

function ConsentBox({
  title,
  required,
  content,
  checked,
  onToggle,
}: {
  title: string;
  required?: boolean;
  content?: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      {content !== undefined && (
        <div className="h-36 overflow-y-auto bg-white/[0.03] border border-white/10 rounded-md p-4 text-xs text-white/55 leading-relaxed whitespace-pre-wrap mb-2.5">
          {content || "약관 내용을 불러오지 못했습니다."}
        </div>
      )}
      <label className="flex items-center gap-2.5 cursor-pointer select-none">
        <button
          type="button"
          role="checkbox"
          aria-checked={checked}
          onClick={onToggle}
          className={`focus-ring w-5 h-5 rounded-sm border flex items-center justify-center transition-colors ${
            checked ? "bg-emerald-600 border-emerald-500" : "bg-white/5 border-white/20 hover:border-white/40"
          }`}
        >
          {checked && <Check size={13} strokeWidth={3} />}
        </button>
        <span className="text-sm text-white/80" onClick={onToggle}>
          {title}{" "}
          {required ? (
            <span className="text-emerald-300/80 text-xs">(필수)</span>
          ) : (
            <span className="text-white/35 text-xs">(선택)</span>
          )}
        </span>
      </label>
    </div>
  );
}

export default function SignupTermsPage() {
  const router = useRouter();
  const { status, profile, refresh } = useAuth();
  const { toast } = useToast();

  const [terms, setTerms] = useState<TermsDoc | null>(null);
  const [privacy, setPrivacy] = useState<TermsDoc | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void api.get<TermsDoc>("/api/legal/terms/latest?type=TERMS").then(setTerms).catch(() => setTerms(null));
    void api.get<TermsDoc>("/api/legal/terms/latest?type=PRIVACY").then(setPrivacy).catch(() => setPrivacy(null));
  }, []);

  // 비로그인 접근 → 로그인으로, 이미 동의한 회원 → 홈으로
  useEffect(() => {
    if (status === "anonymous") router.replace("/login");
    if (status === "authenticated" && profile?.agreedTermsAt) router.replace("/");
  }, [status, profile, router]);

  const submit = useCallback(async () => {
    if (!agreeTerms || !agreePrivacy || submitting) return;
    setSubmitting(true);
    try {
      await api.post("/api/me/agree-terms", { marketingAgreed: agreeMarketing });
      await refresh();
      toast({ title: "가입 완료", description: "마이리틀밸리에 오신 것을 환영합니다!", variant: "success" });
      router.replace("/");
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "동의 처리에 실패했습니다.";
      toast({ title: "오류", description: message, variant: "error" });
      setSubmitting(false);
    }
  }, [agreeTerms, agreePrivacy, agreeMarketing, submitting, refresh, router, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16 bg-surface-1">
      <div className="w-full max-w-lg bg-surface-3 border border-white/10 rounded-lg shadow-[0_4px_0_rgba(0,0,0,0.4)] p-8">
        <h1 className="text-2xl mb-2">약관 동의</h1>
        <p className="text-sm text-white/45 mb-8">
          마이리틀밸리 가입을 위해 아래 약관에 동의해주세요.
        </p>

        <div className="flex flex-col gap-7">
          <ConsentBox
            title="이용약관에 동의합니다"
            required
            content={terms?.content ?? ""}
            checked={agreeTerms}
            onToggle={() => setAgreeTerms((v) => !v)}
          />
          <ConsentBox
            title="개인정보 수집 및 이용에 동의합니다"
            required
            content={privacy?.content ?? ""}
            checked={agreePrivacy}
            onToggle={() => setAgreePrivacy((v) => !v)}
          />
          <ConsentBox
            title="이벤트·혜택 알림 수신에 동의합니다"
            checked={agreeMarketing}
            onToggle={() => setAgreeMarketing((v) => !v)}
          />
        </div>

        <button
          type="button"
          onClick={() => void submit()}
          disabled={!agreeTerms || !agreePrivacy || submitting}
          className="focus-ring mt-9 w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-semibold text-sm transition-[background-color,box-shadow,transform] duration-150 shadow-[0_3px_0_0_#065f46] active:translate-y-[2px] active:shadow-[0_1px_0_0_#065f46] disabled:bg-emerald-600/30 disabled:text-white/40 disabled:shadow-none disabled:cursor-not-allowed"
        >
          {submitting && <Loader2 size={15} className="animate-spin" />}
          동의하고 시작하기
        </button>
      </div>
    </div>
  );
}
