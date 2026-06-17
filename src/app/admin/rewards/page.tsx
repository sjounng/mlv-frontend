"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Gift, Loader2, RotateCw } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Tabs,
  Table,
  useToast,
  type TableColumn,
} from "@/components/ui";
import { adminApi, type AdminMail, type MailStatus, type MailSource } from "@/lib/admin-api";
import { ApiError } from "@/lib/api";

const STATUS_TABS = [
  { id: "ALL", label: "전체" },
  { id: "PENDING", label: "발송 대기" },
  { id: "SENT", label: "발송 완료" },
  { id: "FAILED", label: "발송 실패" },
];

const SOURCE_LABEL: Record<MailSource, string> = {
  EVENT: "이벤트",
  PURCHASE: "구매",
  ADMIN: "운영지급",
  REDEEM_CODE: "리딤코드",
};

type Row = AdminMail & Record<string, unknown>;

export default function AdminRewardsPage() {
  const { toast } = useToast();
  const [mails, setMails] = useState<AdminMail[]>([]);
  const [tab, setTab] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);
  const [retryingId, setRetryingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setMails(await adminApi.mails());
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "우편 큐를 불러오지 못했습니다.";
      toast({ title: "불러오기 실패", description: message, variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const counts = useMemo(() => {
    const c = { PENDING: 0, SENT: 0, FAILED: 0 } as Record<MailStatus, number>;
    for (const m of mails) if (m.status in c) c[m.status] += 1;
    return c;
  }, [mails]);

  const filtered = tab === "ALL" ? mails : mails.filter((m) => m.status === tab);

  const onRetry = async (mail: AdminMail) => {
    setRetryingId(mail.id);
    try {
      const updated = await adminApi.retryMail(mail.id);
      setMails((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      toast({ title: "재시도 큐에 다시 넣었습니다", variant: "success" });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "재시도에 실패했습니다.";
      toast({ title: "재시도 실패", description: message, variant: "error" });
    } finally {
      setRetryingId(null);
    }
  };

  const columns: TableColumn<Row>[] = [
    {
      key: "createdAt",
      label: "생성",
      width: "160px",
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
      key: "targetUuid",
      label: "수신 UUID",
      width: "130px",
      render: (r) => <code className="text-xs text-white/55">{r.targetUuid.slice(0, 8)}…</code>,
    },
    {
      key: "status",
      label: "상태",
      width: "150px",
      render: (r) => (
        <div className="flex items-center gap-2">
          <Badge variant={r.status === "SENT" ? "success" : r.status === "PENDING" ? "info" : r.status === "FAILED" ? "error" : "default"} size="sm">
            {r.status}
          </Badge>
          {r.retryCount > 0 && <span className="text-[10px] text-white/40">재시도 {r.retryCount}</span>}
        </div>
      ),
    },
    {
      key: "actions",
      label: "관리",
      width: "110px",
      render: (r) =>
        r.status === "FAILED" || r.status === "PENDING" ? (
          <Button
            size="sm"
            variant="outline"
            disabled={retryingId === r.id}
            onClick={() => onRetry(r)}
            leftIcon={retryingId === r.id ? <Loader2 className="animate-spin" size={13} /> : <RotateCw size={13} />}
          >
            재시도
          </Button>
        ) : (
          <span className="text-xs text-white/30">-</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">보상 / 큐 관리</h1>
          <p className="mt-1.5 text-sm text-white/50">
            인게임 우편 발송 큐의 상태를 모니터링하고 실패 건을 재시도합니다.
          </p>
        </div>
        <Button variant="outline" onClick={() => void load()} leftIcon={<RotateCw size={15} />}>
          새로고침
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card padding="lg"><Stat label="발송 대기" value={counts.PENDING} color="text-blue-300" /></Card>
        <Card padding="lg"><Stat label="발송 완료" value={counts.SENT} color="text-emerald-300" /></Card>
        <Card padding="lg"><Stat label="발송 실패" value={counts.FAILED} color="text-red-300" /></Card>
      </div>

      <Tabs tabs={STATUS_TABS} activeTab={tab} onChange={setTab} />

      <Card padding="none">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-white/40">
            <Loader2 className="animate-spin" size={22} />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Gift} title="해당 상태의 우편이 없습니다" />
        ) : (
          <Table columns={columns} data={filtered} />
        )}
      </Card>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <p className="text-xs text-white/40">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
