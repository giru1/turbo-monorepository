import NewsDetail from "../../../components/NewsDetail/NewsDetail";
import { notFound } from "next/navigation";
import { NewsItem, Participant } from "@/types/news";
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
            desc: newsItem.introtext + (newsItem.fulltext ? `\n\n${newsItem.fulltext}` : ''),
            date: new Date(newsItem.created).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }),
            tags: newsItem.tags?.map(tag => tag.name) || [],
            images: getNewsImages(newsItem),
            participants: getParticipants(newsItem),
            category: newsItem.category?.name || 'Без категории',
            hits: newsItem.hits || 0
        };

        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Grid container spacing={4}>
                    <Grid size={{xs: 12, md: 4}}>
                        <NewsSidebar
                            participants={formattedNewsItem.participants}
                            date={formattedNewsItem.date}
                            tags={formattedNewsItem.tags}
                            currentSlug={slug}
                            category={formattedNewsItem.category}
                            hits={formattedNewsItem.hits}
                        />
                    </Grid>
                    <Grid size={{xs: 12, md: 8}}>
                        <NewsDetail
                            title={formattedNewsItem.title}
                            desc={formattedNewsItem.desc}
                            date={formattedNewsItem.date}
                            tags={formattedNewsItem.tags}
                            images={formattedNewsItem.images}
                            participants={formattedNewsItem.participants}
                            category={formattedNewsItem.category}
                            hits={formattedNewsItem.hits}
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
function getNewsImages(newsItem: any): string[] {
    const images: string[] = [];
    const defaultImage = "http://localhost:9000/assets.orgma.ru/pic2_2_2c7257fb6c.png";

    console.log('🖼️ Поиск изображений для новости:', newsItem.title);
    console.log('📸 Главное изображение:', newsItem.image);
    console.log('🖼️ Галерея:', newsItem.gallery);

    // Главное изображение
    if (newsItem.image?.url) {
        const imageUrl = `http://localhost:1337${newsItem.image.url}`;
        images.push(imageUrl);
        console.log('✅ Добавлено главное изображение:', imageUrl);
    }

    // Изображения из галереи
    if (newsItem.gallery && Array.isArray(newsItem.gallery)) {
        newsItem.gallery.forEach((img: any) => {
            if (img.url) {
                const imageUrl = `http://localhost:1337${img.url}`;
                images.push(imageUrl);
                console.log('✅ Добавлено изображение из галереи:', imageUrl);
            }
        });
    }

    // Если нет изображений, используем дефолтное
    if (images.length === 0) {
        images.push(defaultImage);
        console.log('🖼️ Используется изображение по умолчанию');
    }

    console.log('🎨 Всего изображений:', images.length);
    return images;
}

function getParticipants(newsItem: any): Participant[] {
    const participants: Participant[] = [];

    console.log('👥 Поиск участников для новости:', newsItem.title);
    console.log('✍️ Автор:', newsItem.author);

    if (newsItem.author) {
        participants.push({
            id: newsItem.author.id.toString(),
            name: newsItem.author.name,
            role: 'Автор',
            link: `/participants/${newsItem.author.id}`,
            avatar: newsItem.author.profile?.url ?
                `http://localhost:1337${newsItem.author.profile.url}` : null
        });
        console.log('✅ Добавлен автор:', newsItem.author.name);
    }

    console.log('👥 Всего участников:', participants.length);
    return participants;
}