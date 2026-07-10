"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
// useRouter 제거: 익명 사용자도 FAQ 를 볼 수 있어 로그인 리다이렉트가 필요 없어짐
import { HelpCircle, LifeBuoy, Loader2, MessageSquare, Paperclip, Send, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FaqSection from "@/components/support/FaqSection";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Modal,
  Pagination,
  Select,
  Table,
  Textarea,
  useToast,
  type TableColumn,
} from "@/components/ui";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const PAGE_SIZE = 5; // 문의 내역 5개씩 표시 (07-08 피드백)
const ATTACH_MAX_BYTES = 5 * 1024 * 1024;

type ContactCategory = "PAYMENT" | "ACCOUNT" | "EVENT" | "PLAYER_REPORT" | "BUG_REPORT" | "OTHER";
type ContactStatus = "OPEN" | "ANSWERED" | "CLOSED";

// 신고 분류 선택 시 본문에 자동 입력되는 폼 템플릿 (07-09 피드백)
const REPORT_TEMPLATES: Partial<Record<ContactCategory, string>> = {
  PLAYER_REPORT:
    "신고할 플레이어 (닉네임): \n사건 발생일 (현실 일시): \n사건 내용: \n신고자 디스코드 ID: \n\nTIP: 문의 내용을 구체적으로 서술해주실수록 문의 해결에 도움이 됩니다",
  BUG_REPORT:
    "버그 발생일 (현실 일시): \n버그 내용: \n신고자 디스코드 ID: \n\nTIP: 문의 내용을 구체적으로 서술해주실수록 문의 해결에 도움이 됩니다",
};
const TEMPLATE_VALUES = Object.values(REPORT_TEMPLATES);

interface Inquiry extends Record<string, unknown> {
  id: number;
  category: ContactCategory;
  title: string;
  content: string;
  status: ContactStatus;
  createdAt: string;
  attachmentUrl: string | null;
}

const categories: { value: ContactCategory; label: string }[] = [
  { value: "PAYMENT", label: "결제 / 환불" },
  { value: "ACCOUNT", label: "계정" },
  { value: "EVENT", label: "이벤트" },
  { value: "PLAYER_REPORT", label: "플레이어 신고" },
  { value: "BUG_REPORT", label: "버그 신고" },
  { value: "OTHER", label: "기타" },
];

