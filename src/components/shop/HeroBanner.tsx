"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";

interface PublicPopup {
  id: number;
  imageUrl: string;
  linkUrl: string | null;
}

export default function HeroBanner() {
  const [slides, setSlides] = useState<PublicPopup[]>([]);
  const [current, setCurrent] = useState(0);
  const [ready, setReady] = useState(false);

  const load = useCallback(async () => {
    try {
      setSlides(await api.get<PublicPopup[]>("/api/public/popups"));
    } catch {
      // 배너 없음/실패 시 그냥 숨긴다
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  if (!ready || slides.length === 0) return null;

  const slide = slides[current % slides.length];
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  const Inner = (
    <Image src={slide.imageUrl} alt="배너" fill sizes="(min-width: 1400px) 920px, 100vw" className="object-cover" />
  );

  return (
    <div className="relative h-40 sm:h-48 rounded-xl overflow-hidden bg-surface-3 border border-white/8">
      {slide.linkUrl ? (
        <a href={slide.linkUrl} className="block w-full h-full">{Inner}</a>
      ) : (
        <div className="w-full h-full">{Inner}</div>
      )}

      {slides.length > 1 && (
        <>
          <button onClick={prev} aria-label="이전" className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 hover:bg-black/60 border border-white/10 rounded-md flex items-center justify-center transition-colors">
            <ChevronLeft size={14} />
          </button>
          <button onClick={next} aria-label="다음" className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 hover:bg-black/60 border border-white/10 rounded-md flex items-center justify-center transition-colors">
            <ChevronRight size={14} />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setCurrent(i)}
                aria-label={`배너 ${i + 1}`}
                className={`rounded-full transition-all ${i === current ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/30"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
