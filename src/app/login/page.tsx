import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Card, Separator } from "@/components/ui";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-surface-1">
      <Link href="/" className="flex items-center gap-2.5 mb-8">
        <div className="w-9 h-9 border-2 border-white/80 rounded flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-white/90 uppercase tracking-wide leading-none">마리벨</p>
          <p className="text-xs text-white/35 mt-0.5">마이리틀밸리 공식</p>
        </div>
      </Link>

      <Card padding="lg" className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">마리벨 로그인</h1>
          <p className="mt-2 text-sm text-white/50">
            마인크래프트 정품 계정으로 로그인하세요
          </p>
        </div>

        <button
          type="button"
          className="mt-7 w-full flex items-center justify-center gap-3 bg-white text-black hover:bg-white/90 transition-colors rounded-xl py-3.5 font-medium"
        >
          <MicrosoftLogo />
          <span>Microsoft 계정으로 계속하기</span>
        </button>

        <Separator label="또는" className="my-6" />

        <div className="flex items-start gap-3 p-4 bg-blue-500/5 border border-blue-500/15 rounded-lg">
          <ShieldCheck size={18} className="text-blue-300 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-white/85 font-medium">정품 계정만 접속 가능합니다</p>
            <p className="mt-1 text-xs text-white/50 leading-relaxed">
              마리벨은 Mojang/Microsoft 인증된 마인크래프트 자바 에디션 정품 계정으로만 접속할 수 있습니다.
            </p>
          </div>
        </div>

        <p className="mt-6 text-xs text-white/40 text-center leading-relaxed">
          로그인하면{" "}
          <Link href="/info/terms" className="text-white/70 underline">이용약관</Link>
          {" 및 "}
          <Link href="/info/privacy" className="text-white/70 underline">개인정보처리방침</Link>
          에 동의하는 것으로 간주됩니다.
        </p>

        <p className="mt-3 text-xs text-white/35 text-center">
          처음 로그인 시 자동으로 회원가입됩니다.
        </p>
      </Card>

      <Link href="/" className="mt-8 text-xs text-white/40 hover:text-white/70">
        ← 홈으로 돌아가기
      </Link>
    </div>
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
