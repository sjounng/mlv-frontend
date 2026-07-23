"use client";

// 캐시 충전 상품 관리 (07-22 웹상점 개편)
//  - 상품 CRUD(이름/결제금액 KRW/지급 캐시/아이콘/정렬/노출)
//  - 모든 캐시 상품 페이지에 공통 표시되는 상세 소개 본문 편집
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Coins, Loader2, Pencil, Plus, Trash2, ImagePlus, X, Save } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Modal,
  Table,
  Textarea,
  useToast,
  type TableColumn,
} from "@/components/ui";
import {
  adminApi,
  uploadImage,
  type AdminCashProduct,
  type CashProductUpsert,
} from "@/lib/admin-api";
import { ApiError } from "@/lib/api";

type Row = AdminCashProduct & Record<string, unknown>;

const emptyForm: CashProductUpsert = {
  name: "",
  priceKrw: 0,
  cashAmount: 0,
  iconUrl: null,
  sortOrder: 0,
  active: true,
};

export default function AdminCashProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<AdminCashProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CashProductUpsert>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const iconRef = useRef<HTMLInputElement>(null);

  // 공통 상세 소개
  const [description, setDescription] = useState("");
  const [descDirty, setDescDirty] = useState(false);
  const [savingDesc, setSavingDesc] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [list, desc] = await Promise.all([
        adminApi.cashProducts(),
        adminApi.cashProductDescription().catch(() => ({ description: "" })),
      ]);
      setProducts(list);
      setDescription(desc.description);
      setDescDirty(false);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "불러오지 못했습니다.";
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
    setForm({ ...emptyForm, sortOrder: products.length });
    setOpen(true);
  };

  const openEdit = (p: AdminCashProduct) => {
    setEditingId(p.id);
    setForm({ name: p.name, priceKrw: p.priceKrw, cashAmount: p.cashAmount, iconUrl: p.iconUrl, sortOrder: p.sortOrder, active: p.active });
    setOpen(true);
  };

  const onPickIcon = async (file: File) => {
    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      setForm((f) => ({ ...f, iconUrl: url }));
    } catch {
      toast({ title: "아이콘 업로드 실패", variant: "error" });
    } finally {
      setUploading(false);
    }
  };

  const onSave = async () => {
    if (!form.name.trim() || form.priceKrw <= 0 || form.cashAmount <= 0) {
      toast({ title: "이름·결제 금액·지급 캐시를 확인해 주세요", variant: "warning" });
      return;
    }
    setSaving(true);
    try {
      if (editingId == null) await adminApi.createCashProduct(form);
      else await adminApi.updateCashProduct(editingId, form);
      toast({ title: editingId == null ? "상품이 등록되었습니다" : "상품이 수정되었습니다", variant: "success" });
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
    if (!window.confirm("이 충전 상품을 삭제할까요?")) return;
    setDeleting(true);
    try {
      await adminApi.deleteCashProduct(editingId);
      toast({ title: "상품을 삭제했습니다", variant: "success" });
      setOpen(false);
      await load();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "삭제에 실패했습니다.";
      toast({ title: "삭제 실패", description: message, variant: "error" });
    } finally {
      setDeleting(false);
    }
  };

  const onSaveDesc = async () => {
    setSavingDesc(true);
    try {
      await adminApi.setCashProductDescription(description);
      setDescDirty(false);
      toast({ title: "공통 상세 소개를 저장했습니다", variant: "success" });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "저장에 실패했습니다.";
      toast({ title: "저장 실패", description: message, variant: "error" });
    } finally {
      setSavingDesc(false);
    }
  };

  const columns: TableColumn<Row>[] = [
    { key: "sortOrder", label: "순서", width: "60px", render: (r) => <span className="text-white/50 tabular-nums">{r.sortOrder}</span> },
    { key: "name", label: "상품명" },
    { key: "priceKrw", label: "결제 금액", align: "right", width: "120px", render: (r) => `${r.priceKrw.toLocaleString()}원` },
    { key: "cashAmount", label: "지급 캐시", align: "right", width: "120px", render: (r) => `${r.cashAmount.toLocaleString()} C` },
    { key: "active", label: "노출", width: "80px", render: (r) => <Badge variant={r.active ? "success" : "default"} size="sm">{r.active ? "노출" : "숨김"}</Badge> },
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">캐시 충전 상품</h1>
          <p className="mt-1.5 text-sm text-white/50">원화로 결제해 캐시를 충전하는 상품(패키지)을 관리합니다.</p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={openCreate} disabled={loading}>상품 등록</Button>
      </div>

      <Card padding="none">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-white/40"><Loader2 className="animate-spin" size={22} /></div>
        ) : products.length === 0 ? (
          <EmptyState icon={Coins} title="등록된 충전 상품이 없습니다" />
        ) : (
          <Table columns={columns} data={products} />
        )}
      </Card>

      {/* 공통 상세 소개 */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-semibold">공통 상세 소개</h2>
            <p className="text-xs text-white/45 mt-0.5">모든 캐시 충전 상품 페이지 하단에 동일하게 표시됩니다.</p>
          </div>
          <Button size="sm" onClick={onSaveDesc} disabled={savingDesc || !descDirty} leftIcon={savingDesc ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}>
            저장
          </Button>
        </div>
        <Textarea
          rows={6}
          value={description}
          onChange={(e) => { setDescription(e.target.value); setDescDirty(true); }}
          placeholder="예) 웹상점에서 구매 가능한 캐시 상품입니다. 구매 시 인게임 계정으로 캐시가 지급됩니다."
        />
      </Card>

      <Modal
        isOpen={open}
        onClose={() => !saving && !deleting && setOpen(false)}
        title={editingId == null ? "충전 상품 등록" : "충전 상품 수정"}
        size="md"
        footer={
          <div className="flex items-center justify-between w-full">
            {editingId != null ? (
              <Button variant="ghost" onClick={onDelete} disabled={saving || deleting} leftIcon={deleting ? <Loader2 className="animate-spin" size={15} /> : <Trash2 size={15} />} className="text-red-300 hover:text-red-200">삭제</Button>
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
          <Input label="상품명" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="예) 프리즘 990" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="결제 금액 (원)" type="number" value={form.priceKrw || ""} onChange={(e) => setForm({ ...form, priceKrw: Number(e.target.value) })} />
            <Input label="지급 캐시" type="number" value={form.cashAmount || ""} onChange={(e) => setForm({ ...form, cashAmount: Number(e.target.value) })} />
          </div>
          <Input label="정렬 순서 (작을수록 앞)" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />

          <div>
            <p className="text-xs font-medium text-white/60 mb-1.5">상품 아이콘</p>
            <div className="flex items-center gap-3">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/10 bg-surface-3 shrink-0">
                {form.iconUrl ? (
                  <Image src={form.iconUrl} alt="아이콘 미리보기" fill sizes="80px" className="object-contain p-1.5" unoptimized />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white/25"><ImagePlus size={18} /></div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" onClick={() => iconRef.current?.click()} disabled={uploading} leftIcon={uploading ? <Loader2 className="animate-spin" size={14} /> : <ImagePlus size={14} />}>
                  {form.iconUrl ? "아이콘 변경" : "아이콘 업로드"}
                </Button>
                {form.iconUrl && (
                  <Button variant="ghost" size="sm" onClick={() => setForm({ ...form, iconUrl: null })} leftIcon={<X size={14} />} className="text-white/50">제거</Button>
                )}
              </div>
            </div>
            <input ref={iconRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void onPickIcon(f); e.target.value = ""; }} />
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
