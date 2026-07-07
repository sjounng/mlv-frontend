"use client";

// 메인 하단 이벤트 배너 슬라이더 (피드백 5번 항목)
// - 배너 이미지/링크는 웹패널(관리자 > 배너)에서 설정한다 (/api/public/popups)
// - 3초마다 우측으로 자동 전환(루프), 사용자가 화살표로 직접 넘기면 10초간 고정
// - 중앙에 현재 배너, 좌우로 이전/다음 배너가 톤다운되어 살짝 보인다
// - 배너 클릭 시 설정된 링크로 이동

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";

interface PublicPopup {
  id: number;
  imageUrl: string;
  linkUrl: string | null;
}

const AUTO_MS = 3_000; // 자동 전환 주기
const HOLD_MS = 10_000; // 수동 조작 후 고정 시간

// 단일 배너 렌더 (side=미리보기는 링크 비활성). 모듈 스코프에 두어 렌더마다 재생성되지 않게 한다.
function Banner({ slide, side }: { slide: PublicPopup; side?: boolean }) {
  const img = (
    <Image
      src={slide.imageUrl}
      alt="이벤트 배너"
      fill
      sizes={side ? "(min-width: 768px) 45vw, 0px" : "(min-width: 768px) 70vw, 100vw"}
      className="object-cover"
      // 관리자 업로드 이미지는 환경마다 호스트가 달라 최적화 대상 매칭이 취약하므로 우회한다.
      unoptimized
    />
  );
  if (side || !slide.linkUrl) {
    return <div className="absolute inset-0">{img}</div>;
  }
  return (
    <a href={slide.linkUrl} className="absolute inset-0 cursor-pointer" aria-label="이벤트 자세히 보기">
      {img}
    </a>
  );
}

export default function EventBannerSlider() {
  const [slides, setSlides] = useState<PublicPopup[]>([]);
  const [current, setCurrent] = useState(0);
  const [ready, setReady] = useState(false);
  const holdUntilRef = useRef(0);

  const load = useCallback(async () => {
    try {
      setSlides(await api.get<PublicPopup[]>("/api/public/popups"));
    } catch {
      // 배너 없음/실패 시 섹션을 숨긴다
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  // 3초 자동 루프 (수동 조작 후에는 holdUntil 까지 대기)
  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      if (Date.now() < holdUntilRef.current) return;
      setCurrent((c) => (c + 1) % slides.length);
    }, AUTO_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!ready || slides.length === 0) return null;

  const total = slides.length;
  const go = (dir: 1 | -1) => {
    holdUntilRef.current = Date.now() + HOLD_MS;
    setCurrent((c) => (c + dir + total) % total);
  };
  const at = (offset: number) => slides[(current + offset + total) % total];

  return (
    <section className="py-20 sm:py-28 bg-surface-1 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6">
        {/* 캐러셀: 중앙 배너를 크게, 좌우 배너가 뒤에서 겹쳐 삐져나온다 */}
        <div className="relative">
          {/* 이전 배너 미리보기 — 왼쪽에서 중앙 배너 뒤로 겹침 */}
          {total > 1 && (
            <div
              className="hidden md:block absolute top-1/2 -translate-y-1/2 left-[-20%] w-[56%] aspect-[16/9] rounded-xl overflow-hidden z-0 scale-90 opacity-35 saturate-50 pointer-events-none"
              aria-hidden
            >
              <Banner slide={at(-1)} side />
            </div>
          )}

          {/* 다음 배너 미리보기 — 오른쪽에서 중앙 배너 뒤로 겹침 */}
          {total > 1 && (
            <div
              className="hidden md:block absolute top-1/2 -translate-y-1/2 right-[-20%] w-[56%] aspect-[16/9] rounded-xl overflow-hidden z-0 scale-90 opacity-35 saturate-50 pointer-events-none"
              aria-hidden
            >
              <Banner slide={at(1)} side />
            </div>
          )}

          {/* 현재 배너 (중앙, 크게, 위에) */}
          <div className="relative z-20 mx-auto w-full md:w-[78%] aspect-[16/9] rounded-xl overflow-hidden border border-white/10 shadow-[0_8px_0_rgba(0,0,0,0.45)] bg-surface-3">
            <Banner slide={at(0)} />

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="이전 배너"
                  className="focus-ring absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 border border-white/15 rounded-md flex items-center justify-center transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="다음 배너"
                  className="focus-ring absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 border border-white/15 rounded-md flex items-center justify-center transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
                <span className="absolute bottom-3 right-3 px-2 py-0.5 text-[11px] font-mono tabular-nums bg-black/55 border border-white/10 rounded-sm text-white/80">
                  {current + 1}/{total}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
