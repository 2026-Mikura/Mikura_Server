import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Supabase Storage의 이미지를 <img> 태그에서 사용할 수 있도록 허용
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  // API Route에서 CORS 허용 (키오스크 프론트엔드 → 백엔드 요청)
  async headers() {
    const clientUrl = process.env.CLIENT_URL ?? "http://localhost:5173";
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: clientUrl },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type" },
        ],
      },
    ];
  },
};

export default nextConfig;
