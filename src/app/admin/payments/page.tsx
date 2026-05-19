"use client";

import { useState } from "react";
import { CreditCard, Search, TrendingDown, TrendingUp } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  Input,
  Pagination,
  Select,
  StatCard,
  Table,
  useToast,
  type TableColumn,
} from "@/components/ui";
import MinecraftHead from "@/components/minecraft/MinecraftHead";

interface PaymentRow extends Record<string, unknown> {
  id: string;
  member: string;
  product: string;
  amount: number;
  stellaId: string;
  status: "완료" | "환불요청" | "환불완료" | "실패";
  paidAt: string;
}

const payments: PaymentRow[] = [
  { id: "P-26052012", member: "Steve_KR", product: "VIP 등급 [30일]", amount: 9900, stellaId: "STL-9c3f-12abf", status: "완료", paidAt: "2026-05-19 14:32" },
  { id: "P-26052011", member: "Alex_Lee", product: "다이아몬드 100개", amount: 1100, stellaId: "STL-9c3f-12abe", status: "완료", paidAt: "2026-05-19 14:11" },
  { id: "P-26052010", member: "Notch_Fan", product: "스타터 패키지", amount: 5500, stellaId: "STL-9c3e-12abd", status: "환불요청", paidAt: "2026-05-19 13:58" },
  { id: "P-26052009", member: "MagicGirl", product: "마법사 패키지", amount: 8800, stellaId: "STL-9c3e-12abc", status: "완료", paidAt: "2026-05-19 13:24" },
  { id: "P-26052008", member: "PvP_Pro", product: "랜덤 박스 × 3", amount: 6600, stellaId: "STL-9c3d-12abb", status: "실패", paidAt: "2026-05-19 12:51" },
  { id: "P-26052007", member: "BuilderMK", product: "에메랄드 1,000개", amount: 11000, stellaId: "STL-9c3d-12aba", status: "환불완료", paidAt: "2026-05-19 11:30" },
  { id: "P-26052006", member: "SkyFarmer", product: "스카이블럭 패키지", amount: 7700, stellaId: "STL-9c3c-12ab9", status: "완료", paidAt: "2026-05-19 10:08" },
  { id: "P-26052005", member: "ChillGuy", product: "비행권 [7일]", amount: 5500, stellaId: "STL-9c3c-12ab8", status: "완료", paidAt: "2026-05-19 09:46" },
];

const statusOptions = [
  { value: "all", label: "전체 상태" },
  { value: "완료", label: "완료" },
  { value: "환불요청", label: "환불요청" },
  { value: "환불완료", label: "환불완료" },
  { value: "실패", label: "실패" },
];

export default function AdminPaymentsPage() {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = payments.filter((p) => {
    const ms = statusFilter === "all" || p.status === statusFilter;
    const mq = !search || p.member.toLowerCase().includes(search.toLowerCase());
    return ms && mq;
  });

  const columns: TableColumn<PaymentRow>[] = [
    { key: "id", label: "결제 ID", width: "140px" },
    {
      key: "member",
      label: "회원",
      render: (r) => (
        <div className="flex items-center gap-2">
          <MinecraftHead username={r.member} size="sm" />
          <span>{r.member}</span>
        </div>
      ),
    },
    { key: "product", label: "상품" },
    {
      key: "amount",
      label: "금액",
      align: "right",
      render: (r) => `${r.amount.toLocaleString()}원`,
    },
    {
      key: "stellaId",
      label: "Stella IT ID",
      width: "180px",
      render: (r) => <code className="text-xs text-white/55">{r.stellaId}</code>,
    },
    {
      key: "status",
      label: "상태",
      width: "110px",
      render: (r) => (
        <Badge
          variant={
            r.status === "완료"
              ? "success"
              : r.status === "환불요청"
                ? "warning"
                : r.status === "환불완료"
                  ? "info"
                  : "error"
          }
          size="sm"
        >
          {r.status}
        </Badge>
      ),
    },
    { key: "paidAt", label: "결제일", width: "160px" },
    {
      key: "actions",
      label: "관리",
      width: "120px",
      render: (r) =>
        r.status === "환불요청" ? (
          <Button
            size="sm"
            variant="danger"
            onClick={() => toast({ title: "환불 처리 완료", variant: "success" })}
          >
            환불 처리
          </Button>
        ) : r.status === "완료" ? (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => toast({ title: "환불 요청을 접수했어요", variant: "default" })}
          >
            환불 요청
          </Button>
        ) : null,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">결제/환불 관리</h1>
        <p className="mt-1.5 text-sm text-white/50">모든 결제 내역과 환불 요청을 관리합니다.</p>
      </div>

      {/* Filters */}
      <Card padding="md">
        <div className="grid sm:grid-cols-4 gap-3">
          <Input label="시작일" type="date" defaultValue="2026-05-01" />
          <Input label="종료일" type="date" defaultValue="2026-05-31" />
          <Select
            label="상태"
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
          <Input
            label="회원 검색"
            placeholder="닉네임"
            leftIcon={<Search size={14} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </Card>

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard
          title="총 매출"
          value="₩4,284,500"
          change="+8.4% 전월 대비"
          trend="up"
          icon={TrendingUp}
          color="bg-emerald-500/15 text-emerald-300"
        />
        <StatCard
          title="환불 건수"
          value="12"
          change="-3 전월 대비"
          trend="down"
          icon={TrendingDown}
          color="bg-yellow-500/15 text-yellow-300"
        />
        <StatCard
          title="순 매출"
          value="₩4,156,800"
          change="+9.2% 전월 대비"
          trend="up"
          icon={CreditCard}
          color="bg-blue-500/15 text-blue-300"
        />
      </div>

      <Card padding="none">
        <Table columns={columns} data={filtered} />
      </Card>
      <Pagination currentPage={page} totalPages={6} onPageChange={setPage} />
    </div>
  );
}
