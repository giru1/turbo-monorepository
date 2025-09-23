import { NewsDetail } from "@repo/ui";
import { notFound } from "next/navigation";
import { NewsItem, NewsSlug, Participant } from "@/types/news";
import { Grid, Container, Box } from "@mui/material";
import NewsSidebar from "./components/NewsSidebar";

interface Props {
    params: Promise<{ slug: NewsSlug }>;
}

export async function generateStaticParams() {
    return [
        { slug: 'portal-gosuslug' as NewsSlug },
        { slug: 'cifrovaya-transformaciya' as NewsSlug },
        { slug: 'centr-cifrovogo-razvitiya' as NewsSlug }
    ];
}

export default async function NewsPage({ params }: Props) {
    const { slug } = await params;

    const newsData: Record<NewsSlug, NewsItem> = {
        'portal-gosuslug': {
            title: "Запустили новый портал госуслуг",
            desc: "Сегодня был запущен обновленный портал госуслуг. Теперь жители региона могут получать услуги быстрее и удобнее. Система была полностью переработана для улучшения пользовательского опыта.",
            date: "18 сентября 2025",
            tags: ["новости", "портал", "госуслуг"],
            images: [
                "http://localhost:9000/assets.orgma.ru/pic2_2_282dc010f2.png",
                "http://localhost:9000/assets.orgma.ru/pic2_2_2c7257fb6c.png",
                "http://localhost:9000/assets.orgma.ru/pic2_2_282dc010f2.png"
            ],
            participants: [
                { id: "1", name: "Иванов Иван", role: "Руководитель проекта", link: "/participants/1" },
                { id: "2", name: "Петрова Анна", role: "Разработчик", link: "/participants/2" },
                { id: "3", name: "Сидоров Алексей", role: "Дизайнер", link: "/participants/3" }
            ]
        },
        'cifrovaya-transformaciya': {
            title: "В регионе стартует цифровая трансформация",
            desc: "Программа цифровой трансформации включает в себя автоматизацию муниципальных услуг, внедрение электронного документооборота и создание единой цифровой платформы для взаимодействия с гражданами.",
            date: "15 сентября 2025",
            tags: ["новости", "цифровая", "трансформация"],
            images: [
                "http://localhost:9000/assets.orgma.ru/pic2_2_2c7257fb6c.png",
                "http://localhost:9000/assets.orgma.ru/pic2_2_282dc010f2.png"
            ],
            participants: [
                { id: "4", name: "Кузнецов Дмитрий", role: "Министр цифрового развития", link: "/participants/4" },
                { id: "5", name: "Федорова Мария", role: "Координатор проекта", link: "/participants/5" }
            ]
        },
        'centr-cifrovogo-razvitiya': {
            title: "Открытие центра цифрового развития",
            desc: "Новый центр цифрового развития будет заниматься поддержкой IT-проектов, обучением цифровым навыкам и внедрением инновационных технологий в государственном секторе.",
            date: "10 сентября 2025",
            tags: ["новости", "центр", "цифрового", "развития"],
            images: [
                "http://localhost:9000/assets.orgma.ru/pic2_2_282dc010f2.png",
                "http://localhost:9000/assets.orgma.ru/pic2_2_2c7257fb6c.png",
                "http://localhost:9000/assets.orgma.ru/pic2_2_282dc010f2.png",
                "http://localhost:9000/assets.orgma.ru/pic2_2_2c7257fb6c.png"
            ],
            participants: [
                { id: "6", name: "Васильев Сергей", role: "Директор центра", link: "/participants/6" },
                { id: "7", name: "Николаева Ольга", role: "IT-специалист", link: "/participants/7" },
                { id: "8", name: "Алексеев Павел", role: "Менеджер проектов", link: "/participants/8" }
            ]
        }
    };

    const newsItem = newsData[slug];

    if (!newsItem) {
        notFound();
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Grid container spacing={4}>
                {/* Боковая панель - 4 колонки */}
                <Grid size={{xs: 12, md: 4}}>
                    <NewsSidebar
                        participants={newsItem.participants}
                        date={newsItem.date}
                        tags={newsItem.tags}
                        currentSlug={slug}
                    />
                </Grid>
                {/* Основной контент - 8 колонок */}
                <Grid size={{xs: 12, md: 8}}>
                    <NewsDetail
                        title={newsItem.title}
                        desc={newsItem.desc}
                        date={newsItem.date}
                        tags={newsItem.tags}
                        images={newsItem.images}
                        participants={newsItem.participants}
                    />
                </Grid>


            </Grid>
        </Container>
    );
}