"use client";

// 네비바 우편함(알림) 드롭다운 — 운영진 발송 알림/결제 완료 우편 확인 (피드백 1번)
// 데이터: GET /api/me/mails (웹패널을 통해 발송된 인게임 우편 이력)

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { api } from "@/lib/api";

interface MailItem {
  id: number;
  subject: string;
  content: string;
  status: "PENDING" | "SENT" | "FAILED" | string;
  sentAt: string | null;
  createdAt?: string;
}

const statusLabel: Record<string, { text: string; cls: string }> = {
  SENT: { text: "지급 완료", cls: "text-emerald-300 bg-emerald-500/10" },
  PENDING: { text: "지급 대기", cls: "text-amber-300 bg-amber-500/10" },
  FAILED: { text: "지급 실패", cls: "text-red-300 bg-red-500/10" },
};

export default function MailDropdown() {
  const [open, setOpen] = useState(false);
  const [mails, setMails] = useState<MailItem[] | null>(null);
  const [loading, setLoading] = useState(false);
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

  // 바깥 클릭 시 닫기
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && mails === null) void load();
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
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-surface-3 border border-white/10 rounded-lg shadow-[0_4px_0_rgba(0,0,0,0.4)] z-50">
          <p className="px-4 py-3 text-xs font-semibold text-white/40 border-b border-white/8">
            우편함
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-10 text-white/30">
              <Loader2 size={18} className="animate-spin" />
            </div>
          ) : !mails || mails.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-white/35">받은 우편이 없습니다</p>
          ) : (
            <ul>
              {mails.slice(0, 10).map((m) => {
                const s = statusLabel[m.status] ?? { text: m.status, cls: "text-white/50 bg-white/5" };
                return (
                  <li key={m.id} className="px-4 py-3 border-b border-white/5 last:border-b-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-white/85 truncate">{m.subject}</p>
                      <span className={`shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-sm ${s.cls}`}>
                        {s.text}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-white/40 line-clamp-2 leading-relaxed">{m.content}</p>
                    {m.sentAt && (
                      <p className="mt-1 text-[10px] text-white/25 tabular-nums">
                        {new Date(m.sentAt).toLocaleString("ko-KR")}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
