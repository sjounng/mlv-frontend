"use client";

// 웹상점 준비 중 게이트 (프론트 전용, 피드백 3번)
// - siteConfig.shopEnabled === false 일 때 상점 진입을 막는다.
// - 배경(상점 프리뷰)은 톤다운, 중앙에 "준비 중" 팝업을 강조.

import Link from "next/link";
import { Store, ArrowLeft } from "lucide-react";

export default function ShopComingSoon() {
  return (
    <div className="relative flex-1 min-h-[70vh]">
      {/* 톤다운된 배경 (상점 자리) */}
      <div className="absolute inset-0 bg-surface-1/60 backdrop-blur-sm" aria-hidden />

      {/* 중앙 강조 팝업 */}
      <div className="relative z-10 flex items-center justify-center min-h-[70vh] px-6">
        <div className="w-full max-w-md text-center bg-surface-3 border border-white/10 rounded-lg shadow-[0_6px_0_rgba(0,0,0,0.45)] p-8">
          <div className="w-14 h-14 mx-auto rounded-xl bg-emerald-500/12 border border-emerald-400/25 flex items-center justify-center mb-5">
            <Store size={26} className="text-emerald-300" />
          </div>
          <h1 className="text-xl font-bold mb-2">준비 중인 기능입니다</h1>
          <p className="text-sm text-white/50 leading-relaxed break-keep">
            웹상점은 현재 오픈 준비 중입니다. 정식 오픈 시 공지와 이벤트로 안내해 드릴게요.
            조금만 기다려 주세요!
          </p>
          <Link
            href="/"
            className="focus-ring inline-flex items-center gap-2 mt-7 px-5 py-2.5 rounded-md text-sm font-semibold bg-emerald-600 text-white shadow-[0_3px_0_0_#065f46] hover:bg-emerald-500 active:translate-y-[2px] active:shadow-[0_1px_0_0_#065f46] transition-[background-color,box-shadow,transform] duration-150"
          >
            <ArrowLeft size={15} />
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
