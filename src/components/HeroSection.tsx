"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, Play, BookOpen, X } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

// ─────────────────────────────────────────────────────────────
// ✏️ 히어로 배경 이미지 자리
//    public/assets/scenes/ 에 이미지를 넣고 경로를 적어주세요.
//    예: "/assets/scenes/hero.jpg"  (비워두면 그라데이션만 표시)
// ─────────────────────────────────────────────────────────────
const HERO_IMAGE = "";

const CLIENT_DOWNLOAD_URL = siteConfig.clientDownloadUrl;
const GUIDE_URL = siteConfig.guideUrl;
const TRAILER_URL = siteConfig.trailerUrl;

// SNS 아이콘 (색은 피드백 추천색 #E0E3FF 로 통일 — CSS mask 로 칠한다)
const snsLinks = [
  { label: "디스코드", href: siteConfig.sns.discord, icon: "/assets/sns/discord_icon.svg" },
  { label: "네이버 카페", href: siteConfig.sns.naver, icon: "/assets/sns/naver_icon.svg" },
  { label: "X", href: siteConfig.sns.x, icon: "/assets/sns/x_icon.svg" },
  { label: "인스타그램", href: siteConfig.sns.instagram, icon: "/assets/sns/instagram_icon.svg" },
];

export default function HeroSection() {
  const [connectModal, setConnectModal] = useState(false);

  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* 배경: 이미지가 있으면 이미지 + 좌측 가독성 스크림, 없으면 그라데이션 */}
        {HERO_IMAGE ? (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, rgba(12,17,13,0.92) 0%, rgba(12,17,13,0.6) 45%, rgba(12,17,13,0.3) 100%), url(${HERO_IMAGE}) center / cover no-repeat`,
            }}
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-linear-to-br from-[#0c110d] via-[#111711] to-[#17201a]" />
            <div className="absolute -top-24 -left-24 w-[36rem] h-[36rem] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
          </>
        )}

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-12 w-full grid md:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            {/* 콜아웃 */}
            <p className="text-sm text-white/45 mb-4">힐링 판타지 마인크래프트 서버 마이리틀밸리</p>

            {/* Headline */}
            <h1 className="text-[2.7rem] leading-[1.1] sm:text-5xl md:text-6xl mb-9 tracking-tight">
              <span className="text-emerald-300">MLV</span>에서 시작하는
              <br />
              나만의 마인크래프트
            </h1>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <button
                onClick={() => setConnectModal(true)}
                className="focus-ring flex items-center justify-center gap-2.5 px-10 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-semibold text-base transition-[background-color,box-shadow,transform] duration-150 shadow-[0_3px_0_0_#065f46] active:translate-y-[2px] active:shadow-[0_1px_0_0_#065f46]"
              >
                <Play size={17} className="fill-white" />
                플레이로
              </button>
              <Link
                href="/introduce"
                className="focus-ring flex items-center justify-center gap-2 px-7 py-4 border border-white/20 rounded-lg font-medium text-sm hover:bg-white/5 transition-colors text-white/80 hover:text-white"
              >
                <BookOpen size={15} />
                서버 소개
              </Link>
            </div>

            {/* SNS 링크 */}
            <div className="flex items-center gap-4">
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
          </div>

          {/* 메인 트레일러 영상 자리 (유튜브 embed 또는 mp4 — site-config.trailerUrl) */}
          <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-linear-to-br from-surface-3 via-surface-4 to-black">
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

      {/* 플레이 방법 모달 */}
      {connectModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setConnectModal(false)}
        >
          <div
            className="relative bg-surface-3 border border-white/10 rounded-lg p-8 max-w-md w-full mx-4 shadow-[0_6px_0_rgba(0,0,0,0.45)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* X 닫기 버튼 */}
            <button
              onClick={() => setConnectModal(false)}
              className="focus-ring absolute top-4 right-4 p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="닫기"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-bold mb-3">플레이 방법</h2>
            <p className="text-white/55 text-sm leading-relaxed mb-6 break-keep">
              마이리틀밸리 서버에 접속하려면 전용런처와 Java Edition을 보유한 Microsoft 계정이
              필요합니다. 아래 다운로드 버튼을 눌러 런처를 설치한 뒤 로그인하여 플레이 해주시기
              바랍니다.
            </p>

            <div className="flex flex-col gap-2.5">
              {CLIENT_DOWNLOAD_URL ? (
                <a
                  href={CLIENT_DOWNLOAD_URL}
                  className="focus-ring flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-semibold transition-[background-color,box-shadow,transform] duration-150 shadow-[0_3px_0_0_#065f46] active:translate-y-[2px] active:shadow-[0_1px_0_0_#065f46]"
                >
                  <Download size={15} />
                  전용 런처 다운로드
                </a>
              ) : (
                <div className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white/45">
                  <Download size={15} />
                  다운로드 링크 준비 중입니다
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  if (GUIDE_URL) window.open(GUIDE_URL, "_blank", "noopener,noreferrer");
                }}
                disabled={!GUIDE_URL}
                className="focus-ring block w-full text-center py-2.5 px-4 border border-white/10 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {GUIDE_URL ? "접속 가이드 보기" : "접속 가이드 준비 중"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
