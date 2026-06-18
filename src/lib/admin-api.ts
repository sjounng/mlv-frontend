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

  categories: () => api.get<Category[]>("/api/admin/categories"),
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

export interface AdminEvent extends Record<string, unknown> {
  id: number;
  name: string;
  type: EventType;
  description: string;
  startAt: string;
  endAt: string;
  active: boolean;
  mailTemplateId: number;
}

export interface EventUpsert {
  name: string;
  type: EventType;
  description: string;
  startAt: string;
  endAt: string;
  mailTemplateId: number;
  active: boolean;
}

export interface Popup extends Record<string, unknown> {
  id: number;
  imageUrl: string;
  linkUrl: string | null;
  startAt: string;
  endAt: string;
  active: boolean;
  createdAt: string;
}

export interface PopupUpsert {
  imageUrl: string;
  linkUrl: string | null;
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

export interface Category {
  id: number;
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
}

export type ContactCategory = "PAYMENT" | "ACCOUNT" | "EVENT" | "OTHER";
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
