"use client";

import { useCallback, useEffect, useState } from "react";
import { FolderTree, Loader2, Pencil, Plus } from "lucide-react";
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
import { adminApi, type Category, type CategoryUpsert } from "@/lib/admin-api";
import { ApiError } from "@/lib/api";

type Row = Category & Record<string, unknown>;

const emptyForm: CategoryUpsert = {
  name: "",
  sortOrder: 0,
  active: true,
};

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CategoryUpsert>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setCategories(await adminApi.categories());
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "카테고리를 불러오지 못했습니다.";
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
    const nextSortOrder =
      categories.length === 0 ? 10 : Math.max(...categories.map((category) => category.sortOrder)) + 10;
    setEditingId(null);
    setForm({ ...emptyForm, sortOrder: nextSortOrder });
    setOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditingId(category.id);
    setForm({
      name: category.name,
      sortOrder: category.sortOrder,
      active: category.active,
    });
    setOpen(true);
  };

  const onSave = async () => {
    const body: CategoryUpsert = {
      ...form,
      name: form.name.trim(),
    };
    if (!body.name) {
      toast({ title: "카테고리명을 입력해 주세요", variant: "warning" });
      return;
    }
    setSaving(true);
    try {
      if (editingId == null) {
        await adminApi.createCategory(body);
      } else {
        await adminApi.updateCategory(editingId, body);
      }
      toast({ title: editingId == null ? "카테고리가 등록되었습니다" : "카테고리가 수정되었습니다", variant: "success" });
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
    { key: "name", label: "카테고리명" },
    {
      key: "sortOrder",
      label: "정렬",
      align: "right",
      width: "100px",
      render: (row) => <span className="tabular-nums text-white/70">{row.sortOrder}</span>,
    },
    {
      key: "active",
      label: "상태",
      width: "90px",
      render: (row) => (
        <Badge variant={row.active ? "success" : "default"} size="sm">
          {row.active ? "노출" : "숨김"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "관리",
      width: "80px",
      render: (row) => (
        <button
          type="button"
          onClick={() => openEdit(row)}
          aria-label={`${row.name} 수정`}
          className="focus-ring p-1.5 rounded-md text-white/50 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Pencil size={14} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">상점 카테고리 관리</h1>
          <p className="mt-1.5 text-sm text-white/50">웹상점 상품 분류와 노출 순서를 관리합니다.</p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={openCreate} disabled={loading}>
          카테고리 등록
        </Button>
      </div>

      <Card padding="none">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-white/40">
            <Loader2 className="animate-spin" size={22} />
          </div>
        ) : categories.length === 0 ? (
          <EmptyState icon={FolderTree} title="등록된 카테고리가 없습니다" description="우측 상단에서 카테고리를 등록하세요." />
        ) : (
          <Table columns={columns} data={categories} getRowKey={(row) => row.id} />
        )}
      </Card>

      <Modal
        isOpen={open}
        onClose={() => !saving && setOpen(false)}
        title={editingId == null ? "카테고리 등록" : "카테고리 수정"}
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              취소
            </Button>
            <Button onClick={onSave} disabled={saving} leftIcon={saving ? <Loader2 className="animate-spin" size={15} /> : undefined}>
              {editingId == null ? "등록하기" : "수정하기"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="카테고리명"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="예: 스타터"
          />
          <Input
            label="정렬순서"
            type="number"
            value={form.sortOrder}
            onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) })}
            hint="숫자가 작을수록 상점에서 먼저 표시됩니다."
          />
          <div className="flex items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => setForm({ ...form, active: !form.active })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.active ? "bg-emerald-500" : "bg-white/15"}`}
              aria-pressed={form.active}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.active ? "translate-x-6" : "translate-x-1"}`} />
            </button>
            <span className="text-xs text-white/60">상점에 노출</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
