'use client';
import styles from "../../app/page.module.css";
import { Grid, Container, Typography, Box, Button, CircularProgress } from "@mui/material";
import News from "../../components/News/News";
import NewsFilter from "../../components/NewsFilter/NewsFilter";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { strapiClient } from "../../lib/strapi-client";
import { StrapiNewsItem, Category } from "@/types/news";

// Этот компонент содержит useSearchParams
export default function NewsListContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const observerTarget = useRef<HTMLDivElement>(null);

    const author = searchParams.get('author');
    const tag = searchParams.get('tag');
    const category = searchParams.get('category');
    const date = searchParams.get('date');

    const [news, setNews] = useState<StrapiNewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filteredNews, setFilteredNews] = useState<StrapiNewsItem[]>([]);
    const [displayedNews, setDisplayedNews] = useState<StrapiNewsItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // Настройки ленивой загрузки
    const ITEMS_PER_LOAD = 10;
    const [currentIndex, setCurrentIndex] = useState(ITEMS_PER_LOAD);

    // Загрузка новостей
    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                setError(null);
                console.log('🔄 Начало загрузки данных из Strapi...');

                const newsResponse = await strapiClient.testPopulate();
                const newsData = newsResponse.data || [];
                setNews(newsData);
                setFilteredNews(newsData);

                // Загружаем категории
                const categoriesResponse = await strapiClient.getCategories();
                console.log('📂 Загружено категорий:', categoriesResponse.data?.length);
                setCategories(categoriesResponse.data || []);

            } catch (error) {
                console.error('❌ Ошибка загрузки данных:', error);
                setError(`Ошибка загрузки: ${error instanceof Error ? error.message : String(error)}`);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // Фильтрация новостей
    useEffect(() => {
        console.log('🎯 Начало фильтрации. Всего новостей:', news.length);
        console.log('📅 Параметры фильтрации:', { category, tag, author, date });

        let filtered = news;

        // Фильтрация по категории
        if (category) {
            filtered = filtered.filter(item => item.category?.alias === category);
        }

        // Фильтрация по тегу
        if (tag) {
            filtered = filtered.filter(item => item.tags?.some(t => t.name === tag));
        }

        // Фильтрация по автору
        if (author) {
            filtered = filtered.filter(item => item.author?.name === author);
        }

        // Фильтрация по конкретной дате
        if (date) {
            const filterDate = new Date(date);
            filtered = filtered.filter(item => {
                const itemDate = new Date(item.created);
                return itemDate.toDateString() === filterDate.toDateString();
            });
            console.log('📅 Фильтрация по конкретной дате:', date, 'Найдено:', filtered.length);
        }

        // Фильтрация по диапазону дат
        const startDateParam = searchParams.get('startDate');
        const endDateParam = searchParams.get('endDate');

        if (startDateParam && endDateParam) {
            const startDate = new Date(startDateParam);
            const endDate = new Date(endDateParam);

            filtered = filtered.filter(item => {
                const itemDate = new Date(item.created);
                return itemDate >= startDate && itemDate <= endDate;
            });
        }

        console.log('✅ После фильтрации осталось новостей:', filtered.length);
        setFilteredNews(filtered);

        // Сбрасываем отображаемые новости
        const initialDisplay = filtered.slice(0, ITEMS_PER_LOAD);
        setDisplayedNews(initialDisplay);
        setCurrentIndex(ITEMS_PER_LOAD);
        setHasMore(filtered.length > ITEMS_PER_LOAD);

        console.log('📄 Установлены отображаемые новости:', initialDisplay.length);
    }, [category, tag, author, date, searchParams, news]);

    // Загрузка дополнительных новостей
    const loadMoreNews = useCallback(() => {
        if (loadingMore || !hasMore) {
            console.log('⏭️ Загрузка пропущена:', { loadingMore, hasMore });
            return;
        }

        console.log('🔄 Начало загрузки дополнительных новостей...');
        setLoadingMore(true);

        // Используем setTimeout для имитации загрузки
        setTimeout(() => {
            const nextIndex = currentIndex + ITEMS_PER_LOAD;
            const newNews = filteredNews.slice(currentIndex, nextIndex);

            console.log(`📥 Загружаем новости с ${currentIndex} по ${nextIndex}:`, newNews.length);

            setDisplayedNews(prev => {
                const updated = [...prev, ...newNews];
                console.log('📊 Обновленные отображаемые новости:', updated.length);
                return updated;
            });

            setCurrentIndex(nextIndex);
            setHasMore(nextIndex < filteredNews.length);
            setLoadingMore(false);

            console.log('✅ Загрузка завершена:', {
                nextIndex,
                hasMore: nextIndex < filteredNews.length,
                totalFiltered: filteredNews.length
            });
        }, 300);
    }, [currentIndex, filteredNews, hasMore, loadingMore]);

    // Observer для ленивой загрузки
    useEffect(() => {
        console.log('👀 Настройка Intersection Observer...');

        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                console.log('🎯 Observer triggered:', {
                    isIntersecting: target.isIntersecting,
                    hasMore,
                    loadingMore
                });

                if (target.isIntersecting && hasMore && !loadingMore) {
                    console.log('🚀 Запуск загрузки дополнительных новостей...');
                    loadMoreNews();
                }
            },
            {
                threshold: 0.1,
                rootMargin: '100px' // Загружаем заранее, когда до конца осталось 100px
            }
        );

        const currentTarget = observerTarget.current;
        console.log('🎯 Target element:', currentTarget);

        if (currentTarget) {
            observer.observe(currentTarget);
            console.log('✅ Observer установлен');
        } else {
            console.log('❌ Target element не найден');
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
                console.log('🧹 Observer очищен');
            }
        };
    }, [hasMore, loadingMore, loadMoreNews]);

    // Также добавим обработчик скролла на всякий случай
    useEffect(() => {
        const handleScroll = () => {
            if (loadingMore || !hasMore) return;

            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;

            // Если до конца страницы осталось меньше 500px
            if (scrollTop + clientHeight >= scrollHeight - 500) {
                console.log('📜 Скролл близко к концу, запуск загрузки...');
                loadMoreNews();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMoreNews, loadingMore, hasMore]);

    // Обработчик изменения фильтров
    const handleFilterChange = (filters: {
        category?: string;
        tag?: string;
        author?: string;
        dateRange?: { start: Date | null; end: Date | null };
        specificDate?: string;
    }) => {
        const params = new URLSearchParams();

        if (filters.category) params.set('category', filters.category);
        if (filters.tag) params.set('tag', filters.tag);
        if (filters.author) params.set('author', filters.author);

        if (filters.specificDate) {
            params.set('date', filters.specificDate);
        }

        if (filters.dateRange?.start && filters.dateRange?.end) {
            params.set('startDate', filters.dateRange.start.toISOString());
            params.set('endDate', filters.dateRange.end.toISOString());
        }

        router.push(`?${params.toString()}`, { scroll: false });
    };

    // Получение URL изображения
    const getNewsImage = (item: StrapiNewsItem) => {
        const defaultImage = "https://via.placeholder.com/800x400/4f46e5/ffffff?text=Нет+изображения";

        if (item.image?.url) {
            return item.image.url;
        }

        if (item.gallery && Array.isArray(item.gallery) && item.gallery.length > 0 && item.gallery[0]?.url) {
            return item.gallery[0].url;
        }

        return defaultImage;
    };

    // Получение тегов
    const getNewsTags = (item: StrapiNewsItem) => {
        if (!item.tags || !Array.isArray(item.tags) || item.tags.length === 0) {
            return [];
        }

        return item.tags.map(tag => tag?.name).filter(Boolean);
    };

    // Получение авторов
    const getAuthors = () => {
        const authorsMap = new Map();
        news.forEach(item => {
            if (item?.author) {
                authorsMap.set(item.author.id, item.author);
            }
        });
        return Array.from(authorsMap.values());
    }

    // Форматирование даты для отображения
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Ручная загрузка (на всякий случай)
    const handleManualLoad = () => {
        if (hasMore && !loadingMore) {
            loadMoreNews();
        }
    };

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ marginBottom: 4, marginTop: 4 }}>
                <Typography variant="h6">Загрузка новостей...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="xl" sx={{ marginBottom: 4, marginTop: 4 }}>
                <Typography variant="h6" color="error">{error}</Typography>
                <Button variant="contained" onClick={() => window.location.reload()}>
                    Попробовать снова
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ marginBottom: 4, marginTop: 4 }}>

            {(category || tag || author || date) && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h5">
                        Фильтр:
                        {category && ` Категория: ${category}`}
                        {tag && ` Тег: ${tag}`}
                        {author && ` Автор: ${author}`}
                        {date && ` Дата: ${formatDate(date)}`}
                    </Typography>
                </Box>
            )}

            <main className={styles.content}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <div className={styles.content__left}>
                            <NewsFilter
                                onFilterChange={handleFilterChange}
                                categories={categories}
                                availableTags={Array.from(new Set(news.flatMap(item => {
                                    const tags = item.tags;
                                    return tags ? tags.map(t => t.name) : [];
                                })))}
                                availableAuthors={getAuthors().map(author => author.name)}
                                currentFilters={{
                                    category: category || '',
                                    tag: tag || '',
                                    author: author || '',
                                    date: date || '',
                                }}
                            />
                        </div>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <div className={styles.content__right}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Найдено новостей: {filteredNews.length}
                                {date && ` за ${formatDate(date)}`}
                                {displayedNews.length < filteredNews.length && ` (показано: ${displayedNews.length})`}
                            </Typography>

                            {displayedNews.length > 0 ? (
                                <>
                                    <Grid container spacing={2}>
                                        {displayedNews.map((item) => {
                                            if (!item?.title) {
                                                return null;
                                            }

                                            return (
                                                <News
                                                    key={item.id}
                                                    title={item.title}
                                                    descSmall={item.introtext}
                                                    date={formatDate(item.created)}
                                                    link={`/news/${item.alias}`}
                                                    img={getNewsImage(item)}
                                                    tags={getNewsTags(item)}
                                                />
                                            );
                                        })}
                                    </Grid>

                                    {/* Индикатор загрузки и триггер для ленивой загрузки */}
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4, flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                        {loadingMore ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <CircularProgress size={24} />
                                                <Typography variant="body2">Загрузка новостей...</Typography>
                                            </Box>
                                        ) : hasMore ? (
                                            <>
                                                <Box
                                                    ref={observerTarget}
                                                    sx={{
                                                        padding: '20px',
                                                        textAlign: 'center',
                                                        width: '100%'
                                                    }}
                                                >
                                                    <Typography variant="body2" color="text.secondary">
                                                        Прокрутите вниз чтобы загрузить больше новостей
                                                    </Typography>
                                                </Box>
                                                <Button
                                                    variant="outlined"
                                                    onClick={handleManualLoad}
                                                    size="small"
                                                >
                                                    Загрузить еще
                                                </Button>
                                            </>
                                        ) : filteredNews.length > 0 ? (
                                            <Typography variant="body2" color="text.secondary">
                                                Все новости загружены ({filteredNews.length})
                                            </Typography>
                                        ) : null}
                                    </Box>
                                </>
                            ) : (
                                <Box sx={{ textAlign: 'center', padding: '40px' }}>
                                    <Typography variant="h6">
                                        {news.length === 0
                                            ? 'Новости не найдены'
                                            : date
                                                ? `Новости за ${formatDate(date)} не найдены`
                                                : 'Новости по выбранным фильтрам не найдены'
                                        }
                                    </Typography>
                                </Box>
                            )}
                        </div>
                    </Grid>
                </Grid>
            </main>
        </Container>
    );
}