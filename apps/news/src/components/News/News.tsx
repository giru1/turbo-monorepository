"use client";
import { Grid } from "@mui/material";
import Link from "next/link";
import styles from './News.module.css';
import { NewsProps } from "@/types/news";


export default function News({ title, descSmall, link = "#", date, img, tags, maxLength = 70}: NewsProps) {

    // Функция для обрезки текста с добавлением многоточия
    const truncateText = (text: string, length: number) => {
        if (text.length <= length) {
            return text;
        }
        return text.substring(0, length) + '...';
    };

    // Обрезаем описание если нужно
    const truncatedDescription = truncateText(descSmall, maxLength);

    return (
        <Grid size={{sm: 12, md: 6, lg: 4}}>
            <div className={styles.news__item}>
                <div className={styles.news__item_image}>
                    <img src={img} alt={title}/>
                </div>
                <div className={styles.news__item_content}>
                    <div className={styles.news__item_date}>{date}</div>
                    <h4 className={styles.news__item_title}>{title}</h4>
                    <p className={styles.news__item_excerpt}>{truncatedDescription}</p>
                    <Link href={link} className={styles.news__item_link}>
                        Подробнее →
                    </Link>
                </div>
                <div className={styles.news__item_tags}>{tags}</div>
            </div>
        </Grid>
    );
}