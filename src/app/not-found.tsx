import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-surface-1 text-center">
      <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
        <Compass size={26} className="text-white/40" />
      </div>
      <h1 className="text-3xl font-bold">페이지를 찾을 수 없습니다</h1>
      <p className="mt-3 text-sm text-white/50">
        주소가 잘못되었거나 삭제된 페이지입니다.
      </p>
      <Link
        href="/"
        className="focus-ring mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500/15 border border-emerald-400/30 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/25 transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
