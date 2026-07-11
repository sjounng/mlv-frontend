"use client";

// 홈 마지막(푸터) 섹션 상단의 좌우 슬라이드쇼 (07-10 피드백: 빈 공간 채움).
// 이미지는 site-config.footerSlides 에서 관리. 비어 있으면 브랜드 플레이스홀더 표시.
import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { footerSlides } from "@/lib/site-config";

const AUTO_MS = 5_000;

export default function FooterSlideshow() {
  const slides = footerSlides;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % slides.length), AUTO_MS);
    return () => clearInterval(t);
  }, [slides.length]);

  const total = slides.length;
  const go = (dir: 1 | -1) => setCurrent((c) => (c + dir + total) % total);

  return (
    <div className="relative w-full max-w-5xl mx-auto aspect-[16/6] rounded-2xl overflow-hidden border border-white/10 bg-linear-to-br from-surface-3 via-surface-4 to-surface-2">
      {total === 0 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/30">
          <ImageIcon size={28} />
          <p className="text-xs">이미지 준비 중</p>
        </div>
      ) : (
        <>
          {slides.map((src, i) => (
            <div
              key={src}
              className="absolute inset-0 transition-opacity duration-700 ease-in-out"
              style={{ opacity: current === i ? 1 : 0 }}
            >
              <Image src={src} alt="" fill sizes="(min-width: 768px) 64rem, 100vw" className="object-cover" unoptimized />
            </div>
          ))}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="이전"
                className="focus-ring absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/65 text-white/80 hover:text-white border border-white/10 backdrop-blur-sm transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="다음"
                className="focus-ring absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/65 text-white/80 hover:text-white border border-white/10 backdrop-blur-sm transition-colors"
              >
                <ChevronRight size={18} />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
                {slides.map((s, i) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setCurrent(i)}
                    aria-label={`${i + 1}번째로 이동`}
                    className={`h-2 rounded-full transition-all duration-300 ${current === i ? "w-5 bg-white" : "w-2 bg-white/40 hover:bg-white/70"}`}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
