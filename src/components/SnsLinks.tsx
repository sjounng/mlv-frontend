"use client";

// 공식 SNS 링크 묶음.
// - 아이콘은 CSS mask 로 단색 렌더(선 두께/색을 일관되게 통일)
// - 호버 시 각 SNS 브랜드 색(hex)이 아래에서 위로 애니메이션으로 채워지고 아이콘은 흰색으로 전환
import { siteConfig } from "@/lib/site-config";

type Sns = {
  label: string;
  href: string;
  icon: string;
  /** 호버 시 채워질 브랜드 배경 (단색 또는 그라데이션 CSS 값) */
  fill: string;
  /** 아이콘 SVG마다 내부 여백이 달라 시각 크기를 맞추기 위한 배율 (기본 1) */
  scale?: number;
};

const snsLinks: Sns[] = [
  // 디스코드=블러플, 네이버 카페=그린 (브랜드 실제 색상)
  { label: "디스코드", href: siteConfig.sns.discord, icon: "/assets/sns/discord_icon.svg", fill: "#5662f6" },
  // 네이버 아이콘은 내부 여백이 커서 얇게 보임 → 살짝 키워 굵기/크기를 맞춘다
  { label: "네이버 카페", href: siteConfig.sns.naver, icon: "/assets/sns/naver_icon.svg", fill: "#3ccb0e", scale: 1.18 },
  { label: "X", href: siteConfig.sns.x, icon: "/assets/sns/x_icon.svg", fill: "#131313" },
  // 인스타그램 공식 그라데이션 (노랑→오렌지→마젠타→퍼플→블루)
  {
    label: "인스타그램",
    href: siteConfig.sns.instagram,
    icon: "/assets/sns/instagram_icon.svg",
    fill: "linear-gradient(45deg, #feda75 0%, #fa7e1e 25%, #d62976 50%, #962fbf 75%, #4f5bd5 100%)",
  },
];

export default function SnsLinks({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  const btn = size === "sm" ? "w-9 h-9" : "w-11 h-11";
  const ic = size === "sm" ? "w-[18px] h-[18px]" : "w-5 h-5";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {snsLinks.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          title={s.label}
          className={`focus-ring group relative overflow-hidden flex items-center justify-center ${btn} rounded-xl bg-white/[0.05] border border-white/10 transition-colors duration-300 group-hover:border-transparent`}
        >
          {/* 호버 시 아래→위로 차오르는 브랜드 색 배경 */}
          <span
            aria-hidden
            className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
            style={{ background: s.fill }}
          />
          {/* 아이콘 (mask 단색): 기본은 테마 전경색, 호버 시엔 브랜드 색 위라 '진짜 흰색' 고정
              (라이트에서 bg-white 가 다크로 반전되면 X 검정 배경 위에서 안 보이는 문제 방지) */}
          <span
            aria-hidden
            className={`relative z-10 block ${ic} bg-white/70 group-hover:bg-[#ffffff] transition-colors duration-300`}
            style={{
              maskImage: `url(${s.icon})`,
              WebkitMaskImage: `url(${s.icon})`,
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskPosition: "center",
              transform: s.scale ? `scale(${s.scale})` : undefined,
            }}
          />
        </a>
      ))}
    </div>
  );
}
