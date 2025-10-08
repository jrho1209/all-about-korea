/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.sanity.io'],
    unoptimized: true, // 이미지 최적화 비활성화
  },
};

export default nextConfig;
