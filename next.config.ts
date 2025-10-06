import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // experimental: {
  //   ...({ allowedDevOrigins: ["http://192.168.100.234:3000", "http://localhost:3000"] } as any),
  // },

  experimental: {
    serverActions: {
      allowedOrigins: ['192.168.100.234:3000', 'localhost:3000', 'ck5cg6wf-3000.asse.devtunnels.ms'],
    },
  },

};

export default nextConfig;
