import { Image as ImageIcon } from "lucide-react";
import { Card, EmptyState } from "@/components/ui";

export default function AdminBannersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">팝업 / 배너 관리</h1>
        <p className="mt-1.5 text-sm text-white/50">
          메인 페이지 팝업 이미지 등록과 노출 기간을 관리합니다.
        </p>
      </div>
      <Card padding="lg">
        <EmptyState
          icon={ImageIcon}
          title="팝업/배너 관리 준비 중"
          description="백엔드 팝업 API와 연동 예정입니다. (FR-X52)"
        />
      </Card>
    </div>
  );
}
