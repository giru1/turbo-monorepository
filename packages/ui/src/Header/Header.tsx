// packages/ui/src/Header/Header.tsx
import styles from './Header.module.css';
import React from "react";
import { getHeaderData } from './HeaderApi';

export interface HeaderData {
    logoTitle: string;
    logo: {
        url: string;
        alternativeText: string;
    };
    background: {
        url: string;
        alternativeText: string;
    };
}

interface HeaderProps {
    headerData?: HeaderData | null;
}

export default async function Header({ headerData }: HeaderProps) {
    // Если данные не переданы, загружаем их
    const data = headerData || await getHeaderData();

    if (!data) {
        return (
            <div className={styles.header__left}>
                <div className={styles.header__logo}>
                    <img
                        src="/default-logo.png"
                        alt="Логотип университета"
                        className={styles.header__logo_img}
                    />
                    <h2 className={styles.header__logo_title}>
                        Оренбургский государственный медицинский университет
                    </h2>
                </div>
                <img
                    src="/default-bg.png"
                    alt="Университет"
                    className={styles.header__logo_img}
                />
            </div>
        );
    }

    const { logoTitle, logo, background } = data;

    return (
        <div className={styles.header__left}>
            <div className={styles.header__logo}>
                <img
                    src={logo.url}
                    alt={logo.alternativeText}
                    className={styles.header__logo_img}
                />
                <h2 className={styles.header__logo_title}>
                    {logoTitle}
                </h2>
            </div>
            <img
                src={background.url}
                alt={background.alternativeText}
                className={styles.header__univer_img}
            />
        </div>
    );
}