"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  CreditCard,
  ExternalLink,
  FileText,
  Gift,
  History,
  Image as ImageIcon,
  LayoutDashboard,
  Mail,
  Menu,
  MessageSquare,
  ShoppingBag,
  Tags,
  Users,
  X,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/items", label: "상점 아이템 관리", icon: ShoppingBag },
  { href: "/admin/categories", label: "상점 카테고리 관리", icon: Tags },
  { href: "/admin/mail", label: "우편 관리", icon: Mail },
  { href: "/admin/payments", label: "결제/환불 관리", icon: CreditCard },
  { href: "/admin/rewards", label: "보상/큐 관리", icon: Gift },
  { href: "/admin/events", label: "이벤트 관리", icon: Calendar },
  { href: "/admin/members", label: "회원 관리", icon: Users },
  { href: "/admin/banners", label: "팝업/배너 관리", icon: ImageIcon },
  { href: "/admin/inquiries", label: "문의 답변", icon: MessageSquare },
  { href: "/admin/policies", label: "약관/방침 관리", icon: FileText },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-surface-1">
      {/* Mobile backdrop */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky md:top-0 inset-y-0 left-0 z-40 w-64 bg-surface-2 border-r border-white/8 transform transition-transform md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:h-screen md:flex md:flex-col`}
      >
        <div className="flex items-center justify-between px-5 h-14 border-b border-white/8 shrink-0">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-7 h-7 border-2 border-white/70 rounded flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </div>
            <div className="leading-tight">
              <p className="text-xs font-bold text-white/90 uppercase">관리자 패널</p>
              <p className="text-[10px] text-white/35">마리벨 운영도구</p>
            </div>
          </Link>
          <button
            type="button"
            className="md:hidden text-white/40 hover:text-white"
            onClick={() => setOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`focus-ring relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-emerald-500/10 text-white before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-0.5 before:rounded-full before:bg-emerald-400"
                    : "text-white/55 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={16} className={active ? "text-emerald-300" : ""} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/8 p-3 space-y-1 shrink-0">
          <Link
            href="/admin/audit"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-white/45 hover:text-white hover:bg-white/5"
          >
            <History size={14} />
            <span>감사 로그</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-white/45 hover:text-white hover:bg-white/5"
          >
            <ExternalLink size={14} />
            <span>사이트로 돌아가기</span>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="md:hidden sticky top-0 z-20 h-12 bg-surface-2 border-b border-white/8 flex items-center px-4 gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-white/70"
            aria-label="사이드바 열기"
          >
            <Menu size={20} />
          </button>
          <p className="text-sm font-semibold">관리자 패널</p>
        </header>
        <div className="flex-1 min-w-0 p-5 md:p-8">{children}</div>
      </div>
    </div>
  );
}
