"use client";

// 애플 제품 페이지 스타일의 스크롤 소개 페이지.
// - 풀스크린 챕터 4개. 각 챕터 = 배경 이미지 1장 + 제목 + 내용.
// - 스크롤 위치에 따라 배경이 크로스페이드로 전환되고, 텍스트는 모션과 함께 등장한다.

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

// ─────────────────────────────────────────────────────────────
// ✏️ 기획자 편집 영역
//    챕터마다 제목(두 줄)·강조 단어·내용·배경 이미지를 채우면 됩니다.
//    - titleEm: 색이 들어가는 강조 단어 (titleTop 줄 다음 줄 맨 앞에 표시)
//    - image: 배경 이미지 경로. 예: "/assets/scenes/ch1.jpg"
//      (public/assets/scenes/ 폴더에 이미지를 넣고 경로를 적어주세요.
//       비워두면 임시 그라데이션 배경이 표시됩니다.)
// ─────────────────────────────────────────────────────────────
const chapters = [
  {
    titleTop: "챕터1 제목 윗줄",
    titleEm: "강조1",
    titleBottom: " 챕터1 제목 아랫줄",
    body: "챕터1 내용",
    image: "",
  },
  {
    titleTop: "챕터2 제목 윗줄",
    titleEm: "강조2",
    titleBottom: " 챕터2 제목 아랫줄",
    body: "챕터2 내용",
    image: "",
  },
  {
    titleTop: "챕터3 제목 윗줄",
    titleEm: "강조3",
    titleBottom: " 챕터3 제목 아랫줄",
    body: "챕터3 내용",
    image: "",
  },
  {
    titleTop: "챕터4 제목 윗줄",
    titleEm: "강조4",
    titleBottom: " 챕터4 제목 아랫줄",
    body: "챕터4 내용",
    image: "",
  },
];
// ───────────────────────── 편집 영역 끝 ─────────────────────────

// 이미지가 없을 때 보여줄 임시 배경 (챕터 순서대로: 새벽 숲 → 동굴 → 노을 → 밤하늘)
const fallbackScenes = [
  "radial-gradient(1200px 700px at 50% 110%, rgba(16,185,129,0.22), transparent 65%), radial-gradient(800px 400px at 80% -10%, rgba(52,211,153,0.10), transparent 60%), linear-gradient(180deg, #0a0f0b 0%, #0d1710 55%, #10241a 100%)",
  "radial-gradient(900px 500px at 20% 30%, rgba(103,232,249,0.10), transparent 55%), radial-gradient(600px 400px at 85% 70%, rgba(103,232,249,0.07), transparent 60%), linear-gradient(180deg, #070b0c 0%, #0a1214 60%, #0c181c 100%)",
  "radial-gradient(1100px 600px at 50% 115%, rgba(251,191,36,0.16), transparent 60%), radial-gradient(700px 350px at 15% -5%, rgba(251,146,60,0.08), transparent 55%), linear-gradient(180deg, #0e0c08 0%, #171208 60%, #221a0c 100%)",
  "radial-gradient(1000px 550px at 50% -20%, rgba(192,132,252,0.08), transparent 60%), radial-gradient(1400px 800px at 50% 120%, rgba(16,185,129,0.10), transparent 65%), linear-gradient(180deg, #06070a 0%, #0a0c12 60%, #0c1113 100%)",
];

// 챕터별 강조 단어 색 (디자인 요소)
const emphasisColors = ["text-emerald-300", "text-mc-diamond", "text-mc-gold", "text-emerald-300"];

export default function ServerShowcase() {
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState<boolean[]>(() => chapters.map((_, i) => i === 0));
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const idx = sectionRefs.current.indexOf(entry.target as HTMLElement);
          if (idx < 0) continue;
          if (entry.isIntersecting) {
            setActive(idx);
            setSeen((prev) => (prev[idx] ? prev : prev.map((v, i) => (i === idx ? true : v))));
          }
        }
      },
      // 화면 중앙 부근에 걸친 섹션을 활성 장면으로 판정
      { root: scrollerRef.current, rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // 챕터 공통 등장 모션 (Tailwind 는 동적 클래스명을 스캔하지 못하므로 정적 문자열로 매핑)
  const delayClasses: Record<number, string> = { 0: "", 100: "delay-100" };
  const reveal = (i: number, delay: 0 | 100 = 0) =>
    `transition-[opacity,transform] duration-700 ease-out ${delayClasses[delay]} ${
      seen[i] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
    }`;

  return (
    // 페이지 단위 스크롤: 한 번 넘기면 다음 챕터에 딱 멈춘다 (snap-mandatory + snap-always)
    <div ref={scrollerRef} className="relative h-dvh overflow-y-auto snap-y snap-mandatory">
      {/* 고정 배경 레이어 — 활성 챕터만 보이도록 크로스페이드 */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
        {chapters.map((ch, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              opacity: active === i ? 1 : 0,
              // 이미지가 있으면 텍스트 가독성을 위한 어두운 스크림을 함께 깐다
              background: ch.image
                ? `linear-gradient(rgba(5,8,6,0.55), rgba(5,8,6,0.65)), url(${ch.image}) center / cover no-repeat`
                : fallbackScenes[i % fallbackScenes.length],
            }}
          />
        ))}
      </div>

      {/* 챕터 인디케이터 */}
      <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 hidden sm:flex flex-col gap-2.5">
        {chapters.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`${i + 1}번째 장면으로 이동`}
            onClick={() => sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth" })}
            className={`focus-ring w-2 h-2 transition-all duration-300 ${
              active === i ? "bg-emerald-300 scale-125 rotate-45" : "bg-white/25 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      {chapters.map((ch, i) => {
        const Heading = i === 0 ? ("h1" as const) : ("h2" as const);
        return (
          <section
            key={i}
            ref={(el) => {
              sectionRefs.current[i] = el;
            }}
            className="relative z-10 h-dvh snap-start snap-always flex items-center"
          >
            <div className="max-w-4xl mx-auto px-6 w-full text-center">
              <Heading className={`text-5xl md:text-7xl leading-[1.15] ${reveal(i)}`}>
                {ch.titleTop}
                <br />
                <span className={emphasisColors[i % emphasisColors.length]}>{ch.titleEm}</span>
                {ch.titleBottom}
              </Heading>
              <p className={`mt-7 text-base md:text-lg text-white/55 max-w-xl mx-auto leading-relaxed break-keep ${reveal(i, 100)}`}>
                {ch.body}
              </p>
            </div>
            {i === 0 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 animate-bounce" aria-hidden>
                <ChevronDown size={20} />
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
