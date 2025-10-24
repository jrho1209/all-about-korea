/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.sanity.io'],
    unoptimized: true, // 이미지 최적화 비활성화
  },
  // CSP 제거하고 다른 방식으로 보안 적용
};


export default nextConfig;
