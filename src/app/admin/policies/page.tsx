import { FileText } from "lucide-react";
import { Card, EmptyState } from "@/components/ui";

export default function AdminPoliciesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">약관 / 방침 관리</h1>
        <p className="mt-1.5 text-sm text-white/50">
          약관 버전을 등록·게시하고, 변경 시 재동의 절차를 트리거합니다.
        </p>
      </div>
      <Card padding="lg">
        <EmptyState
          icon={FileText}
          title="약관/방침 관리 준비 중"
          description="백엔드 약관 API(/api/legal)와 연동 예정입니다. (FR-X54)"
        />
      </Card>
    </div>
  );
}
