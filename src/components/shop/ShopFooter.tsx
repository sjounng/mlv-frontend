// 상점 하단 푸터 (07-10 피드백 재배치): 구매안내 · 문의하기
import Link from "next/link";
import { Info, MessageCircle } from "lucide-react";

const notices = [
  "구매한 상품은 인게임 우편함으로 자동 지급됩니다.",
  "결제 후 문제가 발생하면 문의 페이지를 이용해주세요.",
  "환불 정책은 홈페이지 하단 > 환불 정책에서 확인하세요.",
];

export default function ShopFooter() {
  return (
    <footer className="mt-2 border-t border-white/8 pt-8 grid gap-6 md:grid-cols-2">
      {/* 구매 안내 */}
      <div>
        <p className="text-sm font-semibold mb-3">구매 안내</p>
        <ul className="flex flex-col gap-2.5">
          {notices.map((notice, i) => (
            <li key={i} className="flex gap-2 items-start">
              <Info size={12} className="text-white/25 mt-0.5 shrink-0" />
              <p className="text-xs text-white/45 leading-relaxed">{notice}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* 문의하기 */}
      <div>
        <p className="text-sm font-semibold mb-3">도움이 필요하신가요?</p>
        <p className="text-xs text-white/45 mb-4 leading-relaxed">상품 구매 관련 문의는 고객지원을 이용해주세요.</p>
        <Link
          href="/contact"
          className="focus-ring flex items-center justify-between w-full sm:max-w-xs px-3 py-2 bg-white/8 hover:bg-white/12 border border-white/10 rounded-lg text-sm transition-colors"
        >
          <span>문의하기</span>
          <MessageCircle size={13} className="text-white/50" />
        </Link>
      </div>
    </footer>
  );
}
