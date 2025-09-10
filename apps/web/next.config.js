/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    trailingSlash: true,
    distDir: 'dist',
    // assetPrefix: './', // ✅ Добавьте эту строку
    images: {
        unoptimized: true, // ✅ Для статического экспорта
    },
};

export default nextConfig;
