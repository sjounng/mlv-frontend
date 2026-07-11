// 상점 좌측 사이드바 (07-10 피드백 재배치): 추천 상품 + 진행 중인 이벤트
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Package, Sparkles } from "lucide-react";
import type { Product } from "./ProductCard";

export default function ShopSidebar({ products }: { products: Product[] }) {
  const recommended = products.filter((p) => p.badge === "HOT");
  const popular = (recommended.length > 0 ? recommended : products).slice(0, 5);

  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col gap-4">
      {/* 추천 상품 */}
      <div className="bg-surface-3 border border-white/8 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold flex items-center gap-1.5">
            <Sparkles size={14} className="text-amber-300" /> 추천 상품
          </p>
        </div>
        {popular.length === 0 ? (
          <p className="text-xs text-white/40">등록된 상품이 없습니다.</p>
        ) : (
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
        )}
      </div>

      {/* 진행 중인 이벤트 */}
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
