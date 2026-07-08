"use client";

// 메인 인트로 이미지 슬라이더 (07-08 피드백: 트레일러 영상 → 이미지 슬라이드)
// - 배너 이미지/링크는 웹패널(관리자 > 배너)에서 설정 (/api/public/popups)
// - 좌우 반투명 화살표 블록으로 직접 전환, 하단 페이지 도트 표시
// - 기본 5초 자동 슬라이드, 유저가 직접 넘기면 이후 5초간 자동 전환 정지
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { api } from "@/lib/api";

interface PublicPopup {
  id: number;
  imageUrl: string;
  linkUrl: string | null;
}

const AUTO_MS = 5_000; // 기본 자동 전환 주기
const HOLD_MS = 5_000; // 수동 조작 후 자동 전환 정지 시간

export default function IntroSlider() {
  const [slides, setSlides] = useState<PublicPopup[]>([]);
  const [current, setCurrent] = useState(0);
  const holdUntilRef = useRef(0);

  useEffect(() => {
    void api
      .get<PublicPopup[]>("/api/public/popups")
      .then(setSlides)
      .catch(() => {});
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

  return (
    <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden border border-white/10 shadow-[0_10px_0_rgba(0,0,0,0.4)] bg-linear-to-br from-surface-3 via-surface-4 to-black">
      {total === 0 ? (
        // 배너 미등록 시 플레이스홀더
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-linear-to-tr from-emerald-500/10 via-transparent to-cyan-500/10">
          <ImageIcon size={30} className="text-white/25" />
          <p className="text-xs text-white/35">배너 이미지 준비 중</p>
        </div>
      ) : (
        <>
          {slides.map((slide, i) => {
            const inner = (
              <Image
                src={slide.imageUrl}
                alt="이벤트 배너"
                fill
                sizes="(min-width: 768px) 70vw, 100vw"
                className="object-cover"
                priority={i === 0}
                unoptimized
              />
            );
            return (
              <div
                key={slide.id}
                className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                style={{ opacity: current === i ? 1 : 0, pointerEvents: current === i ? "auto" : "none" }}
              >
                {slide.linkUrl ? (
                  <a href={slide.linkUrl} className="absolute inset-0" aria-label="이벤트 자세히 보기">
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </div>
            );
          })}

          {total > 1 && (
            <>
              {/* 좌우 반투명 화살표 블록 */}
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="이전 배너"
                className="focus-ring group/arrow absolute left-0 top-0 bottom-0 w-14 sm:w-16 flex items-center justify-center bg-black/25 hover:bg-black/45 transition-colors"
              >
                <ChevronLeft size={26} className="text-white/70 group-hover/arrow:text-white transition-colors" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="다음 배너"
                className="focus-ring group/arrow absolute right-0 top-0 bottom-0 w-14 sm:w-16 flex items-center justify-center bg-black/25 hover:bg-black/45 transition-colors"
              >
                <ChevronRight size={26} className="text-white/70 group-hover/arrow:text-white transition-colors" />
              </button>

              {/* 하단 페이지 도트 */}
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
        </>
      )}
    </div>
  );
}
