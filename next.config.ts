import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  // GitHub Pages serves the site under /wlg-nz-quizzes/; Vercel serves at the
  // root. Vercel sets VERCEL=1 during builds, so no manual env is needed.
  basePath: process.env.VERCEL ? '' : '/wlg-nz-quizzes',
  trailingSlash: true,
  reactStrictMode: true,
  allowedDevOrigins: ['127.0.0.1'],
};

export default nextConfig;
