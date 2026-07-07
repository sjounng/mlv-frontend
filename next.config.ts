import type { NextConfig } from "next";

// 업로드 이미지는 백엔드(/uploads)가 서빙한다. 빌드 시점의 API 주소를 이미지 최적화 허용 목록에 넣는다.
// ("||" 사용: docker build arg 미지정 시 빈 문자열이 들어올 수 있다)
const apiBase = new URL(process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080");

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // 로컬 개발에서 백엔드(127.0.0.1)의 업로드 이미지를 최적화하려면 필요.
    // 운영에서는 api.mlv.town 이 공인 IP 라 불필요하며, SSRF 방어를 위해 켜지 않는다.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
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
