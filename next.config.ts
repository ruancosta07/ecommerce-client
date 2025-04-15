import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "**",
      pathname: "**"
    },
    {protocol: "https",
      hostname: "files.stripe.com",
      pathname: "/links/**"
    }
    
  ],
  
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds:true
  }
};

export default nextConfig;
