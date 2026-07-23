"use client";

// 캐시 충전 상품 상세 (07-22 웹상점 개편)
//  - 아이콘/이름/KRW 가격, 구매 개수 설정, 구매(PG 연동 준비중 → 보류)
//  - 공통 상세 소개(모든 캐시 상품에 동일), 청약철회 안내 박스 + 보기 팝업
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ChevronLeft, Coins, Loader2, Minus, Plus, Info, ImageOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button, EmptyState, Modal, useToast } from "@/components/ui";
import { shopApi, type CashProductResponse } from "@/lib/shop-api";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";

const MAX_QTY = 99;

export default function ChargeDetailPage() {
  const params = useParams<{ id: string }>();
  const { status } = useAuth();
  const { toast } = useToast();

  const [product, setProduct] = useState<CashProductResponse | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);
  const [qty, setQty] = useState(1);
  const [refundOpen, setRefundOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, d] = await Promise.all([
        shopApi.cashProduct(params.id),
        shopApi.cashProductDescription().catch(() => ({ description: "" })),
      ]);
      setProduct(p);
      setDescription(d.description);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) setNotFoundError(true);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const onBuy = () => {
    if (status !== "authenticated") {
      toast({ title: "로그인이 필요합니다", variant: "warning" });
      return;
    }
    // Stella IT PG 연동 준비 전까지 결제 팝업은 보류 (07-22 피드백)
    toast({ title: "결제 기능 준비 중입니다", description: "PG사 연동 후 이용하실 수 있어요.", variant: "default" });
  };

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="max-w-5xl mx-auto px-6 py-12">
          <Link href="/shop/charge" className="focus-ring inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors mb-6">
            <ChevronLeft size={16} /> 충전 상품 목록
          </Link>

          {loading ? (
            <div className="flex items-center justify-center py-20 text-white/40"><Loader2 className="animate-spin" size={24} /></div>
          ) : notFoundError || !product ? (
            <EmptyState icon={Coins} title="충전 상품을 찾을 수 없습니다" />
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-8">
                {/* 아이콘 */}
                <div className="relative aspect-square rounded-2xl border border-white/10 bg-surface-2 overflow-hidden">
                  {product.iconUrl ? (
                    <Image src={product.iconUrl} alt={product.name} fill sizes="(min-width:768px) 40rem, 100vw" className="object-contain p-8" unoptimized />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/20"><ImageOff size={40} /></div>
                  )}
                </div>

                {/* 구매 패널 */}
                <div>
                  <h1 className="text-2xl font-bold">{product.name}</h1>
                  <p className="mt-2 text-sm text-amber-300/90 flex items-center gap-1.5">
                    <Coins size={15} /> {product.cashAmount.toLocaleString()} 캐시 지급
                  </p>
                  <div className="mt-4 flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold tabular-nums">{product.priceKrw.toLocaleString()}</span>
                    <span className="text-sm text-white/50">KRW</span>
                  </div>

                  {/* 수량 */}
                  <div className="mt-6 flex items-center gap-3">
                    <span className="text-sm text-white/60">구매 개수</span>
                    <div className="flex items-center gap-1.5">
                      <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="focus-ring w-8 h-8 rounded-md border border-white/10 text-white/70 hover:bg-white/5 flex items-center justify-center" aria-label="수량 감소">
                        <Minus size={13} />
                      </button>
                      <span className="w-10 text-center text-sm tabular-nums">{qty}</span>
                      <button type="button" onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))} disabled={qty >= MAX_QTY} className="focus-ring w-8 h-8 rounded-md border border-white/10 text-white/70 hover:bg-white/5 flex items-center justify-center disabled:opacity-40" aria-label="수량 증가">
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-lg bg-surface-2 border border-white/8 px-4 py-3">
                    <span className="text-sm text-white/60">결제 금액</span>
                    <span className="text-lg font-bold tabular-nums">{(product.priceKrw * qty).toLocaleString()} KRW</span>
                  </div>

                  <Button onClick={onBuy} className="w-full mt-4" size="lg">구매하기</Button>
                  <p className="mt-2 text-center text-xs text-white/35">결제(PG) 연동 준비 중입니다.</p>

                  {/* 청약 철회 안내 */}
                  <div className="mt-4 rounded-lg bg-surface-2 border border-white/8 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium flex items-center gap-1.5"><Info size={14} className="text-white/50" /> 청약 철회 안내</p>
                      <button type="button" onClick={() => setRefundOpen(true)} className="focus-ring text-xs text-emerald-300 hover:text-emerald-200">보기</button>
                    </div>
                    <ul className="mt-2 space-y-1 text-xs text-white/50 leading-relaxed">
                      <li>· 청약철회는 구매일로부터 7일 이내 가능합니다. (단, 사용했을 경우 청약철회 불가)</li>
                      <li>· 법정대리인 동의 없이 미성년자 명의의 결제수단으로 결제한 경우 취소할 수 있습니다.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 공통 상세 소개 */}
              <div className="mt-10">
                <h2 className="text-lg font-semibold mb-3">상품 상세 소개</h2>
                <div className="rounded-xl border border-white/8 bg-surface-2 p-5 text-sm text-white/70 leading-relaxed whitespace-pre-wrap min-h-[80px]">
                  {description || "상세 소개가 아직 등록되지 않았습니다."}
                </div>
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />

      <Modal isOpen={refundOpen} onClose={() => setRefundOpen(false)} title="청약 철회 안내" size="md">
        <div className="space-y-2.5 text-sm text-white/70 leading-relaxed">
          <p>· 청약철회는 구매일로부터 7일 이내 가능합니다. (단, 사용했을 경우 청약철회 불가)</p>
          <p>· 고객센터 또는 결제 즉시 문의를 통해 취소·환불을 요청할 수 있으며, 구매 즉시 효과가 적용되는 상품 및 구매 시 지급되는 부가 상품을 사용한 경우 청약철회가 제한됩니다.</p>
          <p>· 미성년자가 법정대리인의 동의 없이 결제한 경우 미성년자 본인 또는 법정대리인은 결제를 취소할 수 있습니다. 단, 결제가 진행된 재화 또는 서비스의 콘텐츠가 사용된 경우에는 취소가 제한될 수 있습니다.</p>
        </div>
      </Modal>
    </>
  );
}
