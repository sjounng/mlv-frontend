"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Calendar, Loader2, Pencil, Plus, Trash2, ImagePlus, X } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Modal,
  Select,
  Table,
  useToast,
  type TableColumn,
} from "@/components/ui";
import RichTextEditor from "@/components/admin/RichTextEditor";
import {
  adminApi,
  uploadImage,
  type AdminEvent,
  type EventStatus,
  type EventType,
  type EventUpsert,
  type MailTemplate,
} from "@/lib/admin-api";
import { ApiError } from "@/lib/api";

const TYPE_OPTIONS: { value: EventType; label: string }[] = [
  { value: "GENERAL", label: "일반" },
  { value: "ATTENDANCE", label: "출석체크" },
  { value: "INVITE", label: "친구초대" },
  { value: "PAYBACK", label: "페이백" },
];

const STATUS_OPTIONS: { value: EventStatus; label: string }[] = [
  { value: "UPCOMING", label: "진행예정" },
  { value: "ONGOING", label: "진행중" },
  { value: "ENDED", label: "종료" },
];

const STATUS_LABEL: Record<EventStatus, string> = {
  UPCOMING: "진행예정",
  ONGOING: "진행중",
  ENDED: "종료",
};

const STATUS_VARIANT: Record<EventStatus, "success" | "info" | "default"> = {
  ONGOING: "success",
  UPCOMING: "info",
  ENDED: "default",
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
  bannerImageUrl: null,
  description: "",
  startAt: "",
  endAt: "",
  status: "ONGOING",
  featured: false,
  mailTemplateId: null,
  active: true,
};

function Toggle({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${on ? "bg-emerald-500" : "bg-white/15"}`}
        aria-pressed={on}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${on ? "translate-x-6" : "translate-x-1"}`} />
      </button>
      <span className="text-xs text-white/60">{label}</span>
    </div>
  );
}

