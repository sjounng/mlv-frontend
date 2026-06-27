"use client";

import { useState } from "react";
import { Copy, Check, Play, BookOpen } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const SERVER_ADDRESS = siteConfig.serverAddress;
const SERVER_EDITION = siteConfig.serverEdition;
const SERVER_STATUS = siteConfig.serverStatus;

const statusConfig = {
  open: { color: "bg-emerald-400", label: "서버 운영 중" },
  maintenance: { color: "bg-amber-400", label: "점검 중" },
  closed: { color: "bg-gray-500", label: "서버 닫힘" },
};

export default function HeroSection() {
  const [copied, setCopied] = useState(false);
  const [connectModal, setConnectModal] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SERVER_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const status = statusConfig[SERVER_STATUS];

  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-linear-to-br from-[#0b0c0d] via-[#101113] to-[#15171a]" />
        {/* Brand ambiance */}
        <div className="absolute -top-24 -left-24 w-[36rem] h-[36rem] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

        {/* Minecraft world illustration placeholder (right side) */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-30 pointer-events-none">
          <div
            className="w-full h-full"
            style={{
              background:
                "radial-gradient(ellipse at 70% 50%, rgba(255,255,255,0.05) 0%, transparent 70%)",
            }}
          />
          {/* Pixelated block grid overlay for MC feel */}
          <svg
            className="absolute inset-0 w-full h-full opacity-20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Castle silhouette blocks */}
          <div className="absolute bottom-0 right-0 w-full h-3/4 flex items-end justify-end pr-8">
            <BlockCastle />
          </div>
        </div>

        {/* Moon */}
        <div className="absolute top-20 right-1/3 w-14 h-14 rounded-full bg-white/60 blur-[2px] shadow-[0_0_50px_16px_rgba(255,255,255,0.10)]" />

        {/* Stars */}
        <Stars />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-12 w-full">
          <div className="max-w-2xl">
            {/* Status pill */}
            <span className="inline-flex items-center gap-2 mb-6 px-3 py-1 text-xs bg-white/[0.06] border border-white/10 rounded-full">
              <span className="relative flex w-2 h-2">
                {SERVER_STATUS === "open" && (
                  <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                )}
                <span className={`relative inline-flex w-2 h-2 rounded-full ${status.color}`} />
              </span>
              <span className="font-medium text-white/75">{status.label}</span>
              <span className="text-white/25">·</span>
              <span className="text-white/45">{SERVER_EDITION}</span>
            </span>

            {/* Headline */}
            <h1 className="text-[2.7rem] leading-[1.1] sm:text-5xl md:text-6xl font-bold mb-5 tracking-tight">
              <span className="text-emerald-300">{siteConfig.name}</span>에서 시작하는
              <br />
              나만의 마인크래프트
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-white/55 mb-9 leading-relaxed max-w-xl">
              다양한 콘텐츠와 안정적인 환경, 그리고 활발한 커뮤니티가 여러분을 기다립니다.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <button
                onClick={() => setConnectModal(true)}
                className="focus-ring flex items-center justify-center gap-2 px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium text-sm transition-colors shadow-lg shadow-emerald-950/40"
              >
                <Play size={15} className="fill-white" />
                서버 접속하기
              </button>
              <a
                href="/introduce"
                className="focus-ring flex items-center justify-center gap-2 px-7 py-3.5 border border-white/20 rounded-lg font-medium text-sm hover:bg-white/5 transition-colors text-white/80 hover:text-white"
              >
                <BookOpen size={15} />
                서버 가이드
              </a>
            </div>

            {/* Server address — primary, copyable */}
            <button
              onClick={handleCopy}
              className="focus-ring group flex items-center gap-3 px-4 py-3 bg-surface-2/80 border border-white/10 hover:border-emerald-400/30 rounded-xl transition-colors w-full sm:w-fit"
              title="주소 복사"
            >
              <span className="flex flex-col items-start min-w-0">
                <span className="text-[11px] text-white/40 font-medium">접속 주소</span>
                <span className="text-sm sm:text-base font-mono font-semibold text-white truncate">
                  {SERVER_ADDRESS}
                </span>
              </span>
              <span className="ml-auto flex items-center gap-1.5 text-xs text-white/50 group-hover:text-emerald-300 transition-colors shrink-0">
                {copied ? (
                  <>
                    <Check size={14} className="text-emerald-400" /> 복사됨
                  </>
                ) : (
                  <>
                    <Copy size={14} /> 복사
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Connect Modal */}
      {connectModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setConnectModal(false)}
        >
          <div
            className="bg-surface-3 border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-2">서버에 접속하기</h2>
            <p className="text-white/50 text-sm mb-6">
              마리벨 서버에 접속하려면 마인크래프트 Java Edition이 필요합니다.
            </p>

            <div className="bg-white/5 rounded-lg p-4 mb-6 flex items-center justify-between">
              <code className="text-sm font-mono">{SERVER_ADDRESS}</code>
              <button onClick={handleCopy} className="focus-ring text-white/40 hover:text-white" aria-label="주소 복사">
                {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              <a
                href="https://www.minecraft.net"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-2.5 px-4 bg-white/10 hover:bg-white/15 border border-white/15 rounded-lg text-sm transition-colors"
              >
                마인크래프트 공식 사이트
              </a>
              <a
                href="/introduce"
                className="block text-center py-2.5 px-4 border border-white/10 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              >
                접속 가이드 보기
              </a>
            </div>

            <button
              onClick={() => setConnectModal(false)}
              className="mt-4 w-full text-center text-xs text-white/30 hover:text-white/50 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Stars() {
  const positions = [
    { top: "8%", left: "55%", size: 1.5 },
    { top: "12%", left: "62%", size: 1 },
    { top: "5%", left: "75%", size: 2 },
    { top: "18%", left: "80%", size: 1 },
    { top: "22%", left: "58%", size: 1.5 },
    { top: "9%", left: "88%", size: 1 },
    { top: "30%", left: "92%", size: 2 },
    { top: "15%", left: "70%", size: 1 },
    { top: "35%", left: "68%", size: 1.5 },
    { top: "28%", left: "84%", size: 1 },
    { top: "6%", left: "50%", size: 1 },
    { top: "40%", left: "78%", size: 1.5 },
    { top: "3%", left: "95%", size: 1 },
  ];

  return (
    <>
      {positions.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/70"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
          }}
        />
      ))}
    </>
  );
}

