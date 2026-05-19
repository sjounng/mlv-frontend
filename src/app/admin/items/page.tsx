"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  Input,
  Modal,
  Select,
  Tabs,
  Table,
  Textarea,
  useToast,
  type TableColumn,
} from "@/components/ui";
import ItemIcon from "@/components/minecraft/ItemIcon";

interface ItemRow extends Record<string, unknown> {
  id: string;
  emoji: string;
  emojiColor: string;
  name: string;
  category: string;
  price: number;
  status: "판매중" | "비공개" | "품절";
  mailCode: string;
}

const initialItems: ItemRow[] = [
  { id: "starter", emoji: "⚔️", emojiColor: "bg-slate-700/50", name: "스타터 패키지", category: "패키지", price: 5500, status: "판매중", mailCode: "MAIL_STARTER" },
  { id: "vip-30", emoji: "👑", emojiColor: "bg-yellow-900/40", name: "VIP 등급 [30일]", category: "멤버십", price: 9900, status: "판매중", mailCode: "MAIL_VIP30" },
  { id: "emerald-1000", emoji: "💚", emojiColor: "bg-green-900/40", name: "에메랄드 1,000개", category: "재화", price: 11000, status: "판매중", mailCode: "MAIL_EM1000" },
  { id: "mage-pack", emoji: "🔮", emojiColor: "bg-purple-900/40", name: "마법사 패키지", category: "패키지", price: 8800, status: "비공개", mailCode: "MAIL_MAGE" },
  { id: "random-box", emoji: "🎁", emojiColor: "bg-red-900/40", name: "랜덤 박스", category: "아이템", price: 2200, status: "판매중", mailCode: "MAIL_RANDOM" },
  { id: "exp-booster-1h", emoji: "✨", emojiColor: "bg-lime-900/40", name: "경험치 부스터 [1시간]", category: "유틸리티", price: 1500, status: "품절", mailCode: "MAIL_EXP1H" },
];

const categoryTabs = [
  { id: "all", label: "전체" },
  { id: "패키지", label: "패키지" },
  { id: "멤버십", label: "멤버십" },
  { id: "재화", label: "재화" },
  { id: "유틸리티", label: "유틸리티" },
  { id: "아이템", label: "아이템" },
];

const categoryOptions = [
  { value: "패키지", label: "패키지" },
  { value: "멤버십", label: "멤버십" },
  { value: "재화", label: "재화" },
  { value: "유틸리티", label: "유틸리티" },
  { value: "아이템", label: "아이템" },
];

const mailOptions = [
  { value: "MAIL_STARTER", label: "MAIL_STARTER" },
  { value: "MAIL_VIP30", label: "MAIL_VIP30" },
  { value: "MAIL_EM1000", label: "MAIL_EM1000" },
  { value: "MAIL_MAGE", label: "MAIL_MAGE" },
  { value: "MAIL_RANDOM", label: "MAIL_RANDOM" },
];

export default function AdminItemsPage() {
  const { toast } = useToast();
  const [items] = useState<ItemRow[]>(initialItems);
  const [tab, setTab] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [active, setActive] = useState(true);

  const filtered = tab === "all" ? items : items.filter((i) => i.category === tab);

  const columns: TableColumn<ItemRow>[] = [
    {
      key: "emoji",
      label: "이미지",
      width: "80px",
      render: (r) => <ItemIcon emoji={r.emoji} color={r.emojiColor} size="sm" />,
    },
    { key: "name", label: "상품명" },
    {
      key: "category",
      label: "카테고리",
      width: "120px",
      render: (r) => <Badge variant="default" size="sm">{r.category}</Badge>,
    },
    {
      key: "price",
      label: "가격",
      align: "right",
      width: "120px",
      render: (r) => `${r.price.toLocaleString()}원`,
    },
    {
      key: "status",
      label: "상태",
      width: "100px",
      render: (r) => (
        <Badge
          variant={r.status === "판매중" ? "success" : r.status === "품절" ? "warning" : "default"}
          size="sm"
        >
          {r.status}
        </Badge>
      ),
    },
    {
      key: "mailCode",
      label: "연결 우편",
      width: "150px",
      render: (r) => <code className="text-xs text-white/65">{r.mailCode}</code>,
    },
    {
      key: "actions",
      label: "관리",
      width: "100px",
      render: () => (
        <div className="flex items-center gap-1">
          <button type="button" className="p-1.5 rounded-md text-white/50 hover:text-white hover:bg-white/5">
            <Pencil size={14} />
          </button>
          <button type="button" className="p-1.5 rounded-md text-white/50 hover:text-red-400 hover:bg-red-500/10">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">상점 아이템 관리</h1>
          <p className="mt-1.5 text-sm text-white/50">웹상점에 등록된 상품을 관리합니다.</p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={() => setModalOpen(true)}>
          상품 등록
        </Button>
      </div>

      <Tabs tabs={categoryTabs} activeTab={tab} onChange={setTab} />

      <Card padding="none">
        <Table columns={columns} data={filtered} />
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="상품 등록"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>취소</Button>
            <Button
              onClick={() => {
                toast({ title: "상품이 등록되었습니다", variant: "success" });
                setModalOpen(false);
              }}
            >
              등록하기
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="상품명" placeholder="예: 스타터 패키지" />
          <div className="grid sm:grid-cols-2 gap-4">
            <Select label="카테고리" options={categoryOptions} defaultValue="패키지" />
            <Input label="가격 (원)" type="number" placeholder="5500" />
          </div>
          <Textarea
            label="설명"
            placeholder="서버 생활에 필요한 필수 아이템 묶음입니다."
            rows={3}
          />
          <Select label="연결 우편 템플릿" options={mailOptions} defaultValue="MAIL_STARTER" />
          <div>
            <p className="text-xs font-medium text-white/60 mb-2">판매 상태</p>
            <button
              type="button"
              onClick={() => setActive(!active)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                active ? "bg-emerald-500" : "bg-white/15"
              }`}
              aria-pressed={active}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  active ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className="ml-3 text-xs text-white/60">
              {active ? "판매중으로 게시" : "비공개"}
            </span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
