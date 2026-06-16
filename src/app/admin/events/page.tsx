import { Calendar } from "lucide-react";
import { Card, EmptyState } from "@/components/ui";

export default function AdminEventsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">이벤트 관리</h1>
        <p className="mt-1.5 text-sm text-white/50">
          이벤트 등록/수정/종료와 참여 현황 통계를 관리합니다.
        </p>
      </div>
      <Card padding="lg">
        <EmptyState
          icon={Calendar}
          title="이벤트 관리 준비 중"
          description="백엔드 이벤트 API(/api/admin/events)와 연동 예정입니다. (FR-X50)"
        />
      </Card>
    </div>
  );
}
