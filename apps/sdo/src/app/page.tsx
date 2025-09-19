'use client';
import styles from "./page.module.css";
import Head from "@/app/components/Head";
import Sidebar from "@/app/components/Sidebar/Sidebar";
import Header from "@/app/components/Header/Header";

import Footer from "@/app/components/Footer/Footer";
import {Grid} from "@mui/material";
import Card from "@/app/components/Card/Card";
import Container from "@mui/material/Container";
import React from "react";

export default function Home() {
  return (

      <Container maxWidth="xl" sx={{marginBottom: 4, marginTop: 4}}>
        <main className={styles.content}>
          <Grid container>
            <Grid size={{xs: 12, md: 6, lg: 6, xl: 6}} order={{xs: 2, md: 1}}>
              <div className={styles.content__left}>
                <div className="Content-module__OthSla__content__left">
                  <div className="contentBlock">

                    <div className={styles.content__left}>
                      <div className="Content-module__OthSla__content__left">
                        <div className="contentBlock">
                          <h2 className="contentBlock__title">Системы дистанционного
                            образования</h2>
                          <p className="contentBlock__text">
                            Системы дистанционного образования Оренбургского
                            государственного медицинского университета
                            предоставляют студентам и преподавателям удобный доступ к
                            образовательным ресурсам и
                            современным цифровым сервисам. На единой платформе собраны
                            решения для разных категорий
                            обучающихся, обеспечивающие эффективное взаимодействие и
                            поддержку учебного процесса.
                          </p>

                          <h3 className="contentBlock__subtitle">Основные возможности
                            систем:</h3>
                          <ul className="contentBlock__list">
                            <li className="contentBlock__listItem">
                              доступ к образовательным курсам и учебным материалам в
                              онлайн-формате;
                            </li>
                            <li className="contentBlock__listItem">
                              единый вход с использованием <strong>Идентификатора
                              ВУЗа</strong> для всех платформ;
                            </li>
                            <li className="contentBlock__listItem">
                              поддержка различных категорий обучающихся: студентов,
                              слушателей подготовительных курсов,
                              слушателей ИПО и иностранных студентов;
                            </li>
                            <li className="contentBlock__listItem">
                              возможность онлайн-тестирования, контроля знаний и
                              коммуникации с преподавателями;
                            </li>
                            <li className="contentBlock__listItem">
                              доступность образовательных ресурсов в любое время и с
                              любого устройства.
                            </li>
                          </ul>

                          <p className="contentBlock__text">
                            Каждая система разработана с учетом особенностей целевой
                            аудитории: от студентов основных
                            образовательных программ до слушателей подготовительных курсов и
                            иностранных студентов.
                            Такой подход обеспечивает комфортное и продуктивное обучение в
                            цифровой среде.
                          </p>

                          <p className="contentBlock__text">
                            При возникновении проблем с доступом студенты и сотрудники могут
                            обратиться
                            в службу технической поддержки по адресу <a
                              href="mailto:623@orgmu.ru">623@orgmu.ru</a>.
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </Grid>
            <Grid size={{xs: 12, md: 6, lg: 6, xl: 6}} order={{xs: 1, md: 2}}>
              <div className={styles.content__right}>
                <div className="cardIt__wrap">
                  <Card
                      description={"Доступ для студентов основных образовательных программ"}
                      title={"Основная система для студентов"}
                      buttonLink={"http://1c.orgma.ru/sdo_CUN_001/wc/#/auth"}
                  />
                  <Card
                      buttonLink={"http://1c.orgma.ru/sdo-dovuz/wc/#/auth"}
                      description={"Доступ для обучающихся на подготовительных курсах"}
                      title={"Подготовительные курсы"}
                  />
                  <Card
                      buttonLink={"http://1c.orgma.ru/sdo-IPO/wc/#/auth"}
                      description={"Доступ для обучающихся в ИПО"}
                      title={"Институт профессионального образования"}
                  />
                  <Card
                      buttonLink={"http://fis.sdo.orgma.ru/"}
                      description={"Доступ для студентов ФИС"}
                      title={"Факультет иностранных студентов"}
                  />
                </div>
              </div>
            </Grid>
          </Grid>
        </main>
      </Container>

  );
}
