import Link from "next/link";
import {
  FileText,
  Shield,
  RefreshCcw,
  Building2,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui";

const links = [
  {
    href: "/info/terms",
    title: "이용약관",
    desc: "마리벨 서비스 이용에 관한 약관입니다.",
    icon: FileText,
    color: "text-blue-300 bg-blue-500/10",
  },
  {
    href: "/info/privacy",
    title: "개인정보처리방침",
    desc: "회원의 개인정보가 어떻게 수집·이용·보관되는지 안내합니다.",
    icon: Shield,
    color: "text-emerald-300 bg-emerald-500/10",
  },
  {
    href: "/info/refund",
    title: "환불 정책",
    desc: "디지털 재화 결제에 대한 환불 기준을 안내합니다.",
    icon: RefreshCcw,
    color: "text-yellow-300 bg-yellow-500/10",
  },
  {
    href: "/info/faq",
    title: "자주 묻는 질문",
    desc: "계정, 결제, 게임플레이 관련 자주 묻는 질문을 확인하세요.",
    icon: HelpCircle,
    color: "text-purple-300 bg-purple-500/10",
  },
];

export default function InfoHubPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="max-w-5xl mx-auto px-6 py-12">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Service Info</p>
          <h1 className="text-3xl md:text-4xl font-bold">서비스 정보</h1>
          <p className="mt-3 text-sm text-white/50">마리벨 서비스 운영에 관한 약관, 정책, 사업자 정보를 안내합니다.</p>

          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            {links.map((l) => {
              const Icon = l.icon;
              return (
                <Link key={l.href} href={l.href} className="block group">
                  <Card padding="lg" className="h-full group-hover:border-white/20 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${l.color}`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-base font-semibold">{l.title}</h3>
                          <ArrowRight size={14} className="text-white/30 group-hover:text-white/80 transition-colors" />
                        </div>
                        <p className="mt-1.5 text-sm text-white/50 leading-relaxed">{l.desc}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Business Info */}
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
                <Building2 size={18} />
              </div>
              <div>
                <h2 className="text-lg font-semibold">사업자 정보</h2>
                <p className="text-xs text-white/40">통신판매업 신고 및 사업자 등록 정보입니다.</p>
              </div>
            </div>

            <Card padding="lg">
              <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                {[
                  ["상호", "마이리틀밸리"],
                  ["대표자", "김민수"],
                  ["사업자 등록번호", "123-45-67890"],
                  ["통신판매업 신고번호", "제 2026-서울강남-0123 호"],
                  ["주소", "서울특별시 강남구 테헤란로 152, 5층"],
                  ["호스팅 제공", "Stella IT, Inc."],
                  ["고객센터", "support@maribel.kr · 1577-0000"],
                  ["운영 시간", "평일 10:00 - 18:00 (점심 12:00 - 13:00)"],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-1">
                    <dt className="text-xs text-white/40">{k}</dt>
                    <dd className="text-white/85">{v}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
