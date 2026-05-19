"use client";

import { useState } from "react";
import { Pencil, Plus, RefreshCcw, Trash2, X } from "lucide-react";
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
import MinecraftHead from "@/components/minecraft/MinecraftHead";

interface TemplateRow extends Record<string, unknown> {
  code: string;
  title: string;
  items: number;
}
interface HistoryRow extends Record<string, unknown> {
  id: string;
  player: string;
  title: string;
  source: "구매" | "이벤트" | "리딤코드" | "관리자";
  status: "pending" | "sent" | "failed";
  requestedAt: string;
}
interface CodeRow extends Record<string, unknown> {
  code: string;
  mail: string;
  maxUses: number;
  uses: number;
  expiresAt: string;
  status: "활성" | "만료";
}

const templates: TemplateRow[] = [
  { code: "MAIL_STARTER", title: "스타터 패키지 보상", items: 4 },
  { code: "MAIL_VIP30", title: "VIP 30일 등급 부여", items: 1 },
  { code: "MAIL_EM1000", title: "에메랄드 1,000개", items: 1 },
  { code: "MAIL_RANDOM", title: "랜덤 박스", items: 1 },
  { code: "MAIL_EVENT_MAY", title: "5월 시즌 시작 보상", items: 3 },
];

const histories: HistoryRow[] = [
  { id: "SEND-002012", player: "Steve_KR", title: "비행권 [7일] 보상", source: "구매", status: "sent", requestedAt: "2026-05-19 14:33" },
  { id: "SEND-002011", player: "Alex_Lee", title: "VIP 30일 등급 부여", source: "구매", status: "sent", requestedAt: "2026-05-19 14:21" },
  { id: "SEND-002010", player: "Notch_Fan", title: "5월 시즌 시작 보상", source: "리딤코드", status: "pending", requestedAt: "2026-05-19 14:18" },
  { id: "SEND-002009", player: "MagicGirl", title: "출석 14일차 보상", source: "이벤트", status: "failed", requestedAt: "2026-05-19 14:05" },
  { id: "SEND-002008", player: "PvP_Pro", title: "랜덤 박스 × 3", source: "구매", status: "sent", requestedAt: "2026-05-19 13:51" },
];

const codes: CodeRow[] = [
  { code: "MAY-SEASON-2026", mail: "MAIL_EVENT_MAY", maxUses: 1000, uses: 412, expiresAt: "2026-05-31", status: "활성" },
  { code: "WELCOME-NEW", mail: "MAIL_STARTER", maxUses: 5000, uses: 1893, expiresAt: "2026-12-31", status: "활성" },
  { code: "APRIL-EVENT", mail: "MAIL_RANDOM", maxUses: 500, uses: 500, expiresAt: "2026-04-30", status: "만료" },
];

const mailOptions = [
  { value: "MAIL_STARTER", label: "MAIL_STARTER" },
  { value: "MAIL_VIP30", label: "MAIL_VIP30" },
  { value: "MAIL_RANDOM", label: "MAIL_RANDOM" },
  { value: "MAIL_EVENT_MAY", label: "MAIL_EVENT_MAY" },
];

const tabs = [
  { id: "templates", label: "우편 템플릿" },
  { id: "history", label: "발송 이력" },
  { id: "codes", label: "리딤코드" },
];

