import Link from "next/link";
import Image from "next/image";
import { businessInfo, siteConfig } from "@/lib/site-config";
import SnsLinks from "@/components/SnsLinks";

const legalLinks = [
  { label: "이용약관", href: "/info/terms" },
  { label: "개인정보처리방침", href: "/info/privacy" },
  { label: "환불 정책", href: "/info/refund" },
  { label: "FAQ", href: "/info/faq" },
];

export default function Footer() {
  return (
    <footer className="bg-surface-1 border-t border-white/8 py-7">
      <div className="max-w-7xl mx-auto px-6">
        {/* 상단 한 줄: 로고+소개(좌) / 약관 링크 + SNS(우) — 07-10 피드백: 위치 교체 + 높이 축소 */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/brand/maribel-logo.png"
              alt={siteConfig.name}
              width={600}
              height={214}
              className="h-7 w-auto opacity-90"
            />
            <p className="text-sm text-white/45">
              {siteConfig.fullName} <span className="text-white/20 mx-1">|</span> 최고의 힐링 판타지
              마인크래프트 서버
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <nav aria-label="정보">
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {legalLinks.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-xs text-white/45 hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <SnsLinks size="sm" />
          </div>
        </div>

        {/* 사업자 정보 */}
        <div className="pt-5 border-t border-white/5 mb-5">
          <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">
            사업자 정보
          </p>
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-1.5">
            {businessInfo.map(({ label, value }) => (
              <div key={label} className="flex gap-2 text-xs leading-relaxed">
                <dt className="text-white/25 shrink-0">{label}</dt>
                <dd className="text-white/40 break-keep">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="pt-5 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-2">
          <p className="text-xs text-white/20">
            © 2026 {siteConfig.fullName}. All rights reserved.
          </p>
          <p className="text-xs text-white/15 break-keep">
            Minecraft는 Mojang AB 및 Microsoft의 상표이며 {siteConfig.fullName}는 이들과 제휴관계가
            아닙니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
