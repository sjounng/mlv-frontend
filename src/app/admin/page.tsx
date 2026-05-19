import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CreditCard,
  Mail,
  UserPlus,
  Wallet,
} from "lucide-react";
import {
  Badge,
  Card,
  StatCard,
  Table,
  type TableColumn,
} from "@/components/ui";
import MinecraftHead from "@/components/minecraft/MinecraftHead";

interface PaymentRow extends Record<string, unknown> {
  id: string;
  member: string;
  product: string;
  amount: number;
  status: "완료" | "환불요청" | "실패";
  time: string;
}

const recentPayments: PaymentRow[] = [
  { id: "P-26052012", member: "Steve_KR", product: "VIP 등급 [30일]", amount: 9900, status: "완료", time: "5분 전" },
  { id: "P-26052011", member: "Alex_Lee", product: "다이아몬드 100개", amount: 1100, status: "완료", time: "8분 전" },
  { id: "P-26052010", member: "Notch_Fan", product: "스타터 패키지", amount: 5500, status: "환불요청", time: "12분 전" },
  { id: "P-26052009", member: "MagicGirl", product: "마법사 패키지", amount: 8800, status: "완료", time: "24분 전" },
  { id: "P-26052008", member: "PvP_Pro", product: "랜덤 박스 × 3", amount: 6600, status: "실패", time: "31분 전" },
];

const paymentColumns: TableColumn<PaymentRow>[] = [
  { key: "id", label: "결제 ID", width: "130px" },
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
    key: "status",
    label: "상태",
    width: "100px",
    render: (r) => (
      <Badge
        variant={r.status === "완료" ? "success" : r.status === "실패" ? "error" : "warning"}
        size="sm"
      >
        {r.status}
      </Badge>
    ),
  },
  { key: "time", label: "시간", width: "100px" },
];

const rewardQueue = [
  { label: "발송 대기", count: 12, color: "bg-blue-500", percent: 24 },
  { label: "발송 완료", count: 198, color: "bg-emerald-500", percent: 72 },
  { label: "발송 실패", count: 2, color: "bg-red-500", percent: 4 },
];

const recentInquiries = [
  { title: "비행권 적용이 안돼요", member: "Steve_KR", time: "12분 전", status: "답변대기" },
  { title: "환불 처리 문의드립니다", member: "Alex_Lee", time: "1시간 전", status: "답변대기" },
  { title: "닉네임 변경 후 인식 문제", member: "Notch_Fan", time: "2시간 전", status: "답변완료" },
  { title: "유튜브 채널 협업 문의", member: "VideoStar", time: "5시간 전", status: "답변완료" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">대시보드</h1>
        <p className="mt-1.5 text-sm text-white/50">오늘의 운영 현황을 한 눈에 확인하세요.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="오늘 매출"
          value="₩284,500"
          change="+12% 어제 대비"
          trend="up"
          icon={Wallet}
          color="bg-emerald-500/15 text-emerald-300"
        />
        <StatCard
          title="신규 회원"
          value="47"
          change="+8% 어제 대비"
          trend="up"
          icon={UserPlus}
          color="bg-blue-500/15 text-blue-300"
        />
        <StatCard
          title="처리 대기 환불"
          value="3"
          change="-1 어제 대비"
          trend="down"
          icon={CreditCard}
          color="bg-yellow-500/15 text-yellow-300"
        />
        <StatCard
          title="발송 실패 우편"
          value="2"
          change="+2 어제 대비"
          trend="down"
          icon={AlertCircle}
          color="bg-red-500/15 text-red-300"
        />
      </div>

      {/* Recent payments */}
      <Card padding="none">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
          <h2 className="text-sm font-semibold">최근 결제</h2>
          <Link href="/admin/payments" className="text-xs text-white/50 hover:text-white inline-flex items-center gap-1">
            전체 보기 <ArrowRight size={12} />
          </Link>
        </div>
        <Table columns={paymentColumns} data={recentPayments} />
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Reward queue */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-white/60" />
              <h2 className="text-sm font-semibold">보상 큐 상태</h2>
            </div>
            <Link href="/admin/rewards" className="text-xs text-white/50 hover:text-white">전체 보기</Link>
          </div>
          <div className="space-y-3">
            {rewardQueue.map((r) => (
              <div key={r.label}>
                <div className="flex items-center justify-between mb-1.5 text-xs">
                  <span className="text-white/65">{r.label}</span>
                  <span className="text-white/80 font-semibold">{r.count}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full ${r.color}`} style={{ width: `${r.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-white/8 grid grid-cols-3 gap-2 text-center">
            {rewardQueue.map((r) => (
              <div key={r.label}>
                <p className="text-lg font-semibold">{r.count}</p>
                <p className="text-[10px] text-white/40 mt-0.5">{r.label}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent inquiries */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">최근 문의</h2>
            <Link href="/admin/inquiries" className="text-xs text-white/50 hover:text-white">전체 보기</Link>
          </div>
          <ul className="space-y-2">
            {recentInquiries.map((i, idx) => (
              <li
                key={idx}
                className="flex items-start justify-between gap-3 p-3 bg-white/3 border border-white/5 rounded-lg"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{i.title}</p>
                  <p className="text-xs text-white/40 mt-0.5">
                    {i.member} · {i.time}
                  </p>
                </div>
                <Badge variant={i.status === "답변대기" ? "warning" : "success"} size="sm">
                  {i.status}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
