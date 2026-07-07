"use client";

// 네비바 우편함(알림) 드롭다운 — 운영진 발송 알림/결제 완료 우편 확인 (피드백 1번)
// 데이터: GET /api/me/mails (웹패널을 통해 발송된 인게임 우편 이력)
// - 각 메일: 우측 상단에 날짜, 미읽음은 #de3527 circle 표시
// - 메일 클릭 시 화면 중앙 팝업(제목+본문), ESC/X 로 닫아도 알림 패널은 유지
// - 읽음 여부는 서버에 별도 API 가 없어 로컬(localStorage)로 관리한다

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Mail, X } from "lucide-react";
import { api } from "@/lib/api";

interface MailItem {
  id: number;
  subject: string;
  content: string;
  status: "PENDING" | "SENT" | "FAILED" | string;
  sentAt: string | null;
  createdAt?: string;
}

const READ_KEY = "maribel.mail.read";

function loadReadSet(): Set<number> {
  try {
    const raw = localStorage.getItem(READ_KEY);
    return new Set(raw ? (JSON.parse(raw) as number[]) : []);
  } catch {
    return new Set();
  }
}

export default function MailDropdown() {
  const [open, setOpen] = useState(false);
  const [mails, setMails] = useState<MailItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [readIds, setReadIds] = useState<Set<number>>(new Set());
  const [selected, setSelected] = useState<MailItem | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setMails(await api.get<MailItem[]>("/api/me/mails"));
    } catch {
      setMails([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReadIds(loadReadSet());
    // 벨의 미읽음 표시를 바로 보여주기 위해 마운트 시 우편을 미리 불러온다.
    void load();
  }, [load]);

  // 바깥 클릭 시 드롭다운 닫기 (단, 중앙 팝업이 열려 있으면 유지)
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (selected) return;
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, selected]);

  // ESC: 팝업이 열려 있으면 팝업만 닫는다 (패널 유지)
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selected]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && mails === null) void load();
  };

  const openMail = (m: MailItem) => {
    setSelected(m);
    setReadIds((prev) => {
      if (prev.has(m.id)) return prev;
      const next = new Set(prev).add(m.id);
      try {
        localStorage.setItem(READ_KEY, JSON.stringify([...next]));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const unreadCount = mails ? mails.filter((m) => !readIds.has(m.id)).length : 0;

  const fmtDate = (m: MailItem) => {
    const iso = m.sentAt ?? m.createdAt;
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit" });
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        className="focus-ring relative p-2 rounded-md text-white/60 hover:text-white transition-colors"
        aria-label="우편함"
        aria-expanded={open}
      >
        <Mail size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: "#de3527" }} />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-surface-3 border border-white/10 rounded-lg shadow-[0_4px_0_rgba(0,0,0,0.4)] z-50">
          <p className="px-4 py-3 text-xs font-semibold text-white/40 border-b border-white/8">우편함</p>

          {loading ? (
            <div className="flex items-center justify-center py-10 text-white/30">
              <Loader2 size={18} className="animate-spin" />
            </div>
          ) : !mails || mails.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-white/35">받은 우편이 없습니다</p>
          ) : (
            <ul>
              {mails.slice(0, 15).map((m) => {
                const unread = !readIds.has(m.id);
                return (
                  <li key={m.id} className="border-b border-white/5 last:border-b-0">
                    <button
                      type="button"
                      onClick={() => openMail(m)}
                      className="focus-ring w-full text-left px-4 py-3 hover:bg-white/[0.03] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm truncate ${unread ? "font-semibold text-white/90" : "font-medium text-white/70"}`}>
                          {m.subject}
                        </p>
                        {/* 우측 상단: 날짜 + 미읽음 circle */}
                        <span className="shrink-0 flex items-center gap-1.5 text-[10px] text-white/30 tabular-nums pt-0.5">
                          {fmtDate(m)}
                          {unread && (
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#de3527" }} />
                          )}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-white/40 truncate">
                        {m.content.length > 20 ? `${m.content.slice(0, 20)}…` : m.content}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* 메일 확인 중앙 팝업 (닫아도 알림 패널은 유지) */}
      {selected && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative bg-surface-3 border border-white/10 rounded-lg p-7 max-w-lg w-full mx-4 shadow-[0_6px_0_rgba(0,0,0,0.45)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="focus-ring absolute top-4 right-4 p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="닫기"
            >
              <X size={18} />
            </button>
            <p className="text-[11px] text-white/35 tabular-nums mb-1">{fmtDate(selected)}</p>
            <h2 className="text-lg font-bold pr-8 mb-4 break-keep">{selected.subject}</h2>
            <p className="text-sm text-white/65 leading-relaxed whitespace-pre-wrap break-keep">
              {selected.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
