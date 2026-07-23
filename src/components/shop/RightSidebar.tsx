"use client";

// 상점 우측 사이드바: 보유 코인 + 충전하기 (07-22 개편: 장바구니 제거, 충전 페이지로 이동)
import Link from "next/link";
import { Coins, Plus } from "lucide-react";
import CashDisplay from "@/components/minecraft/CashDisplay";
import { useAuth } from "@/lib/auth";

export default function RightSidebar() {
  const { status, cashBalance } = useAuth();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col gap-4">
      {/* 보유 코인 + 충전하기 */}
      <div className="bg-surface-3 border border-white/8 rounded-xl p-4">
        <p className="text-xs font-semibold text-white/50 mb-2 flex items-center gap-1.5">
          <Coins size={13} className="text-amber-300" /> 보유 코인
        </p>
        {status === "authenticated" ? (
          <CashDisplay amount={cashBalance ?? 0} size="lg" />
        ) : (
          <p className="text-sm text-white/40">로그인 후 확인 가능</p>
        )}
        <Link
          href="/shop/charge"
          className="focus-ring mt-4 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap bg-emerald-600 text-white shadow-[0_3px_0_0_#065f46] hover:bg-emerald-500 active:translate-y-[2px] active:shadow-[0_1px_0_0_#065f46] transition-[background-color,box-shadow,transform] duration-150"
        >
          <Plus size={15} /> 충전하기
        </Link>
      </div>

      <div className="bg-surface-3 border border-white/8 rounded-xl p-4">
        <p className="text-xs text-white/45 leading-relaxed">
          캐시를 충전하고 상점에서 원하는 상품을 구매해 보세요.
        </p>
      </div>
    </aside>
  );
}
