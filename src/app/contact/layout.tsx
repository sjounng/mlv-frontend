import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "고객지원",
  description: "자주 묻는 질문(FAQ)과 직접 문의하기를 제공하는 마이리틀밸리 고객지원입니다.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
