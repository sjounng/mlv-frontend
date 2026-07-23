"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Minus, Plus, Zap } from "lucide-react";
import { Button, Card, useToast } from "@/components/ui";
import CashDisplay from "@/components/minecraft/CashDisplay";
import { useAuth } from "@/lib/auth";
import { shopApi } from "@/lib/shop-api";
import { ApiError } from "@/lib/api";

interface Props {
  productId: number;
  price: number;
  productName: string;
  stockQuantity: number | null;
}

export default function ProductPurchasePanel({ productId, price, productName, stockQuantity }: Props) {
  const router = useRouter();
  const { status, cashBalance, refresh } = useAuth();
  const { toast } = useToast();
  const [qty, setQty] = useState(1);
  const [buying, setBuying] = useState(false);

  const maxQty = stockQuantity != null ? Math.max(1, Math.min(99, stockQuantity)) : 99;
  const total = price * qty;
  const balance = cashBalance ?? 0;
  const insufficient = status === "authenticated" && total > balance;

  const onBuy = async () => {
    if (status !== "authenticated") {
      toast({ title: "로그인이 필요합니다", variant: "warning" });
      router.push("/login");
      return;
    }
    if (insufficient) {
      toast({
        title: "보유 캐시가 부족합니다",
        description: "충전 페이지로 이동합니다.",
        variant: "warning",
      });
      router.push("/shop/charge");
      return;
    }
    setBuying(true);
    try {
      await shopApi.purchase(productId, qty);
      toast({ title: "구매 완료!", description: `${productName} 보상이 인게임 우편함으로 발송됩니다.`, variant: "success" });
      await refresh();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "구매에 실패했습니다.";
      toast({ title: "구매 실패", description: message, variant: "error" });
    } finally {
      setBuying(false);
    }
  };

  return (
    <Card padding="lg">
      <p className="text-xs text-white/40">단가</p>
      <div className="flex items-baseline gap-1.5 mt-1">
        <span className="text-2xl font-bold text-amber-300 tabular-nums">{price.toLocaleString()}</span>
        <span className="text-sm text-amber-300/70">C</span>
      </div>

      <div className="mt-5">
        <p className="text-xs text-white/40 mb-2">수량</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="focus-ring w-9 h-9 rounded-lg border border-white/10 text-white/70 hover:bg-white/5 flex items-center justify-center transition-colors"
            aria-label="수량 감소"
          >
            <Minus size={14} />
          </button>
          <input
            type="number"
            min={1}
            max={maxQty}
            value={qty}
            aria-label="수량"
            onChange={(e) => setQty(Math.max(1, Math.min(maxQty, Number(e.target.value) || 1)))}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg text-center py-2 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-400/15 focus:border-emerald-400/50 transition-colors"
          />
          <button
            type="button"
            onClick={() => setQty(Math.min(maxQty, qty + 1))}
            className="focus-ring w-9 h-9 rounded-lg border border-white/10 text-white/70 hover:bg-white/5 flex items-center justify-center transition-colors"
            aria-label="수량 증가"
          >
            <Plus size={14} />
          </button>
        </div>
        {stockQuantity != null && (
          <p className="mt-2 text-xs text-white/35">재고 {stockQuantity.toLocaleString()}개</p>
        )}
      </div>

      <div className="mt-5 py-4 border-y border-white/8 flex items-center justify-between gap-3">
        <span className="text-sm text-white/60">총 결제 캐시</span>
        <span className="text-xl font-bold text-amber-300 tabular-nums">{total.toLocaleString()} C</span>
      </div>

      <div className="mt-5">
        <Button
          className="w-full"
          disabled={buying}
          leftIcon={buying ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />}
          onClick={onBuy}
        >
          {status === "authenticated" ? "구매하기" : "로그인하고 구매"}
        </Button>
      </div>

      {status === "authenticated" && (
        <div className="mt-5 p-3 bg-white/3 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-xs text-white/40">보유 캐시</p>
            <div className="mt-0.5">
              <CashDisplay amount={balance} size="md" />
            </div>
          </div>
          {insufficient && <span className="text-xs font-medium text-red-300">캐시 부족</span>}
        </div>
      )}
    </Card>
  );
}
