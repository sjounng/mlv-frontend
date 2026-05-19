"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  Gift,
  Users,
  Ticket,
  Calendar,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button, Card, Badge, Input, useToast } from "@/components/ui";
import ItemIcon from "@/components/minecraft/ItemIcon";

const TODAY = 21;
const CHECKED_DAYS = 20;
const DAYS_IN_MONTH = 31;

const invitedFriends = [
  { name: "Steve_KR", status: "가입 완료", date: "2026-05-12" },
  { name: "Alex_Lee", status: "가입 완료", date: "2026-05-15" },
  { name: "Notch_Fan", status: "초대 발송", date: "2026-05-18" },
];

const events = [
  {
    id: "ev1",
    title: "5월 출석체크 이벤트",
    status: "진행중" as const,
    period: "2026-05-01 ~ 2026-05-31",
    desc: "매일 접속하고 출석 보상을 받아가세요!",
    reward: "랜덤 박스 / 캐시 / 부스터",
    emoji: "📅",
  },
  {
    id: "ev2",
    title: "친구 초대 이벤트",
    status: "진행중" as const,
    period: "2026-05-15 ~ 2026-06-15",
    desc: "친구 3명을 초대하면 VIP 7일권을 드립니다.",
    reward: "VIP 7일권",
    emoji: "👥",
  },
  {
    id: "ev3",
    title: "어린이날 특별 보상",
    status: "종료" as const,
    period: "2026-05-01 ~ 2026-05-07",
    desc: "어린이날 한정 특별 보상 이벤트가 종료되었습니다.",
    reward: "다이아몬드 100개 + 펫 소환권",
    emoji: "🎁",
  },
];

const INVITE_CODE = "MARIBEL-A8K2Z9";

export default function EventPage() {
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [checkedIn, setCheckedIn] = useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(INVITE_CODE);
    toast({ title: "초대 코드가 복사되었습니다", variant: "success" });
  };

  const onCheckIn = () => {
    if (checkedIn) return;
    setCheckedIn(true);
    toast({
      title: "출석체크 완료!",
      description: "오늘의 보상이 우편함으로 발송되었습니다.",
      variant: "success",
    });
  };

  const onRedeem = () => {
    if (!code.trim()) {
      toast({ title: "코드를 입력해 주세요", variant: "warning" });
      return;
    }
    toast({
      title: "코드를 확인하고 있어요",
      description: "유효한 코드라면 잠시 후 우편함으로 보상이 도착합니다.",
      variant: "default",
    });
    setCode("");
  };

  const inviteProgress = 3;
  const inviteGoal = 5;

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="max-w-6xl mx-auto px-6 py-12 space-y-10">
          {/* Header */}
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Events</p>
            <h1 className="text-3xl md:text-4xl font-bold">이벤트</h1>
            <p className="mt-3 text-sm text-white/50">출석체크, 친구초대, 리딤코드 등 다양한 이벤트로 보상을 받아가세요.</p>
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
              <Badge variant="success">진행중</Badge>
            </div>

            <div className="grid grid-cols-7 sm:grid-cols-10 gap-2">
              {Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1).map((d) => {
                const isChecked = d <= CHECKED_DAYS || (checkedIn && d === TODAY);
                const isToday = d === TODAY;
                return (
                  <div
                    key={d}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs ${
                      isToday
                        ? "ring-2 ring-white/40"
                        : ""
                    } ${
                      isChecked
                        ? "bg-green-500/20 text-green-200 border border-green-500/30"
                        : "bg-white/3 text-white/30 border border-white/5"
                    }`}
                  >
                    <span className="font-semibold">{d}</span>
                    {isChecked && <Check size={11} className="mt-0.5" />}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ItemIcon emoji="🎁" color="bg-red-500/15" size="md" />
                <div>
                  <p className="text-xs text-white/40">오늘의 보상</p>
                  <p className="text-sm font-medium">랜덤 박스 1개</p>
                </div>
              </div>
              <Button
                onClick={onCheckIn}
                disabled={checkedIn}
                leftIcon={checkedIn ? <Check size={16} /> : <Sparkles size={16} />}
              >
                {checkedIn ? "출석 완료" : "출석하기"}
              </Button>
            </div>
          </Card>

          {/* Invite */}
          <Card padding="lg">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-blue-500/15 text-blue-300 flex items-center justify-center">
                <Users size={18} />
              </div>
              <div>
                <h2 className="text-base font-semibold">친구초대</h2>
                <p className="text-xs text-white/40">친구를 초대하고 함께 보상을 받아가세요</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-white/40 mb-2">내 초대 코드</p>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5">
                  <code className="flex-1 font-mono text-sm text-white">{INVITE_CODE}</code>
                  <Button onClick={onCopy} size="sm" variant="outline" leftIcon={<Copy size={13} />}>복사</Button>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between mb-2 text-xs">
                    <span className="text-white/40">초대 진행</span>
                    <span className="text-white/70">{inviteProgress} / {inviteGoal}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-blue-500 to-cyan-400"
                      style={{ width: `${(inviteProgress / inviteGoal) * 100}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-white/40">5명 초대 시 VIP 등급 30일권을 드립니다.</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-white/40 mb-2">초대 현황</p>
                <div className="space-y-2">
                  {invitedFriends.map((f) => (
                    <div
                      key={f.name}
                      className="flex items-center justify-between bg-white/3 border border-white/5 rounded-lg px-3 py-2.5"
                    >
                      <div>
                        <p className="text-sm">{f.name}</p>
                        <p className="text-xs text-white/35">{f.date}</p>
                      </div>
                      <Badge variant={f.status === "가입 완료" ? "success" : "warning"} size="sm">
                        {f.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
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
              />
              <Button onClick={onRedeem} leftIcon={<Gift size={16} />}>코드 입력</Button>
            </div>
            <p className="mt-3 text-xs text-white/35">유튜브, 디스코드, 이벤트 등에서 발급된 리딤코드를 사용할 수 있습니다.</p>
          </Card>

          {/* Event list */}
          <div>
            <h2 className="text-lg font-semibold mb-4">진행 중 / 종료된 이벤트</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((e) => (
                <Card key={e.id} padding="lg" className="flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <ItemIcon emoji={e.emoji} color="bg-white/5" size="md" />
                    <Badge variant={e.status === "진행중" ? "success" : "default"}>
                      {e.status}
                    </Badge>
                  </div>
                  <h3 className="text-base font-semibold">{e.title}</h3>
                  <p className="mt-1.5 text-sm text-white/50 leading-relaxed">{e.desc}</p>
                  <div className="mt-4 pt-4 border-t border-white/8 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-white/40">기간</span>
                      <span className="text-white/70">{e.period}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">보상</span>
                      <span className="text-white/70 text-right">{e.reward}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant={e.status === "진행중" ? "solid" : "outline"}
                      size="sm"
                      disabled={e.status === "종료"}
                      className="w-full"
                    >
                      {e.status === "진행중" ? "참여하기" : "종료된 이벤트"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
