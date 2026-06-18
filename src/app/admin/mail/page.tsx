"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Mail, Plus, Send, Ticket } from "lucide-react";
import {
  Button,
  Card,
  EmptyState,
  Input,
  Modal,
  Select,
  Tabs,
  Table,
  Textarea,
  useToast,
  type TableColumn,
} from "@/components/ui";
import { adminApi, type MailTemplate } from "@/lib/admin-api";
import { ApiError } from "@/lib/api";

const TABS = [
  { id: "templates", label: "우편 템플릿" },
  { id: "send", label: "별도 지급" },
  { id: "redeem", label: "리딤코드 발급" },
];

type TemplateRow = MailTemplate & Record<string, unknown>;

export default function AdminMailPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState("templates");
  const [templates, setTemplates] = useState<MailTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setTemplates(await adminApi.mailTemplates());
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "우편 템플릿을 불러오지 못했습니다.";
      toast({ title: "불러오기 실패", description: message, variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const templateOptions = templates.map((t) => ({ value: String(t.id), label: `${t.mailCode} — ${t.subject}` }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">우편 관리</h1>
        <p className="mt-1.5 text-sm text-white/50">인게임 우편 템플릿을 관리하고, 별도 지급·리딤코드를 발급합니다.</p>
      </div>

      <Tabs tabs={TABS} activeTab={tab} onChange={setTab} />

      {tab === "templates" && <TemplatesTab templates={templates} loading={loading} onChanged={load} />}
      {tab === "send" && <SendTab templateOptions={templateOptions} />}
      {tab === "redeem" && <RedeemTab templateOptions={templateOptions} />}
    </div>
  );
}

function TemplatesTab({ templates, loading, onChanged }: { templates: MailTemplate[]; loading: boolean; onChanged: () => Promise<void> }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ mailCode: "", subject: "", content: "", rewardsJson: '[{"itemId":"minecraft:diamond","quantity":1}]' });

  const onSave = async () => {
    if (!form.mailCode.trim() || !form.subject.trim() || !form.content.trim() || !form.rewardsJson.trim()) {
      toast({ title: "모든 항목을 입력해 주세요", variant: "warning" });
      return;
    }
    try {
      JSON.parse(form.rewardsJson);
    } catch {
      toast({ title: "보상 JSON 형식이 올바르지 않습니다", variant: "error" });
      return;
    }
    setSaving(true);
    try {
      await adminApi.createMailTemplate(form);
      toast({ title: "우편 템플릿이 생성되었습니다", variant: "success" });
      setOpen(false);
      setForm({ mailCode: "", subject: "", content: "", rewardsJson: '[{"itemId":"minecraft:diamond","quantity":1}]' });
      await onChanged();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "생성에 실패했습니다.";
      toast({ title: "생성 실패", description: message, variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  const columns: TableColumn<TemplateRow>[] = [
    { key: "mailCode", label: "우편 코드", render: (r) => <code className="text-xs text-white/70">{r.mailCode}</code> },
    { key: "subject", label: "제목" },
    { key: "createdAt", label: "생성일", width: "140px", render: (r) => new Date(r.createdAt).toLocaleDateString("ko-KR") },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button leftIcon={<Plus size={16} />} onClick={() => setOpen(true)}>템플릿 생성</Button>
      </div>
      <Card padding="none">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-white/40"><Loader2 className="animate-spin" size={22} /></div>
        ) : templates.length === 0 ? (
          <EmptyState icon={Mail} title="우편 템플릿이 없습니다" />
        ) : (
          <Table columns={columns} data={templates} />
        )}
      </Card>

      <Modal
        isOpen={open}
        onClose={() => !saving && setOpen(false)}
        title="우편 템플릿 생성"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>취소</Button>
            <Button onClick={onSave} disabled={saving} leftIcon={saving ? <Loader2 className="animate-spin" size={15} /> : undefined}>생성하기</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="우편 코드 (영문/숫자)" value={form.mailCode} onChange={(e) => setForm({ ...form, mailCode: e.target.value })} placeholder="STARTER_KIT" />
          <Input label="제목" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          <Textarea label="본문" rows={3} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          <Textarea label="보상 JSON" rows={3} value={form.rewardsJson} onChange={(e) => setForm({ ...form, rewardsJson: e.target.value })} />
          <p className="text-xs text-white/35">예: {`[{"itemId":"minecraft:diamond","quantity":3}]`}</p>
        </div>
      </Modal>
    </div>
  );
}

function SendTab({ templateOptions }: { templateOptions: { value: string; label: string }[] }) {
  const { toast } = useToast();
  const [targetUuid, setTargetUuid] = useState("");
  const [mailTemplateId, setMailTemplateId] = useState("");
  const [sourceRefId, setSourceRefId] = useState("");
  const [sending, setSending] = useState(false);

  const onSend = async () => {
    if (!targetUuid.trim() || !mailTemplateId || !sourceRefId.trim()) {
      toast({ title: "대상 UUID·템플릿·참조 ID를 입력해 주세요", variant: "warning" });
      return;
    }
    setSending(true);
    try {
      await adminApi.sendMail({ targetUuid: targetUuid.trim(), mailTemplateId: Number(mailTemplateId), sourceRefId: sourceRefId.trim() });
      toast({ title: "우편 발송 요청을 등록했습니다", description: "인게임 우편함으로 발송됩니다.", variant: "success" });
      setTargetUuid("");
      setSourceRefId("");
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "발송에 실패했습니다.";
      toast({ title: "발송 실패", description: message, variant: "error" });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card padding="lg" className="max-w-xl">
      <div className="space-y-4">
        <Input label="대상 플레이어 UUID" value={targetUuid} onChange={(e) => setTargetUuid(e.target.value)} placeholder="00000000-0000-0000-0000-000000000000" />
        <Select label="우편 템플릿" options={[{ value: "", label: "선택하세요" }, ...templateOptions]} value={mailTemplateId} onChange={(e) => setMailTemplateId(e.target.value)} />
        <Input label="참조 ID (멱등 키 용도)" value={sourceRefId} onChange={(e) => setSourceRefId(e.target.value)} placeholder="예: compensation-2026-06" />
        <Button onClick={onSend} disabled={sending} leftIcon={sending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}>발송하기</Button>
      </div>
    </Card>
  );
}

function RedeemTab({ templateOptions }: { templateOptions: { value: string; label: string }[] }) {
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [mailTemplateId, setMailTemplateId] = useState("");
  const [maxUses, setMaxUses] = useState("100");
  const [expiresAt, setExpiresAt] = useState("");
  const [creating, setCreating] = useState(false);

  const onCreate = async () => {
    if (!code.trim() || !mailTemplateId || !expiresAt) {
      toast({ title: "코드·템플릿·만료일을 입력해 주세요", variant: "warning" });
      return;
    }
    setCreating(true);
    try {
      await adminApi.createRedeemCode({
        code: code.trim(),
        mailTemplateId: Number(mailTemplateId),
        maxUses: Number(maxUses) || 1,
        expiresAt: new Date(expiresAt).toISOString(),
      });
      toast({ title: "리딤코드를 발급했습니다", variant: "success" });
      setCode("");
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "발급에 실패했습니다.";
      toast({ title: "발급 실패", description: message, variant: "error" });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Card padding="lg" className="max-w-xl">
      <div className="space-y-4">
        <Input label="코드" value={code} onChange={(e) => setCode(e.target.value)} placeholder="MARIBEL-SUMMER-2026" />
        <Select label="우편 템플릿" options={[{ value: "", label: "선택하세요" }, ...templateOptions]} value={mailTemplateId} onChange={(e) => setMailTemplateId(e.target.value)} />
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="최대 사용 횟수" type="number" value={maxUses} onChange={(e) => setMaxUses(e.target.value)} />
          <Input label="만료일시" type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
        </div>
        <Button onClick={onCreate} disabled={creating} leftIcon={creating ? <Loader2 className="animate-spin" size={16} /> : <Ticket size={16} />}>리딤코드 발급</Button>
      </div>
    </Card>
  );
}
