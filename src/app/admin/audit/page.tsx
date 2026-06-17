"use client";

import { useCallback, useEffect, useState } from "react";
import { History, Loader2 } from "lucide-react";
import {
  Badge,
  Card,
  EmptyState,
  Pagination,
  Table,
  useToast,
  type TableColumn,
} from "@/components/ui";
import { adminApi, type AuditLog } from "@/lib/admin-api";
import { ApiError } from "@/lib/api";

const PAGE_SIZE = 50;

type Row = AuditLog & Record<string, unknown>;

export default function AdminAuditPage() {
  const { toast } = useToast();
  const [data, setData] = useState<AuditLog[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.auditLogs({ page, size: PAGE_SIZE });
      setData(res.content);
      setTotalPages(Math.max(1, res.totalPages));
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "감사 로그를 불러오지 못했습니다.";
      toast({ title: "불러오기 실패", description: message, variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [page, toast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const columns: TableColumn<Row>[] = [
    {
      key: "createdAt",
      label: "시각",
      width: "170px",
      render: (r) => new Date(r.createdAt).toLocaleString("ko-KR", { dateStyle: "short", timeStyle: "medium" }),
    },
    { key: "actor", label: "행위자", width: "150px" },
    {
      key: "action",
      label: "행위",
      width: "110px",
      render: (r) => <Badge variant="default" size="sm">{r.action}</Badge>,
    },
    {
      key: "entityType",
      label: "대상",
      render: (r) => (
        <span className="text-white/70">
          {r.entityType}
          <span className="text-white/35"> #{r.entityId}</span>
        </span>
      ),
    },
    {
      key: "newValue",
      label: "변경값",
      render: (r) => <span className="text-white/55 text-xs break-all">{r.newValue ?? "-"}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">감사 로그</h1>
        <p className="mt-1.5 text-sm text-white/50">관리자 행위 로그(누가/언제/무엇을)를 조회합니다.</p>
      </div>

      <Card padding="none">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-white/40">
            <Loader2 className="animate-spin" size={22} />
          </div>
        ) : data.length === 0 ? (
          <EmptyState icon={History} title="감사 로그가 없습니다" />
        ) : (
          <Table columns={columns} data={data} />
        )}
      </Card>

      {totalPages > 1 && (
        <Pagination currentPage={page + 1} totalPages={totalPages} onPageChange={(p) => setPage(p - 1)} />
      )}
    </div>
  );
}
