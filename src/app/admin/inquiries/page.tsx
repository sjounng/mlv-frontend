"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, MessageSquare, Paperclip } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Modal,
  Table,
  Textarea,
  useToast,
  type TableColumn,
} from "@/components/ui";
import { adminApi, type Inquiry, type ContactCategory, type ContactStatus } from "@/lib/admin-api";
import { ApiError } from "@/lib/api";

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

type Row = Inquiry & Record<string, unknown>;

export default function AdminInquiriesPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await adminApi.inquiries());
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "문의를 불러오지 못했습니다.";
      toast({ title: "불러오기 실패", description: message, variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const openReply = (inq: Inquiry) => {
    setSelected(inq);
    setReply("");
  };

  const onSend = async () => {
    if (!selected) return;
    if (!reply.trim()) {
      toast({ title: "답변 내용을 입력해 주세요", variant: "warning" });
      return;
    }
    setSending(true);
    try {
      await adminApi.replyInquiry(selected.id, reply.trim());
      toast({ title: "답변을 등록했습니다", variant: "success" });
      setSelected(null);
      await load();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "답변 등록에 실패했습니다.";
      toast({ title: "등록 실패", description: message, variant: "error" });
    } finally {
      setSending(false);
    }
  };

  const columns: TableColumn<Row>[] = [
    {
      key: "createdAt",
      label: "접수일",
      width: "160px",
      render: (r) => new Date(r.createdAt).toLocaleString("ko-KR", { dateStyle: "short", timeStyle: "short" }),
    },
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
    {
      key: "actions",
      label: "관리",
      width: "100px",
      render: (r) => (
        <Button size="sm" variant="outline" onClick={() => openReply(r)}>
          {r.status === "OPEN" ? "답변하기" : "보기"}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">문의 답변</h1>
        <p className="mt-1.5 text-sm text-white/50">사용자 문의를 확인하고 답변을 작성합니다.</p>
      </div>

      <Card padding="none">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-white/40"><Loader2 className="animate-spin" size={22} /></div>
        ) : items.length === 0 ? (
          <EmptyState icon={MessageSquare} title="문의가 없습니다" />
        ) : (
          <Table columns={columns} data={items} />
        )}
      </Card>

      <Modal
        isOpen={selected !== null}
        onClose={() => !sending && setSelected(null)}
        title={selected?.title ?? "문의"}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setSelected(null)} disabled={sending}>닫기</Button>
            <Button onClick={onSend} disabled={sending} leftIcon={sending ? <Loader2 className="animate-spin" size={15} /> : undefined}>
              답변 등록
            </Button>
          </>
        }
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-white/45">
              <Badge variant="default" size="sm">{CATEGORY_LABEL[selected.category]}</Badge>
              <span>{new Date(selected.createdAt).toLocaleString("ko-KR")}</span>
            </div>
            <div className="p-3 bg-white/3 border border-white/8 rounded-lg text-sm text-white/80 whitespace-pre-wrap">
              {selected.content}
            </div>
            {selected.attachmentUrl && (
              <a
                href={selected.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex items-center gap-1.5 text-sm text-emerald-300 hover:text-emerald-200 hover:underline"
              >
                <Paperclip size={14} className="shrink-0" />
                첨부파일 보기
              </a>
            )}
            <Textarea label="답변" rows={5} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="답변 내용을 입력하세요" />
          </div>
        )}
      </Modal>
    </div>
  );
}
