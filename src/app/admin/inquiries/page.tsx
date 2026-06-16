import { MessageSquare } from "lucide-react";
import { Card, EmptyState } from "@/components/ui";

export default function AdminInquiriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">문의 답변</h1>
        <p className="mt-1.5 text-sm text-white/50">
          사용자 문의를 확인하고 답변을 작성합니다.
        </p>
      </div>
      <Card padding="lg">
        <EmptyState
          icon={MessageSquare}
          title="문의 답변 준비 중"
          description="백엔드 문의 API(/api/admin/inquiries)와 연동 예정입니다. (FR-X53)"
        />
      </Card>
    </div>
  );
}
