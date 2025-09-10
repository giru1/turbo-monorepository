'use client';
import Container from "@mui/material/Container";
import styles from './Content.module.css';

import {Grid} from '@mui/material';
import React from "react";
import Card from "@/app/components/Card/Card";
import MenuIt from "@/app/components/MenuIt/MenuIt";

export default function Content() {
    return (
        <>
            <Container maxWidth="xl" sx={{marginBottom: 4, marginTop: 4}}>
                <main className={styles.content}>
                    <Grid container>
                        <Grid size={{xs: 12, md: 6, lg: 6, xl: 6}} order={{ xs: 2, md: 1 }}>
                            <div className={styles.content__left}>
                                <MenuIt/>
                            </div>
                        </Grid>
                        <Grid size={{xs: 12, md: 6, lg: 6, xl: 6}} order={{ xs: 1, md: 2 }}>
                            <div className={styles.content__right}>
                                <div className="cardIt__wrap">

                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </main>
            </Container>
        </>)}