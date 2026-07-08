import Navbar from "@/components/Navbar";
import MainShowcase from "@/components/MainShowcase";

// 홈 = 스크롤 스냅 단일 페이지 (인트로 → 소개 → 다운로드 + 푸터). Navbar 는 고정 오버레이.
export default function HomePage() {
  return (
    <>
      <Navbar />
      <MainShowcase />
    </>
  );
}
