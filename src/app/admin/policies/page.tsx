"use client";

import { useCallback, useEffect, useState } from "react";
import { FileText, Loader2, Plus } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Modal,
  Select,
  Table,
  Textarea,
  useToast,
  type TableColumn,
} from "@/components/ui";
import { adminApi, type Terms, type TermsCreate, type TermsType } from "@/lib/admin-api";
import { ApiError } from "@/lib/api";

const TYPE_OPTIONS: { value: TermsType; label: string }[] = [
  { value: "TERMS", label: "이용약관" },
  { value: "PRIVACY", label: "개인정보처리방침" },
  { value: "REFUND", label: "환불정책" },
];

const TYPE_LABEL: Record<TermsType, string> = {
  TERMS: "이용약관",
  PRIVACY: "개인정보처리방침",
  REFUND: "환불정책",
};

type Row = Terms & Record<string, unknown>;

const emptyForm: TermsCreate = { type: "TERMS", version: "", content: "" };

export default function AdminPoliciesPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<Terms[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<TermsCreate>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await adminApi.terms());
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "약관을 불러오지 못했습니다.";
      toast({ title: "불러오기 실패", description: message, variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const onPublish = async () => {
    if (!form.version.trim() || !form.content.trim()) {
      toast({ title: "버전과 내용을 입력해 주세요", variant: "warning" });
      return;
    }
    setSaving(true);
    try {
      await adminApi.publishTerms(form);
      toast({ title: "새 버전을 게시했습니다", variant: "success" });
      setOpen(false);
      setForm(emptyForm);
      await load();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "게시에 실패했습니다.";
      toast({ title: "게시 실패", description: message, variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  const columns: TableColumn<Row>[] = [
    { key: "type", label: "종류", width: "160px", render: (r) => <Badge variant="default" size="sm">{TYPE_LABEL[r.type]}</Badge> },
    { key: "version", label: "버전", width: "120px", render: (r) => <code className="text-xs text-white/70">{r.version}</code> },
    { key: "publishedAt", label: "게시일", width: "160px", render: (r) => new Date(r.publishedAt).toLocaleString("ko-KR", { dateStyle: "short", timeStyle: "short" }) },
    { key: "content", label: "내용", render: (r) => <span className="text-xs text-white/45 line-clamp-1">{r.content}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">약관 / 방침 관리</h1>
          <p className="mt-1.5 text-sm text-white/50">약관 버전을 게시합니다. 최신 게시본이 사용자에게 노출됩니다.</p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={() => setOpen(true)} disabled={loading}>새 버전 게시</Button>
      </div>

      <Card padding="none">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-white/40"><Loader2 className="animate-spin" size={22} /></div>
        ) : items.length === 0 ? (
          <EmptyState icon={FileText} title="게시된 약관이 없습니다" />
        ) : (
          <Table columns={columns} data={items} />
        )}
      </Card>

      <Modal
        isOpen={open}
        onClose={() => !saving && setOpen(false)}
        title="약관/방침 새 버전 게시"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>취소</Button>
            <Button onClick={onPublish} disabled={saving} leftIcon={saving ? <Loader2 className="animate-spin" size={15} /> : undefined}>게시하기</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Select label="종류" options={TYPE_OPTIONS} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as TermsType })} />
            <Input label="버전" value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} placeholder="예: v1.1" />
          </div>
          <Textarea label="내용" rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          <p className="text-xs text-white/35">게시 즉시 최신 버전으로 사용자에게 노출됩니다. 변경 시 재동의 정책은 추후 연동 예정입니다.</p>
        </div>
      </Modal>
    </div>
  );
}
