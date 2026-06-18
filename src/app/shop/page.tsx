"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import ShopSidebar from "@/components/shop/ShopSidebar";
import HeroBanner from "@/components/shop/HeroBanner";
import ProductGrid from "@/components/shop/ProductGrid";
import RightSidebar from "@/components/shop/RightSidebar";
import { useToast } from "@/components/ui";
import { shopApi, toUiProduct, type ShopCategory } from "@/lib/shop-api";
import type { Product } from "@/components/shop/ProductCard";
import { ApiError } from "@/lib/api";

export default function ShopPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([shopApi.products(), shopApi.categories()]);
      setProducts(p.map(toUiProduct));
      setCategories(c);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "상품을 불러오지 못했습니다.";
      toast({ title: "불러오기 실패", description: message, variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  return (
    <div className="flex flex-1 max-w-[1400px] w-full mx-auto px-4 py-6 gap-5">
      <ShopSidebar />

      <main className="flex-1 min-w-0 flex flex-col gap-5">
        <HeroBanner />
        {loading ? (
          <div className="flex items-center justify-center py-20 text-white/40">
            <Loader2 className="animate-spin" size={26} />
          </div>
        ) : (
          <ProductGrid products={products} categories={categories.map((c) => ({ id: String(c.id), label: c.name }))} />
        )}
      </main>

      <RightSidebar />
    </div>
  );
}
