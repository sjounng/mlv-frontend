"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, CreditCard, Loader2, Mail, MessageSquare, Users, Wallet } from "lucide-react";
import { Badge, Card, StatCard, Table, useToast, type TableColumn } from "@/components/ui";
import { adminApi, type AdminMail, type DashboardStats, type MailSource } from "@/lib/admin-api";
import { ApiError } from "@/lib/api";

const SOURCE_LABEL: Record<MailSource, string> = {
  EVENT: "이벤트",
  PURCHASE: "구매",
  ADMIN: "운영지급",
  REDEEM_CODE: "리딤코드",
};

type MailRow = AdminMail & Record<string, unknown>;

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentMails, setRecentMails] = useState<AdminMail[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [dashboard, mails] = await Promise.all([adminApi.dashboard(), adminApi.mails()]);
      setStats(dashboard);
      setRecentMails(mails.slice(0, 8));
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "대시보드를 불러오지 못했습니다.";
      toast({ title: "불러오기 실패", description: message, variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const mailColumns: TableColumn<MailRow>[] = [
    {
      key: "createdAt",
      label: "생성",
      width: "150px",
      render: (r) => new Date(r.createdAt).toLocaleString("ko-KR", { dateStyle: "short", timeStyle: "short" }),
    },
    { key: "subject", label: "우편 제목" },
    {
      key: "sourceType",
      label: "출처",
      width: "100px",
      render: (r) => <Badge variant="default" size="sm">{SOURCE_LABEL[r.sourceType]}</Badge>,
    },
    {
      key: "status",
      label: "상태",
      width: "100px",
      render: (r) => (
        <Badge variant={r.status === "SENT" ? "success" : r.status === "PENDING" ? "info" : r.status === "FAILED" ? "error" : "default"} size="sm">
          {r.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">대시보드</h1>
        <p className="mt-1.5 text-sm text-white/50">운영 현황을 한 눈에 확인하세요.</p>
      </div>

      {loading || !stats ? (
        <div className="flex items-center justify-center py-20 text-white/40">
          <Loader2 className="animate-spin" size={24} />
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard title="활성 회원" value={stats.activeUsers.toLocaleString()} icon={Users} color="bg-blue-500/15 text-blue-300" />
            <StatCard title="완료된 충전" value={stats.paidCharges.toLocaleString()} icon={Wallet} color="bg-emerald-500/15 text-emerald-300" />
            <StatCard title="처리 대기 환불" value={stats.pendingRefunds.toLocaleString()} icon={CreditCard} color="bg-yellow-500/15 text-yellow-300" />
            <StatCard title="발송 대기 우편" value={stats.pendingMails.toLocaleString()} icon={Mail} color="bg-sky-500/15 text-sky-300" />
            <StatCard title="발송 실패 우편" value={stats.failedMails.toLocaleString()} icon={AlertCircle} color="bg-red-500/15 text-red-300" />
            <StatCard title="미답변 문의" value={stats.openInquiries.toLocaleString()} icon={MessageSquare} color="bg-purple-500/15 text-purple-300" />
          </div>

          <Card padding="none">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
              <h2 className="text-sm font-semibold">최근 우편 큐</h2>
              <Link href="/admin/rewards" className="text-xs text-white/50 hover:text-white inline-flex items-center gap-1">
                전체 보기 <ArrowRight size={12} />
              </Link>
            </div>
            {recentMails.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-white/40">최근 우편이 없습니다.</p>
            ) : (
              <Table columns={mailColumns} data={recentMails} />
            )}
          </Card>
        </>
      )}
    </div>
  );
}
