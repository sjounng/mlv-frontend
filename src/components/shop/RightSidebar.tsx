import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface PopularItem {
  id: string;
  name: string;
  price: number;
  emoji: string;
  emojiColor: string;
}

const popularItems: PopularItem[] = [
  { id: "vip-30", name: "VIP 등급 [30일]", price: 9900, emoji: "👑", emojiColor: "bg-yellow-900/40" },
  { id: "emerald-1000", name: "에메랄드 1,000개", price: 11000, emoji: "💚", emojiColor: "bg-green-900/40" },
  { id: "starter", name: "스타터 패키지", price: 5500, emoji: "📦", emojiColor: "bg-amber-900/40" },
  { id: "diamond-100", name: "다이아몬드 100개", price: 1100, emoji: "💎", emojiColor: "bg-cyan-900/40" },
  { id: "fly-7", name: "비행권 [7일]", price: 5500, emoji: "🪶", emojiColor: "bg-slate-700/40" },
];

const updates = [
  { title: "마공학 장비 밸런스 조정 안내", date: "2024.05.20" },
  { title: "신규 펫 3종 추가", date: "2024.05.18" },
  { title: "5월 가정의 달 특별 이벤트", date: "2024.05.15" },
];

export default function RightSidebar() {
  return (
    <aside className="w-64 shrink-0 flex flex-col gap-4">
      {/* Popular Items */}
      <div className="bg-[#161616] border border-white/8 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold">인기 상품</p>
          <Link href="/shop?sort=popular" className="flex items-center gap-0.5 text-xs text-white/35 hover:text-white/60 transition-colors">
            더보기 <ArrowRight size={11} />
          </Link>
        </div>

        <ol className="flex flex-col gap-2.5">
          {popularItems.map((item, i) => (
            <li key={item.id}>
              <Link
                href={`/shop/product/${item.id}`}
                className="flex items-center gap-2.5 group"
              >
                <span className={`w-4 text-xs font-bold shrink-0 ${i < 3 ? "text-white/60" : "text-white/25"}`}>
                  {i + 1}
                </span>
                <div className={`w-7 h-7 rounded ${item.emojiColor} flex items-center justify-center text-base shrink-0`}>
                  {item.emoji}
                </div>
                <span className="text-xs text-white/70 group-hover:text-white transition-colors flex-1 leading-tight line-clamp-1">
                  {item.name}
                </span>
                <span className="text-xs text-white/50 shrink-0 tabular-nums">
                  {item.price.toLocaleString()} C
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>

      {/* Sale Event Banner */}
      <div className="relative bg-[#161616] border border-white/8 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-purple-900/20 to-transparent" />
        <div className="relative p-4">
          <p className="text-sm font-semibold mb-1.5">특별 할인 이벤트</p>
          <p className="text-xs text-white/45 mb-4 leading-relaxed">
            주말 한정! 인기 패키지 최대 30% 할인
          </p>
          <div className="h-20 bg-white/3 rounded-lg flex items-center justify-center mb-4 text-3xl">
            🎁
          </div>
          <Link
            href="/event"
            className="block text-center py-2 px-4 bg-white/8 hover:bg-white/12 border border-white/10 rounded-lg text-xs font-medium transition-colors"
          >
            이벤트 보러가기
          </Link>
        </div>
      </div>

      {/* Recent Updates */}
      <div className="bg-[#161616] border border-white/8 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold">최근 업데이트</p>
          <Link href="/info" className="flex items-center gap-0.5 text-xs text-white/35 hover:text-white/60 transition-colors">
            더보기 <ArrowRight size={11} />
          </Link>
        </div>

        <ul className="flex flex-col gap-3">
          {updates.map((u, i) => (
            <li key={i} className="flex flex-col gap-0.5">
              <Link href="/info" className="text-xs text-white/65 hover:text-white transition-colors leading-snug">
                {u.title}
              </Link>
              <span className="text-[10px] text-white/25">{u.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
