"use client";

// 회원 통합 조회 + 경고 부여/취소 모달 (07-09 피드백)
import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Ban, Loader2, ShieldCheck } from "lucide-react";
import {
  Badge,
  Button,
  Select,
  Textarea,
  Input,
  useToast,
} from "@/components/ui";
import {
  adminApi,
  type AdminMemberDetail,
  type Role,
  type WarningReason,
} from "@/lib/admin-api";
import { ApiError } from "@/lib/api";

// 대시보드에서는 USER ↔ OPERATOR 만 관리 (SUPER_ADMIN 은 DB 로만 지정)
const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: "USER", label: "USER · 일반 유저" },
  { value: "OPERATOR", label: "OPERATOR · 운영자" },
];
const ROLE_LABEL: Record<Role, string> = {
  USER: "일반 유저",
  OPERATOR: "운영자",
  SUPER_ADMIN: "최고 관리자",
};

const REASON_OPTIONS: { value: WarningReason; label: string }[] = [
  { value: "MISCONDUCT", label: "비매너 행위" },
  { value: "BUG_ABUSE", label: "버그악용" },
  { value: "CUSTOM", label: "직접 작성" },
];
const REASON_LABEL: Record<WarningReason, string> = {
  MISCONDUCT: "비매너 행위",
  BUG_ABUSE: "버그악용",
  CUSTOM: "직접 작성",
};

const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;

