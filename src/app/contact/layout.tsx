import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "문의하기",
  description: "궁금한 점이나 불편 사항을 남겨주세요.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
