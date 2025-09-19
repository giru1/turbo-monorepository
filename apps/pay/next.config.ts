import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'export',
    trailingSlash: true,
    distDir: 'dist',
    // assetPrefix: './', // ✅ Добавьте эту строку
    images: {
        unoptimized: true, // ✅ Для статического экспорта
    },
};

export default nextConfig;
