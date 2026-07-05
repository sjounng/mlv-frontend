import type { NextConfig } from "next";

// 업로드 이미지는 백엔드(/uploads)가 서빙한다. 빌드 시점의 API 주소를 이미지 최적화 허용 목록에 넣는다.
// ("||" 사용: docker build arg 미지정 시 빈 문자열이 들어올 수 있다)
const apiBase = new URL(process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080");

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: apiBase.protocol === "https:" ? "https" : "http",
        hostname: apiBase.hostname,
        port: apiBase.port,
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
