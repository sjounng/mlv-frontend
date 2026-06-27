"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Coins, Gift, Users, type LucideIcon } from "lucide-react";
import { api } from "@/lib/api";

interface EventItem {
  id: number;
  name: string;
  type: "ATTENDANCE" | "INVITE" | "PAYBACK" | "GENERAL";
  description: string;
  startAt: string;
  endAt: string;
  active: boolean;
}

const TYPE_STYLE: Record<EventItem["type"], { icon: LucideIcon; glow: string; iconTint: string }> = {
  ATTENDANCE: { icon: Calendar, glow: "from-emerald-500/10", iconTint: "bg-emerald-500/12 text-emerald-300" },
  INVITE: { icon: Users, glow: "from-blue-500/10", iconTint: "bg-blue-500/12 text-blue-300" },
  PAYBACK: { icon: Coins, glow: "from-amber-500/10", iconTint: "bg-amber-500/12 text-amber-300" },
  GENERAL: { icon: Gift, glow: "from-purple-500/10", iconTint: "bg-purple-500/12 text-purple-300" },
};

export default function EventBanner() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [ready, setReady] = useState(false);

  const load = useCallback(async () => {
    try {
      const all = await api.get<EventItem[]>("/api/events");
      setEvents(all.filter((e) => e.active).slice(0, 2));
    } catch {
      // 실패 시 섹션을 숨긴다
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  // 진행 중인 이벤트가 없으면 빈 섹션 대신 숨긴다
  if (!ready || events.length === 0) return null;

  return (
    <section className="py-20 sm:py-24 bg-[#090a0b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10 sm:mb-12">
          <div>
            <span className="text-xs text-emerald-300/70 uppercase tracking-widest font-medium">Events</span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold">진행 중인 이벤트</h2>
          </div>
          <Link
            href="/event"
            className="hidden sm:flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors"
          >
            전체 보기 <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((ev) => {
            const style = TYPE_STYLE[ev.type] ?? TYPE_STYLE.GENERAL;
            const Icon = style.icon;
            return (
              <Link
                key={ev.id}
                href="/event"
                className={`focus-ring group relative p-6 bg-linear-to-br ${style.glow} to-transparent bg-white/[0.03] hover:bg-white/[0.06] border border-white/8 hover:border-white/12 rounded-2xl transition-all overflow-hidden`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${style.iconTint}`}>
                    <Icon size={19} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium text-emerald-300 bg-emerald-400/10">
                        진행중
                      </span>
                    </div>
                    <h3 className="font-semibold mb-1.5 truncate group-hover:text-white transition-colors">
                      {ev.name}
                    </h3>
                    <p className="text-sm text-white/45 leading-relaxed line-clamp-2">{ev.description}</p>
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-white/20 group-hover:text-emerald-300 group-hover:translate-x-1 transition-all shrink-0 mt-1"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
