import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "dpvbxbfpfnahmtbhcadf.supabase.co",
      pathname: "/storage/v1/object/public/utilsBucket/**"
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
