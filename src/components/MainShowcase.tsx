"use client";

// 홈(메인) = 스크롤 스냅 단일 페이지 (07-08 피드백: 서버정보/소개 페이지를 메인으로 편입)
// 구성:
//   0) 인트로       — 이미지 슬라이더 + 헤드라인 + SNS + (우측 섹션 인디케이터, 중앙 하단 화살표)
//   1..n) 소개      — 좌측 제목+본문 / 우측 미디어(이미지·영상)
//   마지막) 다운로드 권장 — 커스텀 타이틀 + 전용 런처 다운로드 CTA
// 미세한 스크롤 입력 시 다음 섹션으로 자동 스냅(snap-mandatory), 우측 인디케이터로 현재 섹션 표시.
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, Play } from "lucide-react";
import { mainShowcase, type ShowcaseSection } from "@/lib/site-config";
import IntroSlider from "@/components/IntroSlider";
import SnsLinks from "@/components/SnsLinks";
import DownloadButton from "@/components/DownloadButton";

// 소개 섹션 우측 미디어
function SectionMedia({ media, isNew }: { media?: string; isNew?: boolean }) {
  const isVideo = !!media && (media.endsWith(".mp4") || media.includes("youtube") || media.includes("youtu.be"));
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 shadow-[0_8px_0_rgba(0,0,0,0.4)] bg-linear-to-br from-surface-3 via-surface-4 to-black">
      {media ? (
        isVideo ? (
          media.endsWith(".mp4") ? (
            <video src={media} controls className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <iframe
              src={media}
              title="소개 영상"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )
        ) : (
          <Image src={media} alt="소개 미디어" fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" unoptimized />
        )
      ) : (
        <>
          <div className="absolute inset-0 bg-linear-to-tr from-emerald-500/10 via-transparent to-cyan-500/10" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
              <Play size={22} className="text-white/50 fill-white/50 ml-0.5" />
            </div>
            <p className="text-xs text-white/35">영상 · 이미지 준비 중</p>
          </div>
        </>
      )}
      {isNew && (
        <span className="absolute bottom-3 right-3 px-2 py-0.5 text-[11px] font-bold rounded bg-indigo-500 text-white">
          NEW
        </span>
      )}
    </div>
  );
}

export default function MainShowcase() {
  const sections = mainShowcase.sections;
  // 전체 섹션 수 = 인트로(1) + 소개(n) + 다운로드(1)
  const total = 2 + sections.length;
  const labels = ["홈", ...sections.map((_, i) => `소개 ${i + 1}`), "다운로드"];

  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState<boolean[]>(() => Array.from({ length: total }, (_, i) => i === 0));
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
      { root: scrollerRef.current, rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const reveal = (i: number, delay = false) =>
    `transition-[opacity,transform] duration-700 ease-out ${delay ? "delay-100" : ""} ${
      seen[i] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    }`;

  const dl = mainShowcase.download;

  return (
    <div ref={scrollerRef} className="relative h-dvh overflow-y-auto snap-y snap-mandatory">
      {/* 배경 그라데이션 (은은한 고정 레이어) */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 bg-linear-to-br from-[#0c110d] via-[#111711] to-[#17201a]" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[46rem] h-[46rem] rounded-full bg-emerald-500/10 blur-[130px]" />
      </div>

      {/* 우측 섹션 인디케이터 (현재 위치 표시) */}
      <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 hidden sm:flex flex-col gap-2.5">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`${labels[i]} 섹션으로 이동`}
            title={labels[i]}
            onClick={() => sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth" })}
            className={`focus-ring w-2 h-2 transition-all duration-300 ${
              active === i ? "bg-emerald-300 scale-125 rotate-45" : "bg-white/25 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* 0) 인트로 */}
      <section
        ref={(el) => {
          sectionRefs.current[0] = el;
        }}
        className="relative z-10 min-h-dvh snap-start snap-always flex flex-col items-center justify-center px-6 pt-20 pb-14"
      >
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center">
          {/* 슬라이더는 16:9 유지하되, 화면 높이에 맞게 폭을 제한해 헤드라인·SNS·화살표가 한 화면에 들어오게 한다 */}
          <div className={`mx-auto max-w-3xl [width:min(48rem,calc((100dvh_-_22rem)*16/9))] ${reveal(0)}`}>
            <IntroSlider />
          </div>
          <h1 className={`mt-6 text-[2.2rem] leading-[1.1] sm:text-4xl md:text-5xl tracking-tight ${reveal(0, true)}`}>
            <span className="text-emerald-300">MLV</span>
            {mainShowcase.intro.titleTop.replace(/^MLV/, "")}
            <br />
            {mainShowcase.intro.titleBottom}
          </h1>
          <SnsLinks className={`mt-6 justify-center ${reveal(0, true)}`} />
        </div>

        {/* 중앙 하단 애니메이션 화살표 */}
        <button
          type="button"
          onClick={() => sectionRefs.current[1]?.scrollIntoView({ behavior: "smooth" })}
          aria-label="다음 섹션"
          className="focus-ring absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 hover:text-white/80 animate-bounce transition-colors"
        >
          <ChevronDown size={22} />
        </button>
      </section>

      {/* 1..n) 소개 섹션 (좌: 제목+본문 / 우: 미디어) */}
      {sections.map((sec: ShowcaseSection, si) => {
        const i = si + 1;
        return (
          <section
            key={i}
            ref={(el) => {
              sectionRefs.current[i] = el;
            }}
            className="relative z-10 min-h-dvh snap-start snap-always flex items-center px-6 py-24"
          >
            <div className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-14 items-center">
              <div className={`order-2 md:order-1 ${reveal(i)}`}>
                <h2 className="text-4xl md:text-5xl leading-[1.15] tracking-tight">
                  {sec.titleTop}
                  {sec.titleTop && <br />}
                  <span className="text-emerald-300">{sec.titleEm}</span>
                  {sec.titleBottom}
                </h2>
                <p className="mt-6 text-base md:text-lg text-white/55 leading-relaxed break-keep max-w-md">
                  {sec.body}
                </p>
              </div>
              <div className={`order-1 md:order-2 ${reveal(i, true)}`}>
                <SectionMedia media={sec.media} isNew={sec.isNew} />
              </div>
            </div>
          </section>
        );
      })}

      {/* 마지막) 다운로드 권장 */}
      <section
        ref={(el) => {
          sectionRefs.current[total - 1] = el;
        }}
        className="relative z-10 min-h-dvh snap-start snap-always flex items-center px-6 py-24"
      >
        <div className="w-full max-w-3xl mx-auto text-center">
          <h2 className={`text-5xl md:text-6xl leading-[1.15] tracking-tight ${reveal(total - 1)}`}>
            {dl.titleTop}
            <span style={{ color: dl.titleEmColor }}>{dl.titleEm}</span>
            {dl.titleBottom}
          </h2>
          <p className={`mt-7 text-base md:text-lg text-white/55 max-w-xl mx-auto leading-relaxed break-keep ${reveal(total - 1, true)}`}>
            {dl.body}
          </p>
          <div className={`mt-9 flex justify-center ${reveal(total - 1, true)}`}>
            <DownloadButton large />
          </div>
        </div>
      </section>
    </div>
  );
}
