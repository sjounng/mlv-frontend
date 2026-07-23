"use client";

// 캐시 충전 페이지 (07-22 웹상점 개편)
//  - 로그인 필요
//  - 캐시 충전 상품(KRW 패키지) 목록 + 정렬(총 개수 미표시)
//  - 상품 클릭 → 개별 충전 상품 페이지
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Coins, Lock, ArrowLeft, ImageOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Select, useToast } from "@/components/ui";
import { shopApi, type CashProductResponse } from "@/lib/shop-api";
import { useAuth } from "@/lib/auth";

type SortKey = "default" | "priceAsc" | "priceDesc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "default", label: "기본 정렬" },
  { value: "priceAsc", label: "가격 낮은순" },
  { value: "priceDesc", label: "가격 높은순" },
];

export default function ChargePage() {
  const { status } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<CashProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortKey>("default");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setProducts(await shopApi.cashProducts());
    } catch {
      toast({ title: "충전 상품을 불러오지 못했습니다", variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (status === "authenticated") void load();
  }, [status, load]);

  const sorted = useMemo(() => {
    const list = [...products];
    if (sort === "priceAsc") list.sort((a, b) => a.priceKrw - b.priceKrw);
    else if (sort === "priceDesc") list.sort((a, b) => b.priceKrw - a.priceKrw);
    return list;
  }, [products, sort]);

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="max-w-6xl mx-auto px-6 py-12 space-y-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-emerald-300/70 uppercase tracking-widest font-medium mb-2">Cash Shop</p>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
                <Coins className="text-amber-300" size={28} /> 캐시 충전
              </h1>
            </div>
            <Link href="/shop" className="focus-ring inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors">
              <ArrowLeft size={15} /> 상점으로
            </Link>
          </div>

          {status !== "authenticated" ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 rounded-xl bg-emerald-500/12 border border-emerald-400/25 flex items-center justify-center mb-5">
                <Lock size={24} className="text-emerald-300" />
              </div>
              <h2 className="text-lg font-bold mb-1.5">로그인이 필요합니다</h2>
              <p className="text-sm text-white/50 mb-6">캐시 충전은 로그인 후 이용할 수 있어요.</p>
              <Link
                href="/login"
                className="focus-ring inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
              >
                로그인하러 가기
              </Link>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-16 text-white/40">
              <Loader2 className="animate-spin" size={24} />
            </div>
          ) : sorted.length === 0 ? (
            <p className="text-center text-sm text-white/40 py-16">등록된 충전 상품이 없습니다.</p>
          ) : (
            <>
              <div className="flex justify-end">
                <div className="w-40">
                  <Select options={SORT_OPTIONS} value={sort} onChange={(e) => setSort(e.target.value as SortKey)} />
                </div>
              </div>
              {/* 카드 크기 절반 → 한 줄 8개 (07-24). 표기는 상품명 + KRW 가격만 (중복 제거) */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
                {sorted.map((p) => (
                  <Link
                    key={p.id}
                    href={`/shop/charge/${p.id}`}
                    className="focus-ring group rounded-xl border border-white/8 bg-surface-2 overflow-hidden transition-all hover:border-amber-400/30 hover:-translate-y-0.5"
                  >
                    <div className="relative aspect-square bg-surface-3 overflow-hidden">
                      {p.iconUrl ? (
                        <Image src={p.iconUrl} alt={p.name} fill sizes="120px" className="object-contain p-2 transition-transform duration-300 group-hover:scale-105" unoptimized />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-white/20"><ImageOff size={18} /></div>
                      )}
                    </div>
                    <div className="p-2">
                      <h3 className="text-xs font-semibold truncate">{p.name}</h3>
                      <p className="mt-1 text-xs font-bold tabular-nums">{p.priceKrw.toLocaleString()} KRW</p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
