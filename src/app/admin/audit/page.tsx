import { History } from "lucide-react";
import { Card, EmptyState } from "@/components/ui";

export default function AdminAuditPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">감사 로그</h1>
        <p className="mt-1.5 text-sm text-white/50">
          관리자 행위 로그(누가/언제/무엇을)를 조회합니다.
        </p>
      </div>
      <Card padding="lg">
        <EmptyState
          icon={History}
          title="감사 로그 준비 중"
          description="백엔드 감사 로그 API(/api/admin/audit-logs)와 연동 예정입니다. (FR-X4)"
        />
      </Card>
    </div>
  );
}
