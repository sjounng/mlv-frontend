import Link from "next/link";

export interface Product {
  id: string;
  name: string;
  desc: string;
  price: number;
  emoji: string;
  emojiColor: string;
  badge?: "HOT" | "NEW" | "SALE";
  category: string;
}

interface ProductCardProps {
  product: Product;
  size?: "sm" | "md";
}

const badgeStyles = {
  HOT: "bg-red-500/90 text-white",
  NEW: "bg-blue-500/90 text-white",
  SALE: "bg-yellow-500/90 text-black",
};

export default function ProductCard({ product, size = "md" }: ProductCardProps) {
  return (
    <Link
      href={`/shop/product/${product.id}`}
      className="group flex flex-col bg-[#161616] hover:bg-[#1c1c1c] border border-white/8 hover:border-white/15 rounded-xl overflow-hidden transition-all"
    >
      {/* Image area */}
      <div className={`relative flex items-center justify-center ${size === "sm" ? "h-24" : "h-32"} ${product.emojiColor}`}>
        <span className={size === "sm" ? "text-4xl" : "text-5xl"}>{product.emoji}</span>
        {product.badge && (
          <span
            className={`absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded ${badgeStyles[product.badge]}`}
          >
            {product.badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        <p className={`font-medium leading-tight line-clamp-1 ${size === "sm" ? "text-xs" : "text-sm"}`}>
          {product.name}
        </p>
        {size === "md" && (
          <p className="text-xs text-white/40 line-clamp-1">{product.desc}</p>
        )}
        <p className={`font-semibold mt-auto ${size === "sm" ? "text-xs" : "text-sm"}`}>
          {product.price.toLocaleString()}원
        </p>
      </div>
    </Link>
  );
}
