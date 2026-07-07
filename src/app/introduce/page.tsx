"use client";

import Link from "next/link";
import {
  Play,
  Sword,
  Atom,
  Cloud,
  Gamepad2,
  Users,
  Sparkles,
  Download,
  LogIn,
  Server,
  ArrowRight,
  Castle,
  Swords,
  Wheat,
  Palette,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button, Card, Badge } from "@/components/ui";
import ServerStatus from "@/components/minecraft/ServerStatus";
import { siteConfig } from "@/lib/site-config";

// ─────────────────────────────────────────────────────────────
// ✏️ 기획자 편집 영역
//    아래 문구만 수정하면 페이지에 그대로 반영됩니다.
//    디자인/구조를 바꿀 일이 없으면 이 블록 밖은 건드리지 않아도 됩니다.
// ─────────────────────────────────────────────────────────────
const copy = {
  hero: {
    versionLabel: "버전 표기 1", // 예: v1.21.4
    title1: "제목 1",
    title2: "제목 2", // 제목 둘째 줄
    body: "내용 1",
    primaryCta: "버튼 1",
    secondaryCta: "버튼 2",
    stats: [
      { value: "수치 1", label: "라벨 1" },
      { value: "수치 2", label: "라벨 2" },
      { value: "수치 3", label: "라벨 3" },
    ],
    videoBadge: "영상 라벨 1", // 예: 서버 트레일러 · 2:14
  },
  features: {
    eyebrow: "섹션 소문구 1", // 영문 소문구. 예: Server Features
    heading: "섹션 제목 1",
    items: [
      { title: "콘텐츠 1", desc: "내용 1" },
      { title: "콘텐츠 2", desc: "내용 2" },
      { title: "콘텐츠 3", desc: "내용 3" },
      { title: "콘텐츠 4", desc: "내용 4" },
      { title: "콘텐츠 5", desc: "내용 5" },
      { title: "콘텐츠 6", desc: "내용 6" },
    ],
  },
  connect: {
    eyebrow: "섹션 소문구 2", // 예: How to Connect
    heading: "섹션 제목 2",
    sub: "내용 1",
    steps: [
      { title: "단계 제목 1", desc: "단계 내용 1" },
      { title: "단계 제목 2", desc: "단계 내용 2" },
      { title: "단계 제목 3", desc: "단계 내용 3" },
    ],
    downloadNote: "다운로드 부가 설명 1", // 예: Windows 지원 · 정품 계정 필요
  },
  showcase: {
    eyebrow: "섹션 소문구 3", // 예: Content Showcase
    heading: "섹션 제목 3",
    items: [
      { title: "콘텐츠 1", desc: "내용 1" },
      { title: "콘텐츠 2", desc: "내용 2" },
      { title: "콘텐츠 3", desc: "내용 3" },
      { title: "콘텐츠 4", desc: "내용 4" },
    ],
  },
  cta: {
    heading: "마무리 제목 1",
    body: "마무리 내용 1",
    primaryCta: "버튼 1",
    secondaryCta: "버튼 2",
  },
};
// ───────────────────────── 편집 영역 끝 ─────────────────────────

// 카드에 붙는 아이콘/색 (디자인 요소 — 기획 문구와 분리)
const featureVisuals = [
  { icon: Sword, color: "text-emerald-300 bg-emerald-500/10" },
  { icon: Atom, color: "text-purple-300 bg-purple-500/10" },
  { icon: Cloud, color: "text-cyan-300 bg-cyan-500/10" },
  { icon: Gamepad2, color: "text-yellow-300 bg-yellow-500/10" },
  { icon: Users, color: "text-blue-300 bg-blue-500/10" },
  { icon: Sparkles, color: "text-pink-300 bg-pink-500/10" },
];

const showcaseIcons = [Castle, Swords, Wheat, Palette];
const stepIcons = [Download, Server, LogIn];

const CLIENT_DOWNLOAD_URL = siteConfig.clientDownloadUrl;

