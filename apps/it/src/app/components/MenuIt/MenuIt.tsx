'use client';
import {Grid} from '@mui/material';
import styles from './MenuIt.module.css';

import React from "react";
export default function MenuIt() {
    return (
        <>
            <Grid size={{xs: 12, sm: 12, md: 10, lg: 10, xl: 8}}>

                <ul className={styles.menuIt}>
                    <li className={styles.menuIt__item}>
                        <a className={styles.menuIt__item_link} href="">Система приема заявок</a>
                    </li>
                    <li className={styles.menuIt__item}>
                        <a className={styles.menuIt__item_link} href="">Вход для сотрудников отдела ИТ</a>
                    </li>
                    <li className={styles.menuIt__item}>
                        <a className={styles.menuIt__item_link} href="">Состояние информационных систем</a>
                    </li>
                    <li className={styles.menuIt__item}>
                        <a className={styles.menuIt__item_link} href="">Получение ЕИВ (Единый идетификатор ВУЗа)</a>
                    </li>
                    <li className={styles.menuIt__item}>
                        <a className={styles.menuIt__item_link} href="">MiBase</a>
                    </li>
                </ul>
            </Grid>
        </>)
}