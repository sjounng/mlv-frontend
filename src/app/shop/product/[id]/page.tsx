"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Info, Loader2, Package } from "lucide-react";
import { Badge, Card, EmptyState, Separator } from "@/components/ui";
import ProductPurchasePanel from "./ProductPurchasePanel";
import { shopApi, type ShopProductResponse } from "@/lib/shop-api";
import { ApiError } from "@/lib/api";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [product, setProduct] = useState<ShopProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setProduct(await shopApi.product(id));
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) setNotFoundError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 text-white/40">
        <Loader2 className="animate-spin" size={26} />
      </div>
    );
  }

  if (notFoundError || !product) {
    return (
      <div className="flex-1 max-w-[1400px] w-full mx-auto px-4 py-10">
        <EmptyState icon={Package} title="상품을 찾을 수 없습니다" action={<Link href="/shop" className="text-sm text-white/60 underline">상점으로 돌아가기</Link>} />
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-[1400px] w-full mx-auto px-4 py-6">
      <Link href="/shop" className="inline-flex items-center gap-1 text-xs text-white/40 hover:text-white/70 mb-4">
        <ChevronLeft size={14} /> 상점으로 돌아가기
      </Link>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div>
          <Card padding="lg">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex items-center justify-center rounded-xl w-full sm:w-56 h-56 bg-white/5 shrink-0 overflow-hidden">
                {product.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <Package size={64} className="text-white/20" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="default" size="sm">{product.category.name}</Badge>
                  {product.recommended && <Badge variant="hot" size="sm">HOT</Badge>}
                  {product.newBadge && <Badge variant="new" size="sm">NEW</Badge>}
                </div>
                <h1 className="text-2xl font-bold">{product.name}</h1>
                <p className="mt-3 text-sm text-white/55 leading-relaxed whitespace-pre-wrap">{product.description}</p>
                <div className="mt-5 flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{product.price.toLocaleString()}</span>
                  <span className="text-sm text-white/50">C</span>
                </div>
              </div>
            </div>
          </Card>

          <Card padding="lg" className="mt-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/15 text-blue-300 flex items-center justify-center shrink-0">
                <Info size={17} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold">구매 안내</h3>
                <ul className="mt-3 space-y-1.5 text-xs text-white/55 list-disc list-inside">
                  <li>구매 시 보유 캐시에서 차감되며, 보상은 인게임 우편함으로 발송됩니다.</li>
                  <li>우편함은 인게임에서 <span className="text-white/80">/우편</span> 명령어로 확인할 수 있습니다.</li>
                  <li>이미 수령한 상품의 환불은 제한될 수 있으니, 환불 정책을 참고해 주세요.</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:sticky lg:top-20 lg:self-start">
          <ProductPurchasePanel
            productId={product.id}
            price={product.price}
            productName={product.name}
            imageUrl={product.imageUrl}
            stockQuantity={product.stockQuantity}
          />
          <Separator className="my-4" />
          <p className="text-xs text-white/35 text-center">
            구매 시 <Link href="/info/terms" className="underline hover:text-white/60">이용약관</Link> 및{" "}
            <Link href="/info/refund" className="underline hover:text-white/60">환불 정책</Link>에 동의하게 됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
