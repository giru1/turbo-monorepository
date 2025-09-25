'use client';
import styles from "./page.module.css";
import { Grid, Container, Typography, Box } from "@mui/material";
import News from "../components/News/News";
import NewsFilter from "../components/NewsFilter/NewsFilter";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
// import EnhancedNewsFilter from "./components/EnhancedNewsFilter";

export default function NewsListPage() {
  const searchParams = useSearchParams();
  const participant = searchParams.get('participant');
  const date = searchParams.get('date');
  const tag = searchParams.get('tag');

  const [filteredNews, setFilteredNews] = useState(newsList);

  // Получаем всех уникальных участников из всех новостей
  const allParticipants = Array.from(
      new Map(
          newsList.flatMap(news =>
              news.participants?.map(p => [p.id, p]) || []
          )
      ).values()
  );

  // Получаем все уникальные даты из новостей
  const availableDates = Array.from(new Set(newsList.map(news => news.date))).sort((a, b) =>
      new Date(b.split(' ').reverse().join('-')).getTime() - new Date(a.split(' ').reverse().join('-')).getTime()
  );

  useEffect(() => {
    let filtered = newsList;

    if (participant) {
      filtered = filtered.filter(news =>
          news.participants?.some(p => p.id === participant)
      );
    }

    if (date) {
      filtered = filtered.filter(news => news.date === date);
    }

    if (tag) {
      filtered = filtered.filter(news =>
          news.tags.includes(tag)
      );
    }

    setFilteredNews(filtered);
  }, [participant, date, tag]);

  const handleFilterChange = (filters: {
    tags: string[];
    date: string | null;
    participants: string[];
  }) => {
    let filtered = newsList;

    // Фильтрация по тегам
    if (filters.tags.length > 0) {
      filtered = filtered.filter(newsItem =>
          newsItem.tags.some(tag => filters.tags.includes(tag))
      );
    }

    // Фильтрация по дате
    if (filters.date) {
      filtered = filtered.filter(newsItem => newsItem.date === filters.date);
    }

    // Фильтрация по участникам
    if (filters.participants.length > 0) {
      filtered = filtered.filter(newsItem =>
          newsItem.participants?.some(participant =>
              filters.participants.includes(participant.id)
          )
      );
    }

    setFilteredNews(filtered.length > 0 ? filtered : []);
  };

  const getNewsImage = (item: any) => {
    if (item.images && item.images.length > 0) {
      return item.images[0];
    }
    if (item.img) {
      return item.img;
    }
    return "http://localhost:9000/assets.orgma.ru/pic2_2_2c7257fb6c.png";
  };

  return (
      <Container maxWidth="xl" sx={{ marginBottom: 4, marginTop: 4 }}>
        {(participant || date || tag) && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5">
                Фильтр: {participant && `Участник`} {date && `Дата: ${date}`} {tag && `Тег: ${tag}`}
              </Typography>
            </Box>
        )}

        <main className={styles.content}>
          <Grid container spacing={3}>
            <Grid size={{ xs:12, md: 4 }}>
              <div className={styles.content__left}>
                <NewsFilter
                    onFilterChange={handleFilterChange}
                    allParticipants={allParticipants}
                    availableDates={availableDates}
                />
              </div>
            </Grid>
            <Grid size={{ xs:12, md: 8 }}>
              <div className={styles.content__right}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Найдено новостей: {filteredNews.length}
                </Typography>
                <Grid container>
                  {filteredNews.map((item, idx) => (
                        <News
                            key={idx}
                            title={item.title}
                            descSmall={item.descSmall}
                            date={item.date}
                            link={item.link}
                            img={getNewsImage(item)}
                        />
                  ))}
                </Grid>

                {filteredNews.length === 0 && (
                    <Box sx={{ textAlign: 'center', padding: '40px' }}>
                      <Typography variant="h6">
                        Новости по выбранным фильтрам не найдены
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

// Ваш существующий newsList с участниками...

const newsList = [
  {
    title: "Запустили новый портал госуслуг",
    descSmall: "Теперь доступ к сервисам стал проще и быстрее.",
    link: "/news/portal-gosuslug",
    date: "18 сентября 2025",
    images: [
      "http://localhost:9000/assets.orgma.ru/pic2_2_2c7257fb6c.png",
      "http://localhost:9000/assets.orgma.ru/pic2_2_282dc010f2.png",
      "http://localhost:9000/assets.orgma.ru/pic2_2_2c7257fb6c.png"
    ],
    tags: ["Новости", "События"]
  },
  {
    title: "В регионе стартует цифровая трансформация",
    descSmall: "Программы по автоматизации муниципальных услуг.",
    link: "/news/cifrovaya-transformaciya",
    date: "15 сентября 2025",
    images: [
      "http://localhost:9000/assets.orgma.ru/pic2_2_282dc010f2.png",
      "http://localhost:9000/assets.orgma.ru/pic2_2_2c7257fb6c.png"
    ],
    tags: ["Новости", "Акции"]
  },
  {
    title: "Открытие центра цифрового развития",
    descSmall: "Новый офис для поддержки IT-проектов.",
    link: "/news/centr-cifrovogo-razvitiya",
    date: "10 сентября 2025",
    images: [
      "http://localhost:9000/assets.orgma.ru/pic2_2_2c7257fb6c.png",
      "http://localhost:9000/assets.orgma.ru/pic2_2_282dc010f2.png",
      "http://localhost:9000/assets.orgma.ru/pic2_2_2c7257fb6c.png",
      "http://localhost:9000/assets.orgma.ru/pic2_2_282dc010f2.png"
    ],
    tags: ["События", "Поздравления"]
  },
  {
    title: "Новые меры поддержки малого бизнеса",
    descSmall: "Расширены программы государственной поддержки предпринимателей.",
    link: "/news/podderzhka-biznesa",
    date: "8 сентября 2025",
    images: [
      "http://localhost:9000/assets.orgma.ru/pic2_2_282dc010f2.png",
      "http://localhost:9000/assets.orgma.ru/pic2_2_2c7257fb6c.png"
    ],
    tags: ["Новости", "Акции"]
  },
  {
    title: "Итоги года: достижения и перспективы",
    descSmall: "Подводим итоги работы за год и строим планы на будущее.",
    link: "/news/itogi-goda",
    date: "5 сентября 2025",
    images: [
      "http://localhost:9000/assets.orgma.ru/pic2_2_2c7257fb6c.png",
      "http://localhost:9000/assets.orgma.ru/pic2_2_282dc010f2.png",
      "http://localhost:9000/assets.orgma.ru/pic2_2_2c7257fb6c.png"
    ],
    tags: ["Новости", "События"]
  },
  {
    title: "Обновление мобильного приложения",
    descSmall: "Вышла новая версия приложения с улучшенным интерфейсом.",
    link: "/news/obnovlenie-prilozheniya",
    date: "3 сентября 2025",
    images: [
      "http://localhost:9000/assets.orgma.ru/pic2_2_282dc010f2.png",
      "http://localhost:9000/assets.orgma.ru/pic2_2_2c7257fb6c.png"
    ],
    tags: ["Новости", "Объявления"]
  },
  {
    title: "Поздравление с Днем знаний",
    descSmall: "Торжественные мероприятия, посвященные началу учебного года.",
    link: "/news/den-znaniy",
    date: "1 сентября 2025",
    images: [
      "http://localhost:9000/assets.orgma.ru/pic2_2_2c7257fb6c.png",
      "http://localhost:9000/assets.orgma.ru/pic2_2_282dc010f2.png",
      "http://localhost:9000/assets.orgma.ru/pic2_2_2c7257fb6c.png"
    ],
    tags: ["Поздравления", "События"]
  },
  {
    title: "Технические работы на портале",
    descSmall: "Уведомление о плановых технических работах.",
    link: "/news/tehnicheskie-raboty",
    date: "29 августа 2025",
    images: [
      "http://localhost:9000/assets.orgma.ru/pic2_2_282dc010f2.png"
    ],
    tags: ["Объявления"]
  },
  {
    title: "Новости из отдела разработки",
    descSmall: "Внедрение новых технологий в работе разработчиков.",
    link: "/news/novosti-razrabotki",
    date: "25 августа 2025",
    images: [
      "http://localhost:9000/assets.orgma.ru/pic2_2_2c7257fb6c.png",
      "http://localhost:9000/assets.orgma.ru/pic2_2_282dc010f2.png",
      "http://localhost:9000/assets.orgma.ru/pic2_2_2c7257fb6c.png"
    ],
    tags: ["Новости подразделений"]
  },
  {
    title: "Конкурс на лучший IT-проект",
    descSmall: "Объявляем старт ежегодного конкурса инновационных проектов.",
    link: "/news/konkurs-it-proekt",
    date: "22 августа 2025",
    images: [
      "http://localhost:9000/assets.orgma.ru/pic2_2_282dc010f2.png",
      "http://localhost:9000/assets.orgma.ru/pic2_2_2c7257fb6c.png"
    ],
    tags: ["Акции", "События"]
  },
  {
    title: "Поздравляем юбиляров месяца",
    descSmall: "Чествуем сотрудников, отмечающих юбилейные даты.",
    link: "/news/yubilyary",
    date: "20 августа 2025",
    images: [
      "http://localhost:9000/assets.orgma.ru/pic2_2_2c7257fb6c.png",
      "http://localhost:9000/assets.orgma.ru/pic2_2_282dc010f2.png",
      "http://localhost:9000/assets.orgma.ru/pic2_2_2c7257fb6c.png"
    ],
    tags: ["Поздравления"]
  },
  {
    title: "Отчет о деятельности за полугодие",
    descSmall: "Публикуем финансовый и статистический отчет за 6 месяцев.",
    link: "/news/otchet-polugodie",
    date: "15 августа 2025",
    images: [
      "http://localhost:9000/assets.orgma.ru/pic2_2_282dc010f2.png",
      "http://localhost:9000/assets.orgma.ru/pic2_2_2c7257fb6c.png"
    ],
    tags: ["Новости", "Объявления"]
  },
  {
    title: "Новости отдела кадров",
    descSmall: "Изменения в кадровой политике и новые вакансии.",
    link: "/news/novosti-kadrov",
    date: "12 августа 2025",
    images: [
      "http://localhost:9000/assets.orgma.ru/pic2_2_2c7257fb6c.png",
      "http://localhost:9000/assets.orgma.ru/pic2_2_282dc010f2.png",
      "http://localhost:9000/assets.orgma.ru/pic2_2_2c7257fb6c.png"
    ],
    tags: ["Новости подразделений"]
  },
  {
    title: "Специальное предложение для партнеров",
    descSmall: "Новые условия сотрудничества и бонусные программы.",
    link: "/news/predlozhenie-partneram",
    date: "8 августа 2025",
    images: [
      "http://localhost:9000/assets.orgma.ru/pic2_2_282dc010f2.png"
    ],
    tags: ["Акции"]
  },
  {
    title: "Обновление законодательной базы",
    descSmall: "Важные изменения в нормативных документах.",
    link: "/news/obnovlenie-zakonodatelstva",
    date: "5 августа 2025",
    images: [
      "http://localhost:9000/assets.orgma.ru/pic2_2_2c7257fb6c.png",
      "http://localhost:9000/assets.orgma.ru/pic2_2_282dc010f2.png"
    ],
    tags: ["Новости", "Объявления"]
  },
  {
    title: "Корпоративные мероприятия августа",
    descSmall: "Анонс предстоящих корпоративных событий.",
    link: "/news/korporativnye-meropriyatiya",
    date: "1 августа 2025",
    images: [
      "http://localhost:9000/assets.orgma.ru/pic2_2_282dc010f2.png",
      "http://localhost:9000/assets.orgma.ru/pic2_2_2c7257fb6c.png",
      "http://localhost:9000/assets.orgma.ru/pic2_2_282dc010f2.png"
    ],
    tags: ["События", "Новости подразделений"]
  }
];