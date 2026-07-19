"use client";

// 상품 그리드 (07-12 피드백: 추천 열/중앙 카테고리 탭 제거, 카테고리는 좌측 사이드바로 이동, 4열 그리드)
import { useMemo, useState } from "react";
import { LayoutGrid, List, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { EmptyState, Select } from "@/components/ui";
import ProductCard, { type Product } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  /** 좌측 사이드바에서 선택된 카테고리 id ("all" = 전체) */
  activeCategory: string;
}

const sortOptions = ["추천순", "가격 낮은순", "가격 높은순", "이름순"] as const;
const sortSelectOptions = sortOptions.map((option) => ({ value: option, label: option }));
type SortKey = (typeof sortOptions)[number];

export default function ProductGrid({ products, activeCategory }: ProductGridProps) {
  const [sort, setSort] = useState<SortKey>("추천순");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    const base = activeCategory === "all" ? products : products.filter((p) => p.categoryId === activeCategory);
    const sorted = [...base];
    if (sort === "가격 낮은순") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "가격 높은순") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "이름순") sorted.sort((a, b) => a.name.localeCompare(b.name, "ko"));
    return sorted;
  }, [products, activeCategory, sort]);

  return (
    <section>
      <div className="flex items-center justify-between gap-2 mb-4">
        <h2 className="text-sm font-semibold">전체 상품</h2>
        <div className="flex items-center gap-2">
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="정렬"
            options={sortSelectOptions}
            containerClassName="w-36"
            className="py-1.5 text-xs"
          />
          <div className="flex border border-white/10 rounded-lg overflow-hidden">
            <button onClick={() => setViewMode("grid")} aria-label="그리드 보기" aria-pressed={viewMode === "grid"} className={`focus-ring p-1.5 transition-colors ${viewMode === "grid" ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"}`}>
              <LayoutGrid size={14} />
            </button>
            <button onClick={() => setViewMode("list")} aria-label="리스트 보기" aria-pressed={viewMode === "list"} className={`focus-ring p-1.5 transition-colors ${viewMode === "list" ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"}`}>
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Package} title="상품이 없습니다" />
      ) : viewMode === "grid" ? (
        // 4열 그리드 (07-12 피드백)
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((p) => (
            <Link
              key={p.id}
              href={`/shop/product/${p.id}`}
              className="focus-ring flex items-center gap-4 p-3 bg-surface-3 hover:bg-surface-4 border border-white/8 hover:border-white/15 rounded-xl transition-colors"
            >
              <div className="relative w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                {p.imageUrl ? (
                  <Image src={p.imageUrl} alt={p.name} fill sizes="48px" className="object-cover" unoptimized />
                ) : (
                  <Package size={20} className="text-white/25" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">{p.name}</p>
                <p className="text-xs text-white/40 mt-0.5 line-clamp-1">{p.desc}</p>
              </div>
              <p className="text-sm font-semibold text-amber-300 shrink-0 tabular-nums">{p.price.toLocaleString()} C</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
