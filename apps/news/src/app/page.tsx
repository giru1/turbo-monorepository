'use client';
import styles from "./page.module.css";
import { Grid, Container, Typography, Box, Button, Pagination, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
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
  imageurl: any | null;
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

  const author = searchParams.get('author');
  const tag = searchParams.get('tag');
  const category = searchParams.get('category');
  const date = searchParams.get('date');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');

  const [news, setNews] = useState<StrapiNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredNews, setFilteredNews] = useState<StrapiNewsItem[]>([]);
  const [paginatedNews, setPaginatedNews] = useState<StrapiNewsItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Настройки пагинации
  const pageSizes = [10, 20, 30, 50, 100];
  const totalPages = Math.ceil(filteredNews.length / pageSize);

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
  }, [category, tag, author, date, searchParams, news]);

  // Пагинация отфильтрованных новостей
  useEffect(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginated = filteredNews.slice(startIndex, endIndex);

    setPaginatedNews(paginated);
    console.log(`📄 Пагинация: страница ${page}, размер ${pageSize}, показано ${paginated.length} из ${filteredNews.length}`);
  }, [filteredNews, page, pageSize]);

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

    // Сбрасываем страницу при изменении фильтров
    params.set('page', '1');
    params.set('pageSize', pageSize.toString());

    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Обработчик изменения страницы
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', value.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Обработчик изменения размера страницы
  const handlePageSizeChange = (event: any) => {
    const newPageSize = event.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set('pageSize', newPageSize.toString());
    params.set('page', '1'); // Сбрасываем на первую страницу при изменении размера
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Получение URL изображения
  const getNewsImage = (item: StrapiNewsItem) => {
    const defaultImage = "https://via.placeholder.com/800x400/4f46e5/ffffff?text=Нет+изображения";

    if (item.image?.url) {
      const imageUrl = item.image.url;
      console.log('🖼️ Используется главное изображение из Strapi:', imageUrl);
      return imageUrl;
    }

    if (item.imageurl) {
      console.log('🖼️ Используется imageurl:', item.imageurl);
      return item.imageurl;
    }

    if (item.gallery && Array.isArray(item.gallery) && item.gallery.length > 0 && item.gallery[0]?.url) {
      const imageUrl = item.gallery[0].url;
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
        .map(created => new Date(created).toISOString().split('T')[0]);

    return Array.from(new Set(dates)).sort((a, b) =>
        new Date(b).getTime() - new Date(a).getTime()
    );
  }

  // Форматирование даты для отображения
  const formatDate = (dateString: string) => {
    const date = new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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

  return (
      <Container maxWidth="xl" sx={{ marginBottom: 4, marginTop: 4 }}>
        {/* Отладочная информация */}
        {/*<Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>*/}
        {/*  <Typography variant="body2" color="text.secondary">*/}
        {/*    Отладка: Всего новостей {news.length}, отфильтровано {filteredNews.length}*/}
        {/*    {date && `, фильтр по дате: ${formatDate(date)}`}*/}
        {/*  </Typography>*/}
        {/*</Box>*/}

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
                    availableDates={getAvailableDates()}
                    currentFilters={{
                      category: category || '',
                      tag: tag || '',
                      author: author || '',
                      specificDate: date || '',
                    }}
                />
              </div>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <div className={styles.content__right}>
                {/* Панель управления пагинацией */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">
                    Найдено новостей: {filteredNews.length}
                    {date && ` за ${formatDate(date)}`}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2">
                      Новостей на странице:
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 80 }}>
                      <Select
                          value={pageSize}
                          onChange={handlePageSizeChange}
                          displayEmpty
                      >
                        {pageSizes.map(size => (
                            <MenuItem key={size} value={size}>
                              {size}
                            </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>

                {/* Список новостей */}
                {paginatedNews.length > 0 ? (
                    <>
                      <Grid container spacing={2}>
                        {paginatedNews.map((item) => {
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

                      {/* Пагинация */}
                      {totalPages > 1 && (
                          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                                size="large"
                                showFirstButton
                                showLastButton
                            />
                          </Box>
                      )}

                      {/* Информация о пагинации */}
                      <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Показано {paginatedNews.length} из {filteredNews.length} новостей
                          {totalPages > 1 && ` (страница ${page} из ${totalPages})`}
                        </Typography>
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