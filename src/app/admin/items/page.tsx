"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Pencil, Plus } from "lucide-react";
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
import {
  adminApi,
  uploadImage,
  type AdminProduct,
  type Category,
  type MailTemplate,
  type ProductUpsert,
} from "@/lib/admin-api";
import { ApiError } from "@/lib/api";
import { ImagePlus, X } from "lucide-react";

type Row = AdminProduct & Record<string, unknown>;

const emptyForm: ProductUpsert = {
  name: "",
  description: "",
  price: 0,
  imageUrl: null,
  categoryId: 0,
  mailTemplateId: 0,
  active: true,
  stockQuantity: null,
  recommended: false,
  newBadge: false,
};

export default function AdminItemsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [templates, setTemplates] = useState<MailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductUpsert>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const onPickImage = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      setForm((f) => ({ ...f, imageUrl: url }));
      toast({ title: "이미지를 업로드했습니다", variant: "success" });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "업로드에 실패했습니다.";
      toast({ title: "업로드 실패", description: message, variant: "error" });
    } finally {
      setUploading(false);
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, c, t] = await Promise.all([
        adminApi.products(),
        adminApi.categories(),
        adminApi.mailTemplates(),
      ]);
      setProducts(p);
      setCategories(c);
      setTemplates(t);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "상품을 불러오지 못했습니다.";
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
    setForm({
      ...emptyForm,
      categoryId: categories[0]?.id ?? 0,
      mailTemplateId: templates[0]?.id ?? 0,
    });
    setModalOpen(true);
  };

  const openEdit = (p: AdminProduct) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      imageUrl: p.imageUrl,
      categoryId: p.category.id,
      mailTemplateId: p.mailTemplateId,
      active: p.active,
      stockQuantity: p.stockQuantity,
      recommended: p.recommended,
      newBadge: p.newBadge,
    });
    setModalOpen(true);
  };

  const onSave = async () => {
    if (!form.name.trim() || form.price <= 0 || !form.categoryId || !form.mailTemplateId) {
      toast({ title: "필수 항목을 확인해 주세요", description: "상품명·가격·카테고리·우편 템플릿은 필수입니다.", variant: "warning" });
      return;
    }
    setSaving(true);
    try {
      if (editingId == null) {
        await adminApi.createProduct(form);
        toast({ title: "상품이 등록되었습니다", variant: "success" });
      } else {
        await adminApi.updateProduct(editingId, form);
        toast({ title: "상품이 수정되었습니다", variant: "success" });
      }
      setModalOpen(false);
      await load();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "저장에 실패했습니다.";
      toast({ title: "저장 실패", description: message, variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  const columns: TableColumn<Row>[] = [
    { key: "name", label: "상품명" },
    {
      key: "category",
      label: "카테고리",
      width: "120px",
      render: (r) => <Badge variant="default" size="sm">{r.category.name}</Badge>,
    },
    { key: "price", label: "가격", align: "right", width: "110px", render: (r) => <span className="text-amber-300 tabular-nums">{r.price.toLocaleString()} C</span> },
    {
      key: "stockQuantity",
      label: "재고",
      align: "right",
      width: "80px",
      render: (r) => (r.stockQuantity == null ? "무제한" : r.stockQuantity.toLocaleString()),
    },
    {
      key: "active",
      label: "상태",
      width: "90px",
      render: (r) => (
        <Badge variant={r.active ? "success" : "default"} size="sm">{r.active ? "판매중" : "비공개"}</Badge>
      ),
    },
    {
      key: "actions",
      label: "관리",
      width: "80px",
      render: (r) => (
        <button type="button" onClick={() => openEdit(r)} aria-label={`${r.name} 수정`} className="focus-ring p-1.5 rounded-md text-white/50 hover:text-white hover:bg-white/5 transition-colors">
          <Pencil size={14} />
        </button>
      ),
    },
  ];

  const categoryOptions = categories.map((c) => ({ value: String(c.id), label: c.name }));
  const templateOptions = templates.map((t) => ({ value: String(t.id), label: `${t.mailCode} — ${t.subject}` }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">상점 아이템 관리</h1>
          <p className="mt-1.5 text-sm text-white/50">웹상점 상품을 등록·수정합니다.</p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={openCreate} disabled={loading}>상품 등록</Button>
      </div>

      <Card padding="none">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-white/40"><Loader2 className="animate-spin" size={22} /></div>
        ) : products.length === 0 ? (
          <EmptyState icon={Plus} title="등록된 상품이 없습니다" description="우측 상단에서 상품을 등록하세요." />
        ) : (
          <Table columns={columns} data={products} />
        )}
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => !saving && setModalOpen(false)}
        title={editingId == null ? "상품 등록" : "상품 수정"}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>취소</Button>
            <Button onClick={onSave} disabled={saving} leftIcon={saving ? <Loader2 className="animate-spin" size={15} /> : undefined}>
              {editingId == null ? "등록하기" : "수정하기"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="상품명" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="예: 스타터 패키지" />
          <Textarea label="설명" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="가격 (캐시 C)" type="number" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            <Input
              label="재고 (비우면 무제한)"
              type="number"
              value={form.stockQuantity ?? ""}
              onChange={(e) => setForm({ ...form, stockQuantity: e.target.value === "" ? null : Number(e.target.value) })}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Select label="카테고리" options={categoryOptions} value={String(form.categoryId)} onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })} />
            <Select label="연결 우편 템플릿" options={templateOptions} value={String(form.mailTemplateId)} onChange={(e) => setForm({ ...form, mailTemplateId: Number(e.target.value) })} />
          </div>
          <div>
            <p className="text-xs font-medium text-white/60 mb-2">상품 이미지</p>
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                {form.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.imageUrl} alt="미리보기" className="w-full h-full object-cover" />
                ) : (
                  <ImagePlus size={22} className="text-white/25" />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-white/15 rounded-md cursor-pointer hover:bg-white/5 transition-colors w-fit">
                  {uploading ? <Loader2 className="animate-spin" size={14} /> : <ImagePlus size={14} />}
                  {form.imageUrl ? "이미지 변경" : "이미지 업로드"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/gif,image/webp"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => onPickImage(e.target.files?.[0])}
                  />
                </label>
                {form.imageUrl && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, imageUrl: null })}
                    className="inline-flex items-center gap-1 text-xs text-white/40 hover:text-red-400 w-fit"
                  >
                    <X size={12} /> 이미지 제거
                  </button>
                )}
                <p className="text-[11px] text-white/30">PNG·JPG·GIF·WEBP, 최대 5MB</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-5 pt-1">
            <Toggle label="판매중" checked={form.active} onChange={(v) => setForm({ ...form, active: v })} />
            <Toggle label="추천" checked={form.recommended} onChange={(v) => setForm({ ...form, recommended: v })} />
            <Toggle label="신규" checked={form.newBadge} onChange={(v) => setForm({ ...form, newBadge: v })} />
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? "bg-emerald-500" : "bg-white/15"}`}
        aria-pressed={checked}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
      </button>
      <span className="text-xs text-white/60">{label}</span>
    </div>
  );
}
