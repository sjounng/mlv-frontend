"use client";

import { useCallback, useEffect, useState } from "react";
import { Image as ImageIcon, Loader2, Pencil, Plus } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Modal,
  Table,
  useToast,
  type TableColumn,
} from "@/components/ui";
import { adminApi, type Popup, type PopupUpsert } from "@/lib/admin-api";
import { ApiError } from "@/lib/api";

type Row = Popup & Record<string, unknown>;

function toLocalInput(iso: string) {
  const d = new Date(iso);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
}

const emptyForm: PopupUpsert = { imageUrl: "", linkUrl: null, startAt: "", endAt: "", active: true };

export default function AdminBannersPage() {
  const { toast } = useToast();
  const [popups, setPopups] = useState<Popup[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<PopupUpsert>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [actingId, setActingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setPopups(await adminApi.popups());
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "팝업을 불러오지 못했습니다.";
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

  const openEdit = (p: Popup) => {
    setEditingId(p.id);
    setForm({ imageUrl: p.imageUrl, linkUrl: p.linkUrl, startAt: toLocalInput(p.startAt), endAt: toLocalInput(p.endAt), active: p.active });
    setOpen(true);
  };

  const onSave = async () => {
    if (!form.imageUrl.trim() || !form.startAt || !form.endAt) {
      toast({ title: "이미지 URL과 기간을 입력해 주세요", variant: "warning" });
      return;
    }
    const body: PopupUpsert = {
      ...form,
      linkUrl: form.linkUrl?.trim() || null,
      startAt: new Date(form.startAt).toISOString(),
      endAt: new Date(form.endAt).toISOString(),
    };
    setSaving(true);
    try {
      if (editingId == null) await adminApi.createPopup(body);
      else await adminApi.updatePopup(editingId, body);
      toast({ title: editingId == null ? "팝업이 등록되었습니다" : "팝업이 수정되었습니다", variant: "success" });
      setOpen(false);
      await load();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "저장에 실패했습니다.";
      toast({ title: "저장 실패", description: message, variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  const onToggle = async (p: Popup) => {
    setActingId(p.id);
    try {
      const updated = await adminApi.setPopupActive(p.id, !p.active);
      setPopups((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "처리에 실패했습니다.";
      toast({ title: "처리 실패", description: message, variant: "error" });
    } finally {
      setActingId(null);
    }
  };

  const columns: TableColumn<Row>[] = [
    {
      key: "imageUrl",
      label: "이미지",
      width: "80px",
      render: (r) => (
        <div className="w-12 h-9 rounded bg-white/5 overflow-hidden flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={r.imageUrl} alt="popup" className="w-full h-full object-cover" />
        </div>
      ),
    },
    { key: "linkUrl", label: "링크", render: (r) => <span className="text-xs text-white/55 break-all">{r.linkUrl ?? "-"}</span> },
    {
      key: "startAt",
      label: "노출 기간",
      width: "200px",
      render: (r) => `${new Date(r.startAt).toLocaleDateString("ko-KR")} ~ ${new Date(r.endAt).toLocaleDateString("ko-KR")}`,
    },
    { key: "active", label: "상태", width: "80px", render: (r) => <Badge variant={r.active ? "success" : "default"} size="sm">{r.active ? "노출" : "숨김"}</Badge> },
    {
      key: "actions",
      label: "관리",
      width: "150px",
      render: (r) => (
        <div className="flex items-center gap-1.5">
          <Button size="sm" variant="outline" disabled={actingId === r.id} onClick={() => onToggle(r)}>
            {r.active ? "숨김" : "노출"}
          </Button>
          <button type="button" onClick={() => openEdit(r)} className="p-1.5 rounded-md text-white/50 hover:text-white hover:bg-white/5">
            <Pencil size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">팝업 / 배너 관리</h1>
          <p className="mt-1.5 text-sm text-white/50">메인 페이지 팝업 이미지와 노출 기간을 관리합니다.</p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={openCreate} disabled={loading}>팝업 등록</Button>
      </div>

      <Card padding="none">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-white/40"><Loader2 className="animate-spin" size={22} /></div>
        ) : popups.length === 0 ? (
          <EmptyState icon={ImageIcon} title="등록된 팝업이 없습니다" />
        ) : (
          <Table columns={columns} data={popups} />
        )}
      </Card>

      <Modal
        isOpen={open}
        onClose={() => !saving && setOpen(false)}
        title={editingId == null ? "팝업 등록" : "팝업 수정"}
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
          <Input label="이미지 URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
          <Input label="링크 URL (선택)" value={form.linkUrl ?? ""} onChange={(e) => setForm({ ...form, linkUrl: e.target.value || null })} placeholder="클릭 시 이동할 주소" />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="노출 시작" type="datetime-local" value={form.startAt} onChange={(e) => setForm({ ...form, startAt: e.target.value })} />
            <Input label="노출 종료" type="datetime-local" value={form.endAt} onChange={(e) => setForm({ ...form, endAt: e.target.value })} />
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
            <span className="text-xs text-white/60">노출</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
