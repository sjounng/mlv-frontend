import { Gift } from "lucide-react";
import { Card, EmptyState } from "@/components/ui";

export default function AdminRewardsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">보상 / 큐 관리</h1>
        <p className="mt-1.5 text-sm text-white/50">
          인게임 우편 발송 큐의 상태(대기/완료/실패)를 모니터링하고 재시도·취소를 처리합니다.
        </p>
      </div>
      <Card padding="lg">
        <EmptyState
          icon={Gift}
          title="보상 큐 연동 준비 중"
          description="백엔드 우편 큐 API(/api/admin/mails)와 연동 예정입니다. (FR-X40~42)"
        />
      </Card>
    </div>
  );
}
