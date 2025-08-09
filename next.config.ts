import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */

  // Sentry configuration
  sentry: {
    // Suppresses source map uploading logs during build
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableServerWebpackPlugin: false,
    disableClientWebpackPlugin: false,
  },

  // Enable source maps for better error tracking
  productionBrowserSourceMaps: true,
};

export default nextConfig;
