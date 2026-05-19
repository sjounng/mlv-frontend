import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Info } from "lucide-react";
import { allProducts, featuredProducts } from "@/lib/shop-data";
import { Badge, Card, Separator } from "@/components/ui";
import ItemIcon from "@/components/minecraft/ItemIcon";
import ProductPurchasePanel from "./ProductPurchasePanel";

interface PageProps {
  params: Promise<{ id: string }>;
}

const categoryLabels: Record<string, string> = {
  package: "패키지",
  membership: "멤버십",
  currency: "재화",
  magic: "마공학",
  utility: "유틸리티",
  item: "아이템",
  cosmetic: "치장품",
};

const includedItemsMap: Record<string, { name: string; emoji: string; qty: number }[]> = {
  starter: [
    { name: "다이아몬드 검", emoji: "⚔️", qty: 1 },
    { name: "다이아몬드 갑옷 한 벌", emoji: "🛡️", qty: 1 },
    { name: "다이아몬드 50개", emoji: "💎", qty: 50 },
    { name: "랜덤 박스", emoji: "🎁", qty: 2 },
  ],
  "vip-30": [
    { name: "VIP 등급 (30일)", emoji: "👑", qty: 1 },
    { name: "전용 채팅 색상", emoji: "💬", qty: 1 },
    { name: "비행권 (30일)", emoji: "🪶", qty: 1 },
    { name: "보관함 9칸 확장", emoji: "📦", qty: 1 },
  ],
};

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = [...featuredProducts, ...allProducts].find((p) => p.id === id);
  if (!product) notFound();

  const included =
    includedItemsMap[product.id] ?? [
      { name: product.name, emoji: product.emoji, qty: 1 },
    ];

  return (
    <div className="flex-1 max-w-[1400px] w-full mx-auto px-4 py-6">
      <Link
        href="/shop"
        className="inline-flex items-center gap-1 text-xs text-white/40 hover:text-white/70 mb-4"
      >
        <ChevronLeft size={14} /> 상점으로 돌아가기
      </Link>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        {/* Left */}
        <div>
          <Card padding="lg">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className={`flex items-center justify-center rounded-xl w-full sm:w-56 h-56 ${product.emojiColor} shrink-0`}>
                <span className="text-7xl">{product.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="default" size="sm">{categoryLabels[product.category] ?? product.category}</Badge>
                  {product.badge === "HOT" && <Badge variant="hot" size="sm">HOT</Badge>}
                  {product.badge === "NEW" && <Badge variant="new" size="sm">NEW</Badge>}
                  {product.badge === "SALE" && <Badge variant="warning" size="sm">SALE</Badge>}
                </div>
                <h1 className="text-2xl font-bold">{product.name}</h1>
                <p className="mt-3 text-sm text-white/55 leading-relaxed">{product.desc}</p>
                <div className="mt-5 flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{product.price.toLocaleString()}</span>
                  <span className="text-sm text-white/50">원</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Included items */}
          <Card padding="lg" className="mt-4">
            <h2 className="text-base font-semibold mb-1">포함 내용</h2>
            <p className="text-xs text-white/40 mb-4">구매 시 인게임 우편함으로 다음 보상이 발송됩니다.</p>
            <div className="space-y-2">
              {included.map((it, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 bg-white/3 border border-white/5 rounded-lg px-3 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <ItemIcon emoji={it.emoji} color="bg-white/5" size="sm" />
                    <span className="text-sm">{it.name}</span>
                  </div>
                  <span className="text-xs text-white/50">× {it.qty}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Guide */}
          <Card padding="lg" className="mt-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/15 text-blue-300 flex items-center justify-center shrink-0">
                <Info size={17} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold">구매 안내</h3>
                <ul className="mt-3 space-y-1.5 text-xs text-white/55 list-disc list-inside">
                  <li>결제 완료 후 보상은 약 1분 이내 인게임 우편함으로 발송됩니다.</li>
                  <li>우편함은 인게임에서 <span className="text-white/80">/우편</span> 명령어로 확인할 수 있습니다.</li>
                  <li>유효기간이 있는 상품은 수령 시점부터 차감됩니다.</li>
                  <li>이미 수령한 상품의 환불은 제한될 수 있으니, 환불 정책을 참고해 주세요.</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Right - Purchase Panel */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <ProductPurchasePanel price={product.price} productName={product.name} />
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
