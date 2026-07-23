// 공개 이벤트 조회 API (07-22 목록형 개편)
import { api } from "@/lib/api";

export type EventStatus = "UPCOMING" | "ONGOING" | "ENDED";

export interface PublicEvent {
  id: number;
  name: string;
  type: string;
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

export interface EventPage {
  content: PublicEvent[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export const EVENT_STATUS_LABEL: Record<EventStatus, string> = {
  UPCOMING: "진행예정",
  ONGOING: "진행중",
  ENDED: "종료",
};

export const eventsApi = {
  // page 는 0-based
  list: (params: { q?: string; page?: number; size?: number }) => {
    const sp = new URLSearchParams();
    sp.set("page", String(params.page ?? 0));
    sp.set("size", String(params.size ?? 6));
    if (params.q && params.q.trim()) sp.set("q", params.q.trim());
    return api.get<EventPage>(`/api/events?${sp.toString()}`);
  },
  featured: () => api.get<PublicEvent[]>("/api/events/featured"),
  detail: (id: number) => api.get<PublicEvent>(`/api/events/${id}`),
};
