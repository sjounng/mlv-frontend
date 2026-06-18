"use client";

import { useState } from "react";
import { Copy, Check, Play, BookOpen } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const SERVER_ADDRESS = siteConfig.serverAddress;
const SERVER_MAX = 2000;
const SERVER_ONLINE = 1234;
const SERVER_STATUS: "open" | "maintenance" | "closed" = "open";

const statusConfig = {
  open: { color: "bg-green-500", label: "서버 운영 중" },
  maintenance: { color: "bg-red-500", label: "점검 중" },
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
        <div className="absolute inset-0 bg-linear-to-br from-[#0d0d0d] via-[#111111] to-[#1a1a1a]" />

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
        <div className="absolute top-20 right-1/3 w-16 h-16 rounded-full bg-white/80 blur-sm shadow-[0_0_60px_20px_rgba(255,255,255,0.15)]" />

        {/* Stars */}
        <Stars />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-12 w-full">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="px-3 py-1 text-xs text-white/70 bg-white/10 border border-white/15 rounded-full">
                함께 만드는, 우리의 마인크래프트 세상
              </span>
              {/* Server status dot */}
              <span className="flex items-center gap-1.5 group relative">
                <span className={`w-2 h-2 rounded-full ${status.color} shadow-[0_0_6px_2px] ${SERVER_STATUS === "open" ? "shadow-green-500/60" : SERVER_STATUS === "maintenance" ? "shadow-red-500/60" : "shadow-gray-500/60"}`} />
                <span className="text-xs text-white/40 group-hover:text-white/70 transition-colors">
                  {status.label}
                </span>
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-5 tracking-tight">
              모두가 즐길 수 있는
              <br />
              최고의 마인크래프트 서버
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-white/55 mb-10 leading-relaxed">
              다양한 콘텐츠와 안정적인 환경,
              <br />
              그리고 활발한 커뮤니티가 여러분을 기다립니다.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 mb-10">
              <button
                onClick={() => setConnectModal(true)}
                className="flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg font-medium text-sm transition-all"
              >
                <Play size={15} className="fill-white" />
                서버 접속하기
              </button>
              <a
                href="/introduce"
                className="flex items-center gap-2 px-7 py-3.5 border border-white/20 rounded-lg font-medium text-sm hover:bg-white/5 transition-all text-white/80 hover:text-white"
              >
                <BookOpen size={15} />
                서버 가이드
              </a>
            </div>

            {/* Server Info Card */}
            <div className="flex flex-wrap gap-px bg-white/10 border border-white/10 rounded-xl overflow-hidden w-fit">
              {/* Address */}
              <div className="px-5 py-4 bg-[#111111] flex flex-col gap-1 min-w-[180px]">
                <span className="text-xs text-white/40 font-medium">접속 주소</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-medium">{SERVER_ADDRESS}</span>
                  <button
                    onClick={handleCopy}
                    className="text-white/40 hover:text-white transition-colors"
                    title="주소 복사"
                  >
                    {copied ? (
                      <Check size={14} className="text-green-400" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="w-px bg-white/10" />

              {/* Player count */}
              <div className="px-5 py-4 bg-[#111111] flex flex-col gap-1 min-w-[160px]">
                <span className="text-xs text-white/40 font-medium">현재 접속자</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-mono font-medium">
                    {SERVER_ONLINE.toLocaleString()}{" "}
                    <span className="text-white/30">/ {SERVER_MAX.toLocaleString()}</span>
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                </div>
              </div>
            </div>
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
            className="bg-[#181818] border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-2">서버에 접속하기</h2>
            <p className="text-white/50 text-sm mb-6">
              마리벨 서버에 접속하려면 마인크래프트 Java Edition이 필요합니다.
            </p>

            <div className="bg-white/5 rounded-lg p-4 mb-6 flex items-center justify-between">
              <code className="text-sm font-mono">{SERVER_ADDRESS}</code>
              <button onClick={handleCopy} className="text-white/40 hover:text-white">
                {copied ? <Check size={15} className="text-green-400" /> : <Copy size={15} />}
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

  const UNIT = 16;

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
