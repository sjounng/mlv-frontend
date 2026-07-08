import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

// 정적 공개 라우트만 노출한다. 상품 상세는 CSR 이라 제외 (SSR 전환 시 함께 추가).
const publicRoutes = [
  "",
  "/shop",
  "/event",
  "/contact",
  "/info/terms",
  "/info/privacy",
  "/info/refund",
  "/info/faq",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/shop" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
