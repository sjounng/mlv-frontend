"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Gift, Ticket, Calendar, Sparkles, Loader2, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button, Card, Badge, Input, EmptyState, useToast } from "@/components/ui";
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
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [redeeming, setRedeeming] = useState(false);
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

  useEffect(() => {
    // 데이터 로딩 시작 시의 setLoading 은 의도된 동작이다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadEvents();
  }, [loadEvents]);

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
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "수령에 실패했습니다.";
      toast({ title: "수령 실패", description: message, variant: "error" });
    } finally {
      setClaimingId(null);
    }
  };

  const onRedeem = async () => {
    if (!code.trim()) {
      toast({ title: "코드를 입력해 주세요", variant: "warning" });
      return;
    }
    if (status !== "authenticated") return requireLogin();
    setRedeeming(true);
    try {
      await api.post("/api/redeem-codes/use", { code: code.trim() });
      toast({
        title: "리딤코드를 사용했어요!",
        description: "보상이 인게임 우편함으로 발송되었습니다.",
        variant: "success",
      });
      setCode("");
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "코드 사용에 실패했습니다.";
      toast({ title: "리딤코드 오류", description: message, variant: "error" });
    } finally {
      setRedeeming(false);
    }
  };

  const attendanceEvent = events.find((e) => e.type === "ATTENDANCE" && e.active);

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="max-w-6xl mx-auto px-6 py-12 space-y-10">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Events</p>
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

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
                disabled={!attendanceEvent || claimingId === attendanceEvent?.id}
                leftIcon={
                  claimingId === attendanceEvent?.id ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Sparkles size={16} />
                  )
                }
              >
                출석하기
              </Button>
            </div>
          </Card>

          {/* Redeem code */}
          <Card padding="lg">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-purple-500/15 text-purple-300 flex items-center justify-center">
                <Ticket size={18} />
              </div>
              <div>
                <h2 className="text-base font-semibold">리딤코드</h2>
                <p className="text-xs text-white/40">받은 코드를 입력하고 보상을 수령하세요</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="예: MARIBEL-XXXX-XXXX"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                containerClassName="flex-1"
                disabled={redeeming}
              />
              <Button
                onClick={onRedeem}
                disabled={redeeming}
                leftIcon={redeeming ? <Loader2 className="animate-spin" size={16} /> : <Gift size={16} />}
              >
                코드 입력
              </Button>
            </div>
            <p className="mt-3 text-xs text-white/35">
              유튜브, 디스코드, 이벤트 등에서 발급된 리딤코드를 사용할 수 있습니다.
            </p>
          </Card>

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
