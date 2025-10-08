import NewsDetail from "../../../components/NewsDetail/NewsDetail";
import { notFound } from "next/navigation";
import { NewsItem, Author, Tag, Category } from "@/types/news";
import { Grid, Container } from "@mui/material";
import NewsSidebar from "./components/NewsSidebar";
import { strapiClient } from "@/lib/strapi-client";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    try {
        console.log('🔄 Генерация статических параметров для новостей...');

        // Получаем все новости из Strapi
        const newsResponse = await strapiClient.getNewsItemsSimple();
        const news = newsResponse.data || [];

        console.log('📝 Найдено новостей для статической генерации:', news.length);

        // Возвращаем все slug'и для статической генерации
        const params = news.map((item) => ({
            slug: item.alias,
        }));

        console.log('✅ Сгенерированы параметры:', params);
        return params;
    } catch (error) {
        console.error('❌ Ошибка при получении slug для статической генерации:', error);
        return [];
    }
}

export default async function NewsPage({ params }: Props) {
    const { slug } = await params;

    console.log('🔄 Загрузка новости по slug:', slug);

    try {
        // Получаем данные конкретной новости по slug
        const newsResponse = await strapiClient.getNewsBySlug(slug);
        console.log('📄 Ответ от Strapi:', newsResponse);

        const newsItem = newsResponse.data?.[0];

        if (!newsItem) {
            console.log('❌ Новость не найдена для slug:', slug);
            notFound();
        }

        console.log('✅ Найдена новость:', newsItem.title);

        // Форматируем данные для компонента
        const formattedNewsItem: NewsItem = {
            title: newsItem.title,
            desc: newsItem.introtext + (newsItem.fulltext ? `${newsItem.fulltext}` : ''),
            date: new Date(newsItem.created).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }),
            image: newsItem.image?.url ? newsItem.image.url : null,
            imageurl: newsItem.imageurl,
            tags: newsItem.tags?.map(tag => tag.name) || [],
            gallery: getNewsGallery(newsItem),
            authors: getAuthors(newsItem),
            category: newsItem.category?.name || 'Без категории',
        };
        console.log('📝 Форматированные данные новости:', formattedNewsItem);
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Grid container spacing={4}>
                    <Grid size={{xs: 12, md: 4}}>
                        <NewsSidebar
                            authors={formattedNewsItem.authors}
                            date={formattedNewsItem.date}
                            tags={formattedNewsItem.tags}
                            currentSlug={slug}
                            category={formattedNewsItem.category}
                        />
                    </Grid>
                    <Grid size={{xs: 12, md: 8}}>
                        <NewsDetail
                            title={formattedNewsItem.title}
                            desc={formattedNewsItem.desc}
                            date={formattedNewsItem.date}
                            tags={formattedNewsItem.tags}
                            image={formattedNewsItem.imageurl}
                            imageurl={formattedNewsItem.imageurl}
                            gallery={formattedNewsItem.gallery}
                            authors={formattedNewsItem.authors}
                            category={formattedNewsItem.category}
                        />
                    </Grid>
                </Grid>
            </Container>
        );

    } catch (error) {
        console.error('❌ Ошибка загрузки новости:', error);
        notFound();
    }
}

// Вспомогательные функции
function getNewsGallery(newsItem: any): string[] {
    console.log('🖼️ Поиск изображений для новости:', newsItem.title);
    console.log('📸 Главное изображение:', newsItem.image);
    console.log('🔗 Image URL:', newsItem.imageurl);
    console.log('🖼️ Галерея:', newsItem.gallery);

    const images: string[] = [];

    // 1. Сначала проверяем imageurl (внешняя ссылка)
    if (newsItem.imageurl) {
        images.push(newsItem.imageurl);
        console.log('✅ Добавлено изображение из imageurl:', newsItem.imageurl);
    }

    // 2. Затем проверяем локальное изображение из Strapi
    if (newsItem.image?.url) {
        const strapiImageUrl = newsItem.image.url;
        // Добавляем только если это не дубликат
        if (!images.includes(strapiImageUrl)) {
            images.push(strapiImageUrl);
            console.log('✅ Добавлено изображение из Strapi:', strapiImageUrl);
        }
    }

    // 3. Добавляем изображения из галереи
    if (newsItem.gallery && Array.isArray(newsItem.gallery)) {
        newsItem.gallery.forEach((img: any) => {
            if (img.url) {
                const galleryImageUrl = img.url;
                // Добавляем только если это не дубликат
                if (!images.includes(galleryImageUrl)) {
                    images.push(galleryImageUrl);
                    console.log('✅ Добавлено изображение из галереи:', galleryImageUrl);
                }
            }
        });
    }

    // 4. Если вообще нет изображений, используем заглушку
    if (images.length === 0) {
        const defaultImage = "https://via.placeholder.com/800x400/4f46e5/ffffff?text=Нет+изображения";
        images.push(defaultImage);
        console.log('🖼️ Используется изображение-заглушка');
    }

    console.log('🎨 Всего изображений в галерее:', images.length);
    return images;
}

function getAuthors(newsItem: any): Author[] {
    const authors: Author[] = [];

    console.log('👥 Поиск участников для новости:', newsItem.title);
    console.log('✍️ Автор:', newsItem.author);

    if (newsItem.author) {
        authors.push({
            id: newsItem.author.id.toString(),
            name: newsItem.author.name,
        });
        console.log('✅ Добавлен автор:', newsItem.author.name);
    }

    console.log('👥 Всего участников:', authors.length);
    return authors;
}