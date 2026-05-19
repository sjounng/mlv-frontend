"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, HelpCircle, Paperclip, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Badge,
  Button,
  Card,
  Input,
  Select,
  Table,
  Textarea,
  useToast,
  type TableColumn,
} from "@/components/ui";

const categories = [
  { value: "payment", label: "결제 / 환불" },
  { value: "account", label: "계정" },
  { value: "game", label: "게임플레이" },
  { value: "etc", label: "기타" },
];

interface InquiryRow extends Record<string, unknown> {
  title: string;
  category: string;
  status: "답변대기" | "답변완료";
  date: string;
}

const inquiries: InquiryRow[] = [
  { title: "비행권 구매 후 적용이 안돼요", category: "결제 / 환불", status: "답변완료", date: "2026-05-18" },
  { title: "닉네임이 인식되지 않습니다", category: "계정", status: "답변완료", date: "2026-05-15" },
  { title: "토지 청구 한도 늘릴 수 있나요?", category: "게임플레이", status: "답변대기", date: "2026-05-12" },
  { title: "유튜브 채널 협업 문의", category: "기타", status: "답변완료", date: "2026-05-03" },
];

const inquiryColumns: TableColumn<InquiryRow>[] = [
  { key: "title", label: "제목" },
  { key: "category", label: "카테고리", width: "140px" },
  {
    key: "status",
    label: "상태",
    width: "120px",
    render: (r) => (
      <Badge variant={r.status === "답변완료" ? "success" : "warning"} size="sm">
        {r.status}
      </Badge>
    ),
  },
  { key: "date", label: "작성일", width: "120px" },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [category, setCategory] = useState("payment");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast({ title: "제목과 내용을 입력해 주세요", variant: "warning" });
      return;
    }
    toast({
      title: "문의가 접수되었습니다",
      description: "영업일 기준 1~2일 이내에 답변드리겠습니다.",
      variant: "success",
    });
    setTitle("");
    setContent("");
  };

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold">문의하기</h1>
          <p className="mt-2 text-sm text-white/50">궁금한 점이 있다면 언제든지 문의해 주세요. 영업일 기준 1~2일 이내에 답변드립니다.</p>

          <div className="mt-8 grid lg:grid-cols-[1fr_320px] gap-6">
            {/* Left - Form */}
            <Card padding="lg">
              <form onSubmit={onSubmit} className="space-y-4">
                <Select
                  label="문의 카테고리"
                  options={categories}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
                <Input
                  label="제목"
                  placeholder="예: 결제 후 보상이 도착하지 않아요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Textarea
                  label="내용"
                  placeholder="문의 내용을 자세히 적어주세요. 결제 ID, 닉네임, 발생 시각 등을 함께 적어주시면 빠른 처리가 가능합니다."
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px]"
                />
                <div>
                  <p className="text-xs font-medium text-white/60 mb-1.5">첨부 파일</p>
                  <label className="flex items-center gap-2 px-3 py-2.5 bg-white/5 border border-dashed border-white/15 rounded-lg text-sm text-white/50 hover:bg-white/7 cursor-pointer transition-colors">
                    <Paperclip size={15} />
                    <span>이미지/영상 파일을 첨부할 수 있어요 (최대 10MB)</span>
                    <input type="file" multiple className="hidden" />
                  </label>
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" leftIcon={<Send size={15} />}>문의 보내기</Button>
                </div>
              </form>
            </Card>

            {/* Right - Sidebar */}
            <aside className="space-y-4">
              <Card padding="lg">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <HelpCircle size={15} /> 자주 묻는 질문
                </h3>
                <ul className="space-y-2 text-sm">
                  {[
                    { href: "/info/faq", label: "결제 후 보상이 도착하지 않아요" },
                    { href: "/info/faq", label: "환불은 어떻게 신청하나요?" },
                    { href: "/info/faq", label: "Microsoft 로그인이 안돼요" },
                    { href: "/info/faq", label: "닉네임 변경 방법" },
                  ].map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="text-white/65 hover:text-white">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card padding="lg">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Clock size={15} /> 운영 시간
                </h3>
                <ul className="space-y-1.5 text-xs text-white/60">
                  <li className="flex justify-between"><span>평일</span><span>10:00 - 18:00</span></li>
                  <li className="flex justify-between"><span>점심시간</span><span>12:00 - 13:00</span></li>
                  <li className="flex justify-between"><span>주말/공휴일</span><span>휴무</span></li>
                </ul>
                <p className="mt-3 text-xs text-white/35">긴급 점검 안내는 디스코드 공지 채널을 확인해 주세요.</p>
              </Card>

              <Card padding="lg">
                <h3 className="text-sm font-semibold mb-3">문의 처리 안내</h3>
                <ol className="space-y-2 text-xs text-white/55 list-decimal list-inside leading-relaxed">
                  <li>문의 접수 후 자동으로 접수 번호가 발급됩니다.</li>
                  <li>운영팀이 영업일 기준 1~2일 내에 답변드립니다.</li>
                  <li>답변 알림은 등록된 이메일로 발송됩니다.</li>
                </ol>
              </Card>
            </aside>
          </div>

          {/* My inquiries */}
          <div className="mt-12">
            <h2 className="text-lg font-semibold mb-4">내 문의 내역</h2>
            <Card padding="none">
              <Table columns={inquiryColumns} data={inquiries} />
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
