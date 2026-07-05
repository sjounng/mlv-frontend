import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이벤트",
  description: "출석 체크와 리딤 코드 등 진행 중인 이벤트를 확인하세요.",
};

export default function EventLayout({ children }: { children: React.ReactNode }) {
  return children;
}
