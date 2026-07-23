"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Info, Loader2, Minus, Package, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Button, Card, useToast } from "@/components/ui";
import CashDisplay from "@/components/minecraft/CashDisplay";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { shopApi } from "@/lib/shop-api";
import { ApiError } from "@/lib/api";

export default function CartPage() {
  const router = useRouter();
  const { items, totalPrice, setQuantity, remove, clear } = useCart();
  const { status, cashBalance, refresh } = useAuth();
  const { toast } = useToast();
  const [checkingOut, setCheckingOut] = useState(false);

  const balance = cashBalance ?? 0;
  const insufficient = status === "authenticated" && totalPrice > balance;

  const onCheckout = async () => {
    if (status !== "authenticated") {
      toast({ title: "로그인이 필요합니다", variant: "warning" });
      router.push("/login");
      return;
    }
    if (insufficient) {
      toast({ title: "보유 캐시가 부족합니다", description: "캐시 충전 기능은 준비 중입니다.", variant: "warning" });
      return;
    }
    setCheckingOut(true);
    let purchasedCount = 0;
    try {
      // 백엔드는 단건 구매 API 이므로 항목별로 순차 구매한다.
      for (const item of [...items]) {
        await shopApi.purchase(item.productId, item.quantity);
        purchasedCount += 1;
        remove(item.productId);
      }
      toast({ title: "구매 완료!", description: "보상이 인게임 우편함으로 발송됩니다.", variant: "success" });
      clear();
      await refresh();
      router.push("/mypage");
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "구매 처리 중 문제가 발생했습니다.";
      const partialMessage =
        purchasedCount > 0
          ? "성공한 항목은 장바구니에서 제거했습니다. 남은 항목만 다시 시도해 주세요."
          : "구매가 처리되지 않았습니다.";
      toast({ title: "구매 실패", description: `${message} ${partialMessage}`, variant: "error" });
      await refresh();
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingCart size={22} />
        <h1 className="text-2xl font-bold">장바구니</h1>
      </div>

      {/* 비어있어도 동일한 슬롯 구성 유지 — 최상단에 빈 슬롯 표시 (07-12 피드백 5번) */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-3">
            {items.length === 0 && (
              <div className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-white/15 bg-white/[0.02]">
                <div className="w-14 h-14 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center shrink-0">
                  <Package size={22} className="text-white/20" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white/45">장바구니가 비어 있습니다</p>
                  <Link href="/shop" className="text-xs text-emerald-300 hover:text-emerald-200 underline">
                    상점에서 상품 담으러 가기
                  </Link>
                </div>
              </div>
            )}
            {items.map((item) => (
              <Card key={item.productId} padding="md">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                  <div className="relative w-14 h-14 rounded-lg bg-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill sizes="56px" className="object-cover" unoptimized />
                    ) : (
                      <Package size={22} className="text-white/25" />
                    )}
                  </div>
                  <div className="flex-1 min-w-[120px]">
                    <Link href={`/shop/product/${item.productId}`} className="focus-ring rounded text-sm font-medium hover:underline line-clamp-1">
                      {item.name}
                    </Link>
                    <p className="text-xs text-amber-300/80 mt-0.5 tabular-nums">{item.price.toLocaleString()} C</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setQuantity(item.productId, item.quantity - 1)}
                      className="focus-ring w-7 h-7 rounded-md border border-white/10 text-white/70 hover:bg-white/5 flex items-center justify-center transition-colors"
                      aria-label="수량 감소"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-sm tabular-nums">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= 100}
                      className="focus-ring w-7 h-7 rounded-md border border-white/10 text-white/70 hover:bg-white/5 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                      aria-label="수량 증가"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <p className="ml-auto w-24 text-right text-sm font-semibold text-amber-300 tabular-nums shrink-0">
                    {(item.price * item.quantity).toLocaleString()} C
                  </p>
                  <button
                    type="button"
                    onClick={() => remove(item.productId)}
                    className="focus-ring p-1.5 rounded-md text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                    aria-label={`${item.name} 삭제`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </Card>
            ))}
            {items.length > 0 && (
              <button type="button" onClick={clear} className="text-xs text-white/40 hover:text-white/70">
                장바구니 비우기
              </button>
            )}

            {/* 구매 안내 (07-12 피드백: 상점 푸터 → 장바구니 페이지로 이동) */}
            <div className="mt-4 p-4 rounded-xl bg-white/[0.03] border border-white/8">
              <p className="text-xs font-semibold text-white/60 mb-2.5">구매 안내</p>
              <ul className="flex flex-col gap-2">
                {[
                  "구매한 상품은 인게임 우편함으로 자동 지급됩니다.",
                  "결제 후 문제가 발생하면 고객지원 > 직접 문의를 이용해주세요.",
                  "환불 정책은 홈페이지 하단 > 환불 정책에서 확인하세요.",
                ].map((notice, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <Info size={12} className="text-white/25 mt-0.5 shrink-0" />
                    <p className="text-xs text-white/40 leading-relaxed">{notice}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:sticky lg:top-20 lg:self-start">
            <Card padding="lg">
              <h2 className="text-sm font-semibold mb-4">주문 요약</h2>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-white/55">상품 수</span>
                <span className="tabular-nums">{items.reduce((s, i) => s + i.quantity, 0)}개</span>
              </div>
              <div className="py-4 border-y border-white/8 flex items-center justify-between gap-3">
                <span className="text-sm text-white/60">총 결제 캐시</span>
                <span className="text-2xl font-bold text-amber-300 tabular-nums">{totalPrice.toLocaleString()} C</span>
              </div>

              {status === "authenticated" && (
                <div className="mt-4 p-3 bg-white/[0.03] border border-white/8 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/45">보유 캐시</span>
                    <CashDisplay amount={balance} size="md" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/45">결제 후 잔액</span>
                    <span className={`text-xs font-medium tabular-nums ${insufficient ? "text-red-300" : "text-white/70"}`}>
                      {insufficient
                        ? `${(totalPrice - balance).toLocaleString()} C 부족`
                        : `${(balance - totalPrice).toLocaleString()} C`}
                    </span>
                  </div>
                </div>
              )}

              <Button
                className="w-full mt-5"
                disabled={checkingOut || items.length === 0}
                leftIcon={checkingOut ? <Loader2 className="animate-spin" size={16} /> : undefined}
                onClick={onCheckout}
              >
                {status === "authenticated" ? "캐시로 결제" : "로그인하고 결제"}
              </Button>
            </Card>
          </div>
      </div>
    </div>
  );
}
