import { NewsDetail } from "@repo/ui";
import { notFound } from "next/navigation";
import { NewsItem, NewsMetadata, NewsSlug } from "@/types/news";


interface Props {
    params: Promise<{ slug: NewsSlug  }>;
}

// ✅ Обязательная функция для output: 'export'
export async function generateStaticParams() {
    return [
        { slug: 'portal-gosuslug' as NewsSlug },
        { slug: 'cifrovaya-transformaciya' as NewsSlug },
        { slug: 'centr-cifrovogo-razvitiya' as NewsSlug }
    ];
}

// ✅ Генерация метаданных для SEO
export async function generateMetadata({ params }: Props) {
    const { slug } = await params; // ✅ Добавляем await

    const newsData: Record<NewsSlug, NewsMetadata> = {
        'portal-gosuslug': {
            title: "Запустили новый портал госуслуг",
            description: "Теперь доступ к сервисам стал проще и быстрее.",
        },
        'cifrovaya-transformaciya': {
            title: "В регионе стартует цифровая трансформация",
            description: "Программы по автоматизации муниципальных услуг.",
        },
        'centr-cifrovogo-razvitiya': {
            title: "Открытие центра цифрового развития",
            description: "Новый офис для поддержки IT-проектов.",
        }
    };

    const newsItem = newsData[slug];

    if (!newsItem) {
        return {
            title: 'Страница не найдена',
        };
    }

    return {
        title: newsItem.title,
        description: newsItem.description,
    };
}

export default async function NewsPage({ params }: Props) { // ✅ Добавляем async
    const { slug } = await params; // ✅ Добавляем await

    const newsData: Record<NewsSlug, NewsItem> = {
        'portal-gosuslug': {
            title: "Запустили новый портал госуслуг",
            desc: "Сегодня был запущен обновленный портал госуслуг. Теперь жители региона могут получать услуги быстрее и удобнее. Система была полностью переработана для улучшения пользовательского опыта.",
            date: "18 сентября 2025",
            img: "http://localhost:9000/assets.orgma.ru/pic2_2_282dc010f2.png",
        },
        'cifrovaya-transformaciya': {
            title: "В регионе стартует цифровая трансформация",
            desc: "Программа цифровой трансформации включает в себя автоматизацию муниципальных услуг, внедрение электронного документооборота и создание единой цифровой платформы для взаимодействия с гражданами.",
            date: "15 сентября 2025",
            img: "http://localhost:9000/assets.orgma.ru/pic2_2_282dc010f2.png",
        },
        'centr-cifrovogo-razvitiya': {
            title: "Открытие центра цифрового развития",
            desc: "Новый центр цифрового развития будет заниматься поддержкой IT-проектов, обучением цифровым навыкам и внедрением инновационных технологий в государственном секторе.",
            date: "10 сентября 2025",
            img: "http://localhost:9000/assets.orgma.ru/pic2_2_282dc010f2.png",
        }
    };

    const newsItem = newsData[slug];

    if (!newsItem) {
        notFound();
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <NewsDetail
                title={newsItem.title}
                desc={newsItem.desc}
                date={newsItem.date}
                img={newsItem.img}
            />
        </div>
    );
}