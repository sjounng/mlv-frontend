"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, Tabs } from "@/components/ui";

type FaqCategory = "account" | "payment" | "game" | "etc";

interface Faq {
  q: string;
  a: string;
}

const faqs: Record<FaqCategory, Faq[]> = {
  account: [
    { q: "로그인은 어떻게 하나요?", a: "마인크래프트 자바 에디션 정품 계정과 연결된 Microsoft 계정으로 로그인할 수 있습니다. 첫 로그인 시 자동으로 회원가입이 진행됩니다." },
    { q: "닉네임은 어떻게 변경하나요?", a: "닉네임은 Microsoft 계정에 등록된 마인크래프트 닉네임을 그대로 사용합니다. 닉네임 변경 후 서버에 재접속하면 자동으로 갱신됩니다." },
    { q: "계정을 삭제(탈퇴)하려면 어떻게 해야 하나요?", a: "마이페이지 → 프로필 → 회원 탈퇴 메뉴에서 신청할 수 있습니다. 잔여 캐시는 환불되지 않으니 신중히 결정해 주세요." },
    { q: "로그인이 되지 않아요.", a: "Microsoft 계정 로그인 후 마인크래프트 계정이 연결되어 있어야 합니다. 정품 계정 인증 상태를 확인하고, 그래도 안 될 경우 문의 게시판으로 연락 주세요." },
  ],
  payment: [
    { q: "어떤 결제 수단을 사용할 수 있나요?", a: "신용/체크카드, 휴대폰 결제, 계좌 이체, 가상계좌, 카카오페이, 토스 결제를 지원합니다. 모든 결제는 Stella IT를 통해 처리됩니다." },
    { q: "결제 후 보상이 도착하지 않아요.", a: "결제 후 보상은 인게임 우편함으로 발송되며 보통 1분 이내에 도착합니다. 5분 이상 미도착 시 결제 ID와 함께 문의해 주세요." },
    { q: "환불은 어떻게 신청하나요?", a: "마이페이지 → 결제 내역에서 [환불 요청] 버튼으로 신청할 수 있습니다. 자세한 기준은 환불 정책 문서를 참고해 주세요." },
    { q: "캐시는 언제 사용할 수 있나요?", a: "충전 즉시 인게임 우편함으로 캐시가 지급되며, 웹상점과 인게임 상점 양쪽에서 사용 가능합니다." },
  ],
  game: [
    { q: "서버 주소가 어떻게 되나요?", a: "play.maribel.kr 입니다. 마인크래프트 자바 에디션 1.20.4 버전 기준입니다." },
    { q: "어떤 모드/리소스팩을 사용해야 하나요?", a: "기본 클라이언트만으로 접속 가능합니다. 일부 콘텐츠는 OptiFine 또는 자체 리소스팩 적용 시 더 풍부하게 즐길 수 있습니다." },
    { q: "그리핑/도용 신고는 어떻게 하나요?", a: "디스코드 #신고 채널 또는 인게임 /신고 명령어로 신고할 수 있습니다. 증거 스크린샷이나 좌표를 함께 제공해 주세요." },
    { q: "오프라인 동안 내 땅이 보호되나요?", a: "기본적으로 토지 청구권으로 보호되며, 청구되지 않은 영역은 보호되지 않습니다. 자세한 내용은 인게임 가이드를 참고해 주세요." },
  ],
  etc: [
    { q: "버그를 발견했어요. 어디로 제보하나요?", a: "문의 → 카테고리 [기타] 또는 디스코드 #버그제보 채널로 알려 주세요. 재현 방법과 스크린샷이 있으면 더 빠른 대응이 가능합니다." },
    { q: "디스코드 서버는 어디서 참여하나요?", a: "사이트 푸터의 디스코드 링크 또는 인게임 /디스코드 명령어로 초대 링크를 받을 수 있습니다." },
    { q: "스폰서/유튜브 협업 문의는 어떻게 하나요?", a: "business@maribel.kr 로 메일을 보내주시면 담당자가 검토 후 회신드립니다." },
    { q: "후원 보상은 어떻게 받나요?", a: "이벤트 페이지에서 진행 중인 후원 이벤트를 확인하실 수 있으며, 결제 시 자동으로 보상이 우편함으로 발송됩니다." },
  ],
};

const tabs = [
  { id: "account", label: "계정/로그인" },
  { id: "payment", label: "결제/환불" },
  { id: "game", label: "서버/게임플레이" },
  { id: "etc", label: "기타" },
] as const;

export default function FaqPage() {
  const [active, setActive] = useState<FaqCategory>("account");
  const [openId, setOpenId] = useState<string | null>(null);

  const list = faqs[active];

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="max-w-3xl mx-auto px-6 py-12">
          <Link
            href="/info"
            className="inline-flex items-center gap-1 text-xs text-white/40 hover:text-white/70 mb-4"
          >
            <ChevronLeft size={14} /> 서비스 정보로 돌아가기
          </Link>

          <h1 className="text-3xl font-bold">자주 묻는 질문</h1>
          <p className="mt-2 text-sm text-white/50">자주 묻는 질문을 카테고리별로 모았습니다. 원하는 답변이 없다면 문의하기를 이용해 주세요.</p>

          <div className="mt-8">
            <Tabs
              tabs={[...tabs]}
              activeTab={active}
              onChange={(id) => {
                setActive(id as FaqCategory);
                setOpenId(null);
              }}
            />

            <div className="mt-5 space-y-2">
              {list.map((item, idx) => {
                const id = `${active}-${idx}`;
                const open = openId === id;
                return (
                  <Card key={id} padding="none" className="overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : id)}
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/3 transition-colors"
                    >
                      <span className="text-sm font-medium text-white/90">{item.q}</span>
                      <ChevronDown
                        size={16}
                        className={`shrink-0 text-white/40 transition-transform ${open ? "rotate-180" : ""}`}
                      />
                    </button>
                    {open && (
                      <div className="px-5 pb-4 -mt-1 text-sm text-white/55 leading-7 whitespace-pre-line border-t border-white/5 pt-4">
                        {item.a}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
