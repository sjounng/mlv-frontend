"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HelpCircle, Loader2, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  const router = useRouter();
  const { status } = useAuth();
  const { toast } = useToast();

  const [category, setCategory] = useState<ContactCategory>("PAYMENT");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "anonymous") router.replace("/login");
  }, [status, router]);

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

  if (status !== "authenticated") {
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
        <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Contact</p>
            <h1 className="text-3xl md:text-4xl font-bold">문의하기</h1>
            <p className="mt-3 text-sm text-white/50">결제, 계정, 이벤트 등 궁금한 점을 남겨주세요.</p>
          </div>

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
            <h2 className="text-lg font-semibold mb-4">내 문의 내역</h2>
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
        </section>
      </main>
      <Footer />
    </>
  );
}