export default function IntroducePage() {

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
                <span className="text-xs text-white/30">{copy.hero.versionLabel}</span>
              </div>
              <h1 className="text-4xl md:text-5xl leading-tight tracking-tight">
                {copy.hero.title1}
                <br />
                {copy.hero.title2}
              </h1>
              <p className="mt-5 text-base text-white/55 leading-relaxed max-w-lg">{copy.hero.body}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login">
                  <Button size="lg" rightIcon={<ArrowRight size={16} />}>{copy.hero.primaryCta}</Button>
                </Link>
                <Link href="/shop">
                  <Button size="lg" variant="outline">{copy.hero.secondaryCta}</Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-xs text-white/35">
                {copy.hero.stats.map((s, i) => (
                  <div key={s.label} className="flex items-center gap-6">
                    {i > 0 && <div className="w-px h-8 bg-white/10" />}
                    <div>
                      <p className="text-xl font-semibold text-white">{s.value}</p>
                      <p>{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Video showcase placeholder */}
            <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-linear-to-br from-surface-3 via-surface-4 to-black">
              <div className="absolute inset-0 bg-linear-to-tr from-emerald-500/10 via-transparent to-cyan-500/10" />
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
                <Badge variant="default">{copy.hero.videoBadge}</Badge>
                <Badge variant="info">NEW</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-10">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-2">{copy.features.eyebrow}</p>
              <h2 className="text-2xl md:text-3xl">{copy.features.heading}</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {copy.features.items.map((f, i) => {
                const visual = featureVisuals[i % featureVisuals.length];
                const Icon = visual.icon;
                return (
                  <Card key={f.title} padding="lg" className="hover:border-white/15 transition-colors">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${visual.color}`}>
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
              <p className="text-xs text-white/40 uppercase tracking-widest mb-2">{copy.connect.eyebrow}</p>
              <h2 className="text-2xl md:text-3xl">{copy.connect.heading}</h2>
              <p className="mt-3 text-sm text-white/40">{copy.connect.sub}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {copy.connect.steps.map((s, i) => {
                const Icon = stepIcons[i % stepIcons.length];
                return (
                  <Card key={s.title} padding="lg">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-bold text-white/30">STEP 0{i + 1}</span>
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
                  <p className="text-xs text-white/40 mb-1">전용 클라이언트</p>
                  <p className="text-lg font-semibold text-white">클라이언트를 내려받아 접속하세요</p>
                  <p className="text-xs text-white/35 mt-1">{copy.connect.downloadNote}</p>
                </div>
                {CLIENT_DOWNLOAD_URL ? (
                  <a href={CLIENT_DOWNLOAD_URL}>
                    <Button leftIcon={<Download size={16} />}>클라이언트 다운로드</Button>
                  </a>
                ) : (
                  <Button disabled leftIcon={<Download size={16} />}>다운로드 준비 중</Button>
                )}
              </div>
            </Card>
          </div>
        </section>

        {/* Content Showcase */}
        <section className="py-16 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-10">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-2">{copy.showcase.eyebrow}</p>
              <h2 className="text-2xl md:text-3xl">{copy.showcase.heading}</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {copy.showcase.items.map((c, i) => {
                const Icon = showcaseIcons[i % showcaseIcons.length];
                return (
                  <Card key={c.title} padding="lg" className="hover:border-white/15 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                      <Icon size={22} className="text-emerald-300/80" />
                    </div>
                    <h3 className="text-base font-semibold">{c.title}</h3>
                    <p className="mt-2 text-sm text-white/50 leading-relaxed">{c.desc}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <Card padding="lg" className="relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
              <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-4">
                <div>
                  <h3 className="font-display text-2xl md:text-3xl">{copy.cta.heading}</h3>
                  <p className="mt-2 text-sm text-white/55">{copy.cta.body}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href="/login">
                    <Button size="lg">{copy.cta.primaryCta}</Button>
                  </Link>
                  <Link href="/info/faq">
                    <Button size="lg" variant="outline">{copy.cta.secondaryCta}</Button>
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
