'use client';
import Container from "@mui/material/Container";
import styles from './Footer.module.css';
import Script from 'next/script'

import {Grid} from '@mui/material';
import React from "react";
export default function Footer() {
    return (
        <>
            <footer className={styles.footer}>
                <Container maxWidth="xl" sx={{marginBottom: 2, marginTop: 2}}>
                    {/* Top columns */}
                    <Grid container>
                        <Grid size={{xs: 12, sm: 6, md: 4}}>
                            <div className={styles.footerColumn}>
                                <p className={styles.footerColumnP}>
                                    Россия, 460000,<br/>
                                    г. Оренбург, ул. Советская, 6<br/>
                                    Тел. <a className={styles.footerLink} href="tel:+73532500603">+7 (3532) 50-06-20</a><br/>
                                    E-mail: <a className={styles.footerLink}
                                               href="mailto:office@orgma.ru">office@orgma.ru</a>
                                </p>
                                <p className={styles.highlight}>
                                    Приёмная комиссия: <a className={styles.footerLink} href="tel:+73532500603">+7
                                    (3532) 50-06-03</a>
                                </p>
                            </div>
                        </Grid>


                        <Grid size={{xs: 12, sm: 6, md: 4}}>
                            <div className={styles.footerColumn}>
                                <h4 className={styles.columnTitle}>Контакты</h4>
                                <ul className={styles.footerList}>
                                    <li><a className={styles.footerLink}
                                           href="https://www.orgma.ru/ru/component/k2/item/3775">Контакты</a></li>
                                    <li><a className={styles.footerLink}
                                           href="mailto:office@orgma.ru">office@orgma.ru</a></li>
                                    <li><a className={styles.footerLink}
                                           href="https://www.orgma.ru/ru/component/xmap/html/1?view=html">Карта
                                        сайта</a></li>
                                </ul>
                            </div>
                        </Grid>


                        <Grid size={{xs: 12, sm: 6, md: 4}}>
                            <div className={styles.footerColumn}>
                                <ul className={styles.footerList}>
                                    <li><a className={styles.footerLink}
                                           href="https://www.orgma.ru/ru/akademiya/protivodejstvie-korruptsii/item/403">Стоп-коррупция</a>
                                    </li>
                                    <li><a className={styles.footerLink}
                                           href="https://www.orgma.ru/sveden/document/politika-v-otnoshenii-obrabotki-personalnyh-dannyh.pdf">Политика
                                        конфиденциальности</a></li>
                                    <li><a className={styles.footerLink} href="https://pay.orgma.ru/">Реквизиты</a></li>

                                </ul>
                            </div>
                        </Grid>
                    </Grid>


                    {/* Bottom row */}
                    <Grid container>
                        <Grid size={{md: 12}}>
                            <div className={styles.footerBottom}>
                                <p className={styles.footerBottomText}>
                                    © 2023 федеральное государственное бюджетное образовательное учреждение высшего
                                    образования
                                    «Оренбургский государственный медицинский университет» Министерства здравоохранения
                                    Российской Федерации.
                                    Все права защищены. Использование новостных материалов сайта возможно только при
                                    наличии активной ссылки на
                                    <a className={styles.footerLink}
                                       href="https://www.orgma.ru"> https://www.orgma.ru</a>
                                </p>


                                <p className={styles.support}>
                                    Техподдержка сайта: <a className={styles.footerLink}
                                                           href="mailto:www@orgma.ru">www@orgma.ru</a>
                                </p>
                            </div>
                        </Grid>
                    </Grid>


                </Container>
            </footer>
            <Script src="WidgetMiBase.js"></Script>
        </>)
}