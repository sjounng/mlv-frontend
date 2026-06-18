"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, List, Package } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui";
import ProductCard, { type Product } from "./ProductCard";

interface CategoryTab {
  id: string;
  label: string;
}

interface ProductGridProps {
  products: Product[];
  categories: CategoryTab[];
}

const sortOptions = ["추천순", "가격 낮은순", "가격 높은순", "이름순"] as const;
type SortKey = (typeof sortOptions)[number];

export default function ProductGrid({ products, categories }: ProductGridProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [sort, setSort] = useState<SortKey>("추천순");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const tabs = [{ id: "all", label: "전체" }, ...categories];
  const featured = products.filter((p) => p.badge === "HOT");

  const filtered = useMemo(() => {
    const base = activeTab === "all" ? products : products.filter((p) => p.categoryId === activeTab);
    const sorted = [...base];
    if (sort === "가격 낮은순") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "가격 높은순") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "이름순") sorted.sort((a, b) => a.name.localeCompare(b.name, "ko"));
    return sorted;
  }, [products, activeTab, sort]);

  return (
    <div className="flex flex-col gap-8">
      {featured.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold mb-4">추천 상품</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold">전체 상품</h2>
        </div>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <div className="flex items-center gap-1 flex-1 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === tab.id ? "bg-white text-black" : "text-white/50 hover:text-white/80 hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="bg-white/3 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/60 focus:outline-none"
          >
            {sortOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          <div className="flex border border-white/10 rounded-lg overflow-hidden">
            <button onClick={() => setViewMode("grid")} className={`p-1.5 transition-colors ${viewMode === "grid" ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"}`}>
              <LayoutGrid size={14} />
            </button>
            <button onClick={() => setViewMode("list")} className={`p-1.5 transition-colors ${viewMode === "list" ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"}`}>
              <List size={14} />
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={Package} title="상품이 없습니다" />
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} size="sm" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((p) => (
              <Link
                key={p.id}
                href={`/shop/product/${p.id}`}
                className="flex items-center gap-4 p-3 bg-[#161616] hover:bg-[#1c1c1c] border border-white/8 hover:border-white/15 rounded-xl transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package size={20} className="text-white/25" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">{p.name}</p>
                  <p className="text-xs text-white/40 mt-0.5 line-clamp-1">{p.desc}</p>
                </div>
                <p className="text-sm font-semibold shrink-0 tabular-nums">{p.price.toLocaleString()} C</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
