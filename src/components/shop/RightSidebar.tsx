"use client";

// 상점 우측 사이드바 (07-10 피드백 재배치): 보유 코인 + 충전하기, 그 아래 장바구니.
import Link from "next/link";
import { Coins, Plus, ShoppingCart } from "lucide-react";
import CashDisplay from "@/components/minecraft/CashDisplay";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { useToast } from "@/components/ui";

export default function RightSidebar() {
  const { status, cashBalance } = useAuth();
  const { count, totalPrice } = useCart();
  const { toast } = useToast();

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
        <button
          type="button"
          onClick={() => toast({ title: "충전 기능은 준비 중입니다", variant: "default" })}
          className="focus-ring mt-4 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap bg-emerald-600 text-white shadow-[0_3px_0_0_#065f46] hover:bg-emerald-500 active:translate-y-[2px] active:shadow-[0_1px_0_0_#065f46] transition-[background-color,box-shadow,transform] duration-150"
        >
          <Plus size={15} /> 충전하기
        </button>
      </div>

      {/* 장바구니 */}
      <div className="bg-surface-3 border border-white/8 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold flex items-center gap-1.5">
            <ShoppingCart size={14} className="text-white/60" /> 장바구니
          </p>
          <span className="text-xs text-white/40 tabular-nums">{count}개</span>
        </div>
        {count === 0 ? (
          <p className="text-xs text-white/40 leading-relaxed mb-4">담긴 상품이 없습니다.</p>
        ) : (
          <div className="flex items-center justify-between text-sm mb-4">
            <span className="text-white/50">합계</span>
            <CashDisplay amount={totalPrice} size="sm" />
          </div>
        )}
        <Link
          href="/shop/cart"
          className="focus-ring flex items-center justify-center w-full px-3 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap bg-white/8 hover:bg-white/12 border border-white/10 transition-colors"
        >
          장바구니 보기
        </Link>
      </div>
    </aside>
  );
}
