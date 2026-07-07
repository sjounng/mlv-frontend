import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import EventBannerSlider from "@/components/EventBannerSlider";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        {/* 이벤트 이미지 배너 슬라이더 — 배너는 관리자 > 배너에서 등록 */}
        <EventBannerSlider />
      </main>
      <Footer />
    </>
  );
}
