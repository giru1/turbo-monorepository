'use client';
import Container from "@mui/material/Container";
import styles from './Header.module.css';
import logo from './images/logo.png';
import Image from 'next/image';
import mainFone from './images/main-fone.png';
import {Grid} from '@mui/material';
import React from "react";

interface IHeader {
    title: string;
    description?: React.ReactNode;
}

export default function Header({ title, description }: IHeader) {
    return (
        <Container maxWidth="xl" sx={{marginBottom: 4, marginTop: { xs: 3, md: 5, lg: 10 }}}>
            <header className={styles.header}>
                <Grid container>
                    <Grid size={{xs: 12, md: 6, lg: 6, xl: 7}}>
                        <div className={styles.header__left}>
                            <div className={styles.header__logo}>
                                <Image src={logo} alt="Логотип" className={styles.header__logo_img}/>
                                <h2 className={styles.header__logo_title}>
                                    Оренбургский государственный медицинский университет
                                </h2>
                            </div>
                            <Image src={mainFone} alt="Университет" className={styles.header__univer_img}/>
                        </div>
                    </Grid>
                    <Grid size={{xs: 12, md: 6, lg: 6, xl: 5}}>
                        <div className={styles.header__rigth}>
                            <h1 className={styles.header__title_h1}>{title}</h1>
                            <div className={styles.header__desc}>
                                {description}
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </header>
        </Container>
    );
}