import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FaqSection from "@/components/support/FaqSection";

export const metadata: Metadata = {
  title: "자주 묻는 질문",
  description: "계정, 결제, 게임플레이 관련 자주 묻는 질문을 확인하세요.",
};

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="max-w-3xl mx-auto px-6 py-12">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1 text-xs text-white/40 hover:text-white/70 mb-4"
          >
            <ChevronLeft size={14} /> 고객지원으로 돌아가기
          </Link>

          <h1 className="text-3xl font-bold">자주 묻는 질문</h1>
          <p className="mt-2 text-sm text-white/50">
            자주 묻는 질문을 카테고리별로 모았습니다. 원하는 답변이 없다면 문의하기를 이용해 주세요.
          </p>

          <div className="mt-8">
            <FaqSection />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
