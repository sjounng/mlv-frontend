"use client";

// 홈 최하단 3분할 패널 (07-12 피드백): 서버위키 / 진행중인 이벤트 / 서버정보
// 내용은 site-config(wikiLinks)와 공개 API(/api/events, server-status 설정)로 채운다.
// (운영자 패널에서의 커스텀은 추후 웹패널 라운드에서 확장)
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Calendar,
  ChevronRight,
  ExternalLink,
  Gift,
  HelpCircle,
  Info,
  Map,
  Server,
  Sparkles,
} from "lucide-react";
import ServerStatus from "@/components/minecraft/ServerStatus";
import { siteConfig, wikiLinks } from "@/lib/site-config";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui";

interface EventItem {
  id: number;
  name: string;
  type: string;
  startAt: string;
  endAt: string;
  active: boolean;
}

const wikiIcons = [BookOpen, Map, Sparkles, HelpCircle];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", { year: "2-digit", month: "2-digit", day: "2-digit" });
}

export default function HomeInfoPanels() {
  const { toast } = useToast();
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    void api
      .get<EventItem[]>("/api/events")
      .then((list) => setEvents(list.filter((e) => e.active).slice(0, 4)))
      .catch(() => {});
  }, []);

  const wikiEntries = Object.values(wikiLinks);

  const openOrSoon = (url: string) => {
    if (!url) {
      toast({ title: "위키는 준비 중입니다", variant: "default" });
      return;
    }
    if (url.startsWith("/")) router.push(url);
    else window.open(url, "_blank", "noopener,noreferrer");
  };

  const panel = "flex flex-col bg-surface-3/80 border border-white/8 rounded-2xl p-5";
  const panelTitle = "text-sm font-bold flex items-center gap-2 mb-1";
  const panelSub = "text-xs text-white/40 mb-4";
  const bottomBtn =
    "focus-ring mt-4 flex items-center justify-center gap-1.5 w-full px-3 py-2.5 rounded-lg text-xs font-medium whitespace-nowrap bg-white/6 hover:bg-white/12 border border-white/10 transition-colors";

  return (
    <div className="w-full max-w-6xl mx-auto grid gap-4 md:grid-cols-3">
      {/* 1) 서버위키 */}
      <section className={panel}>
        <p className={panelTitle}>
          <BookOpen size={15} className="text-emerald-300" /> 서버위키
        </p>
        <p className={panelSub}>마리벨 서버의 모든 정보를 확인해보세요.</p>
        <ul className="flex flex-col gap-1.5 flex-1">
          {wikiEntries.map((entry, i) => {
            const Icon = wikiIcons[i % wikiIcons.length];
            return (
              <li key={entry.label}>
                <button
                  type="button"
                  onClick={() => openOrSoon(entry.url)}
                  className="focus-ring w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.03] hover:bg-white/8 border border-white/6 transition-colors text-left"
                >
                  <span className="w-7 h-7 rounded-md bg-emerald-500/12 text-emerald-300 flex items-center justify-center shrink-0">
                    <Icon size={14} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-xs font-medium">{entry.label}</span>
                    <span className="block text-[11px] text-white/35 truncate">{entry.desc}</span>
                  </span>
                  <ChevronRight size={13} className="text-white/25 shrink-0" />
                </button>
              </li>
            );
          })}
        </ul>
        <button type="button" onClick={() => openOrSoon(wikiLinks.main.url)} className={bottomBtn}>
          위키 바로가기 <ExternalLink size={12} />
        </button>
      </section>

      {/* 2) 진행중인 이벤트 */}
      <section className={panel}>
        <p className={panelTitle}>
          <Gift size={15} className="text-emerald-300" /> 진행중인 이벤트
        </p>
        <p className={panelSub}>마리벨에서 진행중인 다양한 이벤트에 참여하세요!</p>
        <ul className="flex flex-col gap-1.5 flex-1">
          {events.length === 0 ? (
            <li className="flex-1 flex items-center justify-center text-xs text-white/35 py-6">
              진행 중인 이벤트가 없습니다
            </li>
          ) : (
            events.map((e) => (
              <li key={e.id}>
                <Link
                  href="/event"
                  className="focus-ring w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.03] hover:bg-white/8 border border-white/6 transition-colors"
                >
                  <span className="w-7 h-7 rounded-md bg-emerald-500/12 text-emerald-300 flex items-center justify-center shrink-0">
                    <Calendar size={14} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-xs font-medium truncate">{e.name}</span>
                    <span className="block text-[11px] text-white/35 tabular-nums">
                      ~ {fmtDate(e.endAt)}
                    </span>
                  </span>
                  <ChevronRight size={13} className="text-white/25 shrink-0" />
                </Link>
              </li>
            ))
          )}
        </ul>
        <Link href="/event" className={bottomBtn}>
          이벤트 전체보기 <ChevronRight size={12} />
        </Link>
      </section>

      {/* 3) 서버정보 */}
      <section className={panel}>
        <p className={panelTitle}>
          <Server size={15} className="text-emerald-300" /> 서버정보
        </p>
        <p className={panelSub}>마리벨 서버의 정보를 확인하세요.</p>
        <dl className="flex flex-col divide-y divide-white/6 flex-1 text-xs">
          <div className="flex items-center justify-between py-2.5">
            <dt className="text-white/40">서버 상태</dt>
            <dd><ServerStatus status={siteConfig.serverStatus} /></dd>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <dt className="text-white/40">에디션 · 버전</dt>
            <dd className="text-white/70">{siteConfig.serverEdition}</dd>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <dt className="text-white/40">접속 방식</dt>
            <dd className="text-white/70">전용 런처</dd>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <dt className="text-white/40">디스코드</dt>
            <dd>
              <a
                href={siteConfig.sns.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring rounded inline-flex items-center gap-1 text-emerald-300 hover:text-emerald-200"
              >
                참여하기 <ExternalLink size={11} />
              </a>
            </dd>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <dt className="text-white/40">고객 지원</dt>
            <dd>
              <Link href="/contact" className="focus-ring rounded inline-flex items-center gap-1 text-white/70 hover:text-white">
                바로가기 <ChevronRight size={11} />
              </Link>
            </dd>
          </div>
        </dl>
        <Link href="/contact" className={bottomBtn}>
          <Info size={12} /> 서버 자세히 보기
        </Link>
      </section>
    </div>
  );
}
