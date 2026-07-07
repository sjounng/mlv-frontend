"use client";

import { Play } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

// ─────────────────────────────────────────────────────────────
// ✏️ 히어로 배경 이미지 자리
//    public/assets/scenes/ 에 이미지를 넣고 경로를 적어주세요.
//    예: "/assets/scenes/hero.jpg"  (비워두면 그라데이션만 표시)
// ─────────────────────────────────────────────────────────────
const HERO_IMAGE = "";

const TRAILER_URL = siteConfig.trailerUrl;

// SNS 아이콘 (색은 피드백 추천색 #E0E3FF 로 통일 — CSS mask 로 칠한다)
const snsLinks = [
  { label: "디스코드", href: siteConfig.sns.discord, icon: "/assets/sns/discord_icon.svg" },
  { label: "네이버 카페", href: siteConfig.sns.naver, icon: "/assets/sns/naver_icon.svg" },
  { label: "X", href: siteConfig.sns.x, icon: "/assets/sns/x_icon.svg" },
  { label: "인스타그램", href: siteConfig.sns.instagram, icon: "/assets/sns/instagram_icon.svg" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* 배경: 이미지가 있으면 이미지 + 어두운 스크림, 없으면 그라데이션 */}
      {HERO_IMAGE ? (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(rgba(12,17,13,0.82), rgba(12,17,13,0.88)), url(${HERO_IMAGE}) center / cover no-repeat`,
          }}
        />
      ) : (
        <>
          <div className="absolute inset-0 bg-linear-to-br from-[#0c110d] via-[#111711] to-[#17201a]" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[42rem] h-[42rem] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none" />
        </>
      )}

      {/* 중앙 정렬 콘텐츠 */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-24 pb-16 w-full flex flex-col items-center text-center">
        {/* 콜아웃 (브랜드 노출: 마리벨 · 마이리틀밸리 · MLV) */}
        <p className="text-sm text-white/45 mb-4">힐링 판타지 마인크래프트 서버 · 마리벨(마이리틀밸리)</p>

        {/* Headline */}
        <h1 className="text-[2.7rem] leading-[1.1] sm:text-5xl md:text-6xl mb-7 tracking-tight">
          <span className="text-emerald-300">MLV</span>에서 시작하는
          <br />
          나만의 마인크래프트
        </h1>

        {/* SNS 링크 */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {snsLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              title={s.label}
              className="focus-ring group flex items-center justify-center w-10 h-10 rounded-lg bg-white/[0.05] border border-white/10 hover:border-white/25 hover:bg-white/10 transition-colors"
            >
              <span
                className="block w-5 h-5 transition-opacity opacity-80 group-hover:opacity-100"
                style={{
                  backgroundColor: "#E0E3FF",
                  maskImage: `url(${s.icon})`,
                  WebkitMaskImage: `url(${s.icon})`,
                  maskSize: "contain",
                  WebkitMaskSize: "contain",
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
                  maskPosition: "center",
                  WebkitMaskPosition: "center",
                }}
              />
            </a>
          ))}
        </div>

        {/* 메인 트레일러 영상 (화면 중앙 — 유튜브 embed 또는 mp4: site-config.trailerUrl) */}
        <div className="relative w-full max-w-3xl aspect-video rounded-xl overflow-hidden border border-white/10 shadow-[0_8px_0_rgba(0,0,0,0.4)] bg-linear-to-br from-surface-3 via-surface-4 to-black">
          {TRAILER_URL ? (
            TRAILER_URL.endsWith(".mp4") ? (
              <video src={TRAILER_URL} controls className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <iframe
                src={TRAILER_URL}
                title="마이리틀밸리 트레일러"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )
          ) : (
            <>
              <div className="absolute inset-0 bg-linear-to-tr from-emerald-500/10 via-transparent to-cyan-500/10" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
                  <Play size={24} className="text-white/50 fill-white/50 ml-0.5" />
                </div>
                <p className="text-xs text-white/35">트레일러 영상 준비 중</p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
