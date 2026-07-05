"use client";

import Link from "next/link";
import Image from "next/image";
import { Package, Plus } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useToast } from "@/components/ui";

export interface Product {
  id: string;
  name: string;
  desc: string;
  price: number; // 캐시(C)
  imageUrl: string | null;
  badge?: "HOT" | "NEW";
  categoryId: string;
}

interface ProductCardProps {
  product: Product;
  size?: "sm" | "md";
}

const badgeStyles = {
  HOT: "bg-red-500/90 text-white",
  NEW: "bg-blue-500/90 text-white",
};

export default function ProductCard({ product, size = "md" }: ProductCardProps) {
  const { add } = useCart();
  const { toast } = useToast();
  const href = `/shop/product/${product.id}`;

  const onAdd = () => {
    add({ productId: Number(product.id), name: product.name, price: product.price, imageUrl: product.imageUrl });
    toast({ title: "장바구니에 담았어요", variant: "success" });
  };

  return (
    <div
      className="group relative flex flex-col bg-surface-3 hover:bg-surface-4 border border-white/8 hover:border-white/15 rounded-xl overflow-hidden transition-colors"
    >
      {/* Image area */}
      <div className="relative">
        <Link href={href} className={`focus-ring relative flex items-center justify-center bg-white/5 ${size === "sm" ? "h-24" : "h-32"}`}>
          {product.imageUrl ? (
            <Image src={product.imageUrl} alt={product.name} fill sizes="(min-width: 1024px) 240px, 50vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
          ) : (
            <Package size={size === "sm" ? 30 : 40} className="text-white/25" />
          )}
          {product.badge && (
            <span className={`absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded ${badgeStyles[product.badge]}`}>
              {product.badge}
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={onAdd}
          aria-label={`${product.name} 장바구니 담기`}
          className="focus-ring absolute bottom-2 right-2 w-8 h-8 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-lg shadow-black/40 flex items-center justify-center transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 md:translate-y-1 md:group-hover:translate-y-0"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Info */}
      <Link href={href} className="focus-ring p-3 flex flex-col gap-1 flex-1">
        <p className={`font-medium leading-tight line-clamp-1 ${size === "sm" ? "text-xs" : "text-sm"}`}>
          {product.name}
        </p>
        {size === "md" && <p className="text-xs text-white/40 line-clamp-1">{product.desc}</p>}
        <p className={`font-semibold text-amber-300 tabular-nums mt-auto ${size === "sm" ? "text-xs" : "text-sm"}`}>
          {product.price.toLocaleString()} C
        </p>
      </Link>
    </div>
  );
}
