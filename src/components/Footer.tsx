import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const serviceLinks = [
  { label: "소개", href: "/introduce" },
  { label: "웹상점", href: "/shop" },
  { label: "이벤트", href: "/event" },
  { label: "문의", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
          <div>
            <span className="font-bold text-sm text-white/70 tracking-wide">
              {siteConfig.name} ({siteConfig.fullName})
            </span>
            <p className="mt-2 text-xs text-white/30 max-w-xs leading-relaxed">
              {siteConfig.tagline}
            </p>
          </div>

          <div className="flex flex-wrap gap-12">
            <nav>
              <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">
                서비스
              </p>
              <ul className="flex flex-col gap-2">
                {serviceLinks.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-white/40 hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav>
              <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">
                정보
              </p>
              <ul className="flex flex-col gap-2">
                {[
                  { label: "이용약관", href: "/info/terms" },
                  { label: "개인정보처리방침", href: "/info/privacy" },
                  { label: "환불 정책", href: "/info/refund" },
                  { label: "FAQ", href: "/info/faq" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-white/40 hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-2">
          <p className="text-xs text-white/20">
            © 2026 마리벨(마이리틀밸리). All rights reserved.
          </p>
          <p className="text-xs text-white/15">
            마인크래프트는 Mojang Studios의 등록 상표입니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