const CATEGORY_LABEL: Record<ContactCategory, string> = {
  PAYMENT: "결제/환불",
  ACCOUNT: "계정",
  EVENT: "이벤트",
  PLAYER_REPORT: "플레이어 신고",
  BUG_REPORT: "버그 신고",
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

  // 이미지 첨부 (png/jpeg)
  const [attachFile, setAttachFile] = useState<File | null>(null);
  const [attachPreview, setAttachPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // 1-based
  const [detail, setDetail] = useState<Inquiry | null>(null); // 제목 클릭 시 팝업 대상

  // 분류 변경: 신고 분류를 고르면 템플릿 자동 입력, 벗어나면(내용이 템플릿 그대로면) 비움.
  // 사용자가 직접 쓴 내용은 덮어쓰지 않는다.
  const onCategoryChange = (next: ContactCategory) => {
    setContent((prev) => {
      const prevIsTemplateOrEmpty = prev === "" || TEMPLATE_VALUES.includes(prev);
      const tpl = REPORT_TEMPLATES[next];
      if (tpl) return prevIsTemplateOrEmpty ? tpl : prev;
      return TEMPLATE_VALUES.includes(prev) ? "" : prev;
    });
    setCategory(next);
  };

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

  // 5개씩 페이지네이션. 목록 변화로 페이지가 범위를 벗어나면 렌더 시 파생값으로 보정
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = useMemo(
    () => items.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [items, safePage],
  );

  const onPickFile = (file: File | null) => {
    if (!file) return;
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      toast({ title: "png 또는 jpeg 이미지만 첨부할 수 있어요", variant: "warning" });
      return;
    }
    if (file.size > ATTACH_MAX_BYTES) {
      toast({ title: "이미지는 5MB 이하만 첨부할 수 있어요", variant: "warning" });
      return;
    }
    setAttachFile(file);
    setAttachPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  const clearAttach = () => {
    setAttachFile(null);
    setAttachPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast({ title: "제목과 내용을 입력해 주세요", variant: "warning" });
      return;
    }
    setSubmitting(true);
    try {
      // 첨부 이미지가 있으면 먼저 업로드하여 URL 을 확보한다
      let attachmentUrl: string | null = null;
      if (attachFile) {
        const form = new FormData();
        form.append("file", attachFile);
        const res = await api.upload<{ url: string }>("/api/contact/inquiries/attachment", form);
        attachmentUrl = res.url;
      }
      await api.post("/api/contact/inquiries", {
        category,
        title: title.trim(),
        content: content.trim(),
        attachmentUrl,
      });
      toast({ title: "문의가 접수되었습니다", variant: "success" });
      setTitle("");
      setContent("");
      clearAttach();
      setPage(1);
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
    {
      key: "title",
      label: "제목",
      render: (r) => (
        <button
          type="button"
          onClick={() => setDetail(r)}
          className="focus-ring rounded inline-flex items-center gap-1.5 text-left text-white hover:text-emerald-300 hover:underline underline-offset-4 transition-colors"
        >
          <span className="truncate">{r.title}</span>
          {r.attachmentUrl && <Paperclip size={12} className="shrink-0 text-white/40" />}
        </button>
      ),
    },
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
                        onChange={(e) => onCategoryChange(e.target.value as ContactCategory)}
                      />
                      <Input label="제목" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="문의 제목" />
                    </div>
                    <Textarea label="내용" rows={6} value={content} onChange={(e) => setContent(e.target.value)} placeholder="문의 내용을 자세히 적어주세요" />

                    {/* 이미지 첨부 (png/jpeg) */}
                    <div>
                      <p className="text-xs font-medium text-white/60 mb-1.5">이미지 첨부 <span className="text-white/30">(선택 · png/jpeg · 최대 5MB)</span></p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg"
                        className="hidden"
                        onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
                      />
                      {attachPreview ? (
                        <div className="relative inline-block">
                          {/* 미리보기: blob URL 이라 next/image 최적화 대상 아님 */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={attachPreview} alt="첨부 미리보기" className="max-h-40 rounded-lg border border-white/10" />
                          <button
                            type="button"
                            onClick={clearAttach}
                            aria-label="첨부 제거"
                            className="focus-ring absolute -top-2 -right-2 w-6 h-6 rounded-full bg-surface-4 border border-white/15 flex items-center justify-center text-white/70 hover:text-white"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="focus-ring inline-flex items-center gap-2 px-4 py-2 text-sm text-white/70 border border-dashed border-white/20 rounded-lg hover:border-white/40 hover:text-white transition-colors"
                        >
                          <Paperclip size={15} /> 이미지 선택
                        </button>
                      )}
                    </div>

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
                      <Table columns={columns} data={pageItems} />
                    )}
                  </Card>
                  {!loading && totalPages > 1 && (
                    <Pagination
                      currentPage={safePage}
                      totalPages={totalPages}
                      onPageChange={setPage}
                      className="mt-4 justify-center"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />

      {/* 문의 상세 팝업 (제목 클릭) */}
      <Modal isOpen={!!detail} onClose={() => setDetail(null)} title={detail?.title} size="lg">
        {detail && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Badge variant="default" size="sm">{CATEGORY_LABEL[detail.category]}</Badge>
              <Badge
                variant={detail.status === "ANSWERED" ? "success" : detail.status === "OPEN" ? "warning" : "default"}
                size="sm"
              >
                {STATUS_LABEL[detail.status]}
              </Badge>
              <span className="text-white/40">{new Date(detail.createdAt).toLocaleString("ko-KR")}</span>
            </div>
            <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap break-words">{detail.content}</p>
            {detail.attachmentUrl && (
              <div>
                <p className="text-xs font-medium text-white/50 mb-2 flex items-center gap-1.5">
                  <Paperclip size={13} /> 첨부 이미지
                </p>
                <a href={detail.attachmentUrl} target="_blank" rel="noopener noreferrer" className="block">
                  <Image
                    src={detail.attachmentUrl}
                    alt="문의 첨부 이미지"
                    width={800}
                    height={600}
                    unoptimized
                    className="max-h-80 w-auto rounded-lg border border-white/10"
                  />
                </a>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
