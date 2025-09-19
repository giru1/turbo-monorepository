'use client';

import styles from './Header.module.css';
import React from "react";

interface HeaderRightProps {
    title: string;
    description: string;
}

export default function HeaderRight({ title, description }: HeaderRightProps) {
    return (
        <div className={styles.header__rigth}>
            <h1 className={styles.header__title_h1}>{title}</h1>
            <div className={styles.header__desc}>
                {description}
            </div>
        </div>
    );
}
