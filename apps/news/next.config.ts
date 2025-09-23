const nextConfig = {
    output: 'export',
    trailingSlash: true,
    distDir: 'dist',
    images: {
        unoptimized: true,
    },
    experimental: {
        externalDir: true, // ✅ Разрешаем импорт из внешних папок
    },
    transpilePackages: ['@repo/ui'],
}


module.exports = nextConfig;


// export default nextConfig;