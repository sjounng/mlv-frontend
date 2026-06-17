// 관리자 API 호출 모음. 응답 DTO 타입과 fetch 헬퍼를 한 곳에서 관리한다.
import { api } from "@/lib/api";

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export type UserStatus = "ACTIVE" | "SUSPENDED" | "WITHDRAWN";

export interface DashboardStats {
  activeUsers: number;
  paidCharges: number;
  pendingMails: number;
  failedMails: number;
  pendingRefunds: number;
  openInquiries: number;
}

export interface AdminMember extends Record<string, unknown> {
  id: number;
  microsoftSub: string;
  minecraftUuid: string;
  minecraftUsername: string;
  email: string | null;
  status: UserStatus;
  createdAt: string;
}

export interface AuditLog extends Record<string, unknown> {
  id: number;
  actor: string;
  entityType: string;
  entityId: string;
  action: string;
  oldValue: string | null;
  newValue: string | null;
  createdAt: string;
}

export type MailStatus = "PENDING" | "SENT" | "FAILED" | "CANCELLED";
export type MailSource = "EVENT" | "PURCHASE" | "ADMIN" | "REDEEM_CODE";

export interface AdminMail extends Record<string, unknown> {
  id: number;
  targetUuid: string;
  mailCode: string;
  subject: string;
  sourceType: MailSource;
  status: MailStatus;
  retryCount: number;
  sentAt: string | null;
  lastError: string | null;
  createdAt: string;
}

function query(params: Record<string, string | number | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export const adminApi = {
  dashboard: () => api.get<DashboardStats>("/api/admin/dashboard"),

  members: (opts: { status?: string; keyword?: string; page?: number; size?: number }) =>
    api.get<PageResponse<AdminMember>>(`/api/admin/members${query(opts)}`),
  suspendMember: (id: number) => api.patch<AdminMember>(`/api/admin/members/${id}/suspend`),
  activateMember: (id: number) => api.patch<AdminMember>(`/api/admin/members/${id}/activate`),

  auditLogs: (opts: { page?: number; size?: number }) =>
    api.get<PageResponse<AuditLog>>(`/api/admin/audit-logs${query(opts)}`),

  mails: () => api.get<AdminMail[]>("/api/admin/mails"),
  retryMail: (id: number) => api.post<AdminMail>(`/api/admin/mails/${id}/retry`),
};
