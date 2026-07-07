"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Coins,
  CreditCard,
  Gift,
  Loader2,
  Mail,
  Receipt,
  ShoppingBag,
  User,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Modal,
  Tabs,
  Table,
  useToast,
  type TableColumn,
} from "@/components/ui";
import MinecraftHead from "@/components/minecraft/MinecraftHead";
import CashDisplay from "@/components/minecraft/CashDisplay";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface CashTransaction extends Record<string, unknown> {
  id: number;
  type: "CHARGE" | "SPEND" | "REFUND" | "ADJUSTMENT";
  amount: number;
  balanceAfter: number;
  memo: string | null;
  createdAt: string;
}

interface ChargeHistory extends Record<string, unknown> {
  id: number;
  merchantOrderId: string;
  cashAmount: number;
  paymentAmountKrw: number;
  status: "READY" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED";
  receiptUrl: string | null;
  createdAt: string;
  paidAt: string | null;
}

interface PurchaseHistory extends Record<string, unknown> {
  id: number;
  orderNumber: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  status: "COMPLETED" | "CANCELLED" | "MAIL_PENDING" | "MAIL_FAILED";
  createdAt: string;
}

interface MailHistory extends Record<string, unknown> {
  id: number;
  subject: string;
  sourceType: "EVENT" | "PURCHASE" | "ADMIN" | "REDEEM_CODE";
  status: "PENDING" | "SENT" | "FAILED" | "CANCELLED";
  createdAt: string;
}

const tabs = [
  { id: "profile", label: "프로필", icon: User },
  { id: "cash", label: "캐시 내역", icon: Coins },
  { id: "payments", label: "결제 내역", icon: CreditCard },
  { id: "rewards", label: "보상 내역", icon: Gift },
];

const CASH_TYPE_LABEL: Record<CashTransaction["type"], string> = {
  CHARGE: "충전",
  SPEND: "사용",
  REFUND: "환불",
  ADJUSTMENT: "조정",
};

const MAIL_SOURCE_LABEL: Record<MailHistory["sourceType"], string> = {
  EVENT: "이벤트",
  PURCHASE: "구매",
  ADMIN: "운영지급",
  REDEEM_CODE: "리딤코드",
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", { dateStyle: "medium", timeStyle: "short" });
}

