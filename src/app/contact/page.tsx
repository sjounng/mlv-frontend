"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
// useRouter 제거: 익명 사용자도 FAQ 를 볼 수 있어 로그인 리다이렉트가 필요 없어짐
import { HelpCircle, LifeBuoy, Loader2, MessageSquare, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FaqSection from "@/components/support/FaqSection";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Select,
  Table,
  Textarea,
  useToast,
  type TableColumn,
} from "@/components/ui";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

type ContactCategory = "PAYMENT" | "ACCOUNT" | "EVENT" | "OTHER";
type ContactStatus = "OPEN" | "ANSWERED" | "CLOSED";

interface Inquiry extends Record<string, unknown> {
  id: number;
  category: ContactCategory;
  title: string;
  content: string;
  status: ContactStatus;
  createdAt: string;
}

const categories: { value: ContactCategory; label: string }[] = [
  { value: "PAYMENT", label: "결제 / 환불" },
  { value: "ACCOUNT", label: "계정" },
  { value: "EVENT", label: "이벤트" },
  { value: "OTHER", label: "기타" },
];

const CATEGORY_LABEL: Record<ContactCategory, string> = {
  PAYMENT: "결제/환불",
  ACCOUNT: "계정",
  EVENT: "이벤트",
  OTHER: "기타",
};

const STATUS_LABEL: Record<ContactStatus, string> = {
  OPEN: "답변대기",
  ANSWERED: "답변완료",
  CLOSED: "종료",
};

export default function ContactPage() {
  const { status } = useAuth();
  const { toast } = useToast();

  const [category, setCategory] = useState<ContactCategory>("PAYMENT");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMine = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await api.get<Inquiry[]>("/api/contact/inquiries/my"));
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "문의 내역을 불러오지 못했습니다.";
      toast({ title: "불러오기 실패", description: message, variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (status === "authenticated") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void loadMine();
    }
  }, [status, loadMine]);

  const onSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast({ title: "제목과 내용을 입력해 주세요", variant: "warning" });
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/api/contact/inquiries", { category, title: title.trim(), content: content.trim() });
      toast({ title: "문의가 접수되었습니다", variant: "success" });
      setTitle("");
      setContent("");
      await loadMine();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "문의 접수에 실패했습니다.";
      toast({ title: "접수 실패", description: message, variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const columns: TableColumn<Inquiry>[] = [
    { key: "createdAt", label: "접수일", width: "150px", render: (r) => new Date(r.createdAt).toLocaleDateString("ko-KR") },
    {
      key: "category",
      label: "분류",
      width: "110px",
      render: (r) => <Badge variant="default" size="sm">{CATEGORY_LABEL[r.category]}</Badge>,
    },
    { key: "title", label: "제목" },
    {
      key: "status",
      label: "상태",
      width: "110px",
      render: (r) => (
        <Badge variant={r.status === "ANSWERED" ? "success" : r.status === "OPEN" ? "warning" : "default"} size="sm">
          {STATUS_LABEL[r.status]}
        </Badge>
      ),
    },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="max-w-4xl mx-auto px-6 py-12 space-y-12">
          {/* 헤더 */}
          <div>
            <p className="text-xs text-emerald-300/70 uppercase tracking-widest mb-2 flex items-center gap-2">
              <LifeBuoy size={14} /> Support
            </p>
            <h1 className="text-3xl md:text-4xl font-bold">고객지원</h1>
            <p className="mt-3 text-sm text-white/50">
              먼저 자주 묻는 질문에서 답을 찾아보세요. 해결되지 않으면 아래에서 직접 문의할 수 있어요.
            </p>
          </div>

          {/* 1) FAQ — 초기 화면 (로그인 불필요) */}
          <div>
            <h2 className="text-lg font-semibold mb-4">자주 묻는 질문</h2>
            <FaqSection />
          </div>

          {/* 2) 직접 문의하기 (로그인 필요) */}
          <div className="pt-4 border-t border-white/8">
            <div className="flex items-center gap-2 mb-1.5">
              <MessageSquare size={18} className="text-white/60" />
              <h2 className="text-lg font-semibold">직접 문의하기</h2>
            </div>
            <p className="text-sm text-white/45 mb-5">원하는 답변이 없다면 직접 문의를 남겨주세요.</p>

            {status !== "authenticated" ? (
              <Card padding="lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <p className="text-sm text-white/55">문의를 남기려면 로그인이 필요합니다.</p>
                  <Link href="/login">
                    <Button>로그인하고 문의하기</Button>
                  </Link>
                </div>
              </Card>
            ) : (
              <div className="space-y-8">
                <Card padding="lg">
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-[200px_1fr] gap-4">
                      <Select
                        label="분류"
                        options={categories.map((c) => ({ value: c.value, label: c.label }))}
                        value={category}
                        onChange={(e) => setCategory(e.target.value as ContactCategory)}
                      />
                      <Input label="제목" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="문의 제목" />
                    </div>
                    <Textarea label="내용" rows={6} value={content} onChange={(e) => setContent(e.target.value)} placeholder="문의 내용을 자세히 적어주세요" />
                    <div className="flex justify-end">
                      <Button onClick={onSubmit} disabled={submitting} leftIcon={submitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}>
                        문의 접수
                      </Button>
                    </div>
                  </div>
                </Card>

                <div>
                  <h3 className="text-base font-semibold mb-4">내 문의 내역</h3>
                  <Card padding="none">
                    {loading ? (
                      <div className="flex items-center justify-center py-12 text-white/40"><Loader2 className="animate-spin" size={22} /></div>
                    ) : items.length === 0 ? (
                      <EmptyState icon={HelpCircle} title="문의 내역이 없습니다" />
                    ) : (
                      <Table columns={columns} data={items} />
                    )}
                  </Card>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
