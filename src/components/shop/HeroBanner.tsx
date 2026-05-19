"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    tag: "다양한 아이템과 특별한 혜택",
    title: "더 강해지는 경험,\n지금 상점에서 시작하세요!",
    cta: "인기 상품 보러가기",
    href: "/shop?cat=featured",
    accent: "from-[#1a1f1a]",
    itemEmoji: "📦",
    itemColor: "bg-amber-900/30",
  },
  {
    tag: "이번 주 한정 특가",
    title: "VIP 등급으로\n더 특별한 서버 생활!",
    cta: "VIP 등급 보러가기",
    href: "/shop?cat=membership",
    accent: "from-[#1a1a2a]",
    itemEmoji: "👑",
    itemColor: "bg-yellow-900/30",
  },
  {
    tag: "신규 아이템 출시",
    title: "마공학 업데이트,\n새로운 장비가 도착했습니다!",
    cta: "신규 상품 보기",
    href: "/shop?cat=magic",
    accent: "from-[#1a1a1f]",
    itemEmoji: "⚗️",
    itemColor: "bg-purple-900/30",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  const slide = slides[current];

  return (
    <div className="relative h-48 rounded-xl overflow-hidden bg-[#161616] border border-white/8">
      {/* Background */}
      <div className={`absolute inset-0 bg-linear-to-r ${slide.accent} to-transparent`} />
      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />

      {/* Grid pattern overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="shop-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#shop-grid)" />
      </svg>

      {/* Item visual (right side) */}
      <div className={`absolute right-12 top-1/2 -translate-y-1/2 w-28 h-28 ${slide.itemColor} rounded-xl flex items-center justify-center text-6xl`}>
        {slide.itemEmoji}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-8">
        <span className="text-xs text-white/50 mb-2">{slide.tag}</span>
        <h2 className="text-xl font-bold leading-snug mb-4 whitespace-pre-line">
          {slide.title}
        </h2>
        <a
          href={slide.href}
          className="inline-flex items-center px-4 py-2 text-xs font-medium bg-white/10 hover:bg-white/15 border border-white/15 rounded-lg transition-colors w-fit"
        >
          {slide.cta}
        </a>
      </div>

      {/* Prev / Next */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 hover:bg-black/60 border border-white/10 rounded-md flex items-center justify-center transition-colors"
      >
        <ChevronLeft size={14} />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 hover:bg-black/60 border border-white/10 rounded-md flex items-center justify-center transition-colors"
      >
        <ChevronRight size={14} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all ${
              i === current ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
