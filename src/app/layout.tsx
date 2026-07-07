import type { Metadata } from "next";
import { Geist_Mono, IBM_Plex_Sans_KR, Jua } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui";
import { AuthProvider } from "@/lib/auth";
import { CartProvider } from "@/lib/cart";
import { siteConfig } from "@/lib/site-config";

// 본문: 담백하지만 기계적이지 않은 한글 산세리프
const bodyFont = IBM_Plex_Sans_KR({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-plex",
  display: "swap",
});

// 제목: 둥글둥글한 디스플레이체 — "마이리틀밸리"의 아기자기한 인상을 만든다
const displayFont = Jua({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-jua",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteTitle = `${siteConfig.name} — ${siteConfig.fullName} 공식 사이트`;
const siteDescription = "다양한 콘텐츠와 안정적인 환경, 그리고 활발한 커뮤니티가 여러분을 기다립니다.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteTitle,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "/",
    siteName: siteConfig.name,
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${bodyFont.variable} ${displayFont.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface-1 text-white">
        <ToastProvider>
          <AuthProvider>
            <CartProvider>{children}</CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
