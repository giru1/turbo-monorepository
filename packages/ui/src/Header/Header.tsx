'use client';

import styles from './Header.module.css';
import React from "react";
import Image from "next/image";

export default function Header() {
    return (
        <div className={styles.header__left}>
            <div className={styles.header__logo}>
                {/*<Image*/}
                {/*    src="http://localhost:9000/assets.orgma.ru/logo_9fbaf5d4b5.png"*/}
                {/*    alt="Логотип"*/}
                {/*    className={styles.header__logo_img}*/}
                {/*/>*/}
                <h2 className={styles.header__logo_title}>
                    Оренбургский государственный медицинский университет
                </h2>
            </div>
            {/*<Image*/}
            {/*    src="http://localhost:9000/assets.orgma.ru/photo_2025_09_09_13_01_26_c1b3c8b407.jpg"*/}
            {/*    alt="Университет"*/}
            {/*    className={styles.header__logo_img}*/}
            {/*/>*/}
        </div>

    );
}