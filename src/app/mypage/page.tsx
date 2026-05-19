"use client";

import { useState } from "react";
import {
  Coins,
  CreditCard,
  Gift,
  Mail,
  Pencil,
  Plus,
  Receipt,
  User,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Badge,
  Button,
  Card,
  Pagination,
  Tabs,
  Table,
  type TableColumn,
} from "@/components/ui";
import MinecraftHead from "@/components/minecraft/MinecraftHead";
import CashDisplay from "@/components/minecraft/CashDisplay";

interface CashRow extends Record<string, unknown> {
  date: string;
  type: "충전" | "사용" | "환불";
  amount: number;
  balance: number;
  memo: string;
}

interface PaymentRow extends Record<string, unknown> {
  date: string;
  product: string;
  amount: number;
  status: "완료" | "환불";
  id: string;
}

interface RewardRow extends Record<string, unknown> {
  date: string;
  source: "이벤트" | "구매" | "리딤코드";
  title: string;
  status: "발송완료" | "발송중" | "실패";
}

const cashHistory: CashRow[] = [
  { date: "2026-05-19 14:32", type: "사용", amount: -3300, balance: 12500, memo: "비행권 [7일] 구매" },
  { date: "2026-05-18 19:11", type: "충전", amount: 15000, balance: 15800, memo: "신용카드 결제" },
  { date: "2026-05-15 12:04", type: "사용", amount: -2200, balance: 800, memo: "랜덤 박스 구매" },
  { date: "2026-05-10 21:48", type: "환불", amount: 1500, balance: 3000, memo: "경험치 부스터 환불" },
  { date: "2026-05-07 09:25", type: "충전", amount: 5000, balance: 1500, memo: "카카오페이 결제" },
];

const payments: PaymentRow[] = [
  { date: "2026-05-19", product: "비행권 [7일]", amount: 5500, status: "완료", id: "P-26051901" },
  { date: "2026-05-18", product: "캐시 충전 15,000C", amount: 15000, status: "완료", id: "P-26051803" },
  { date: "2026-05-15", product: "랜덤 박스 × 3", amount: 6600, status: "완료", id: "P-26051502" },
  { date: "2026-05-10", product: "경험치 부스터 [1시간]", amount: 1500, status: "환불", id: "P-26051002" },
  { date: "2026-05-07", product: "캐시 충전 5,000C", amount: 5000, status: "완료", id: "P-26050701" },
];

const rewards: RewardRow[] = [
  { date: "2026-05-19 14:33", source: "구매", title: "비행권 [7일] 보상", status: "발송완료" },
  { date: "2026-05-18 19:12", source: "구매", title: "캐시 충전 15,000C", status: "발송완료" },
  { date: "2026-05-17 09:00", source: "이벤트", title: "출석 14일차 보상", status: "발송완료" },
  { date: "2026-05-15 12:05", source: "구매", title: "랜덤 박스 × 3", status: "발송완료" },
  { date: "2026-05-12 21:00", source: "리딤코드", title: "5월 시즌 시작 보상", status: "발송완료" },
  { date: "2026-05-08 18:40", source: "이벤트", title: "친구 초대 1단계 보상", status: "실패" },
];

const tabs = [
  { id: "profile", label: "프로필", icon: User },
  { id: "cash", label: "캐시 내역", icon: Coins },
  { id: "payments", label: "결제 내역", icon: CreditCard },
  { id: "rewards", label: "보상 내역", icon: Gift },
];

const cashColumns: TableColumn<CashRow>[] = [
  { key: "date", label: "일시", width: "180px" },
  {
    key: "type",
    label: "유형",
    width: "100px",
    render: (r) => (
      <Badge
        variant={r.type === "충전" ? "info" : r.type === "환불" ? "warning" : "default"}
        size="sm"
      >
        {r.type}
      </Badge>
    ),
  },
  {
    key: "amount",
    label: "금액",
    align: "right",
    render: (r) => (
      <span className={r.amount < 0 ? "text-red-300" : "text-emerald-300"}>
        {r.amount > 0 ? "+" : ""}
        {r.amount.toLocaleString()} C
      </span>
    ),
  },
  {
    key: "balance",
    label: "잔액",
    align: "right",
    render: (r) => <span className="text-white/70">{r.balance.toLocaleString()} C</span>,
  },
  { key: "memo", label: "비고" },
];

