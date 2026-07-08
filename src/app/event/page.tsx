"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Gift, Calendar, Sparkles, Loader2, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IntroSlider from "@/components/IntroSlider";
import { Button, Card, Badge, EmptyState, useToast } from "@/components/ui";
import ItemIcon from "@/components/minecraft/ItemIcon";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface EventItem {
  id: number;
  name: string;
  type: "ATTENDANCE" | "INVITE" | "PAYBACK" | "GENERAL";
  description: string;
  startAt: string;
  endAt: string;
  active: boolean;
}

interface AttendanceBoard {
  eventId: number | null;
  eventName: string | null;
  today: string; // YYYY-MM-DD
  todayClaimed: boolean;
  claimedDates: string[];
  claimable: boolean;
}

const TYPE_EMOJI: Record<EventItem["type"], string> = {
  ATTENDANCE: "📅",
  INVITE: "👥",
  PAYBACK: "💰",
  GENERAL: "🎁",
};

function formatPeriod(start: string, end: string) {
  const f = (iso: string) => new Date(iso).toLocaleDateString("ko-KR");
  return `${f(start)} ~ ${f(end)}`;
}

export default function EventPage() {
  const router = useRouter();
  const { status } = useAuth();
  const { toast } = useToast();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [board, setBoard] = useState<AttendanceBoard | null>(null);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<number | null>(null);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      setEvents(await api.get<EventItem[]>("/api/events"));
    } catch {
      toast({ title: "이벤트를 불러오지 못했습니다", variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const loadBoard = useCallback(async () => {
    try {
      setBoard(await api.get<AttendanceBoard>("/api/events/attendance"));
    } catch {
      setBoard(null);
    }
  }, []);

  useEffect(() => {
    // 데이터 로딩 시작 시의 setLoading 은 의도된 동작이다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (status === "authenticated") void loadBoard();
  }, [status, loadBoard]);

  const requireLogin = () => {
    toast({ title: "로그인이 필요합니다", variant: "warning" });
    router.push("/login");
  };

  const onClaim = async (event: EventItem) => {
    if (status !== "authenticated") return requireLogin();
    setClaimingId(event.id);
    try {
      await api.post(`/api/events/${event.id}/claim`);
      toast({
        title: "보상을 수령했어요!",
        description: "인게임 우편함으로 보상이 발송되었습니다.",
        variant: "success",
      });
      if (event.type === "ATTENDANCE") await loadBoard();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "수령에 실패했습니다.";
      toast({ title: "수령 실패", description: message, variant: "error" });
    } finally {
      setClaimingId(null);
    }
  };

  const attendanceEvent = events.find((e) => e.type === "ATTENDANCE" && e.active);

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="max-w-6xl mx-auto px-6 py-12 space-y-10">
          {/* 이벤트 배너 슬라이더 (placement=EVENT) — 페이지 최상단. 배너 없으면 미표시 */}
          <IntroSlider placement="EVENT" hideWhenEmpty />

          <div>
            <p className="text-xs text-emerald-300/70 uppercase tracking-widest font-medium mb-2">Events</p>
            <h1 className="text-3xl md:text-4xl font-bold">이벤트</h1>
            <p className="mt-3 text-sm text-white/50">
              출석체크, 리딤코드 등 다양한 이벤트로 보상을 받아가세요.
            </p>
          </div>

          {/* Attendance */}
          <Card padding="lg">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/15 text-green-300 flex items-center justify-center">
                  <Calendar size={18} />
                </div>
                <div>
                  <h2 className="text-base font-semibold">출석체크</h2>
                  <p className="text-xs text-white/40">매일 접속하여 보상을 받아가세요</p>
                </div>
              </div>
              <Badge variant={attendanceEvent ? "success" : "default"}>
                {attendanceEvent ? "진행중" : "준비중"}
              </Badge>
            </div>

            {/* 출석 달력 보드 */}
            {status === "authenticated" && board?.eventId ? (
              <AttendanceCalendar today={board.today} claimedDates={board.claimedDates} />
            ) : status !== "authenticated" ? (
              <p className="text-sm text-white/40 py-4">로그인하면 출석 보드를 확인할 수 있어요.</p>
            ) : null}

            <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ItemIcon emoji="🎁" color="bg-red-500/15" size="md" />
                <div>
                  <p className="text-xs text-white/40">오늘의 출석 보상</p>
                  <p className="text-sm font-medium">
                    {attendanceEvent ? attendanceEvent.name : "진행 중인 출석 이벤트가 없습니다"}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => attendanceEvent && onClaim(attendanceEvent)}
                disabled={!attendanceEvent || board?.todayClaimed || claimingId === attendanceEvent?.id}
                leftIcon={
                  claimingId === attendanceEvent?.id ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : board?.todayClaimed ? (
                    <Check size={16} />
                  ) : (
                    <Sparkles size={16} />
                  )
                }
              >
                {board?.todayClaimed ? "오늘 출석 완료" : "출석하기"}
              </Button>
            </div>
          </Card>

          {/* 리딤코드 입력은 마이페이지 > 리딤코드 로 이동함 */}

          {/* Event list */}
          <div>
            <h2 className="text-lg font-semibold mb-4">진행 중인 이벤트</h2>
            {loading ? (
              <div className="flex items-center justify-center py-12 text-white/40">
                <Loader2 className="animate-spin" size={24} />
              </div>
            ) : events.length === 0 ? (
              <Card padding="lg">
                <EmptyState icon={Gift} title="진행 중인 이벤트가 없습니다" />
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map((e) => (
                  <Card key={e.id} padding="lg" className="flex flex-col">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <ItemIcon emoji={TYPE_EMOJI[e.type]} color="bg-white/5" size="md" />
                      <Badge variant={e.active ? "success" : "default"}>
                        {e.active ? "진행중" : "종료"}
                      </Badge>
                    </div>
                    <h3 className="text-base font-semibold">{e.name}</h3>
                    <p className="mt-1.5 text-sm text-white/50 leading-relaxed flex-1">{e.description}</p>
                    <div className="mt-4 pt-4 border-t border-white/8 text-xs">
                      <div className="flex justify-between">
                        <span className="text-white/40">기간</span>
                        <span className="text-white/70">{formatPeriod(e.startAt, e.endAt)}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button
                        variant={e.active ? "solid" : "outline"}
                        size="sm"
                        disabled={!e.active || claimingId === e.id}
                        className="w-full"
                        onClick={() => onClaim(e)}
                        leftIcon={claimingId === e.id ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />}
                      >
                        {e.active ? "보상 수령" : "종료된 이벤트"}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function AttendanceCalendar({ today, claimedDates }: { today: string; claimedDates: string[] }) {
  const [y, m] = today.split("-").map(Number);
  const daysInMonth = new Date(y, m, 0).getDate();
  const claimed = new Set(claimedDates);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-white/70">{y}년 {m}월 출석 현황</p>
        <p className="text-xs text-white/40">이번 달 {claimedDates.length}일 출석</p>
      </div>
      <div className="grid grid-cols-7 sm:grid-cols-10 gap-1.5">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
          const dateStr = `${y}-${pad(m)}-${pad(d)}`;
          const isChecked = claimed.has(dateStr);
          const isToday = dateStr === today;
          return (
            <div
              key={d}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs border ${
                isToday ? "ring-2 ring-emerald-400/50" : ""
              } ${
                isChecked
                  ? "bg-emerald-500/20 text-emerald-200 border-emerald-500/30"
                  : "bg-white/3 text-white/30 border-white/5"
              }`}
            >
              <span className="font-semibold">{d}</span>
              {isChecked && <Check size={11} className="mt-0.5" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
