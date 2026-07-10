"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Search, ShieldAlert } from "lucide-react";
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
import {
  adminApi,
  type AdminMember,
  type AdminMe,
  type MaliciousMember,
  type UserStatus,
} from "@/lib/admin-api";
import { ApiError } from "@/lib/api";
import MemberDetailModal from "./MemberDetailModal";

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

const REASON_LABEL: Record<string, string> = {
  MISCONDUCT: "비매너",
  BUG_ABUSE: "버그악용",
  CUSTOM: "직접작성",
};

const PAGE_SIZE = 20;

type Row = AdminMember & Record<string, unknown>;

function WarningBadge({ count }: { count: number }) {
  const c = count ?? 0;
  if (c <= 0) return <span className="text-xs text-white/30">0</span>;
  return (
    <Badge variant={c >= 3 ? "error" : "warning"} size="sm">
      {c}회{c >= 3 ? " · 악성" : ""}
    </Badge>
  );
}

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

  const [maliciousView, setMaliciousView] = useState(false);
  const [malicious, setMalicious] = useState<MaliciousMember[]>([]);
  const [maliciousLoading, setMaliciousLoading] = useState(false);

  const [detailId, setDetailId] = useState<number | null>(null);
  const [me, setMe] = useState<AdminMe | null>(null);

  useEffect(() => {
    // 현재 로그인한 관리자 role (권한 관리 UI 노출 판단). 어드민 페이지는 유저 프로필을 로드하지 않으므로 별도 조회.
    void adminApi.me().then(setMe).catch(() => {});
  }, []);

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

  const loadMalicious = useCallback(async () => {
    setMaliciousLoading(true);
    try {
      setMalicious(await adminApi.maliciousMembers());
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "악성 유저를 불러오지 못했습니다.";
      toast({ title: "불러오기 실패", description: message, variant: "error" });
    } finally {
      setMaliciousLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!maliciousView) void load();
  }, [load, maliciousView]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (maliciousView) void loadMalicious();
  }, [maliciousView, loadMalicious]);

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
      setData((prev) => prev.map((m) => (m.id === updated.id ? { ...m, status: updated.status } : m)));
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

  // 경고 부여/취소 후 목록의 경고 수 동기화
  const onWarningChanged = (id: number, warningCount: number) => {
    setData((prev) => prev.map((m) => (m.id === id ? { ...m, warningCount } : m)));
    if (maliciousView) void loadMalicious();
  };

  const columns: TableColumn<Row>[] = [
    {
      key: "minecraftUsername",
      label: "회원",
      render: (r) => (
        <div className="flex items-center gap-2.5">
          <MinecraftHead username={r.minecraftUsername} uuid={r.minecraftUuid} size="sm" />
          <div>
            <p className="font-medium">{r.minecraftUsername}</p>
            <p className="text-xs text-white/35 mt-0.5">{r.email ?? "이메일 미등록"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "warningCount",
      label: "경고",
      width: "90px",
      render: (r) => <WarningBadge count={r.warningCount} />,
    },
    {
      key: "createdAt",
      label: "가입일",
      width: "110px",
      render: (r) => new Date(r.createdAt).toLocaleDateString("ko-KR"),
    },
    {
      key: "status",
      label: "상태",
      width: "80px",
      render: (r) => (
        <Badge variant={r.status === "ACTIVE" ? "success" : r.status === "SUSPENDED" ? "error" : "default"} size="sm">
          {STATUS_LABEL[r.status]}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "관리",
      width: "190px",
      render: (r) => (
        <div className="flex items-center gap-1.5 flex-nowrap">
          <Button size="sm" variant="outline" onClick={() => setDetailId(r.id)}>
            상세·경고
          </Button>
          {r.status !== "WITHDRAWN" && (
            <Button
              size="sm"
              variant="ghost"
              disabled={actingId === r.id}
              onClick={() => onToggleStatus(r)}
              leftIcon={actingId === r.id ? <Loader2 className="animate-spin" size={13} /> : undefined}
            >
              {r.status === "SUSPENDED" ? "해제" : "정지"}
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">회원 관리</h1>
          <p className="mt-1.5 text-sm text-white/50">회원 검색·제재, 경고 부여/취소 및 악성 유저를 관리합니다.</p>
        </div>
        <Button
          variant={maliciousView ? "solid" : "outline"}
          leftIcon={<ShieldAlert size={15} />}
          onClick={() => setMaliciousView((v) => !v)}
        >
          {maliciousView ? "전체 회원 보기" : "악성 유저 보기"}
        </Button>
      </div>

      {maliciousView ? (
        <Card padding="none">
          {maliciousLoading ? (
            <div className="flex items-center justify-center py-12 text-white/40"><Loader2 className="animate-spin" size={22} /></div>
          ) : malicious.length === 0 ? (
            <EmptyState icon={ShieldAlert} title="악성 유저가 없습니다" description="경고 3회 이상 누적된 회원이 없습니다." />
          ) : (
            <ul className="divide-y divide-white/6">
              {malicious.map((m) => (
                <li key={m.id} className="p-4 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <MinecraftHead username={m.minecraftUsername} uuid={m.minecraftUuid} size="sm" />
                      <span className="font-medium">{m.minecraftUsername}</span>
                      <Badge variant="error" size="sm">경고 {m.warningCount}회</Badge>
                    </div>
                    <p className="mt-1.5 text-xs text-white/45">
                      사유: {m.warnings.map((w) => REASON_LABEL[w.reason] ?? w.reason).join(", ") || "-"}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setDetailId(m.id)}>상세·경고</Button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      ) : (
        <>
          <Card padding="md">
            <div className="grid sm:grid-cols-[1fr_180px_auto] gap-3">
              <Input
                placeholder="닉네임 · UUID · 이메일로 검색"
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
        </>
      )}

      {detailId != null && (
        <MemberDetailModal
          memberId={detailId}
          viewerRole={me?.role}
          viewerMemberId={me?.memberId ?? null}
          onClose={() => setDetailId(null)}
          onChanged={onWarningChanged}
        />
      )}
    </div>
  );
}
