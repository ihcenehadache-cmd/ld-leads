import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Configuration Webpack pour DuckDB */
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('duckdb');
    }
    return config;
  },
  /* Correction : On ne met PAS turbopack: {} 
     On laisse Next.js gérer le switch automatiquement
  */
  experimental: {
    // Si tu as d'autres options expérimentales, elles vont ici
  }
};

export default nextConfig;

