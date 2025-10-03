'use client';
import styles from "./page.module.css";
import { Grid, Container, Typography, Box, Button } from "@mui/material";
import News from "../components/News/News";
import NewsFilter from "../components/NewsFilter/NewsFilter";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { strapiClient } from "./../lib/strapi-client";

interface StrapiNewsItem {
  id: number;
  title: string;
  alias: string;
  introtext: string;
  fulltext: string;
  created: string;
  hits: number;
  featured: boolean;
  image: any | null;
  gallery: any | null;
  category: {
    id: number;
    name: string;
    alias: string;
  } | null;
  author: {
    id: number;
    name: string;
    profile: any | null;
  } | null;
  tags: any[];
}

export default function NewsListPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const participant = searchParams.get('participant');
  const date = searchParams.get('date');
  const tag = searchParams.get('tag');
  const category = searchParams.get('category');

  const [news, setNews] = useState<StrapiNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredNews, setFilteredNews] = useState<StrapiNewsItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Загрузка новостей
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        console.log('🔄 Начало загрузки данных из Strapi...');

        const newsResponse = await strapiClient.testPopulate();
        setNews(newsResponse.data || []);
        setFilteredNews(newsResponse.data || []);

        // Загружаем категории
        const categoriesResponse = await strapiClient.getCategories();
        console.log('📂 Загружено категорий:', categoriesResponse.data?.length);
        setCategories(categoriesResponse.data || []);

      } catch (error) {
        console.error('❌ Ошибка загрузки данных:', error);
        setError(`Ошибка загрузки: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Фильтрация новостей
  useEffect(() => {
    console.log('🎯 Начало фильтрации. Всего новостей:', news.length);

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
    if (participant) {
      filtered = filtered.filter(item => item.author?.name === participant);
    }

    // Фильтрация по одиночной дате
    if (date && !startDate && !endDate) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.created).toLocaleDateString('ru-RU');
        return itemDate === date;
      });
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
  }, [category, tag, participant, date, searchParams, news]);

  // Обработчик изменения фильтров
  const handleFilterChange = (filters: {
    category?: string;
    tag?: string;
    author?: string;
    date?: string;
    dateRange?: { start: Date | null; end: Date | null };
  }) => {
    const params = new URLSearchParams();

    if (filters.category) params.set('category', filters.category);
    if (filters.tag) params.set('tag', filters.tag);
    if (filters.author) params.set('participant', filters.author);
    if (filters.date) params.set('date', filters.date);

    // Для диапазона дат сохраняем в URL как startDate и endDate
    if (filters.dateRange?.start && filters.dateRange?.end) {
      params.set('startDate', filters.dateRange.start.toISOString());
      params.set('endDate', filters.dateRange.end.toISOString());
      params.delete('date'); // Удаляем одиночную дату если выбран диапазон
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Получение URL изображения
  const getNewsImage = (item: StrapiNewsItem) => {
    const defaultImage = "http://localhost:9000/assets.orgma.ru/pic2_2_2c7257fb6c.png";

    // Проверяем главное изображение
    if (item.image?.url) {
      const imageUrl = `http://localhost:1337${item.image.url}`;
      console.log('🖼️ Используется главное изображение:', imageUrl);
      return imageUrl;
    }

    // Проверяем галерею
    if (item.gallery && Array.isArray(item.gallery) && item.gallery.length > 0 && item.gallery[0]?.url) {
      const imageUrl = `http://localhost:1337${item.gallery[0].url}`;
      console.log('🖼️ Используется изображение из галереи:', imageUrl);
      return imageUrl;
    }

    console.log('🖼️ Используется изображение по умолчанию');
    return defaultImage;
  };

// Получение тегов
  const getNewsTags = (item: StrapiNewsItem) => {
    if (!item.tags || !Array.isArray(item.tags) || item.tags.length === 0) {
      return [];
    }

    const tags = item.tags
        .map(tag => tag?.name)
        .filter(Boolean);

    console.log('🏷️ Теги для новости:', item.title, tags);
    return tags;
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

// Получение дат
  const getAvailableDates = () => {
    const dates = news
        .map(item => item?.created)
        .filter(Boolean)
        .map(created => new Date(created).toLocaleDateString('ru-RU'));

    return Array.from(new Set(dates)).sort((a, b) =>
        new Date(b.split('.').reverse().join('-')).getTime() -
        new Date(a.split('.').reverse().join('-')).getTime()
    );
  }

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    console.log('📅 Форматирование даты:', dateString, '→', date);
    return date;
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

  console.log('🎨 Рендеринг компонента. Новостей для отображения:', filteredNews.length);

  return (
      <Container maxWidth="xl" sx={{ marginBottom: 4, marginTop: 4 }}>
        {/* Отладочная информация */}
        <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Отладка: Всего новостей {news.length}, отфильтровано {filteredNews.length}
          </Typography>
        </Box>

        {(category || tag || participant || date) && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5">
                Фильтр:
                {category && ` Категория: ${category}`}
                {tag && ` Тег: ${tag}`}
                {participant && ` Автор: ${participant}`}
                {date && ` Дата: ${date}`}
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
                    availableDates={getAvailableDates()}
                    currentFilters={{
                      category: category || '',
                      tag: tag || '',
                      author: participant || '',
                      date: date || ''
                    }}
                />
              </div>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <div className={styles.content__right}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Найдено новостей: {filteredNews.length}
                </Typography>

                {filteredNews.length > 0 ? (
                    <Grid container spacing={2}>
                      {filteredNews.map((item) => {
                        if (!item?.title) {
                          console.log('⚠️ Пропущен элемент с отсутствующим заголовком:', item?.id);
                          return null;
                        }

                        console.log('📄 Рендеринг новости:', item.title);
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
                ) : (
                    <Box sx={{ textAlign: 'center', padding: '40px' }}>
                      <Typography variant="h6">
                        {news.length === 0 ? 'Новости не найдены' : 'Новости по выбранным фильтрам не найдены'}
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