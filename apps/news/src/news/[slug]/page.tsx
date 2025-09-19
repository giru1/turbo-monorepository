import { NewsDetail } from "@repo/ui";

interface Props {
    params: { slug: string };
}

export default function NewsPage({ params }: Props) {
    // ⚡ В реальном проекте тут лучше делать fetch из Strapi по slug
    const dummyData = {
        title: "Запустили новый портал госуслуг",
        desc: "Сегодня был запущен обновленный портал госуслуг. Теперь жители региона могут получать услуги быстрее и удобнее. ...",
        date: "18 сентября 2025",
        img: "http://localhost:9000/assets.orgma.ru/news1.png",
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <NewsDetail
                title={dummyData.title}
                desc={dummyData.desc}
                date={dummyData.date}
                img={dummyData.img}
            />
        </div>
    );
}
