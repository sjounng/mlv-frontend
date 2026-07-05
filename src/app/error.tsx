"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-surface-1 text-center">
      <div className="w-14 h-14 rounded-xl bg-red-500/10 border border-red-400/25 flex items-center justify-center mb-6">
        <AlertTriangle size={26} className="text-red-300/80" />
      </div>
      <h1 className="text-3xl font-bold">문제가 발생했습니다</h1>
      <p className="mt-3 text-sm text-white/50">
        일시적인 오류일 수 있습니다. 다시 시도해도 계속되면 문의해주세요.
      </p>
      <div className="mt-8 flex items-center gap-3">
        <button
          onClick={reset}
          className="focus-ring inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500/15 border border-emerald-400/30 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/25 transition-colors"
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="focus-ring inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm font-semibold text-white/70 hover:bg-white/10 transition-colors"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
