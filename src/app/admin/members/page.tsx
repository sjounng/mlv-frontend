"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Pagination,
  Select,
  Table,
  useToast,
  type TableColumn,
} from "@/components/ui";
import MinecraftHead from "@/components/minecraft/MinecraftHead";
import { adminApi, type AdminMember, type UserStatus } from "@/lib/admin-api";
import { ApiError } from "@/lib/api";

const statusOptions = [
  { value: "", label: "전체" },
  { value: "ACTIVE", label: "활성" },
  { value: "SUSPENDED", label: "정지" },
  { value: "WITHDRAWN", label: "탈퇴" },
];

const STATUS_LABEL: Record<UserStatus, string> = {
  ACTIVE: "활성",
  SUSPENDED: "정지",
  WITHDRAWN: "탈퇴",
};

const PAGE_SIZE = 20;

type Row = AdminMember & Record<string, unknown>;

export default function AdminMembersPage() {
  const { toast } = useToast();
  const [keyword, setKeyword] = useState("");
  const [submittedKeyword, setSubmittedKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0); // 0-indexed (server)
  const [data, setData] = useState<AdminMember[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.members({ status, keyword: submittedKeyword, page, size: PAGE_SIZE });
      setData(res.content);
      setTotalPages(Math.max(1, res.totalPages));
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "회원을 불러오지 못했습니다.";
      toast({ title: "불러오기 실패", description: message, variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [status, submittedKeyword, page, toast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const onSearch = () => {
    setPage(0);
    setSubmittedKeyword(keyword.trim());
  };

  const onToggleStatus = async (member: AdminMember) => {
    setActingId(member.id);
    try {
      const updated =
        member.status === "SUSPENDED"
          ? await adminApi.activateMember(member.id)
          : await adminApi.suspendMember(member.id);
      setData((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      toast({
        title: updated.status === "SUSPENDED" ? "회원을 정지했습니다" : "정지를 해제했습니다",
        variant: "success",
      });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "처리에 실패했습니다.";
      toast({ title: "처리 실패", description: message, variant: "error" });
    } finally {
      setActingId(null);
    }
  };

  const columns: TableColumn<Row>[] = [
    {
      key: "minecraftUsername",
      label: "회원",
      render: (r) => (
        <div className="flex items-center gap-2.5">
          <MinecraftHead username={r.minecraftUsername} size="sm" />
          <div>
            <p className="font-medium">{r.minecraftUsername}</p>
            <p className="text-xs text-white/35 mt-0.5">{r.email ?? "이메일 미등록"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "minecraftUuid",
      label: "UUID",
      width: "150px",
      render: (r) => (
        <code className="text-xs text-white/55">{r.minecraftUuid.slice(0, 8)}…{r.minecraftUuid.slice(-4)}</code>
      ),
    },
    {
      key: "createdAt",
      label: "가입일",
      width: "120px",
      render: (r) => new Date(r.createdAt).toLocaleDateString("ko-KR"),
    },
    {
      key: "status",
      label: "상태",
      width: "90px",
      render: (r) => (
        <Badge variant={r.status === "ACTIVE" ? "success" : r.status === "SUSPENDED" ? "error" : "default"} size="sm">
          {STATUS_LABEL[r.status]}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "관리",
      width: "120px",
      render: (r) =>
        r.status === "WITHDRAWN" ? (
          <span className="text-xs text-white/30">-</span>
        ) : (
          <Button
            size="sm"
            variant="outline"
            disabled={actingId === r.id}
            onClick={() => onToggleStatus(r)}
            leftIcon={actingId === r.id ? <Loader2 className="animate-spin" size={13} /> : undefined}
          >
            {r.status === "SUSPENDED" ? "정지 해제" : "정지하기"}
          </Button>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">회원 관리</h1>
        <p className="mt-1.5 text-sm text-white/50">회원을 검색하고 제재(정지/해제)를 관리합니다.</p>
      </div>

      <Card padding="md">
        <div className="grid sm:grid-cols-[1fr_180px_auto] gap-3">
          <Input
            placeholder="닉네임 또는 UUID로 검색"
            leftIcon={<Search size={14} />}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
          />
          <Select
            options={statusOptions}
            value={status}
            onChange={(e) => {
              setPage(0);
              setStatus(e.target.value);
            }}
          />
          <Button onClick={onSearch}>검색</Button>
        </div>
      </Card>

      <Card padding="none">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-white/40">
            <Loader2 className="animate-spin" size={22} />
          </div>
        ) : data.length === 0 ? (
          <EmptyState icon={Search} title="조건에 맞는 회원이 없습니다" />
        ) : (
          <Table columns={columns} data={data} />
        )}
      </Card>

      {totalPages > 1 && (
        <Pagination
          currentPage={page + 1}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p - 1)}
        />
      )}
    </div>
  );
}
