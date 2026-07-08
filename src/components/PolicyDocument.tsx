"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, Badge } from "@/components/ui";
import { api } from "@/lib/api";

export type PolicyType = "TERMS" | "PRIVACY" | "REFUND";

export interface PolicySection {
  title: string;
  body: string;
}

interface PublicTerms {
  type?: PolicyType;
  version?: string;
  content?: string;
  publishedAt?: string;
}

interface Props {
  type: PolicyType;
  title: string;
  /** 백엔드 미연동 시 표시할 정적 버전 (예: "v1.0") */
  fallbackVersion: string;
  /** 백엔드 미연동 시 표시할 시행일 (예: "2026-05-19") */
  fallbackDate: string;
  fallbackSections: PolicySection[];
}

// 관리자(/admin/policies)가 게시한 약관을 공개 페이지에서 읽는다.
// 공개 엔드포인트가 없거나 응답이 비어 있으면 번들된 정적 문서로 폴백한다.
export default function PolicyDocument({
  type,
  title,
  fallbackVersion,
  fallbackDate,
  fallbackSections,
}: Props) {
  const [doc, setDoc] = useState<PublicTerms | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await api.get<PublicTerms>(`/api/legal/terms/latest?type=${type}`);
      if (res && typeof res.content === "string" && res.content.trim()) {
        setDoc(res);
      }
    } catch {
      // 공개 약관 API 미연동/실패 → 정적 폴백 유지
    }
  }, [type]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const usingBackend = !!doc?.content?.trim();
  const version = usingBackend && doc?.version ? doc.version : fallbackVersion;
  const date =
    usingBackend && doc?.publishedAt
      ? new Date(doc.publishedAt).toLocaleDateString("ko-KR")
      : fallbackDate;

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="max-w-3xl mx-auto px-6 py-12">
          <Link
            href="/"
            className="focus-ring rounded inline-flex items-center gap-1 text-xs text-white/40 hover:text-white/70 mb-4"
          >
            <ChevronLeft size={14} /> 홈으로 돌아가기
          </Link>

          <div className="mb-6">
            <h1 className="text-3xl font-bold">{title}</h1>
            <div className="mt-3 flex items-center gap-2">
              <Badge variant="info">{version}</Badge>
              <span className="text-xs text-white/40">시행일: {date}</span>
            </div>
          </div>

          <Card padding="lg" className="space-y-7">
            {usingBackend ? (
              <p className="text-sm text-white/65 leading-7 whitespace-pre-line">
                {doc!.content}
              </p>
            ) : (
              fallbackSections.map((s) => (
                <section key={s.title}>
                  <h2 className="text-base font-semibold text-white mb-2">{s.title}</h2>
                  <p className="text-sm text-white/60 leading-7 whitespace-pre-line">{s.body}</p>
                </section>
              ))
            )}
          </Card>
        </section>
      </main>
      <Footer />
    </>
  );
}
