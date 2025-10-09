'use client';
import Container from "@mui/material/Container";
import styles from './Footer.module.css';
export { getFooterData } from "./FooterApi";

import {Grid} from '@mui/material';
import React from "react";

interface FooterProps {
    footerData: any;
}

interface MenuItem {
    id: number;
    title: string;
    link: string | null;
}

export default function Footer({ footerData }: FooterProps) {
    // Если данные не загружены, показываем заглушку
    if (!footerData) {
        return (
            <footer className={styles.footer}>
                <Container maxWidth="xl">
                    <p>Загрузка футера...</p>
                </Container>
            </footer>
        );
    }

    // Извлекаем данные из структуры
    const address = footerData?.address;
    const email = footerData?.email;
    const phone = footerData?.phone;
    const phonePK = footerData?.phonePK;
    const menuItems: MenuItem[] = footerData?.menu || [];

    // Разделяем меню на две части
    const firstMenuItems = menuItems.slice(0, 3);
    const secondMenuItems = menuItems.slice(3, 6);

    return (
        <>
            <footer className={styles.footer}>
                <Container maxWidth="xl" sx={{marginBottom: 2, marginTop: 2}}>
                    <Grid container>
                        <Grid size={{xs: 12, sm: 6, md: 6}}>
                            <div className={styles.footerColumn}>
                                <p className={styles.footerColumnP}>
                                    {address} <br/>
                                    Тел.{" "}
                                    <a className={styles.footerLink} href={`tel:${phone}`}>
                                        {phone}
                                    </a>
                                    <br/>
                                    E-mail:{" "}
                                    <a className={styles.footerLink} href={`mailto:${email}`}>
                                        {email}
                                    </a>
                                </p>
                                <p className={styles.highlight}>
                                    Приёмная комиссия:{" "}
                                    <a className={styles.footerLink} href={`tel:${phonePK}`}>
                                        {phonePK}
                                    </a>
                                </p>
                            </div>
                        </Grid>

                        <Grid size={{xs: 12, sm: 6, md: 3}}>
                            <div className={styles.footerColumn}>
                                <h4 className={styles.columnTitle}>Контакты</h4>
                                <ul className={styles.footerList}>
                                    {firstMenuItems.map((item: MenuItem) => (
                                        <li key={item.id}>
                                            <a
                                                className={styles.footerLink}
                                                href={item.link || '#'}
                                                target={item.link?.startsWith('http') ? '_blank' : '_self'}
                                                rel={item.link?.startsWith('http') ? 'noopener noreferrer' : ''}
                                            >
                                                {item.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Grid>

                        <Grid size={{xs: 12, sm: 6, md: 3}}>
                            <div className={styles.footerColumn}>
                                <ul className={styles.footerList}>
                                    {secondMenuItems.map((item: MenuItem) => (
                                        <li key={item.id}>
                                            <a
                                                className={styles.footerLink}
                                                href={item.link || '#'}
                                                target={item.link?.startsWith('http') ? '_blank' : '_self'}
                                                rel={item.link?.startsWith('http') ? 'noopener noreferrer' : ''}
                                            >
                                                {item.title}
                                            </a>
                                        </li>
                                    ))}
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
        </>
    );
}