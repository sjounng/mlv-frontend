import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Package, Sparkles } from "lucide-react";
import type { Product } from "./ProductCard";

interface RightSidebarProps {
  products: Product[];
}

export default function RightSidebar({ products }: RightSidebarProps) {
  // 추천(HOT) 우선, 없으면 일반 상품으로 채워 최대 5개
  const recommended = products.filter((p) => p.badge === "HOT");
  const popular = (recommended.length > 0 ? recommended : products).slice(0, 5);

  if (popular.length === 0) return null;

  return (
    <aside className="hidden xl:flex w-64 shrink-0 flex-col gap-4">
      <div className="bg-surface-3 border border-white/8 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold flex items-center gap-1.5">
            <Sparkles size={14} className="text-amber-300" /> 추천 상품
          </p>
          <Link href="/shop" className="flex items-center gap-0.5 text-xs text-white/35 hover:text-white/60 transition-colors">
            더보기 <ArrowRight size={11} />
          </Link>
        </div>

        <ol className="flex flex-col gap-2.5">
          {popular.map((item, i) => (
            <li key={item.id}>
              <Link href={`/shop/product/${item.id}`} className="focus-ring rounded-md flex items-center gap-2.5 group">
                <span className={`w-4 text-xs font-bold shrink-0 tabular-nums ${i < 3 ? "text-amber-300/80" : "text-white/25"}`}>{i + 1}</span>
                <div className="relative w-7 h-7 rounded bg-white/5 overflow-hidden flex items-center justify-center shrink-0">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill sizes="28px" className="object-cover" unoptimized />
                  ) : (
                    <Package size={13} className="text-white/30" />
                  )}
                </div>
                <span className="text-xs text-white/70 group-hover:text-white transition-colors flex-1 leading-tight line-clamp-1">
                  {item.name}
                </span>
                <span className="text-xs text-amber-300/80 shrink-0 tabular-nums">{item.price.toLocaleString()} C</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>

      <Link
        href="/event"
        className="focus-ring block bg-linear-to-br from-emerald-500/[0.07] to-transparent bg-surface-3 border border-white/8 hover:border-emerald-400/25 rounded-xl p-4 transition-colors"
      >
        <p className="text-sm font-semibold mb-1">진행 중인 이벤트</p>
        <p className="text-xs text-white/45 leading-relaxed">출석체크·리딤코드로 보상을 받아가세요.</p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs text-emerald-300">
          이벤트 보러가기 <ArrowRight size={11} />
        </span>
      </Link>
    </aside>
  );
}
