import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ToastProvider } from "@/components/ui";
import { AuthProvider } from "@/lib/auth";
import { CartProvider } from "@/lib/cart";
import { ThemeProvider } from "@/lib/theme";
import { siteConfig } from "@/lib/site-config";

// 07-09 피드백: 타이틀/본문을 Pretendard 로 단일화하고 두께 차이로만 구분한다.
const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "45 920",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 브랜드 검색(마리벨 / 마이리틀밸리 / MLV) 노출을 위한 키워드 중심 메타데이터
const siteTitle = `${siteConfig.name} ${siteConfig.fullName} (MLV) — 힐링 마인크래프트 서버`;
const siteDescription =
  `${siteConfig.name}(${siteConfig.fullName}, MLV)은 힐링 판타지 마인크래프트 서버입니다. ` +
  "다양한 콘텐츠와 안정적인 환경, 활발한 커뮤니티가 여러분을 기다립니다. 지금 마리벨에서 나만의 마인크래프트를 시작하세요.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteTitle,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteDescription,
  applicationName: siteConfig.name,
  keywords: [
    "마리벨",
    "마이리틀밸리",
    "MLV",
    "마리벨 서버",
    "마이리틀밸리 서버",
    "마인크래프트 서버",
    "마크 서버",
    "한국 마인크래프트 서버",
    "힐링 마인크래프트",
    "마인크래프트 힐링 서버",
    "play.mlv.town",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "/",
    siteName: siteConfig.name,
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/assets/brand/og.png", width: 1200, height: 630, alt: `${siteConfig.name} ${siteConfig.fullName}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/assets/brand/og.png"],
  },
  verification: {
    google: siteConfig.googleSiteVerification || undefined,
    other: siteConfig.naverSiteVerification
      ? { "naver-site-verification": siteConfig.naverSiteVerification }
      : {},
  },
};

// 검색엔진이 브랜드/사이트를 이해하도록 구조화 데이터(JSON-LD) 제공
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      alternateName: [siteConfig.fullName, "MLV"],
      url: siteConfig.url,
      logo: `${siteConfig.url}/assets/brand/maribel-logo.png`,
      sameAs: [
        siteConfig.sns.discord,
        siteConfig.sns.naver,
        siteConfig.sns.x,
        siteConfig.sns.instagram,
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      name: `${siteConfig.name} (${siteConfig.fullName})`,
      url: siteConfig.url,
      inLanguage: "ko-KR",
      publisher: { "@id": `${siteConfig.url}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface-1 text-white">
        {/* 테마 초기 적용(FOUC 방지): 저장된 선택 없으면 브라우저 환경(prefers-color-scheme)을 따른다 */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var s=localStorage.getItem('mlv-theme');var t=(s==='light'||s==='dark')?s:(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();",
          }}
        />
        <script
          type="application/ld+json"
          // 구조화 데이터(Organization + WebSite) — 브랜드 검색 이해도 향상
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <CartProvider>{children}</CartProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
