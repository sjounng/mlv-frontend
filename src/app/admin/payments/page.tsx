"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Pagination,
  Select,
  Tabs,
  Table,
  useToast,
  type TableColumn,
} from "@/components/ui";
import {
  adminApi,
  type ChargeHistory,
  type ChargeStatus,
  type Refund,
  type RefundStatus,
} from "@/lib/admin-api";
import { ApiError } from "@/lib/api";

const TABS = [
  { id: "charges", label: "충전 내역" },
  { id: "refunds", label: "환불 요청" },
];

const chargeStatusOptions = [
  { value: "", label: "전체" },
  { value: "PAID", label: "완료" },
  { value: "READY", label: "대기" },
  { value: "FAILED", label: "실패" },
  { value: "REFUNDED", label: "환불됨" },
];

const REFUND_STATUS_LABEL: Record<RefundStatus, string> = {
  REQUESTED: "요청",
  APPROVED: "승인",
  REJECTED: "거절",
  COMPLETED: "환불완료",
};

const PAGE_SIZE = 20;
type ChargeRow = ChargeHistory & Record<string, unknown>;
type RefundRow = Refund & Record<string, unknown>;

export default function AdminPaymentsPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState("charges");

  const [charges, setCharges] = useState<ChargeHistory[]>([]);
  const [chargeStatus, setChargeStatus] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<number | null>(null);

  const loadCharges = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.charges({ status: chargeStatus, page, size: PAGE_SIZE });
      setCharges(res.content);
      setTotalPages(Math.max(1, res.totalPages));
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "결제 내역을 불러오지 못했습니다.";
      toast({ title: "불러오기 실패", description: message, variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [chargeStatus, page, toast]);

  const loadRefunds = useCallback(async () => {
    setLoading(true);
    try {
      setRefunds(await adminApi.refunds());
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "환불 요청을 불러오지 못했습니다.";
      toast({ title: "불러오기 실패", description: message, variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (tab === "charges") void loadCharges();
    else void loadRefunds();
  }, [tab, loadCharges, loadRefunds]);

  const onProcess = async (refund: Refund, status: RefundStatus) => {
    // 처리 사유(운영 메모)를 입력받는다. 거절은 사유 필수, 완료는 선택.
    const label = status === "REJECTED" ? "거절 사유를 입력하세요" : "처리 메모를 입력하세요 (선택)";
    const memo = window.prompt(label);
    if (memo === null) return; // 프롬프트 취소 시 중단
    if (status === "REJECTED" && !memo.trim()) {
      toast({ title: "거절 사유를 입력해 주세요", variant: "warning" });
      return;
    }
    setActingId(refund.id);
    try {
      const updated = await adminApi.processRefund(refund.id, status, memo.trim());
      setRefunds((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      toast({ title: `환불 요청을 ${REFUND_STATUS_LABEL[status]} 처리했습니다`, variant: "success" });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "처리에 실패했습니다.";
      toast({ title: "처리 실패", description: message, variant: "error" });
    } finally {
      setActingId(null);
    }
  };

  const chargeColumns: TableColumn<ChargeRow>[] = [
    { key: "createdAt", label: "일시", width: "160px", render: (r) => new Date(r.createdAt).toLocaleString("ko-KR", { dateStyle: "short", timeStyle: "short" }) },
    { key: "merchantOrderId", label: "주문번호", render: (r) => <code className="text-xs text-white/55">{r.merchantOrderId}</code> },
    { key: "cashAmount", label: "캐시", align: "right", width: "110px", render: (r) => `${r.cashAmount.toLocaleString()} C` },
    { key: "paymentAmountKrw", label: "결제액", align: "right", width: "110px", render: (r) => `${r.paymentAmountKrw.toLocaleString()}원` },
    {
      key: "status",
      label: "상태",
      width: "100px",
      render: (r) => (
        <Badge variant={chargeBadge(r.status)} size="sm">{r.status}</Badge>
      ),
    },
  ];

  const refundColumns: TableColumn<RefundRow>[] = [
    { key: "createdAt", label: "요청일", width: "160px", render: (r) => new Date(r.createdAt).toLocaleString("ko-KR", { dateStyle: "short", timeStyle: "short" }) },
    { key: "cashChargeId", label: "충전 ID", width: "90px" },
    { key: "reason", label: "사유" },
    {
      key: "status",
      label: "상태",
      width: "100px",
      render: (r) => (
        <Badge variant={r.status === "COMPLETED" ? "success" : r.status === "REJECTED" ? "error" : "warning"} size="sm">
          {REFUND_STATUS_LABEL[r.status]}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "처리",
      width: "190px",
      render: (r) =>
        r.status === "REQUESTED" || r.status === "APPROVED" ? (
          <div className="flex gap-1.5">
            <Button size="sm" disabled={actingId === r.id} onClick={() => onProcess(r, "COMPLETED")}
              leftIcon={actingId === r.id ? <Loader2 className="animate-spin" size={13} /> : undefined}>
              환불 완료
            </Button>
            <Button size="sm" variant="outline" disabled={actingId === r.id} onClick={() => onProcess(r, "REJECTED")}>
              거절
            </Button>
          </div>
        ) : (
          <span className="text-xs text-white/30">-</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">결제 / 환불 관리</h1>
        <p className="mt-1.5 text-sm text-white/50">충전 내역을 조회하고 환불 요청을 처리합니다.</p>
      </div>

      <Tabs tabs={TABS} activeTab={tab} onChange={setTab} />

      {tab === "charges" ? (
        <>
          <Card padding="md">
            <div className="sm:max-w-[200px]">
              <Select options={chargeStatusOptions} value={chargeStatus} onChange={(e) => { setPage(0); setChargeStatus(e.target.value); }} />
            </div>
          </Card>
          <Card padding="none">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-white/40"><Loader2 className="animate-spin" size={22} /></div>
            ) : charges.length === 0 ? (
              <EmptyState title="충전 내역이 없습니다" />
            ) : (
              <Table columns={chargeColumns} data={charges} />
            )}
          </Card>
          {totalPages > 1 && <Pagination currentPage={page + 1} totalPages={totalPages} onPageChange={(p) => setPage(p - 1)} />}
        </>
      ) : (
        <Card padding="none">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-white/40"><Loader2 className="animate-spin" size={22} /></div>
          ) : refunds.length === 0 ? (
            <EmptyState title="환불 요청이 없습니다" />
          ) : (
            <Table columns={refundColumns} data={refunds} />
          )}
        </Card>
      )}
    </div>
  );
}

function chargeBadge(status: ChargeStatus): "success" | "error" | "warning" | "default" | "info" {
  if (status === "PAID") return "success";
  if (status === "FAILED" || status === "CANCELLED") return "error";
  if (status === "REFUNDED") return "warning";
  return "default";
}
