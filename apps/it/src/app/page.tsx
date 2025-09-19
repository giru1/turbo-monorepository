'use client';
import styles from "./page.module.css";

import {Grid} from "@mui/material";

import { Card } from "@repo/ui";
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
                    <h2 className="contentBlock__title">Управление по цифровому развитию</h2>
                    <p className="contentBlock__text">
                      Управление по цифровому развитию Оренбургского государственного медицинского
                      университета
                      осуществляет организацию, сопровождение и развитие цифровой инфраструктуры
                      вуза. Подразделение
                      обеспечивает бесперебойное функционирование информационных систем и сервисов,
                      необходимых
                      для учебной, научной и административной деятельности.
                    </p>

                    <h3 className="contentBlock__subtitle">Основные задачи Управления:</h3>
                    <ul className="contentBlock__list">
                      <li className="contentBlock__listItem">поддержка работоспособности и развитие
                        корпоративных
                        информационных систем;
                      </li>
                      <li className="contentBlock__listItem">обеспечение функционирования серверного
                        оборудования,
                        сетевой инфраструктуры и рабочих мест;
                      </li>
                      <li className="contentBlock__listItem">внедрение и сопровождение современных
                        цифровых сервисов
                        для студентов и сотрудников;
                      </li>
                      <li className="contentBlock__listItem">развитие платформ дистанционного
                        обучения и
                        образовательных порталов;
                      </li>
                      <li className="contentBlock__listItem">обеспечение информационной безопасности
                        и защиты
                        персональных данных.
                      </li>
                    </ul>

                    <p className="contentBlock__text">
                      С помощью предоставляемых сервисов сотрудники университета могут подавать и
                      отслеживать заявки
                      на
                      техническое обслуживание, контролировать состояние информационных систем,
                      получать единый
                      идентификатор
                      ВУЗа (ЕИВ), а студенты и преподаватели — пользоваться системой дистанционного
                      обучения,
                      образовательным
                      порталом и другими цифровыми ресурсами.
                    </p>

                    <p className="contentBlock__text">
                      Деятельность Управления направлена на формирование современной цифровой среды
                      университета,
                      которая способствует повышению качества образовательного процесса, научной
                      деятельности
                      и административного управления.
                    </p>
                  </div>
                </div>

              </div>
            </Grid>
            <Grid size={{xs: 12, md: 6, lg: 6, xl: 6}} order={{xs: 1, md: 2}}>
              <div className={styles.content__right}>
                <div className="cardIt__wrap">
                  <Card
                      description={"Список приложений и сервисов для студентов и сотрудников"}
                      title={"Список приложений"}
                      widgetUrl="/defaultSettings.json"
                  />
                  <Card
                      link={"https://it.app.orgma.ru/it_001/"}
                      description={"Доступ для сотрудников отдела ИТ к внутренним системам и инструментам управления"}
                      title={"Вход для сотрудников отдела ИТ"}
                  />
                  <Card
                      link={"https://board.uptime.orgma.ru/status/orgmu"}
                      description={"Мониторинг состояния всех ключевых информационных систем университета в реальном времени"}
                      title={"Состояние информационных систем"}
                  />
                  <Card
                      link={"https://it.orgma.ru/eiv/"}
                      description={"Регистрация и получение Единого идентификатора ВУЗа (ЕИВ) для доступа к сервисам"}
                      title={"Получение ЕИВ (Единого идентификатора ВУЗа)"}
                  />
                  <Card
                      link={"https://sdo.orgma.ru/"}
                      description={"Доступ к системе дистанционного обучения университета. Вход студентов и преподавателей"}
                      title={"Страница входа в СДО"}
                  />
                  <Card
                      link={"https://edu.app.orgma.ru"}
                      description={"Образовательная платформа университета: довузовская подготовка, ИПО, корпоративные сервисы и CMS"}
                      title={"Образовательный портал ОрГМУ"}
                  />
                </div>
              </div>
            </Grid>
          </Grid>
        </main>
      </Container>

  );
}