export default function MyPage() {
  const router = useRouter();
  const { status, profile, cashBalance, logout } = useAuth();
  const { toast } = useToast();

  const [active, setActive] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<CashTransaction[]>([]);
  const [balance, setBalance] = useState<number | null>(null);
  const [charges, setCharges] = useState<ChargeHistory[]>([]);
  const [purchases, setPurchases] = useState<PurchaseHistory[]>([]);
  const [mails, setMails] = useState<MailHistory[]>([]);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    if (status === "anonymous") {
      router.replace("/login");
    }
  }, [status, router]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [cash, chargeList, purchaseList, mailList] = await Promise.all([
        api.get<{ balance: number; recentTransactions: CashTransaction[] }>("/api/me/cash"),
        api.get<ChargeHistory[]>("/api/me/charges"),
        api.get<PurchaseHistory[]>("/api/me/purchases"),
        api.get<MailHistory[]>("/api/me/mails"),
      ]);
      setBalance(cash.balance);
      setTransactions(cash.recentTransactions);
      setCharges(chargeList);
      setPurchases(purchaseList);
      setMails(mailList);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "데이터를 불러오지 못했습니다.";
      toast({ title: "불러오기 실패", description: message, variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (status === "authenticated") {
      // 데이터 로딩 시작 시의 setLoading 은 의도된 동작이다.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void loadData();
    }
  }, [status, loadData]);

  const onWithdraw = async () => {
    setWithdrawing(true);
    try {
      await api.del("/api/me/withdraw");
      toast({ title: "회원 탈퇴가 완료되었습니다", variant: "success" });
      await logout();
      router.replace("/");
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "탈퇴 처리에 실패했습니다.";
      toast({ title: "탈퇴 실패", description: message, variant: "error" });
      setWithdrawing(false);
    }
  };

  if (status !== "authenticated" || !profile) {
    return (
      <>
        <Navbar />
        <main className="pt-16 min-h-screen flex items-center justify-center text-white/50">
          <Loader2 className="animate-spin" size={26} />
        </main>
        <Footer />
      </>
    );
  }

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
              <div className="mt-6 space-y-4">
                <Card padding="lg">
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="flex items-center gap-4">
                      <MinecraftHead username={profile.minecraftUsername} uuid={profile.minecraftUuid} size="lg" />
                      <div>
                        <h2 className="text-xl font-bold">{profile.minecraftUsername}</h2>
                        <p className="text-xs text-white/45 mt-0.5">
                          가입일: {new Date(profile.createdAt).toLocaleDateString("ko-KR")}
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 grid sm:grid-cols-2 gap-x-8 gap-y-3 w-full">
                      <Field label="UUID" value={profile.minecraftUuid} mono />
                      <Field label="이메일" value={profile.email ?? "미등록"} />
                      <Field label="상태" value={profile.status === "ACTIVE" ? "정상" : profile.status} />
                      <Field
                        label="약관 동의"
                        value={profile.agreedTermsAt ? formatDateTime(profile.agreedTermsAt) : "미동의"}
                      />
                    </div>
                  </div>
                </Card>

                <Card padding="lg" className="border-red-500/20">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={18} className="text-red-300 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-white/85">회원 탈퇴</p>
                        <p className="text-xs text-white/45 mt-1 leading-relaxed">
                          탈퇴 시 보유 캐시는 소멸되며 계정 정보가 익명화됩니다. 결제/보상 내역은 법정 보관 기간 동안 유지됩니다.
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setWithdrawOpen(true)}>
                      탈퇴하기
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {active === "cash" && (
              <div className="mt-6 space-y-4">
                <Card padding="lg">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-white/40">현재 보유 캐시</p>
                      <div className="mt-1">
                        <CashDisplay amount={balance ?? cashBalance ?? 0} size="lg" />
                      </div>
                    </div>
                    <Button onClick={() => router.push("/shop")}>충전하러 가기</Button>
                  </div>
                </Card>
                <Card padding="none">
                  {loading ? (
                    <LoadingRow />
                  ) : transactions.length === 0 ? (
                    <EmptyState icon={Coins} title="캐시 변동 내역이 없습니다" />
                  ) : (
                    <Table columns={cashColumns} data={transactions} />
                  )}
                </Card>
              </div>
            )}

            {active === "payments" && (
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-white/70">충전 내역</h3>
                  <Card padding="none">
                    {loading ? (
                      <LoadingRow />
                    ) : charges.length === 0 ? (
                      <EmptyState icon={CreditCard} title="충전 내역이 없습니다" />
                    ) : (
                      <Table columns={chargeColumns} data={charges} />
                    )}
                  </Card>
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-white/70">구매 내역</h3>
                  <Card padding="none">
                    {loading ? (
                      <LoadingRow />
                    ) : purchases.length === 0 ? (
                      <EmptyState icon={ShoppingBag} title="구매 내역이 없습니다" />
                    ) : (
                      <Table columns={purchaseColumns} data={purchases} />
                    )}
                  </Card>
                </div>
              </div>
            )}

            {active === "rewards" && (
              <Card padding="none" className="mt-6">
                {loading ? (
                  <LoadingRow />
                ) : mails.length === 0 ? (
                  <EmptyState icon={Mail} title="보상 발송 이력이 없습니다" />
                ) : (
                  <>
                    <Table columns={mailColumns} data={mails} />
                    <div className="px-4 py-3 border-t border-white/5 text-xs text-white/40 flex items-center gap-1.5">
                      <Mail size={13} /> 발송 실패 시 자동으로 재시도됩니다.
                    </div>
                  </>
                )}
              </Card>
            )}
          </div>
        </section>
      </main>
      <Footer />

      <Modal
        isOpen={withdrawOpen}
        onClose={() => !withdrawing && setWithdrawOpen(false)}
        title="정말 탈퇴하시겠어요?"
        footer={
          <>
            <Button variant="outline" onClick={() => setWithdrawOpen(false)} disabled={withdrawing}>
              취소
            </Button>
            <Button variant="danger" onClick={onWithdraw} disabled={withdrawing} leftIcon={withdrawing ? <Loader2 className="animate-spin" size={15} /> : undefined}>
              탈퇴하기
            </Button>
          </>
        }
      >
        <p className="text-sm text-white/70 leading-relaxed">
          보유하신 캐시 <strong className="text-white">{(balance ?? cashBalance ?? 0).toLocaleString()} C</strong> 가 모두 소멸되며 되돌릴 수 없습니다.
          계속 진행하시겠어요?
        </p>
      </Modal>
    </>
  );
}

