import Link from "next/link";
import { History, ChevronLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button, Card, Badge } from "@/components/ui";

const sections = [
  {
    title: "제1조 (수집하는 개인정보 항목)",
    body: `회사는 다음과 같은 개인정보를 수집합니다.\n\n[필수 항목]\n- Microsoft 계정 식별자 (xuid)\n- 마인크래프트 계정 UUID 및 닉네임\n- 이메일 주소\n- 서비스 이용 기록, 접속 IP, 쿠키\n\n[선택 항목]\n- 문의 답변을 위한 추가 연락처`,
  },
  {
    title: "제2조 (개인정보의 수집 및 이용 목적)",
    body: `① 회원 식별 및 본인 확인\n② 마인크래프트 서버 및 웹사이트 서비스 제공\n③ 결제, 환불, 우편 발송 등 유료 서비스 운영\n④ 부정 이용 방지 및 안전한 운영\n⑤ 공지사항 전달 및 고객 문의 응대`,
  },
  {
    title: "제3조 (개인정보의 보유 및 이용 기간)",
    body: `회사는 원칙적으로 회원 탈퇴 시 개인정보를 지체 없이 파기합니다. 단, 다음과 같이 관련 법령에서 정한 기간 동안 보관할 수 있습니다.\n\n- 계약 또는 청약 철회 등에 관한 기록: 5년 (전자상거래법)\n- 대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래법)\n- 소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)\n- 로그인 기록: 3개월 (통신비밀보호법)`,
  },
  {
    title: "제4조 (개인정보의 제3자 제공)",
    body: `회사는 회원의 동의 없이 개인정보를 외부에 제공하지 않습니다. 단, 법령에 의거하거나, 결제 처리를 위한 PG사(Stella IT)에 한해 결제에 필요한 최소한의 정보가 제공됩니다.`,
  },
  {
    title: "제5조 (개인정보의 처리 위탁)",
    body: `회사는 서비스 운영을 위해 다음과 같이 업무를 위탁하고 있습니다.\n\n- 결제 처리: Stella IT\n- 클라우드 인프라: AWS\n- 고객 응대: 자체 운영`,
  },
  {
    title: "제6조 (회원의 권리와 행사 방법)",
    body: `회원은 언제든지 본인의 개인정보 열람, 정정, 삭제, 처리 정지를 요청할 수 있으며, 마이페이지 또는 고객센터(support@maribel.kr)를 통해 신청할 수 있습니다.`,
  },
  {
    title: "제7조 (쿠키의 운영)",
    body: `회사는 회원의 편의를 위해 쿠키를 사용합니다. 회원은 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나, 일부 서비스의 이용에 제한이 있을 수 있습니다.`,
  },
  {
    title: "제8조 (개인정보 보호책임자)",
    body: `성명: 박지훈\n직책: 개인정보 보호책임자\n연락처: privacy@maribel.kr`,
  },
  {
    title: "부칙",
    body: `본 방침은 2026년 5월 19일부터 시행됩니다.`,
  },
];

export default function PrivacyPage() {
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

          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">개인정보처리방침</h1>
              <div className="mt-3 flex items-center gap-2">
                <Badge variant="info">v1.0</Badge>
                <span className="text-xs text-white/40">시행일: 2026-05-19</span>
              </div>
            </div>
            <Button variant="outline" size="sm" leftIcon={<History size={14} />}>
              이전 버전
            </Button>
          </div>

          <Card padding="lg" className="space-y-7">
            {sections.map((s) => (
              <section key={s.title}>
                <h2 className="text-base font-semibold text-white mb-2">{s.title}</h2>
                <p className="text-sm text-white/60 leading-7 whitespace-pre-line">{s.body}</p>
              </section>
            ))}
          </Card>
        </section>
      </main>
      <Footer />
    </>
  );
}
