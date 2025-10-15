const nextConfig = {
    output: 'export',
    trailingSlash: true,
    basePath: '/news/dist', // Оставьте пустым для текущей директории
    assetPrefix: './', // Оставьте пустым для текущей директории
    distDir: 'dist',
    images: {
        unoptimized: true,
    },
    generateBuildId: async () => 'static-build',
    experimental: {

        externalDir: true, // ✅ Разрешаем импорт из внешних папок
        missingSuspenseWithCSRBailout: false,
    },
    transpilePackages: ['@repo/ui'],
    // Показывать подробные ошибки в dev режиме
    eslint: {
        // В dev режиме показывать ошибки как предупреждения
        ignoreDuringBuilds: true, // Временно отключить ESLint при билде
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