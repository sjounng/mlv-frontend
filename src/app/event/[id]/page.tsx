"use client";

// 이벤트 상세 페이지 (07-22 개편)
//  - 제목, 게시일, 목록으로 돌아가기, 대표 배너, 리치 본문(정화 후 렌더)
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ChevronLeft, Loader2, CalendarDays } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge, EmptyState } from "@/components/ui";
import { eventsApi, EVENT_STATUS_LABEL, type PublicEvent } from "@/lib/events-api";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { ApiError } from "@/lib/api";

export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const [event, setEvent] = useState<PublicEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setEvent(await eventsApi.detail(Number(params.id)));
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) setNotFoundError(true);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const safeBody = useMemo(() => sanitizeHtml(event?.description ?? ""), [event?.description]);

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="max-w-4xl mx-auto px-6 py-12">
          <Link
            href="/event"
            className="focus-ring inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors mb-6"
          >
            <ChevronLeft size={16} />
            목록으로 돌아가기
          </Link>

          {loading ? (
            <div className="flex items-center justify-center py-20 text-white/40">
              <Loader2 className="animate-spin" size={24} />
            </div>
          ) : notFoundError || !event ? (
            <EmptyState icon={CalendarDays} title="이벤트를 찾을 수 없습니다" description="삭제되었거나 비공개 처리된 이벤트일 수 있어요." />
          ) : (
            <article>
              <div className="flex items-center gap-2 mb-3">
                <Badge
                  variant={event.status === "ONGOING" ? "success" : event.status === "UPCOMING" ? "info" : "default"}
                  size="sm"
                >
                  {EVENT_STATUS_LABEL[event.status]}
                </Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold break-keep">{event.name}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/45">
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={13} />
                  게시일 {new Date(event.publishedAt).toLocaleDateString("ko-KR")}
                </span>
                <span>이벤트 기간 {new Date(event.startAt).toLocaleDateString("ko-KR")} ~ {new Date(event.endAt).toLocaleDateString("ko-KR")}</span>
              </div>

              {event.bannerImageUrl && (
                <div className="relative w-full aspect-video mt-6 rounded-2xl overflow-hidden border border-white/10">
                  <Image src={event.bannerImageUrl} alt={event.name} fill sizes="(min-width: 768px) 56rem, 100vw" className="object-cover" unoptimized />
                </div>
              )}

              {safeBody ? (
                <div
                  className="event-body mt-8 text-sm leading-relaxed text-white/80"
                  // 본문은 sanitizeHtml 로 정화된 관리자 콘텐츠
                  dangerouslySetInnerHTML={{ __html: safeBody }}
                />
              ) : (
                <p className="mt-8 text-sm text-white/40">상세 내용이 없습니다.</p>
              )}
            </article>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
