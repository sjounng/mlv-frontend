import Link from "next/link";
import { Info, MessageCircle } from "lucide-react";

const notices = [
  "구매한 상품은 인게임 우편함으로 자동 지급됩니다.",
  "결제 후 문제가 발생하면 문의 페이지를 이용해주세요.",
  "환불 정책은 서버 정보 > 환불 정책에서 확인하세요.",
];

export default function ShopSidebar() {
  return (
    <aside className="hidden lg:flex w-56 shrink-0 flex-col gap-4">
      {/* Purchase Guide */}
      <div className="bg-white/3 border border-white/8 rounded-xl p-4">
        <p className="text-xs font-semibold text-white/60 mb-3">구매 안내</p>
        <ul className="flex flex-col gap-2.5">
          {notices.map((notice, i) => (
            <li key={i} className="flex gap-2 items-start">
              <Info size={12} className="text-white/25 mt-0.5 shrink-0" />
              <p className="text-xs text-white/40 leading-relaxed">{notice}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Help */}
      <div className="bg-white/3 border border-white/8 rounded-xl p-4">
        <p className="text-sm font-semibold mb-1">도움이 필요하신가요?</p>
        <p className="text-xs text-white/40 mb-4 leading-relaxed">
          상품 구매 관련 문의는 문의 페이지를 이용해주세요.
        </p>
        <Link
          href="/contact"
          className="flex items-center justify-between w-full px-3 py-2 bg-white/8 hover:bg-white/12 border border-white/10 rounded-lg text-sm transition-colors"
        >
          <span>문의하기</span>
          <MessageCircle size={13} className="text-white/50" />
        </Link>
      </div>
    </aside>
  );
}
