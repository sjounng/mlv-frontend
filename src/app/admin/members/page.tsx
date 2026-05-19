"use client";

import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  Input,
  Pagination,
  Select,
  Table,
  type TableColumn,
} from "@/components/ui";
import MinecraftHead from "@/components/minecraft/MinecraftHead";
import CashDisplay from "@/components/minecraft/CashDisplay";

interface MemberRow extends Record<string, unknown> {
  username: string;
  uuid: string;
  joinedAt: string;
  cash: number;
  totalPaid: number;
  status: "활성" | "정지";
  email: string;
}

const members: MemberRow[] = [
  { username: "Steve_KR", uuid: "a8f3b1d2-9c7e-4f5b-9b2a-12ef34cd5678", joinedAt: "2024-08-12", cash: 12500, totalPaid: 84600, status: "활성", email: "steve.kr@example.com" },
  { username: "Alex_Lee", uuid: "b2c4d5e6-7f8a-49b1-aa3c-21de43cd9876", joinedAt: "2024-11-03", cash: 5300, totalPaid: 42300, status: "활성", email: "alex.lee@example.com" },
  { username: "Notch_Fan", uuid: "c3d5e6f7-8a9b-4c0d-bb4d-32ef54de7654", joinedAt: "2025-02-19", cash: 0, totalPaid: 19800, status: "정지", email: "notch.fan@example.com" },
  { username: "MagicGirl", uuid: "d4e5f6a7-8b9c-4d0e-cc5e-43fa65ef6543", joinedAt: "2025-04-22", cash: 24800, totalPaid: 132000, status: "활성", email: "magic.girl@example.com" },
  { username: "PvP_Pro", uuid: "e5f6a7b8-9c0d-4e1f-dd6f-54ab76fa5432", joinedAt: "2025-08-01", cash: 1200, totalPaid: 9900, status: "활성", email: "pvp.pro@example.com" },
  { username: "BuilderMK", uuid: "f6a7b8c9-0d1e-4f2a-ee70-65bc87ab4321", joinedAt: "2025-12-15", cash: 8800, totalPaid: 27500, status: "활성", email: "builder.mk@example.com" },
  { username: "SkyFarmer", uuid: "g7b8c9d0-1e2f-4a3b-ff81-76cd98bc3210", joinedAt: "2026-01-08", cash: 4200, totalPaid: 15400, status: "활성", email: "sky.farmer@example.com" },
];

const statusOptions = [
  { value: "all", label: "전체" },
  { value: "활성", label: "활성" },
  { value: "정지", label: "정지" },
];

export default function AdminMembersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = members.filter((m) => {
    const ms = statusFilter === "all" || m.status === statusFilter;
    const mq = !search || m.username.toLowerCase().includes(search.toLowerCase());
    return ms && mq;
  });

  const columns: TableColumn<MemberRow>[] = [
    {
      key: "username",
      label: "회원",
      render: (r) => (
        <div className="flex items-center gap-2.5">
          <MinecraftHead username={r.username} size="sm" />
          <div>
            <p className="font-medium">{r.username}</p>
            <p className="text-xs text-white/35 mt-0.5">{r.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "uuid",
      label: "UUID",
      width: "150px",
      render: (r) => (
        <code className="text-xs text-white/55">{r.uuid.slice(0, 8)}…{r.uuid.slice(-4)}</code>
      ),
    },
    { key: "joinedAt", label: "가입일", width: "110px" },
    {
      key: "cash",
      label: "보유 캐시",
      align: "right",
      width: "130px",
      render: (r) => <CashDisplay amount={r.cash} size="sm" />,
    },
    {
      key: "totalPaid",
      label: "총 결제",
      align: "right",
      width: "110px",
      render: (r) => `${r.totalPaid.toLocaleString()}원`,
    },
    {
      key: "status",
      label: "상태",
      width: "90px",
      render: (r) => (
        <Badge variant={r.status === "활성" ? "success" : "error"} size="sm">
          {r.status}
        </Badge>
      ),
    },
    {
      key: "detail",
      label: "상세",
      width: "100px",
      render: (r) => (
        <Button
          size="sm"
          variant="ghost"
          rightIcon={
            <ChevronDown
              size={12}
              className={`transition-transform ${openId === r.username ? "rotate-180" : ""}`}
            />
          }
          onClick={() => setOpenId(openId === r.username ? null : r.username)}
        >
          상세보기
        </Button>
      ),
    },
  ];

  // Show expansion as a separate render under the table
  const expandedMember = members.find((m) => m.username === openId) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">회원 관리</h1>
        <p className="mt-1.5 text-sm text-white/50">가입 회원의 정보와 활동을 확인합니다.</p>
      </div>

      <Card padding="md">
        <div className="grid sm:grid-cols-[1fr_200px] gap-3">
          <Input
            placeholder="닉네임 또는 이메일로 검색"
            leftIcon={<Search size={14} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </Card>

      <Card padding="none">
        <Table columns={columns} data={filtered} />
      </Card>

      {expandedMember && (
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <MinecraftHead username={expandedMember.username} size="lg" />
              <div>
                <h2 className="text-lg font-bold">{expandedMember.username}</h2>
                <p className="text-xs text-white/45">{expandedMember.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                {expandedMember.status === "활성" ? "정지하기" : "정지 해제"}
              </Button>
              <Button size="sm" variant="outline">캐시 조정</Button>
              <Button size="sm" variant="outline">우편 발송</Button>
            </div>
          </div>
          <dl className="grid sm:grid-cols-4 gap-x-6 gap-y-3 text-sm">
            <div>
              <dt className="text-xs text-white/40">UUID</dt>
              <dd className="font-mono text-white/85 mt-1 break-all">{expandedMember.uuid}</dd>
            </div>
            <div>
              <dt className="text-xs text-white/40">가입일</dt>
              <dd className="text-white/85 mt-1">{expandedMember.joinedAt}</dd>
            </div>
            <div>
              <dt className="text-xs text-white/40">보유 캐시</dt>
              <dd className="mt-1"><CashDisplay amount={expandedMember.cash} size="md" /></dd>
            </div>
            <div>
              <dt className="text-xs text-white/40">총 결제 금액</dt>
              <dd className="text-white/85 mt-1">{expandedMember.totalPaid.toLocaleString()}원</dd>
            </div>
          </dl>
        </Card>
      )}

      <Pagination currentPage={page} totalPages={5} onPageChange={setPage} />
    </div>
  );
}
