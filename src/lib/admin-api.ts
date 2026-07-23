// 관리자 API 호출 모음. 응답 DTO 타입과 fetch 헬퍼를 한 곳에서 관리한다.
import { api, API_BASE_URL, ApiError, getAccessToken, refreshAccessToken } from "@/lib/api";

/** 이미지 파일 업로드 → 공개 URL 반환 (multipart, 401 시 refresh 1회 재시도). */
export async function uploadImage(file: File): Promise<{ url: string }> {
  const send = () => {
    const form = new FormData();
    form.append("file", file);
    const token = getAccessToken();
    return fetch(`${API_BASE_URL}/api/admin/uploads`, {
      method: "POST",
      credentials: "include",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
  };

  let response = await send();
  if (response.status === 401 && (await refreshAccessToken())) {
    response = await send();
  }
  if (!response.ok) {
    let code = "UPLOAD_FAILED";
    let message = "업로드에 실패했습니다.";
    try {
      const body = await response.json();
      code = body?.code ?? code;
      message = body?.message ?? message;
    } catch {
      // ignore
    }
    throw new ApiError(response.status, code, message);
  }
  return response.json();
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export type UserStatus = "ACTIVE" | "SUSPENDED" | "WITHDRAWN";
export type Role = "USER" | "OPERATOR" | "SUPER_ADMIN";

export interface AdminMe {
  memberId: number | null;
  displayName: string | null;
  role: Role;
}

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
  warningCount: number;
  createdAt: string;
}

export type WarningReason = "MISCONDUCT" | "BUG_ABUSE" | "CUSTOM";

export interface Warning extends Record<string, unknown> {
  id: number;
  reason: WarningReason;
  detail: string;
  customText: string | null;
  countAtIssue: number;
  issuedBy: string | null;
  canceled: boolean;
  canceledReason: string | null;
  canceledAt: string | null;
  createdAt: string;
}

export interface WarningGrant {
  reason: WarningReason;
  detail: string;
  customText?: string | null;
}

export interface AdminMemberDetail {
  id: number;
  minecraftUuid: string;
  minecraftUsername: string;
  email: string | null;
  discordId: string | null;
  status: UserStatus;
  role: Role;
  warningCount: number;
  totalPaidKrw: number;
  createdAt: string;
  warnings: Warning[];
}

export interface MaliciousMember extends Record<string, unknown> {
  id: number;
  minecraftUuid: string;
  minecraftUsername: string;
  email: string | null;
  warningCount: number;
  warnings: Warning[];
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
  me: () => api.get<AdminMe>("/api/admin/me"),

  // 상점 활성화/비활성화 (07-10 피드백)
  shopStatus: () => api.get<{ enabled: boolean }>("/api/admin/shop-status"),
  setShopStatus: (enabled: boolean) =>
    api.patch<{ enabled: boolean }>("/api/admin/shop-status", { enabled }),

  members: (opts: { status?: string; keyword?: string; page?: number; size?: number }) =>
    api.get<PageResponse<AdminMember>>(`/api/admin/members${query(opts)}`),
  suspendMember: (id: number) => api.patch<AdminMember>(`/api/admin/members/${id}/suspend`),
  activateMember: (id: number) => api.patch<AdminMember>(`/api/admin/members/${id}/activate`),

  // 경고 시스템 (07-09 피드백)
  memberDetail: (id: number) => api.get<AdminMemberDetail>(`/api/admin/members/${id}`),
  maliciousMembers: () => api.get<MaliciousMember[]>("/api/admin/members/malicious"),
  grantWarning: (id: number, body: WarningGrant) =>
    api.post<Warning>(`/api/admin/members/${id}/warnings`, body),
  cancelWarning: (warningId: number, reason: string) =>
    api.post<Warning>(`/api/admin/warnings/${warningId}/cancel`, { reason }),
  changeRole: (id: number, role: Role) =>
    api.patch<AdminMember>(`/api/admin/members/${id}/role`, { role }),

  auditLogs: (opts: { page?: number; size?: number }) =>
    api.get<PageResponse<AuditLog>>(`/api/admin/audit-logs${query(opts)}`),

  mails: () => api.get<AdminMail[]>("/api/admin/mails"),
  retryMail: (id: number) => api.post<AdminMail>(`/api/admin/mails/${id}/retry`),

  categories: () => api.get<Category[]>("/api/admin/categories"),
  createCategory: (body: CategoryUpsert) => api.post<Category>("/api/admin/categories", body),
  updateCategory: (id: number, body: CategoryUpsert) => api.patch<Category>(`/api/admin/categories/${id}`, body),
  mailTemplates: () => api.get<MailTemplate[]>("/api/admin/mail-templates"),
  createMailTemplate: (body: { mailCode: string; subject: string; content: string; rewardsJson: string }) =>
    api.post<MailTemplate>("/api/admin/mail-templates", body),
  sendMail: (body: { targetUuid: string; mailTemplateId: number; sourceRefId: string }) =>
    api.post<AdminMail>("/api/admin/mails/send", body),
  createRedeemCode: (body: { code: string; mailTemplateId: number; maxUses: number; expiresAt: string }) =>
    api.post<{ id: number; code: string }>("/api/admin/redeem-codes", body),

  products: () => api.get<AdminProduct[]>("/api/admin/products"),
  createProduct: (body: ProductUpsert) => api.post<AdminProduct>("/api/admin/products", body),
  updateProduct: (id: number, body: ProductUpsert) => api.patch<AdminProduct>(`/api/admin/products/${id}`, body),

  inquiries: () => api.get<Inquiry[]>("/api/admin/inquiries"),
  replyInquiry: (id: number, content: string) =>
    api.post<Inquiry>(`/api/admin/inquiries/${id}/reply`, { content }),

  events: () => api.get<AdminEvent[]>("/api/admin/events"),
  createEvent: (body: EventUpsert) => api.post<AdminEvent>("/api/admin/events", body),
  updateEvent: (id: number, body: EventUpsert) => api.patch<AdminEvent>(`/api/admin/events/${id}`, body),
  deleteEvent: (id: number) => api.del(`/api/admin/events/${id}`),

  popups: () => api.get<Popup[]>("/api/admin/popups"),
  createPopup: (body: PopupUpsert) => api.post<Popup>("/api/admin/popups", body),
  updatePopup: (id: number, body: PopupUpsert) => api.patch<Popup>(`/api/admin/popups/${id}`, body),
  setPopupActive: (id: number, active: boolean) =>
    api.patch<Popup>(`/api/admin/popups/${id}/active?active=${active}`),

  terms: () => api.get<Terms[]>("/api/admin/terms"),
  publishTerms: (body: TermsCreate) => api.post<Terms>("/api/admin/terms", body),

  charges: (opts: { status?: string; page?: number; size?: number }) =>
    api.get<PageResponse<ChargeHistory>>(`/api/admin/payments/charges${query(opts)}`),
  refunds: () => api.get<Refund[]>("/api/admin/refunds"),
  processRefund: (id: number, status: RefundStatus, operatorMemo: string) =>
    api.patch<Refund>(`/api/admin/refunds/${id}/process`, { status, operatorMemo }),
};

export type EventType = "ATTENDANCE" | "INVITE" | "PAYBACK" | "GENERAL";
export type EventStatus = "UPCOMING" | "ONGOING" | "ENDED";

export interface AdminEvent extends Record<string, unknown> {
  id: number;
  name: string;
  type: EventType;
  bannerImageUrl: string | null;
  description: string | null;
  startAt: string;
  endAt: string;
  status: EventStatus;
  featured: boolean;
  active: boolean;
  mailTemplateId: number | null;
  publishedAt: string;
}

export interface EventUpsert {
  name: string;
  type: EventType;
  bannerImageUrl: string | null;
  description: string | null;
  startAt: string;
  endAt: string;
  status: EventStatus;
  featured: boolean;
  mailTemplateId: number | null;
  active: boolean;
}

/** 배너 노출 위치: 홈 인트로 슬라이더 / 이벤트 페이지 상단 */
export type BannerPlacement = "HOME" | "EVENT";

export interface Popup extends Record<string, unknown> {
  id: number;
  imageUrl: string;
  linkUrl: string | null;
  placement: BannerPlacement;
  startAt: string;
  endAt: string;
  active: boolean;
  createdAt: string;
}

export interface PopupUpsert {
  imageUrl: string;
  linkUrl: string | null;
  placement: BannerPlacement;
  startAt: string;
  endAt: string;
  active: boolean;
}

export type TermsType = "TERMS" | "PRIVACY" | "REFUND";

export interface Terms extends Record<string, unknown> {
  id: number;
  type: TermsType;
  version: string;
  content: string;
  publishedAt: string;
}

export interface TermsCreate {
  type: TermsType;
  version: string;
  content: string;
}

export type ChargeStatus = "READY" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED";

export interface ChargeHistory extends Record<string, unknown> {
  id: number;
  merchantOrderId: string;
  cashAmount: number;
  paymentAmountKrw: number;
  status: ChargeStatus;
  stellaPaymentId: string | null;
  receiptUrl: string | null;
  createdAt: string;
  paidAt: string | null;
}

export type RefundStatus = "REQUESTED" | "APPROVED" | "REJECTED" | "COMPLETED";

export interface Refund extends Record<string, unknown> {
  id: number;
  cashChargeId: number;
  reason: string;
  status: RefundStatus;
  operatorMemo: string | null;
  processedAt: string | null;
  createdAt: string;
}

export interface Category extends Record<string, unknown> {
  id: number;
  name: string;
  sortOrder: number;
  active: boolean;
}

export interface CategoryUpsert {
  name: string;
  sortOrder: number;
  active: boolean;
}

export interface MailTemplate extends Record<string, unknown> {
  id: number;
  mailCode: string;
  subject: string;
  content: string;
  rewardsJson: string;
  createdAt: string;
}

export type PurchaseLimitType = "NONE" | "WEEKLY" | "MONTHLY" | "ONCE";

export interface AdminProduct extends Record<string, unknown> {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  category: Category;
  mailTemplateId: number;
  active: boolean;
  stockQuantity: number | null;
  recommended: boolean;
  newBadge: boolean;
  purchaseLimitType: PurchaseLimitType;
  purchaseLimitCount: number;
}

export interface ProductUpsert {
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  categoryId: number;
  mailTemplateId: number;
  active: boolean;
  stockQuantity: number | null;
  recommended: boolean;
  newBadge: boolean;
  purchaseLimitType: PurchaseLimitType;
  purchaseLimitCount: number;
}

export type ContactCategory = "PAYMENT" | "ACCOUNT" | "EVENT" | "PLAYER_REPORT" | "BUG_REPORT" | "OTHER";
export type ContactStatus = "OPEN" | "ANSWERED" | "CLOSED";

export interface Inquiry extends Record<string, unknown> {
  id: number;
  category: ContactCategory;
  title: string;
  content: string;
  attachmentUrl: string | null;
  status: ContactStatus;
  createdAt: string;
}
