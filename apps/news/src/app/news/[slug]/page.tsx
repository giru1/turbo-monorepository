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
            image: getMainImage(newsItem), // Используем исправленную функцию
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
                            originalDate={newsItem.created} // Передаем оригинальную дату из Strapi
                            tags={formattedNewsItem.tags}
                            currentSlug={slug}
                        />
                    </Grid>
                    <Grid size={{xs: 12, md: 8}}>
                        <NewsDetail
                            title={formattedNewsItem.title}
                            desc={formattedNewsItem.desc}
                            date={formattedNewsItem.date}
                            tags={formattedNewsItem.tags}
                            image={formattedNewsItem.image} // Используем image вместо imageurl
                            imageurl={formattedNewsItem.image} // Тоже используем image для consistency
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

// Функция для получения основного изображения
function getMainImage(newsItem: any): string | null {
    console.log('📸 Поиск основного изображения для новости:', newsItem.title);

    // 1. Приоритет: локальное изображение из Strapi
    if (newsItem.image?.url) {
        const imageUrl = newsItem.image.url;
        console.log('✅ Основное изображение из Strapi:', imageUrl);
        return imageUrl;
    }

    // 2. Резерв: imageurl (внешняя ссылка)
    if (newsItem.imageurl) {
        console.log('✅ Основное изображение из imageurl:', newsItem.imageurl);
        return newsItem.imageurl;
    }

    // 3. Заглушка если нет изображений
    console.log('🖼️ Основное изображение не найдено, используется заглушка');
    return "https://via.placeholder.com/800x400/4f46e5/ffffff?text=Нет+изображения";
}

// Вспомогательные функции
function getNewsGallery(newsItem: any): string[] {
    console.log('🖼️ Поиск изображений галереи для новости:', newsItem.title);
    console.log('📸 Главное изображение:', newsItem.image);
    console.log('🔗 Image URL:', newsItem.imageurl);
    console.log('🖼️ Галерея:', newsItem.gallery);

    const images: string[] = [];
    const mainImage = getMainImage(newsItem);

    // Добавляем изображения из галереи (исключая дубликаты с основным изображением)
    if (newsItem.gallery && Array.isArray(newsItem.gallery)) {
        newsItem.gallery.forEach((img: any, index: number) => {
            if (img.url) {
                const galleryImageUrl = img.url;
                // Проверяем, что это не дубликат основного изображения
                if (galleryImageUrl !== mainImage && !images.includes(galleryImageUrl)) {
                    images.push(galleryImageUrl);
                    console.log(`✅ Добавлено изображение из галереи [${index}]:`, galleryImageUrl);
                } else if (galleryImageUrl === mainImage) {
                    console.log(`⏭️ Пропущено дубликат основного изображения [${index}]`);
                }
            }
        });
    }

    // Если в галерее нет изображений, но есть основное - используем его
    if (images.length === 0 && mainImage) {
        images.push(mainImage);
        console.log('🔄 Использовано основное изображение в галерее');
    }

    // Если вообще нет изображений, используем заглушку
    if (images.length === 0) {
        const defaultImage = "https://via.placeholder.com/800x400/4f46e5/ffffff?text=Нет+изображения";
        images.push(defaultImage);
        console.log('🖼️ Используется изображение-заглушка в галерее');
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