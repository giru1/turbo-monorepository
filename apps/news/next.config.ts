const nextConfig = {
    output: 'export',
    trailingSlash: true,
    distDir: 'dist',
    images: {
        unoptimized: true,
    },
    experimental: {
        externalDir: true, // ✅ Разрешаем импорт из внешних папок
        missingSuspenseWithCSRBailout: false,
    },
    transpilePackages: ['@repo/ui'],
    // Показывать подробные ошибки в dev режиме
    eslint: {
        // В dev режиме показывать ошибки как предупреждения
        ignoreDuringBuilds: false,
    },
    typescript: {
        // В dev режиме проверять типы строже
        ignoreBuildErrors: false,
    },
    // Включаем подробные ошибки
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
}


module.exports = nextConfig;


// export default nextConfig;