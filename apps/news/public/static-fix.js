// Исправление путей для статического экспорта
if (window.location.protocol === 'file:') {
    const base = document.createElement('base');
    base.href = './';
    document.head.appendChild(base);

    // Исправляем пути для всех ресурсов
    document.querySelectorAll('link[href], script[src]').forEach(el => {
        if (el.href && !el.href.startsWith('http')) {
            el.href = './' + el.href;
        }
        if (el.src && !el.src.startsWith('http')) {
            el.src = './' + el.src;
        }
    });
}