"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Play,
  Sword,
  Atom,
  Cloud,
  Gamepad2,
  Users,
  Sparkles,
  Copy,
  Check,
  Download,
  LogIn,
  Server,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button, Card, Badge } from "@/components/ui";
import ServerStatus from "@/components/minecraft/ServerStatus";
import { siteConfig } from "@/lib/site-config";

const features = [
  {
    icon: Sword,
    title: "생존 서버",
    desc: "안정적인 바닐라 기반의 생존 환경에서 자유롭게 모험하고 건축하세요.",
    color: "text-emerald-300 bg-emerald-500/10",
  },
  {
    icon: Atom,
    title: "마공학",
    desc: "독자적인 마공학 콘텐츠로 색다른 자동화와 마법을 경험할 수 있습니다.",
    color: "text-purple-300 bg-purple-500/10",
  },
  {
    icon: Cloud,
    title: "스카이블럭",
    desc: "한정된 공간에서 무한한 가능성을 펼치는 스카이블럭 모드를 제공합니다.",
    color: "text-cyan-300 bg-cyan-500/10",
  },
  {
    icon: Gamepad2,
    title: "미니게임",
    desc: "PvP, 술래잡기, 베드워즈 등 다양한 미니게임이 매일 열립니다.",
    color: "text-yellow-300 bg-yellow-500/10",
  },
  {
    icon: Users,
    title: "커뮤니티",
    desc: "디스코드와 인게임 채팅에서 활발히 교류하는 따뜻한 커뮤니티가 있습니다.",
    color: "text-blue-300 bg-blue-500/10",
  },
  {
    icon: Sparkles,
    title: "업데이트",
    desc: "매월 새로운 시즌 콘텐츠와 이벤트가 제공되어 지루할 틈이 없습니다.",
    color: "text-pink-300 bg-pink-500/10",
  },
];

const contents = [
  {
    emoji: "🏰",
    title: "왕국 건설",
    desc: "친구들과 함께 광활한 왕국을 세우고 영토를 확장해 보세요.",
  },
  {
    emoji: "⚔️",
    title: "던전 탐험",
    desc: "맞춤 제작된 던전에서 보스를 격파하고 희귀 아이템을 획득하세요.",
  },
  {
    emoji: "🌾",
    title: "농업과 무역",
    desc: "농사와 거래 시스템으로 서버 경제의 한 축을 담당해 보세요.",
  },
  {
    emoji: "🎨",
    title: "치장과 스킨",
    desc: "전용 치장품과 펫으로 나만의 개성을 표현해 보세요.",
  },
];

const SERVER_ADDRESS = siteConfig.serverAddress;

export default function IntroducePage() {
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(SERVER_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="relative">
          <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-5">
                <ServerStatus status={siteConfig.serverStatus} />
                <span className="text-xs text-white/30">v1.20.4</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                마리벨에 오신 것을<br />환영합니다
              </h1>
              <p className="mt-5 text-base text-white/55 leading-relaxed max-w-lg">
                마이리틀밸리(마리벨)는 5년차 마인크래프트 한국 커뮤니티 서버입니다.
                생존부터 마공학, 스카이블럭, 미니게임까지 다양한 콘텐츠를 한 곳에서 만나보세요.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login">
                  <Button size="lg" rightIcon={<ArrowRight size={16} />}>지금 시작하기</Button>
                </Link>
                <Link href="/shop">
                  <Button size="lg" variant="outline">웹상점 둘러보기</Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-xs text-white/35">
                <div>
                  <p className="text-xl font-semibold text-white">12,400+</p>
                  <p>가입 회원</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <p className="text-xl font-semibold text-white">320+</p>
                  <p>평균 동시 접속</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <p className="text-xl font-semibold text-white">5년차</p>
                  <p>운영 경험</p>
                </div>
              </div>
            </div>

            {/* Video showcase placeholder */}
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-linear-to-br from-surface-3 via-surface-4 to-black">
              <div className="absolute inset-0 bg-linear-to-tr from-purple-500/10 via-transparent to-cyan-500/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  type="button"
                  className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:scale-105 transition-transform"
                  aria-label="영상 재생"
                >
                  <Play size={24} className="fill-current ml-0.5" />
                </button>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <Badge variant="default">서버 트레일러 · 2:14</Badge>
                <Badge variant="info">NEW</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-10">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Server Features</p>
              <h2 className="text-2xl md:text-3xl font-bold">콘텐츠 한눈에 보기</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <Card key={f.title} padding="lg" className="hover:border-white/15 transition-colors">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${f.color}`}>
                      <Icon size={20} />
                    </div>
                    <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                    <p className="mt-2 text-sm text-white/50 leading-relaxed">{f.desc}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* How to connect */}
        <section className="py-16 border-t border-white/5 bg-surface-2/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-10 text-center">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-2">How to Connect</p>
              <h2 className="text-2xl md:text-3xl font-bold">3단계로 시작하기</h2>
              <p className="mt-3 text-sm text-white/40">처음이신가요? 아래 순서대로 따라하시면 됩니다.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {[
                { icon: Download, step: "01", title: "마인크래프트 설치", desc: "마인크래프트 자바 에디션 정품 클라이언트를 설치합니다." },
                { icon: Server, step: "02", title: "서버 주소 입력", desc: "멀티 플레이 → 서버 추가에 아래 주소를 입력해 주세요." },
                { icon: LogIn, step: "03", title: "플레이 시작", desc: "서버에 접속해 자유롭게 마리벨의 세상을 즐기세요." },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <Card key={s.step} padding="lg">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-bold text-white/30">STEP {s.step}</span>
                    </div>
                    <div className="w-11 h-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                      <Icon size={20} className="text-white/80" />
                    </div>
                    <h3 className="text-base font-semibold">{s.title}</h3>
                    <p className="mt-2 text-sm text-white/50 leading-relaxed">{s.desc}</p>
                  </Card>
                );
              })}
            </div>

            <Card padding="lg" variant="elevated">
              <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                <div>
                  <p className="text-xs text-white/40 mb-1">서버 주소</p>
                  <p className="text-xl font-mono font-semibold text-white">{SERVER_ADDRESS}</p>
                  <p className="text-xs text-white/35 mt-1">버전: 1.20.4 · Java Edition · 한국 서버</p>
                </div>
                <Button
                  onClick={copyAddress}
                  variant={copied ? "outline" : "solid"}
                  leftIcon={copied ? <Check size={16} /> : <Copy size={16} />}
                >
                  {copied ? "복사됨" : "주소 복사"}
                </Button>
              </div>
            </Card>
          </div>
        </section>

        {/* Content Showcase */}
        <section className="py-16 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-10">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Content Showcase</p>
              <h2 className="text-2xl md:text-3xl font-bold">무엇을 즐길 수 있나요?</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {contents.map((c) => (
                <Card key={c.title} padding="lg" className="hover:border-white/15 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-4">
                    {c.emoji}
                  </div>
                  <h3 className="text-base font-semibold">{c.title}</h3>
                  <p className="mt-2 text-sm text-white/50 leading-relaxed">{c.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <Card padding="lg" className="relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
              <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-4">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold">지금 바로 시작하세요</h3>
                  <p className="mt-2 text-sm text-white/55">로그인 한 번이면 마리벨의 모든 콘텐츠를 즐길 수 있어요.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href="/login">
                    <Button size="lg">로그인하고 시작</Button>
                  </Link>
                  <Link href="/info/faq">
                    <Button size="lg" variant="outline">자주 묻는 질문</Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
