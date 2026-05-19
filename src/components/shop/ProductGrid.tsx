"use client";

import { useState } from "react";
import { LayoutGrid, List, ChevronDown, ArrowRight } from "lucide-react";
import Link from "next/link";
import ProductCard, { type Product } from "./ProductCard";

const categoryTabs = [
  { label: "전체", id: "all" },
  { label: "마공학", id: "magic" },
  { label: "멤버십", id: "membership" },
  { label: "스탬업", id: "stamup" },
  { label: "치장품", id: "cosmetic" },
];

const sortOptions = ["추천순", "인기순", "가격 낮은순", "가격 높은순", "최신순"];

interface ProductGridProps {
  featuredProducts: Product[];
  allProducts: Product[];
}

export default function ProductGrid({ featuredProducts, allProducts }: ProductGridProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [sort, setSort] = useState("추천순");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOpen, setSortOpen] = useState(false);

  const filtered =
    activeTab === "all"
      ? allProducts
      : allProducts.filter((p) => p.category === activeTab);

  return (
    <div className="flex flex-col gap-8">
      {/* Featured / Recommended */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold">추천 상품</h2>
          <Link
            href="/shop?cat=featured"
            className="flex items-center gap-1 text-xs text-white/35 hover:text-white/60 transition-colors"
          >
            더보기 <ArrowRight size={11} />
          </Link>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* All Products */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold">전체 상품</h2>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 mb-4">
          {/* Category tabs */}
          <div className="flex items-center gap-1 flex-1">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-white text-black"
                    : "text-white/50 hover:text-white/80 hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/50 hover:text-white/80 border border-white/10 rounded-lg transition-colors bg-white/3"
            >
              <span className="text-white/30 text-[10px]">정렬</span>
              {sort}
              <ChevronDown size={11} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-[#1c1c1c] border border-white/10 rounded-xl overflow-hidden shadow-xl z-20">
                {sortOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setSort(opt); setSortOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                      sort === opt
                        ? "text-white bg-white/8"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View mode */}
          <div className="flex border border-white/10 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 transition-colors ${viewMode === "grid" ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"}`}
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 transition-colors ${viewMode === "list" ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"}`}
            >
              <List size={14} />
            </button>
          </div>
        </div>

        {/* Grid */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-6 gap-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} size="sm" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-4 p-3 bg-[#161616] hover:bg-[#1c1c1c] border border-white/8 hover:border-white/15 rounded-xl transition-all"
              >
                <div className={`w-12 h-12 rounded-lg ${p.emojiColor} flex items-center justify-center text-2xl shrink-0`}>
                  {p.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">{p.name}</p>
                  <p className="text-xs text-white/40 mt-0.5">{p.desc}</p>
                </div>
                {p.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                    p.badge === "HOT" ? "bg-red-500/90 text-white" :
                    p.badge === "NEW" ? "bg-blue-500/90 text-white" :
                    "bg-yellow-500/90 text-black"
                  }`}>
                    {p.badge}
                  </span>
                )}
                <p className="text-sm font-semibold shrink-0 tabular-nums">
                  {p.price.toLocaleString()}원
                </p>
                <button className="shrink-0 px-3 py-1.5 bg-white/8 hover:bg-white/15 border border-white/10 rounded-lg text-xs transition-colors">
                  구매
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
