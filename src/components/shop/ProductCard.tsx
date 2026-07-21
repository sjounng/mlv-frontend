"use client";

// 상품 카드 (07-12 피드백: 피파 웹상점 스타일)
// - 썸네일 + 본문 텍스트(2줄) 표시, 4열 그리드 기준 확장형 카드
// - 카드 상단에 구매 제한 뱃지 (매주 초기화 / 매월 초기화 / 계정 당 1회)
// - 호버 시 세부 설명 info 팝업(설명 + 구매 제한 안내 자동 기입)
// - 장바구니 버튼은 카트 아이콘
import Link from "next/link";
import Image from "next/image";
import { Package, Search, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useToast } from "@/components/ui";
import type { PurchaseLimitType } from "@/lib/shop-api";

export interface Product {
  id: string;
  name: string;
  desc: string;
  price: number; // 캐시(C)
  imageUrl: string | null;
  badge?: "HOT" | "NEW";
  categoryId: string;
  limitType?: PurchaseLimitType;
  limitCount?: number;
}

interface ProductCardProps {
  product: Product;
  size?: "sm" | "md";
}

const badgeStyles = {
  HOT: "bg-red-500/90 text-white",
  NEW: "bg-blue-500/90 text-white",
};

// 카드 상단 제한 뱃지 라벨
const LIMIT_BADGE: Partial<Record<PurchaseLimitType, string>> = {
  WEEKLY: "매주 초기화",
  MONTHLY: "매월 초기화",
  ONCE: "계정 당 1회",
};

// info 팝업 하단 자동 기입 문구 (07-12 피드백 문구 그대로)
const LIMIT_DESC: Partial<Record<PurchaseLimitType, string>> = {
  WEEKLY: "구매제한이 매주 월요일 오전 6:00 초기화되는 상품입니다",
  MONTHLY: "구매제한이 매월 1일 오전 6:00 초기화되는 상품입니다",
  ONCE: "계정 당 1회만 구매할 수 있는 상품입니다",
};

export default function ProductCard({ product }: ProductCardProps) {
  const { add } = useCart();
  const { toast } = useToast();
  const href = `/shop/product/${product.id}`;
  const limitType = product.limitType ?? "NONE";
  const limitBadge = LIMIT_BADGE[limitType];
  const limitDesc = LIMIT_DESC[limitType];

  const onAdd = () => {
    add({ productId: Number(product.id), name: product.name, price: product.price, imageUrl: product.imageUrl });
    toast({ title: "장바구니에 담았어요", variant: "success" });
  };

  return (
    <div className="group relative flex flex-col bg-surface-3 border border-white/8 hover:border-white/20 rounded-xl transition-colors">
      {/* 상단 뱃지 줄 (구매 제한 + HOT/NEW) */}
      <div className="absolute top-2 left-2 right-2 z-10 flex items-center gap-1.5 pointer-events-none">
        {limitBadge && (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-black/55 text-white border border-white/15">
            {limitBadge}
          </span>
        )}
        {product.badge && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${badgeStyles[product.badge]}`}>
            {product.badge}
          </span>
        )}
      </div>

      {/* 썸네일 */}
      <Link href={href} className="focus-ring relative flex items-center justify-center bg-white/5 rounded-t-xl overflow-hidden h-36 sm:h-40">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 280px, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <Package size={40} className="text-white/25" />
        )}
      </Link>

      {/* 본문: 이름 + 설명(2줄) + 가격/카트 */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <Link href={href} className="focus-ring rounded">
          <p className="text-sm font-semibold leading-tight line-clamp-1">{product.name}</p>
        </Link>
        <p className="text-xs text-white/45 leading-relaxed line-clamp-2 flex-1">{product.desc}</p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm font-semibold text-amber-300 tabular-nums">{product.price.toLocaleString()} C</p>
          <button
            type="button"
            onClick={onAdd}
            aria-label={`${product.name} 장바구니 담기`}
            className="focus-ring w-8 h-8 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white flex items-center justify-center transition-colors"
          >
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>

      {/* 호버 info 팝업 — 카드 위를 덮는 세부 설명 (07-12 피드백 2번) */}
      <div className="hidden md:flex absolute inset-0 z-20 flex-col rounded-xl bg-surface-4/97 backdrop-blur-sm border border-white/15 p-3.5 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
        <p className="text-sm font-bold leading-tight mb-2">{product.name}</p>
        <p className="text-xs text-emerald-300 leading-relaxed whitespace-pre-wrap break-keep overflow-y-auto flex-1">
          {product.desc}
        </p>
        {limitDesc && (
          <div className="mt-2 pt-2 border-t border-white/10">
            <p className="text-[11px] font-semibold text-white/60 mb-0.5">구매 제한</p>
            <p className="text-[11px] text-white/50 leading-relaxed">( {limitDesc} )</p>
          </div>
        )}
        <div className="mt-2.5 flex items-center gap-1.5">
          <Link
            href={href}
            className="focus-ring flex-1 flex items-center justify-center gap-1 px-1.5 py-2 rounded-lg text-[11px] font-medium whitespace-nowrap bg-white/8 hover:bg-white/14 border border-white/10 transition-colors"
          >
            <Search size={12} className="shrink-0" /> 상품정보 상세보기
          </Link>
          <button
            type="button"
            onClick={onAdd}
            aria-label={`${product.name} 장바구니 담기`}
            className="focus-ring w-9 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-colors"
          >
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
