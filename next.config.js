/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['mt-client-api-v1.agiliumtrade.agiliumtrade.ai'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
      };
    }
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['metaapi.cloud-sdk'],
  },
};

module.exports = nextConfig;