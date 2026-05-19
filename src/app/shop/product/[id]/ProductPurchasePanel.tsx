"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import { Button, Card } from "@/components/ui";
import CashDisplay from "@/components/minecraft/CashDisplay";
import { useToast } from "@/components/ui";

interface Props {
  price: number;
  productName: string;
}

const CASH_BALANCE = 12500;

export default function ProductPurchasePanel({ price, productName }: Props) {
  const [qty, setQty] = useState(1);
  const { toast } = useToast();

  const total = price * qty;
  const insufficient = total > CASH_BALANCE;

  return (
    <Card padding="lg">
      <p className="text-xs text-white/40">단가</p>
      <div className="flex items-baseline gap-1.5 mt-1">
        <span className="text-2xl font-bold">{price.toLocaleString()}</span>
        <span className="text-sm text-white/50">원</span>
      </div>

      <div className="mt-5">
        <p className="text-xs text-white/40 mb-2">수량</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-9 h-9 rounded-lg border border-white/10 text-white/70 hover:bg-white/5 flex items-center justify-center transition-colors"
            aria-label="수량 감소"
          >
            <Minus size={14} />
          </button>
          <input
            type="number"
            min={1}
            max={99}
            value={qty}
            onChange={(e) =>
              setQty(Math.max(1, Math.min(99, Number(e.target.value) || 1)))
            }
            className="flex-1 bg-white/5 border border-white/10 rounded-lg text-center py-2 text-sm focus:outline-none focus:border-white/25"
          />
          <button
            type="button"
            onClick={() => setQty(Math.min(99, qty + 1))}
            className="w-9 h-9 rounded-lg border border-white/10 text-white/70 hover:bg-white/5 flex items-center justify-center transition-colors"
            aria-label="수량 증가"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="mt-5 py-4 border-y border-white/8 flex items-center justify-between">
        <span className="text-sm text-white/60">총 결제 금액</span>
        <span className="text-xl font-bold">{total.toLocaleString()}원</span>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <Button
          variant="outline"
          leftIcon={<ShoppingCart size={16} />}
          onClick={() =>
            toast({ title: `${productName} 장바구니에 담겼어요`, variant: "success" })
          }
        >
          장바구니 담기
        </Button>
        <Button
          leftIcon={<Zap size={16} />}
          onClick={() =>
            toast({
              title: insufficient ? "캐시가 부족해요" : "결제 화면으로 이동합니다",
              variant: insufficient ? "warning" : "default",
            })
          }
        >
          바로 구매
        </Button>
      </div>

      <div className="mt-5 p-3 bg-white/3 rounded-lg flex items-center justify-between">
        <div>
          <p className="text-xs text-white/40">보유 캐시</p>
          <div className="mt-0.5">
            <CashDisplay amount={CASH_BALANCE} size="md" />
          </div>
        </div>
        {insufficient && (
          <Link href="/shop" className="text-xs text-yellow-300 hover:text-yellow-200 underline">
            캐시 충전하기
          </Link>
        )}
      </div>
    </Card>
  );
}
