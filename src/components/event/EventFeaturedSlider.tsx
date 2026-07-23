"use client";

// 이벤트 상단 자동 슬라이더 (07-22 피드백): 관리자가 featured 로 선택한 이벤트의
//  배너 이미지를 좌우 슬라이드로 표시. 클릭 시 해당 이벤트 상세로 이동.
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { eventsApi, type PublicEvent } from "@/lib/events-api";

const AUTO_MS = 5_000;
const HOLD_MS = 5_000;

export default function EventFeaturedSlider() {
  const [slides, setSlides] = useState<PublicEvent[]>([]);
  const [ready, setReady] = useState(false);
  const [current, setCurrent] = useState(0);
  const holdUntilRef = useRef(0);

  useEffect(() => {
    void eventsApi
      .featured()
      .then((list) => setSlides(list.filter((e) => e.bannerImageUrl)))
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      if (Date.now() < holdUntilRef.current) return;
      setCurrent((c) => (c + 1) % slides.length);
    }, AUTO_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  const total = slides.length;
  const go = (dir: 1 | -1) => {
    holdUntilRef.current = Date.now() + HOLD_MS;
    setCurrent((c) => (c + dir + total) % total);
  };

  // featured 배너가 없으면 영역 자체를 표시하지 않음
  if (!ready || total === 0) return null;

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-[0_10px_0_rgba(0,0,0,0.4)] bg-linear-to-br from-surface-3 via-surface-4 to-surface-2">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: current === i ? 1 : 0, pointerEvents: current === i ? "auto" : "none" }}
        >
          <Link href={`/event/${slide.id}`} className="absolute inset-0" aria-label={`${slide.name} 자세히 보기`}>
            <Image
              src={slide.bannerImageUrl as string}
              alt={slide.name}
              fill
              sizes="(min-width: 768px) 70vw, 100vw"
              className="object-cover"
              priority={i === 0}
              unoptimized
            />
          </Link>
        </div>
      ))}

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="이전 배너"
            className="focus-ring absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/65 text-white/80 hover:text-white border border-white/10 backdrop-blur-sm transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="다음 배너"
            className="focus-ring absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/65 text-white/80 hover:text-white border border-white/10 backdrop-blur-sm transition-colors"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  holdUntilRef.current = Date.now() + HOLD_MS;
                  setCurrent(i);
                }}
                aria-label={`${i + 1}번째 배너로 이동`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  current === i ? "w-5 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