export default function AdminEventsPage() {
  const { toast } = useToast();
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [templates, setTemplates] = useState<MailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<EventUpsert>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const bannerRef = useRef<HTMLInputElement>(null);

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
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (e: AdminEvent) => {
    setEditingId(e.id);
    setForm({
      name: e.name,
      type: e.type,
      bannerImageUrl: e.bannerImageUrl,
      description: e.description ?? "",
      startAt: toLocalInput(e.startAt),
      endAt: toLocalInput(e.endAt),
      status: e.status,
      featured: e.featured,
      mailTemplateId: e.mailTemplateId,
      active: e.active,
    });
    setOpen(true);
  };

  const onPickBanner = async (file: File) => {
    setUploadingBanner(true);
    try {
      const { url } = await uploadImage(file);
      setForm((f) => ({ ...f, bannerImageUrl: url }));
    } catch {
      toast({ title: "배너 업로드 실패", variant: "error" });
    } finally {
      setUploadingBanner(false);
    }
  };

  const onSave = async () => {
    if (!form.name.trim() || !form.startAt || !form.endAt) {
      toast({ title: "이벤트명·기간을 확인해 주세요", variant: "warning" });
      return;
    }
    const body: EventUpsert = {
      ...form,
      description: form.description ?? "",
      mailTemplateId: form.mailTemplateId || null,
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

  const onDelete = async () => {
    if (editingId == null) return;
    if (!window.confirm("이 이벤트를 삭제할까요? 되돌릴 수 없습니다.")) return;
    setDeleting(true);
    try {
      await adminApi.deleteEvent(editingId);
      toast({ title: "이벤트를 삭제했습니다", variant: "success" });
      setOpen(false);
      await load();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "삭제에 실패했습니다.";
      toast({ title: "삭제 실패", description: message, variant: "error" });
    } finally {
      setDeleting(false);
    }
  };

  const columns: TableColumn<Row>[] = [
    { key: "name", label: "이벤트명" },
    {
      key: "startAt",
      label: "기간",
      render: (r) => `${new Date(r.startAt).toLocaleDateString("ko-KR")} ~ ${new Date(r.endAt).toLocaleDateString("ko-KR")}`,
    },
    { key: "featured", label: "슬라이더", width: "80px", render: (r) => (r.featured ? <Badge variant="info" size="sm">노출</Badge> : <span className="text-white/25 text-xs">-</span>) },
    { key: "active", label: "공개", width: "80px", render: (r) => <Badge variant={r.active ? "success" : "default"} size="sm">{r.active ? "공개" : "비공개"}</Badge> },
    { key: "status", label: "진행상태", width: "90px", render: (r) => <Badge variant={STATUS_VARIANT[r.status]} size="sm">{STATUS_LABEL[r.status]}</Badge> },
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
          <p className="mt-1.5 text-sm text-white/50">이벤트를 등록·수정하고 진행 상태·공개 여부·슬라이더 노출을 관리합니다.</p>
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
        onClose={() => !saving && !deleting && setOpen(false)}
        title={editingId == null ? "이벤트 등록" : "이벤트 수정"}
        size="lg"
        footer={
          <div className="flex items-center justify-between w-full">
            {editingId != null ? (
              <Button variant="ghost" onClick={onDelete} disabled={saving || deleting} leftIcon={deleting ? <Loader2 className="animate-spin" size={15} /> : <Trash2 size={15} />} className="text-red-300 hover:text-red-200">
                삭제
              </Button>
            ) : <span />}
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setOpen(false)} disabled={saving || deleting}>취소</Button>
              <Button onClick={onSave} disabled={saving || deleting} leftIcon={saving ? <Loader2 className="animate-spin" size={15} /> : undefined}>
                {editingId == null ? "등록하기" : "수정하기"}
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          <Input label="이벤트명" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

          {/* 대표 배너 이미지 (목록 썸네일 + 상세/슬라이더) */}
          <div>
            <p className="text-xs font-medium text-white/60 mb-1.5">대표 배너 이미지</p>
            <div className="flex items-center gap-3">
              <div className="relative w-40 aspect-video rounded-lg overflow-hidden border border-white/10 bg-surface-3 shrink-0">
                {form.bannerImageUrl ? (
                  <Image src={form.bannerImageUrl} alt="배너 미리보기" fill sizes="160px" className="object-cover" unoptimized />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white/25"><ImagePlus size={20} /></div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" onClick={() => bannerRef.current?.click()} disabled={uploadingBanner} leftIcon={uploadingBanner ? <Loader2 className="animate-spin" size={14} /> : <ImagePlus size={14} />}>
                  {form.bannerImageUrl ? "이미지 변경" : "이미지 업로드"}
                </Button>
                {form.bannerImageUrl && (
                  <Button variant="ghost" size="sm" onClick={() => setForm({ ...form, bannerImageUrl: null })} leftIcon={<X size={14} />} className="text-white/50">제거</Button>
                )}
              </div>
            </div>
            <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void onPickBanner(f); e.target.value = ""; }} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Select label="진행 상태" options={STATUS_OPTIONS} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as EventStatus })} />
            <Select label="유형" options={TYPE_OPTIONS} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as EventType })} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="시작" type="datetime-local" value={form.startAt} onChange={(e) => setForm({ ...form, startAt: e.target.value })} />
            <Input label="종료" type="datetime-local" value={form.endAt} onChange={(e) => setForm({ ...form, endAt: e.target.value })} />
          </div>

          <div>
            <p className="text-xs font-medium text-white/60 mb-1.5">본문</p>
            <RichTextEditor value={form.description ?? ""} onChange={(html) => setForm({ ...form, description: html })} placeholder="이벤트 내용을 작성하세요 (이미지·영상·굵게 지원)" />
          </div>

          {/* 보상 연결(선택) — 출석/보상형 이벤트에서만 */}
          <Select
            label="연결 우편 템플릿 (보상형 이벤트만, 선택)"
            options={[{ value: "", label: "연결 안 함" }, ...templateOptions]}
            value={String(form.mailTemplateId || "")}
            onChange={(e) => setForm({ ...form, mailTemplateId: e.target.value ? Number(e.target.value) : null })}
          />

          <div className="flex items-center gap-6 pt-1">
            <Toggle on={form.active} onToggle={() => setForm({ ...form, active: !form.active })} label="공개" />
            <Toggle on={form.featured} onToggle={() => setForm({ ...form, featured: !form.featured })} label="상단 슬라이더 노출" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
