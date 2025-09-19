
import styles from "./page.module.css";

import {Grid} from "@mui/material";
import Link from "next/link";
import { News, NewsFilter } from "@repo/ui";
import Container from "@mui/material/Container";
import React from "react";

export default function Home() {
  const newsList = [
    {
      title: "Запустили новый портал госуслуг",
      descSmall: "Теперь доступ к сервисам стал проще и быстрее.",
      link: "/news/portal-gosuslug",
      date: "18 сентября 2025",
      img: "http://localhost:9000/assets.orgma.ru/pic2_2_282dc010f2.png",
    },
    {
      title: "В регионе стартует цифровая трансформация",
      descSmall: "Программы по автоматизации муниципальных услуг.",
      link: "/news/cifrovaya-transformaciya",
      date: "15 сентября 2025",
      img: "http://localhost:9000/assets.orgma.ru/pic2_2_282dc010f2.png",
    },
    {
      title: "Открытие центра цифрового развития",
      descSmall: "Новый офис для поддержки IT-проектов.",
      link: "/news/centr-cifrovogo-razvitiya",
      date: "10 сентября 2025",
      img: "http://localhost:9000/assets.orgma.ru/pic2_2_282dc010f2.png",
    },
  ];
  return (

      <Container maxWidth="xl" sx={{marginBottom: 4, marginTop: 4}}>
        <main className={styles.content}>
          <Grid container>
            <Grid size={{xs: 12, md: 6, lg: 6, xl: 6}} order={{xs: 2, md: 1}}>
              <div className={styles.content__left}>
                <NewsFilter/>
              </div>
            </Grid>
            <Grid size={{xs: 12, md: 6, lg: 6, xl: 6}} order={{xs: 1, md: 2}}>
              <div className={styles.content__right}>
                <div className="cardIt__wrap">
                  {newsList.map((item, idx) => (
                      <News
                          key={idx}
                          title={item.title}
                          descSmall={item.descSmall}
                          date={item.date}
                          link={item.link}
                          img={item.img}
                      />
                  ))}
                </div>
              </div>
            </Grid>
          </Grid>
        </main>
      </Container>

  );
}
