'use client';

import styles from "@/app/components/Content/Content.module.css";
import {Box, Grid, Link, Typography} from "@mui/material";
import Container from "@mui/material/Container";
import React from "react";
import BlockPay from "@/app/components/BlockPay/BlockPay";

export default function Home() {
  return (

      <Container maxWidth="xl" sx={{marginBottom: 4, marginTop: 4}}>
        <main className={styles.content}>
          <Grid container>
            <Grid size={{xs: 12, md: 4, lg: 4, xl: 4}} order={{xs: 2, md: 1}}>
              <div className={styles.content__left}>

                {/* Подвал */}
                <Box sx={{textAlign: 'center', mt: 4}}>
                  <Typography variant="body2">
                    <Link href="https://www.orgma.ru" target="_blank">orgma.ru</Link> |{' '}
                    <Link href="#" target="_blank">Условия оплаты и возврат</Link> |{' '}
                    <Link
                        href="https://www.orgma.ru/sveden/document/politika-v-otnoshenii-obrabotki-personalnyh-dannyh.pdf"
                        target="_blank">
                      Политика конфиденциальности
                    </Link>
                  </Typography>
                  <Typography variant="body2" sx={{mt: 1}}>
                    Контактный телефон: <Link href="tel:+73532500606">+7 (3532)
                    50-06-06</Link> добавочный <strong>628</strong>
                  </Typography>
                </Box>

              </div>
            </Grid>
            <Grid size={{xs: 12, md: 8, lg: 8, xl: 8}} order={{xs: 1, md: 2}}>
              <div className={styles.content__right}>
                <BlockPay/>
              </div>
            </Grid>
          </Grid>
        </main>
      </Container>


  );
}