export default function AdminMailPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState("templates");
  const [tplModal, setTplModal] = useState(false);
  const [codeModal, setCodeModal] = useState(false);
  const [tplItems, setTplItems] = useState<{ id: string; qty: number }[]>([
    { id: "diamond", qty: 10 },
  ]);

  const templateColumns: TableColumn<TemplateRow>[] = [
    {
      key: "code",
      label: "우편 코드",
      width: "200px",
      render: (r) => <code className="text-xs text-white/80">{r.code}</code>,
    },
    { key: "title", label: "제목" },
    {
      key: "items",
      label: "보상 아이템 수",
      width: "150px",
      align: "right",
      render: (r) => `${r.items}개`,
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

  const historyColumns: TableColumn<HistoryRow>[] = [
    { key: "id", label: "발송 ID", width: "150px" },
    {
      key: "player",
      label: "수신 플레이어",
      render: (r) => (
        <div className="flex items-center gap-2">
          <MinecraftHead username={r.player} size="sm" />
          <span>{r.player}</span>
        </div>
      ),
    },
    { key: "title", label: "우편 제목" },
    {
      key: "source",
      label: "출처",
      width: "110px",
      render: (r) => <Badge variant="default" size="sm">{r.source}</Badge>,
    },
    {
      key: "status",
      label: "상태",
      width: "100px",
      render: (r) => {
        const variant = r.status === "sent" ? "success" : r.status === "pending" ? "info" : "error";
        return <Badge variant={variant} size="sm">{r.status}</Badge>;
      },
    },
    { key: "requestedAt", label: "발송 요청", width: "160px" },
    {
      key: "retry",
      label: "재시도",
      width: "100px",
      render: (r) =>
        r.status === "failed" ? (
          <Button
            size="sm"
            variant="outline"
            leftIcon={<RefreshCcw size={12} />}
            onClick={() => toast({ title: "재시도 요청을 전송했어요", variant: "default" })}
          >
            재시도
          </Button>
        ) : null,
    },
  ];

  const codeColumns: TableColumn<CodeRow>[] = [
    {
      key: "code",
      label: "코드",
      render: (r) => <code className="text-xs text-white/85">{r.code}</code>,
    },
    {
      key: "mail",
      label: "연결 우편",
      render: (r) => <code className="text-xs text-white/65">{r.mail}</code>,
    },
    {
      key: "uses",
      label: "사용 수",
      align: "right",
      render: (r) => `${r.uses.toLocaleString()} / ${r.maxUses.toLocaleString()}`,
    },
    { key: "expiresAt", label: "만료일", width: "120px" },
    {
      key: "status",
      label: "상태",
      width: "100px",
      render: (r) => (
        <Badge variant={r.status === "활성" ? "success" : "default"} size="sm">
          {r.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">우편 관리</h1>
          <p className="mt-1.5 text-sm text-white/50">우편 템플릿, 발송 이력, 리딤코드를 관리합니다.</p>
        </div>
        {tab === "templates" && (
          <Button leftIcon={<Plus size={16} />} onClick={() => setTplModal(true)}>
            템플릿 추가
          </Button>
        )}
        {tab === "codes" && (
          <Button leftIcon={<Plus size={16} />} onClick={() => setCodeModal(true)}>
            코드 생성
          </Button>
        )}
      </div>

      <Tabs tabs={tabs} activeTab={tab} onChange={setTab} />

      {tab === "templates" && (
        <Card padding="none">
          <Table columns={templateColumns} data={templates} />
        </Card>
      )}
      {tab === "history" && (
        <Card padding="none">
          <Table columns={historyColumns} data={histories} />
        </Card>
      )}
      {tab === "codes" && (
        <Card padding="none">
          <Table columns={codeColumns} data={codes} />
        </Card>
      )}

      {/* Template Modal */}
      <Modal
        isOpen={tplModal}
        onClose={() => setTplModal(false)}
        title="우편 템플릿 추가"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setTplModal(false)}>취소</Button>
            <Button
              onClick={() => {
                toast({ title: "템플릿이 저장되었습니다", variant: "success" });
                setTplModal(false);
              }}
            >
              저장
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="우편 코드" placeholder="MAIL_EXAMPLE" />
          <Input label="제목" placeholder="예: 5월 시즌 시작 보상" />
          <Textarea
            label="본문"
            placeholder="플레이어에게 표시될 우편 본문입니다."
            rows={4}
          />

          <div>
            <p className="text-xs font-medium text-white/60 mb-2">아이템 목록</p>
            <div className="space-y-2">
              {tplItems.map((it, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    containerClassName="flex-1"
                    placeholder="아이템 ID (예: minecraft:diamond)"
                    value={it.id}
                    onChange={(e) => {
                      const next = [...tplItems];
                      next[idx] = { ...next[idx], id: e.target.value };
                      setTplItems(next);
                    }}
                  />
                  <Input
                    containerClassName="w-24"
                    type="number"
                    placeholder="수량"
                    value={it.qty}
                    onChange={(e) => {
                      const next = [...tplItems];
                      next[idx] = { ...next[idx], qty: Number(e.target.value) || 0 };
                      setTplItems(next);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setTplItems(tplItems.filter((_, i) => i !== idx))}
                    className="p-2 text-white/40 hover:text-red-400 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <Button
              size="sm"
              variant="outline"
              className="mt-2"
              leftIcon={<Plus size={13} />}
              onClick={() => setTplItems([...tplItems, { id: "", qty: 1 }])}
            >
              아이템 추가
            </Button>
          </div>
        </div>
      </Modal>

      {/* Redeem Code Modal */}
      <Modal
        isOpen={codeModal}
        onClose={() => setCodeModal(false)}
        title="리딤코드 생성"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setCodeModal(false)}>취소</Button>
            <Button
              onClick={() => {
                toast({ title: "리딤코드가 생성되었어요", variant: "success" });
                setCodeModal(false);
              }}
            >
              생성
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="코드 이름" placeholder="MAY-SEASON-2026" />
          <Select label="연결 우편" options={mailOptions} defaultValue="MAIL_STARTER" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="최대 사용 수" type="number" defaultValue={100} />
            <Input label="만료일" type="date" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
