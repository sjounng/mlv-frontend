"use client";

// 이벤트 목록 페이지 (07-22 개편: FC 온라인식 목록형)
//  - 상단 featured 자동 슬라이더
//  - 제목 검색(띄어쓰기 무관 다중 키워드, Enter/돋보기)
//  - 목록 6개씩 + 페이지네이션, 종료 이벤트 구분 표시, 호버 효과, 클릭 시 상세 이동
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Loader2, CalendarDays, ImageOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventFeaturedSlider from "@/components/event/EventFeaturedSlider";
import { Badge, EmptyState, Pagination, useToast } from "@/components/ui";
import { eventsApi, EVENT_STATUS_LABEL, type PublicEvent } from "@/lib/events-api";

const PAGE_SIZE = 6;

function formatPeriod(start: string, end: string) {
  const f = (iso: string) => new Date(iso).toLocaleDateString("ko-KR");
  return `${f(start)} ~ ${f(end)}`;
}

function statusVariant(status: PublicEvent["status"]) {
  if (status === "ONGOING") return "success" as const;
  if (status === "UPCOMING") return "info" as const;
  return "default" as const;
}

export default function EventPage() {
  const { toast } = useToast();

  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  // 입력 중 검색어와 실제 적용된 검색어를 분리 (Enter/돋보기로만 적용)
  const [queryInput, setQueryInput] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");

  const load = useCallback(async (q: string, p: number) => {
    setLoading(true);
    try {
      const res = await eventsApi.list({ q, page: p, size: PAGE_SIZE });
      setEvents(res.content);
      setTotalPages(Math.max(1, res.totalPages));
    } catch {
      toast({ title: "이벤트를 불러오지 못했습니다", variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load(appliedQuery, page);
  }, [load, appliedQuery, page]);

  const runSearch = () => {
    setPage(0);
    setAppliedQuery(queryInput);
  };

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="max-w-6xl mx-auto px-6 py-12 space-y-8">
          {/* 상단 featured 슬라이더 */}
          <div className="mx-auto [width:min(100%,calc(38dvh*16/9))]">
            <EventFeaturedSlider />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-xs text-emerald-300/70 uppercase tracking-widest font-medium mb-2">Events</p>
              <h1 className="text-3xl md:text-4xl font-bold">이벤트</h1>
            </div>
            {/* 검색 */}
            <div className="flex items-center gap-2 w-full sm:w-80">
              <div className="relative flex-1">
                <input
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") runSearch();
                  }}
                  placeholder="이벤트 제목 검색"
                  className="focus-ring w-full h-10 rounded-lg bg-surface-2 border border-white/10 pl-4 pr-10 text-sm placeholder:text-white/30"
                />
                <button
                  type="button"
                  onClick={runSearch}
                  aria-label="검색"
                  className="focus-ring absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Search size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* 목록 */}
          {loading ? (
            <div className="flex items-center justify-center py-16 text-white/40">
              <Loader2 className="animate-spin" size={24} />
            </div>
          ) : events.length === 0 ? (
            <div className="py-8">
              <EmptyState
                icon={CalendarDays}
                title={appliedQuery ? "검색 결과가 없습니다" : "등록된 이벤트가 없습니다"}
                description={appliedQuery ? `"${appliedQuery}"에 해당하는 이벤트를 찾지 못했어요.` : undefined}
              />
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((e) => {
                const ended = e.status === "ENDED";
                return (
                  <Link
                    key={e.id}
                    href={`/event/${e.id}`}
                    className={`focus-ring group flex items-stretch gap-4 rounded-xl border border-white/8 bg-surface-2 overflow-hidden transition-all hover:border-emerald-400/30 hover:bg-surface-3 hover:-translate-y-0.5 ${
                      ended ? "opacity-60" : ""
                    }`}
                  >
                    {/* 썸네일 */}
                    <div className="relative w-40 sm:w-56 shrink-0 aspect-[16/7] bg-surface-4 overflow-hidden">
                      {e.bannerImageUrl ? (
                        <Image
                          src={e.bannerImageUrl}
                          alt={e.name}
                          fill
                          sizes="224px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-white/20">
                          <ImageOff size={22} />
                        </div>
                      )}
                    </div>
                    {/* 본문 */}
                    <div className="flex-1 min-w-0 flex items-center justify-between gap-4 py-3 pr-4">
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold truncate group-hover:text-emerald-200 transition-colors">
                          {e.name}
                        </h3>
                        <p className="mt-1 text-xs text-white/45 flex items-center gap-1.5">
                          <CalendarDays size={13} className="shrink-0" />
                          {formatPeriod(e.startAt, e.endAt)}
                        </p>
                      </div>
                      <Badge variant={statusVariant(e.status)} size="sm" className="shrink-0">
                        {EVENT_STATUS_LABEL[e.status]}
                      </Badge>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {!loading && totalPages > 1 && (
            <Pagination
              currentPage={page + 1}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p - 1)}
            />
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