const cashColumns: TableColumn<CashTransaction>[] = [
  { key: "createdAt", label: "일시", width: "180px", render: (r) => formatDateTime(r.createdAt) },
  {
    key: "type",
    label: "유형",
    width: "100px",
    render: (r) => (
      <Badge variant={r.type === "CHARGE" ? "info" : r.type === "REFUND" ? "warning" : "default"} size="sm">
        {CASH_TYPE_LABEL[r.type]}
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
    key: "balanceAfter",
    label: "잔액",
    align: "right",
    render: (r) => <span className="text-white/70">{r.balanceAfter.toLocaleString()} C</span>,
  },
  { key: "memo", label: "비고", render: (r) => r.memo ?? "-" },
];

const chargeColumns: TableColumn<ChargeHistory>[] = [
  { key: "createdAt", label: "일시", width: "160px", render: (r) => formatDateTime(r.createdAt) },
  { key: "cashAmount", label: "충전 캐시", align: "right", render: (r) => `${r.cashAmount.toLocaleString()} C` },
  { key: "paymentAmountKrw", label: "결제 금액", align: "right", render: (r) => `${r.paymentAmountKrw.toLocaleString()}원` },
  {
    key: "status",
    label: "상태",
    width: "100px",
    render: (r) => (
      <Badge variant={r.status === "PAID" ? "success" : r.status === "REFUNDED" ? "warning" : r.status === "FAILED" ? "error" : "default"} size="sm">
        {r.status}
      </Badge>
    ),
  },
  {
    key: "receiptUrl",
    label: "영수증",
    width: "100px",
    render: (r) =>
      r.receiptUrl ? (
        <a href={r.receiptUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-white">
          <Receipt size={13} /> 보기
        </a>
      ) : (
        <span className="text-white/30 text-xs">-</span>
      ),
  },
];

const purchaseColumns: TableColumn<PurchaseHistory>[] = [
  { key: "createdAt", label: "일시", width: "160px", render: (r) => formatDateTime(r.createdAt) },
  { key: "productName", label: "상품명" },
  { key: "quantity", label: "수량", align: "right", width: "70px" },
  { key: "totalPrice", label: "금액", align: "right", render: (r) => `${r.totalPrice.toLocaleString()} C` },
  {
    key: "status",
    label: "상태",
    width: "120px",
    render: (r) => (
      <Badge variant={r.status === "COMPLETED" ? "success" : r.status === "MAIL_FAILED" || r.status === "CANCELLED" ? "error" : "info"} size="sm">
        {r.status}
      </Badge>
    ),
  },
];

const mailColumns: TableColumn<MailHistory>[] = [
  { key: "createdAt", label: "발송일", width: "180px", render: (r) => formatDateTime(r.createdAt) },
  {
    key: "sourceType",
    label: "출처",
    width: "110px",
    render: (r) => <Badge variant="default" size="sm">{MAIL_SOURCE_LABEL[r.sourceType]}</Badge>,
  },
  { key: "subject", label: "우편 제목" },
  {
    key: "status",
    label: "상태",
    width: "110px",
    render: (r) => (
      <Badge variant={r.status === "SENT" ? "success" : r.status === "PENDING" ? "info" : "error"} size="sm">
        {r.status}
      </Badge>
    ),
  },
];

function LoadingRow() {
  return (
    <div className="flex items-center justify-center py-10 text-white/40">
      <Loader2 className="animate-spin" size={20} />
    </div>
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