const paymentColumns: TableColumn<PaymentRow>[] = [
  { key: "date", label: "결제일", width: "120px" },
  { key: "product", label: "상품명" },
  {
    key: "amount",
    label: "금액",
    align: "right",
    render: (r) => `${r.amount.toLocaleString()}원`,
  },
  {
    key: "status",
    label: "상태",
    width: "100px",
    render: (r) => (
      <Badge variant={r.status === "완료" ? "success" : "warning"} size="sm">
        {r.status}
      </Badge>
    ),
  },
  {
    key: "id",
    label: "영수증",
    width: "120px",
    render: (r) => (
      <button type="button" className="inline-flex items-center gap-1 text-xs text-white/50 hover:text-white">
        <Receipt size={13} />
        {r.id}
      </button>
    ),
  },
];

const rewardColumns: TableColumn<RewardRow>[] = [
  { key: "date", label: "수령일", width: "180px" },
  {
    key: "source",
    label: "출처",
    width: "120px",
    render: (r) => <Badge variant="default" size="sm">{r.source}</Badge>,
  },
  { key: "title", label: "우편 제목" },
  {
    key: "status",
    label: "상태",
    width: "120px",
    render: (r) => (
      <Badge
        variant={r.status === "발송완료" ? "success" : r.status === "발송중" ? "info" : "error"}
        size="sm"
      >
        {r.status}
      </Badge>
    ),
  },
];

export default function MyPage() {
  const [active, setActive] = useState("profile");
  const [paymentPage, setPaymentPage] = useState(1);

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold">마이페이지</h1>
          <p className="mt-2 text-sm text-white/50">계정 정보, 캐시·결제·보상 내역을 확인할 수 있어요.</p>

          <div className="mt-8">
            <Tabs tabs={tabs} activeTab={active} onChange={setActive} />

            {active === "profile" && (
              <Card padding="lg" className="mt-6">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="flex items-center gap-4">
                    <MinecraftHead username="Steve_KR" size="lg" />
                    <div>
                      <h2 className="text-xl font-bold">Steve_KR</h2>
                      <p className="text-xs text-white/45 mt-0.5">가입일: 2024-08-12</p>
                    </div>
                  </div>
                  <div className="flex-1 grid sm:grid-cols-2 gap-x-8 gap-y-3 w-full">
                    <Field label="UUID" value="a8f3b1d2-9c7e-4f5b-9b2a-12ef34cd5678" mono />
                    <Field label="이메일" value="steve.kr@example.com" />
                    <Field label="Microsoft ID" value="MS_xuid_2008143728****" mono />
                    <Field label="역할" value="일반 회원" />
                  </div>
                  <Button variant="outline" size="sm" leftIcon={<Pencil size={14} />}>
                    프로필 수정
                  </Button>
                </div>
              </Card>
            )}

            {active === "cash" && (
              <div className="mt-6 space-y-4">
                <Card padding="lg">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-white/40">현재 보유 캐시</p>
                      <div className="mt-1">
                        <CashDisplay amount={12500} size="lg" />
                      </div>
                      <p className="text-xs text-white/35 mt-1">최근 충전: 2026-05-18</p>
                    </div>
                    <Button leftIcon={<Plus size={16} />}>충전하기</Button>
                  </div>
                </Card>
                <Card padding="none">
                  <Table columns={cashColumns} data={cashHistory} />
                </Card>
              </div>
            )}

            {active === "payments" && (
              <div className="mt-6 space-y-4">
                <Card padding="none">
                  <Table columns={paymentColumns} data={payments} />
                </Card>
                <Pagination
                  currentPage={paymentPage}
                  totalPages={3}
                  onPageChange={setPaymentPage}
                />
              </div>
            )}

            {active === "rewards" && (
              <Card padding="none" className="mt-6">
                <Table columns={rewardColumns} data={rewards} />
                <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <p className="text-white/40 flex items-center gap-1.5">
                    <Mail size={13} /> 발송 실패 시 자동으로 재시도됩니다.
                  </p>
                  <Button variant="ghost" size="sm">실패 보상 다시 보내기</Button>
                </div>
              </Card>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs text-white/40 mb-1">{label}</p>
      <p className={`text-sm text-white/85 ${mono ? "font-mono" : ""} break-all`}>{value}</p>
    </div>
  );
}
