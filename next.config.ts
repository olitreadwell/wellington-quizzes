import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/wellington-quizzes',
  trailingSlash: true,
  reactStrictMode: true,
  allowedDevOrigins: ['127.0.0.1'],
};

export default nextConfig;
