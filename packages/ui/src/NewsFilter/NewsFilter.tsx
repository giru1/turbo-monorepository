'use client';
import { Grid } from '@mui/material';
import styles from './NewsDetail.module.css';

interface NewsProps {
    title: string;
    desc: string;
    link?: string;
    date?: string;
    img?: string;
}

export default function NewsDetail({title, desc, date, img}:NewsProps) {

    return (
        <Grid size={{xs: 12, sm: 6, md: 6, lg: 6}}>
            <div className="">
                <div className="">
                    <div className="">
                        <h1 className="">{title}</h1>
                        <div className="">{date}</div>
                        <div className="">
                            <img src={img} alt="Логотип" className={styles.header__logo_img}/>
                        </div>
                        <div className="">{desc}</div>
                    </div>
                </div>
            </div>
        </Grid>
    );
}