function BlockCastle() {
  const blocks = [
    // Base platform
    { x: 0, y: 20, w: 22, h: 2, opacity: 0.5 },
    { x: 2, y: 18, w: 18, h: 2, opacity: 0.5 },
    // Tower left
    { x: 2, y: 2, w: 4, h: 16, opacity: 0.45 },
    { x: 1, y: 0, w: 2, h: 2, opacity: 0.6 },
    { x: 4, y: 0, w: 2, h: 2, opacity: 0.6 },
    // Tower right
    { x: 16, y: 4, w: 4, h: 14, opacity: 0.45 },
    { x: 15, y: 2, w: 2, h: 2, opacity: 0.6 },
    { x: 18, y: 2, w: 2, h: 2, opacity: 0.6 },
    // Center wall
    { x: 6, y: 8, w: 10, h: 10, opacity: 0.4 },
    { x: 7, y: 6, w: 2, h: 2, opacity: 0.55 },
    { x: 13, y: 6, w: 2, h: 2, opacity: 0.55 },
    // Gate
    { x: 9, y: 14, w: 4, h: 4, opacity: 0.2 },
    // Flag
    { x: 3, y: -2, w: 1, h: 4, opacity: 0.7 },
  ];

  return (
    <svg
      viewBox="-2 -4 26 28"
      className="w-80 h-80 md:w-[420px] md:h-[420px] text-white"
      style={{ filter: "drop-shadow(0 0 30px rgba(255,255,255,0.05))" }}
    >
      {blocks.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          fill={`rgba(180,180,180,${b.opacity})`}
          rx="0.1"
        />
      ))}
      {/* Flag */}
      <polygon points="4,-4 4,0 8,-2" fill="rgba(255,255,255,0.6)" />
    </svg>
  );
}