export default function MemberDetailModal({
  memberId,
  viewerRole,
  viewerMemberId,
  onClose,
  onChanged,
}: {
  memberId: number | null;
  /** 현재 로그인한 관리자의 role (권한 관리 UI 노출 판단) */
  viewerRole?: Role;
  /** 현재 관리자의 memberId (본인 여부 판별). 부트스트랩 관리자면 null */
  viewerMemberId?: number | null;
  onClose: () => void;
  onChanged: (id: number, warningCount: number) => void;
}) {
  const { toast } = useToast();
  const isSuperAdmin = viewerRole === "SUPER_ADMIN";

  const [detail, setDetail] = useState<AdminMemberDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const [roleValue, setRoleValue] = useState<Role>("USER");
  const [savingRole, setSavingRole] = useState(false);

  const [reason, setReason] = useState<WarningReason>("MISCONDUCT");
  const [detailText, setDetailText] = useState("");
  const [customText, setCustomText] = useState("");
  const [granting, setGranting] = useState(false);
  const [cancelingId, setCancelingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    if (memberId == null) return;
    setLoading(true);
    try {
      const d = await adminApi.memberDetail(memberId);
      setDetail(d);
      setRoleValue(d.role);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "회원 정보를 불러오지 못했습니다.";
      toast({ title: "불러오기 실패", description: message, variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [memberId, toast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (memberId != null) void load();
  }, [memberId, load]);

  const onGrant = async () => {
    if (memberId == null) return;
    if (!detailText.trim()) {
      toast({ title: "사건경위(사유)를 입력해 주세요", variant: "warning" });
      return;
    }
    if (reason === "CUSTOM" && !customText.trim()) {
      toast({ title: "직접 작성 안내 문구를 입력해 주세요", variant: "warning" });
      return;
    }
    setGranting(true);
    try {
      await adminApi.grantWarning(memberId, {
        reason,
        detail: detailText.trim(),
        customText: reason === "CUSTOM" ? customText.trim() : null,
      });
      toast({ title: "경고를 부여했습니다", description: "유저에게 안내 메일이 발송되었습니다.", variant: "success" });
      setDetailText("");
      setCustomText("");
      const updated = await adminApi.memberDetail(memberId);
      setDetail(updated);
      onChanged(memberId, updated.warningCount);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "경고 부여에 실패했습니다.";
      toast({ title: "부여 실패", description: message, variant: "error" });
    } finally {
      setGranting(false);
    }
  };

  const onChangeRole = async () => {
    if (memberId == null || !detail) return;
    if (roleValue === detail.role) return;
    setSavingRole(true);
    try {
      await adminApi.changeRole(memberId, roleValue);
      setDetail({ ...detail, role: roleValue });
      toast({ title: "권한을 변경했습니다", description: `${ROLE_LABEL[roleValue]}로 설정`, variant: "success" });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "권한 변경에 실패했습니다.";
      toast({ title: "변경 실패", description: message, variant: "error" });
      setRoleValue(detail.role);
    } finally {
      setSavingRole(false);
    }
  };

  const onCancel = async (warningId: number) => {
    if (memberId == null) return;
    const why = window.prompt("경고 취소 사유를 입력하세요 (선택)") ?? "";
    setCancelingId(warningId);
    try {
      await adminApi.cancelWarning(warningId, why);
      const updated = await adminApi.memberDetail(memberId);
      setDetail(updated);
      onChanged(memberId, updated.warningCount);
      toast({ title: "경고를 취소했습니다", variant: "success" });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "경고 취소에 실패했습니다.";
      toast({ title: "취소 실패", description: message, variant: "error" });
    } finally {
      setCancelingId(null);
    }
  };

  const activeWarnings = detail?.warningCount ?? 0;
  const isMalicious = activeWarnings >= 3;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="relative bg-surface-3 border border-white/10 rounded-lg w-full max-w-2xl max-h-[88vh] overflow-y-auto shadow-[0_6px_0_rgba(0,0,0,0.45)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-surface-3 border-b border-white/8 px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">회원 상세 · 경고 관리</h2>
          <button onClick={onClose} className="focus-ring rounded p-1 text-white/50 hover:text-white" aria-label="닫기">✕</button>
        </div>

        {loading || !detail ? (
          <div className="flex items-center justify-center py-16 text-white/40"><Loader2 className="animate-spin" size={22} /></div>
        ) : (
          <div className="px-6 py-5 space-y-6">
            {/* 통합 정보 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-lg font-bold">{detail.minecraftUsername}</h3>
                {isMalicious && (
                  <Badge variant="error" size="sm">악성 유저</Badge>
                )}
              </div>
              <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <Info label="UUID" value={detail.minecraftUuid} mono />
                <Info label="이메일" value={detail.email ?? "미등록"} />
                <Info label="디스코드 ID" value={detail.discordId ?? "미연동"} />
                <Info label="상태" value={detail.status} />
                <Info label="가입일" value={new Date(detail.createdAt).toLocaleDateString("ko-KR")} />
                <Info label="후원 금액" value={won(detail.totalPaidKrw)} />
                <Info label="누적 경고" value={`${detail.warningCount}회`} highlight={detail.warningCount > 0} />
                <Info label="권한" value={ROLE_LABEL[detail.role] ?? detail.role} />
              </dl>
            </div>

            {/* 권한(역할) 관리 — 최고 관리자 전용 */}
            {isSuperAdmin && (
              <div className="border border-emerald-500/20 rounded-lg p-4">
                <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <ShieldCheck size={15} className="text-emerald-300" /> 권한 관리
                </p>
                {detail.role === "SUPER_ADMIN" ? (
                  <p className="text-sm text-white/45">
                    최고 관리자(SUPER_ADMIN)의 권한은 대시보드에서 변경할 수 없습니다. (DB 에서만 관리)
                  </p>
                ) : viewerMemberId != null && viewerMemberId === detail.id ? (
                  <p className="text-sm text-white/45">본인의 권한은 변경할 수 없습니다.</p>
                ) : (
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Select
                        label="역할 (USER ↔ OPERATOR)"
                        options={ROLE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                        value={roleValue === "SUPER_ADMIN" ? "OPERATOR" : roleValue}
                        onChange={(e) => setRoleValue(e.target.value as Role)}
                      />
                    </div>
                    <Button
                      onClick={onChangeRole}
                      disabled={savingRole || roleValue === detail.role}
                      leftIcon={savingRole ? <Loader2 className="animate-spin" size={15} /> : undefined}
                    >
                      권한 적용
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* 경고 부여 폼 */}
            <div className="border border-white/10 rounded-lg p-4">
              <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle size={15} className="text-amber-300" /> 경고 부여
              </p>
              <div className="space-y-3">
                <Select
                  label="사유 유형"
                  options={REASON_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                  value={reason}
                  onChange={(e) => setReason(e.target.value as WarningReason)}
                />
                {reason === "CUSTOM" && (
                  <Input
                    label="유저 안내 문구 (메일의 [ ] 안에 표시)"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="예: 부적절한 닉네임 사용"
                  />
                )}
                <Textarea
                  label="사건경위 (내부 기록 · 필수)"
                  rows={3}
                  value={detailText}
                  onChange={(e) => setDetailText(e.target.value)}
                  placeholder="경고 사유·정황을 기록합니다 (로그로 보존)"
                />
                <div className="flex justify-end">
                  <Button onClick={onGrant} disabled={granting} leftIcon={granting ? <Loader2 className="animate-spin" size={15} /> : <Ban size={15} />}>
                    경고 부여 + 메일 발송
                  </Button>
                </div>
              </div>
            </div>

            {/* 경고 이력 */}
            <div>
              <p className="text-sm font-semibold mb-3">경고 이력 ({detail.warnings.length})</p>
              {detail.warnings.length === 0 ? (
                <p className="text-sm text-white/35 py-4">경고 이력이 없습니다.</p>
              ) : (
                <ul className="space-y-2">
                  {detail.warnings.map((w) => (
                    <li key={w.id} className={`rounded-lg border p-3 ${w.canceled ? "border-white/8 opacity-55" : "border-red-500/20"}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant={w.canceled ? "default" : "warning"} size="sm">{REASON_LABEL[w.reason]}</Badge>
                            {w.canceled && <Badge variant="default" size="sm">취소됨</Badge>}
                            <span className="text-xs text-white/40">{new Date(w.createdAt).toLocaleString("ko-KR")}</span>
                            {w.issuedBy && <span className="text-xs text-white/30">by {w.issuedBy}</span>}
                          </div>
                          {w.customText && <p className="mt-1.5 text-sm text-white/70">안내: {w.customText}</p>}
                          <p className="mt-1 text-sm text-white/55 whitespace-pre-wrap break-words">{w.detail}</p>
                          {w.canceled && w.canceledReason && (
                            <p className="mt-1 text-xs text-white/35">취소 사유: {w.canceledReason}</p>
                          )}
                        </div>
                        {!w.canceled && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={cancelingId === w.id}
                            onClick={() => onCancel(w.id)}
                            leftIcon={cancelingId === w.id ? <Loader2 className="animate-spin" size={12} /> : undefined}
                          >
                            취소
                          </Button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ label, value, mono, highlight }: { label: string; value: string; mono?: boolean; highlight?: boolean }) {
  return (
    <div>
      <dt className="text-xs text-white/40 mb-0.5">{label}</dt>
      <dd className={`text-sm break-all ${mono ? "font-mono" : ""} ${highlight ? "text-red-300 font-medium" : "text-white/85"}`}>{value}</dd>
    </div>
  );
}
