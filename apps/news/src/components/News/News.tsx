"use client";
import { Grid } from "@mui/material";
import Link from "next/link";
import styles from './News.module.css';

interface NewsProps {
    title: string;
    descSmall: string;
    link?: string;
    date?: string;
    img?: string;
    tags?: string[];
}

export default function News({ title, descSmall, link = "#", date, img, tags }: NewsProps) {
    return (
        <Grid size={{sm: 12, md: 6}}>
            <div className={styles.news__item}>
                <div className={styles.news__item_image}>
                    <img src={img} alt={title}/>
                </div>
                <div className={styles.news__item_content}>
                    <div className={styles.news__item_date}>{date}</div>
                    <h4 className={styles.news__item_title}>{title}</h4>
                    <p className={styles.news__item_excerpt}>{descSmall}</p>
                    <Link href={link} className={styles.news__item_link}>
                        Подробнее →
                    </Link>
                </div>
                <div className={styles.news__item_tags}>{tags}</div>
            </div>
        </Grid>
    );
}