'use client';
import Container from "@mui/material/Container";
import styles from './Header.module.css';
import logo from './images/logo.png';
import Image from 'next/image';
import mainFone from './images/main-fone.png';
import {Grid} from '@mui/material';
import React from "react";
export default function Header() {
    return (
        <>
        <Container maxWidth="xl" sx={{marginBottom: 4, marginTop: 12}}>
            <header className={styles.header}>
                <Grid container>
                    <Grid size={{xs: 6, md: 6}}>
                        <div className={styles.header__left}>
                            <div className={styles.header__logo}>
                                <Image src={logo} alt="Логотип" className={styles.header__logo_img} unoptimized={true}/>
                                <h2 className={styles.header__logo_title}>
                                    Оренбургский государственный медицинский университет
                                </h2>
                            </div>
                            <Image src={mainFone} alt="Университет" className={styles.header__univer_img} unoptimized={true}/>
                        </div>
                    </Grid>
                    <Grid size={{xs: 6, md: 6}}>
                        <div className={styles.header__rigth}>
                            <h1 className={styles.header__title_h1}>УПРАВЛЕНИЕ ПО ЦИФРОВОМУ РАЗВИТИЮ</h1>
                            <p className={styles.header__desc_p}>
                                Руководитель подразделения: <b>Кирьяков Дмитрий Анатольевич</b>
                                460014, Оренбургская область, город Оренбург, ул. Советская, 6
                                <br/>Телефон: <b>+7 (3532) 50-06-06 доб. 644</b><br/>
                                Электронная почта: <b>d.a.kir@orgma.ru</b>
                            </p>
                        </div>
                    </Grid>
                </Grid>
            </header>
        </Container>
    </>)}