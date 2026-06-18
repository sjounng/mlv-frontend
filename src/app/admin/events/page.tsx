"use client";

import { useCallback, useEffect, useState } from "react";
import { Calendar, Loader2, Pencil, Plus } from "lucide-react";
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
import { adminApi, type AdminEvent, type EventType, type EventUpsert, type MailTemplate } from "@/lib/admin-api";
import { ApiError } from "@/lib/api";

const TYPE_OPTIONS: { value: EventType; label: string }[] = [
  { value: "ATTENDANCE", label: "출석체크" },
  { value: "INVITE", label: "친구초대" },
  { value: "PAYBACK", label: "페이백" },
  { value: "GENERAL", label: "일반" },
];

const TYPE_LABEL: Record<EventType, string> = {
  ATTENDANCE: "출석체크",
  INVITE: "친구초대",
  PAYBACK: "페이백",
  GENERAL: "일반",
};

type Row = AdminEvent & Record<string, unknown>;

function toLocalInput(iso: string) {
  const d = new Date(iso);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
}

const emptyForm: EventUpsert = {
  name: "",
  type: "GENERAL",
  description: "",
  startAt: "",
  endAt: "",
  mailTemplateId: 0,
  active: true,
};

export default function AdminEventsPage() {
  const { toast } = useToast();
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [templates, setTemplates] = useState<MailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<EventUpsert>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [e, t] = await Promise.all([adminApi.events(), adminApi.mailTemplates()]);
      setEvents(e);
      setTemplates(t);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "이벤트를 불러오지 못했습니다.";
      toast({ title: "불러오기 실패", description: message, variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, mailTemplateId: templates[0]?.id ?? 0 });
    setOpen(true);
  };

  const openEdit = (e: AdminEvent) => {
    setEditingId(e.id);
    setForm({
      name: e.name,
      type: e.type,
      description: e.description,
      startAt: toLocalInput(e.startAt),
      endAt: toLocalInput(e.endAt),
      mailTemplateId: e.mailTemplateId,
      active: e.active,
    });
    setOpen(true);
  };

  const onSave = async () => {
    if (!form.name.trim() || !form.startAt || !form.endAt || !form.mailTemplateId) {
      toast({ title: "필수 항목을 확인해 주세요", variant: "warning" });
      return;
    }
    const body: EventUpsert = {
      ...form,
      startAt: new Date(form.startAt).toISOString(),
      endAt: new Date(form.endAt).toISOString(),
    };
    setSaving(true);
    try {
      if (editingId == null) await adminApi.createEvent(body);
      else await adminApi.updateEvent(editingId, body);
      toast({ title: editingId == null ? "이벤트가 등록되었습니다" : "이벤트가 수정되었습니다", variant: "success" });
      setOpen(false);
      await load();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "저장에 실패했습니다.";
      toast({ title: "저장 실패", description: message, variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  const columns: TableColumn<Row>[] = [
    { key: "name", label: "이벤트명" },
    { key: "type", label: "유형", width: "110px", render: (r) => <Badge variant="default" size="sm">{TYPE_LABEL[r.type]}</Badge> },
    {
      key: "startAt",
      label: "기간",
      render: (r) => `${new Date(r.startAt).toLocaleDateString("ko-KR")} ~ ${new Date(r.endAt).toLocaleDateString("ko-KR")}`,
    },
    { key: "active", label: "상태", width: "90px", render: (r) => <Badge variant={r.active ? "success" : "default"} size="sm">{r.active ? "진행" : "종료"}</Badge> },
    {
      key: "actions",
      label: "관리",
      width: "70px",
      render: (r) => (
        <button type="button" onClick={() => openEdit(r)} className="p-1.5 rounded-md text-white/50 hover:text-white hover:bg-white/5">
          <Pencil size={14} />
        </button>
      ),
    },
  ];

  const templateOptions = templates.map((t) => ({ value: String(t.id), label: `${t.mailCode} — ${t.subject}` }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">이벤트 관리</h1>
          <p className="mt-1.5 text-sm text-white/50">이벤트를 등록·수정하고 진행 상태를 관리합니다.</p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={openCreate} disabled={loading}>이벤트 등록</Button>
      </div>

      <Card padding="none">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-white/40"><Loader2 className="animate-spin" size={22} /></div>
        ) : events.length === 0 ? (
          <EmptyState icon={Calendar} title="등록된 이벤트가 없습니다" />
        ) : (
          <Table columns={columns} data={events} />
        )}
      </Card>

      <Modal
        isOpen={open}
        onClose={() => !saving && setOpen(false)}
        title={editingId == null ? "이벤트 등록" : "이벤트 수정"}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>취소</Button>
            <Button onClick={onSave} disabled={saving} leftIcon={saving ? <Loader2 className="animate-spin" size={15} /> : undefined}>
              {editingId == null ? "등록하기" : "수정하기"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="이벤트명" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Select label="유형" options={TYPE_OPTIONS} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as EventType })} />
            <Select label="연결 우편 템플릿" options={[{ value: "", label: "선택" }, ...templateOptions]} value={String(form.mailTemplateId || "")} onChange={(e) => setForm({ ...form, mailTemplateId: Number(e.target.value) })} />
          </div>
          <Textarea label="설명" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="시작" type="datetime-local" value={form.startAt} onChange={(e) => setForm({ ...form, startAt: e.target.value })} />
            <Input label="종료" type="datetime-local" value={form.endAt} onChange={(e) => setForm({ ...form, endAt: e.target.value })} />
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setForm({ ...form, active: !form.active })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.active ? "bg-emerald-500" : "bg-white/15"}`}
              aria-pressed={form.active}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.active ? "translate-x-6" : "translate-x-1"}`} />
            </button>
            <span className="text-xs text-white/60">활성</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
